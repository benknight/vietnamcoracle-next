'use server';
import { headers } from 'next/headers';
import { PostMediaBlockPost } from '../../components/PostMediaBlock';
import WPRestClient from '../../lib/WPRestClient';
import GraphQLClient from '../../lib/WPGraphQLClient';
import SearchResultsQuery from '../../queries/SearchResults.gql';

const { ALGOLIA_APP_ID: appId, ALGOLIA_KEY_ADMIN: key } = process.env;

type fetcherFn = (
  params: [query: string, page: number, pageSize: number],
) => Promise<PostMediaBlockPost[]>;

export const fetchAlgoliaResults: fetcherFn = async params => {
  const [query, page, pageSize] = params;

  const ipAddress = (await headers()).get('x-forwarded-for');

  if (!ipAddress) {
    throw new Error('IP address not found');
  }

  if (!appId || !key) {
    throw new Error('Algolia credentials not found');
  }

  const result = await fetch(
    `https://${appId}-dsn.algolia.net/1/indexes/wp_post?` +
      new URLSearchParams({
        query,
        page: String(Number(page) - 1),
        hitsPerPage: String(Math.min(100, Number(pageSize))),
        attributesToHighlight: 'title',
        attributesToRetrieve: 'slug,thumbnail,title',
        attributesToSnippet: 'content:40,excerpt:40',
        userToken: ipAddress || '',
      }),
    {
      headers: {
        'X-Algolia-API-Key': key,
        'X-Algolia-Application-Id': appId,
      },
    },
  ).then(res => res.json());

  if (result.hits.length === 0) {
    return [];
  }

  const hits = [...result.hits];

  return hits
    .filter(hit => Boolean(hit.title))
    .map(hit => ({
      categories: [],
      excerpt:
        hit.excerpt && hit._snippetResult.excerpt.matchLevel === 'full'
          ? hit._snippetResult.excerpt.value
          : hit._snippetResult.content.matchLevel === 'full'
          ? hit._snippetResult.content.value
          : hit._snippetResult.excerpt.value,
      image: {
        altText: hit.thumbnailAltText,
        src: hit.thumbnail,
      },
      slug: hit.slug,
      title: hit._highlightResult.title.value,
    }));
};

export const fetchWpResults: fetcherFn = async params => {
  const [query, page, pageSize] = params;

  const restClient = new WPRestClient('subscriber');

  const { results } = await restClient.get(
    `/wp/v2/search?search=${query}&page=${page}&pageSize=${pageSize}`,
  );

  if (results.length === 0) {
    return [];
  }

  const gqlClient = new GraphQLClient();

  const data = await gqlClient.request(SearchResultsQuery, {
    in: results.map(r => r.id),
  });

  const posts = [...data.contentNodes.nodes];

  return posts.map(post => ({
    // categories: [...post.categories.nodes].map(node => ({
    //   name: node.name,
    //   uri: node.uri,
    // })),
    categories: [],
    excerpt: post.excerpt,
    image: {
      altText: post.featuredImage.node.altText,
      src: post.featuredImage.node.srcMedium,
    },
    slug: post.slug,
    title: post.title,
  }));
};
