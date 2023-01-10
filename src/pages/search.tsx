import cx from 'classnames';
import { gql } from 'graphql-request';
import _flatten from 'lodash/flatten';
import _upperFirst from 'lodash/upperFirst';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useSWR from 'swr';
import Footer from '../components/Footer';
import Layout, { LayoutMain, LayoutSidebar } from '../components/Layout';
import PostMediaBlock, {
  PostMediaBlockPost,
} from '../components/PostMediaBlock';
import SidebarDefault from '../components/SidebarDefault';
import * as fragments from '../config/fragments';
import getGQLClient from '../lib/getGQLClient';
import RestClient from '../lib/RestClient';
import useWaitCursor from '../lib/useWaitCursor';

const SEARCH_RESULTS_QUERY = gql`
  query SearchResults($in: [ID]) {
    contentNodes(where: { in: $in }) {
      nodes {
        ...PostMediaBlockData
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${fragments.PostMediaBlockData}
`;

const gqlClient = getGQLClient();

const wpResultsFetcher = async ([query, page, pageSize]): Promise<
  PostMediaBlockPost[]
> => {
  const { data: results } = await RestClient.get(
    `/search?search=${query}&page=${page}&pageSize=${pageSize}`,
  );
  if (results.length === 0) {
    return [];
  }
  const data = await gqlClient.request(SEARCH_RESULTS_QUERY, {
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

const algoliaResultsFetcher = async ([query, page, pageSize]): Promise<
  PostMediaBlockPost[]
> => {
  if (!query) return [];
  const result = await fetch(
    `/api/search/?q=${query}&page=${page}&pageSize=${pageSize}`,
  ).then(res => (res.ok ? res.json() : Promise.reject()));
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

function Page({
  index = 0,
  pageSize,
  query = '',
  isLastPage = false,
  onClickMore,
  onError,
  source = '',
}) {
  const request = useSWR(
    query === '' ? null : [query, index + 1, pageSize, source],
    source === 'algolia' ? algoliaResultsFetcher : wpResultsFetcher,
    {
      onError,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    },
  );
  const { data, error, isLoading } = request;
  const posts = data ? _flatten(data) : [];
  const showSeaching = index === 0 && isLoading;
  const noResults = index === 0 && !isLoading && !error && posts.length === 0;

  useWaitCursor(isLoading);

  let status;

  if (showSeaching) {
    status = <>Searching…</>;
  } else if (noResults) {
    status = (
      <>
        No results found for <em>{query}</em>
      </>
    );
  } else if (index === 0) {
    status = (
      <>
        Search results for ‘<em>{query}</em>’
      </>
    );
  }

  return (
    <>
      {status && (
        <div className="py-4 lg:pt-12 ml-2 sm:ml-4 lg:ml-0 mr-8 lg:font-display lg:text-xl">
          {status}
        </div>
      )}
      {posts.map(post => (
        <PostMediaBlock key={post.slug} post={post} />
      ))}
      {isLastPage &&
        !noResults &&
        !isLoading &&
        (source === 'algolia' || posts.length < pageSize) && (
          <div className="text-sm text-center italic">End of results.</div>
        )}
      <button
        className={cx('btn w-full h-12 lg:h-10 lg:w-auto my-4 lg:mb-24', {
          'opacity-50': isLoading,
          hidden:
            source === 'algolia' ||
            !isLastPage ||
            (isLoading && index === 0) ||
            (!isLoading && posts.length < pageSize),
        })}
        disabled={isLoading}
        onClick={onClickMore}>
        Load More Results
      </button>
    </>
  );
}

export default function Search() {
  // const initialized = useRef(false);
  const router = useRouter();
  const [pageCount, setPageCount] = useState(1);
  const [source, setSource] = useState<'algolia' | 'wp'>('algolia');
  const { query, size } = router.query;

  // useEffect(() => {
  //   if (initialized.current !== true && size) {
  //     setPageCount(Math.min(3, parseInt(String(size))));
  //     initialized.current = true;
  //   }
  // }, [size]);

  // useEffect(() => {
  //   if (initialized.current === true && query && pageCount !== 1)
  //     setPageCount(1);
  // }, [query]);

  // useEffect(() => {
  //   router.replace(
  //     {
  //       pathname: '/search',
  //       query: { query, size: pageCount + 1 },
  //     },
  //     null,
  //     { scroll: false },
  //   );
  // }, [pageCount, router]);

  return (
    <>
      <Head>
        <title>
          Search results
          {router.query.query ? ` for ${router.query.query}` : ''}
        </title>
      </Head>
      <Layout className="max-w-screen-2xl pb-14 xl:pb-0">
        <LayoutMain className="min-h-screen bg-gray-100 dark:bg-black lg:bg-transparent">
          <div className="px-2 lg:px-8 pb-8">
            {[...Array(pageCount)].map((_item, i) => (
              <Page
                index={i}
                isLastPage={i === pageCount - 1}
                key={i}
                query={query ? String(query) : ''}
                onClickMore={() => setPageCount(x => x + 1)}
                onError={error => {
                  console.error(error);
                  if (source === 'algolia') {
                    setPageCount(1);
                    setSource('wp');
                  }
                }}
                pageSize={source === 'algolia' ? 100 : 10}
                source={source}
              />
            ))}
          </div>
        </LayoutMain>
        <LayoutSidebar>
          <SidebarDefault />
          <Footer />
        </LayoutSidebar>
      </Layout>
    </>
  );
}
