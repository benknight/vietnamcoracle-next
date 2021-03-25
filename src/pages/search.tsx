import { gql } from 'graphql-request';
import _upperFirst from 'lodash/upperFirst';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, Fragment } from 'react';
import SearchForm from '../components/SearchForm';
import GraphQLClient from '../lib/GraphQLClient';
import useWaitCursor from '../lib/useWaitCursor';

const SEARCH_RESULTS_QUERY = gql`
  query SearchResults($in: [ID]) {
    contentNodes(where: { in: $in }) {
      nodes {
        uri
        ... on Page {
          title
        }
        ... on Post {
          excerpt
          title
          categories(
            where: {
              exclude: "154" # Exclude top-level category
            }
          ) {
            nodes {
              name
              uri
            }
          }
          featuredImage {
            node {
              altText
              sourceUrl(size: MEDIUM)
              slug
            }
          }
        }
        contentType {
          node {
            name
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

const pageSize = 10;

export default function SearchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  useWaitCursor(loading);

  const loadResults = async () => {
    // TODO: Use SWR to leverage caching on these queries
    setLoading(true);
    const posts = await fetch(
      `/api/search?query=${query}&page=${page}`,
    ).then(res => res.json());
    const response = await GraphQLClient.request(SEARCH_RESULTS_QUERY, {
      in: posts.map(p => p.id),
    });
    setResults([...results, ...response.contentNodes.nodes]);
    setPage(page => page + 1);
    setHasNextPage(posts.length === pageSize);
    setLoading(false);
  };

  useEffect(() => {
    if (!router.query.query || query === router.query.query) return;
    if (results.length > 0) {
      setResults([]);
      setPage(1);
      setHasNextPage(false);
    }
    setQuery(String(router.query.query) || '');
  }, [router.query.query]);

  useEffect(() => {
    if (!query) return;
    loadResults();
  }, [query]);

  return (
    <>
      <Head>
        <title>
          Search results{router.query.query ? ` for ${router.query.query}` : ''}
        </title>
      </Head>
      <div className="page-wrap pb-24 max-w-5xl mx-auto">
        <div className="max-w-sm mt-16 mb-12">
          <SearchForm />
        </div>
        {results.map(r => (
          <div className="flex my-14" key={r.uri}>
            {r.featuredImage ? (
              <div className="flex-shrink-0 mr-6">
                <Image
                  alt={r.featuredImage.node.altText}
                  className="rounded"
                  height={150}
                  layout="fixed"
                  loading="lazy"
                  src={`https://res.cloudinary.com/vietnam-coracle/image/fetch/${r.featuredImage.node.sourceUrl}`}
                  width={150}
                />
              </div>
            ) : null}
            <div className="flex-auto">
              <div className="flex items-baseline">
                <Link href={r.uri}>
                  <a className="link mt-1 text-2xl font-display">{r.title}</a>
                </Link>
                {r.contentType.node.name !== 'post' && (
                  <div className="ml-2 italic opacity-50">
                    {_upperFirst(r.contentType.node.name)}
                  </div>
                )}
              </div>
              <div
                className="my-1"
                dangerouslySetInnerHTML={{ __html: r.excerpt }}
              />
              {r.categories?.nodes.length > 0 && (
                <div className="text-gray-500">
                  Posted in{' '}
                  {r.categories.nodes.map((r, index) => (
                    <Fragment key={r.uri}>
                      {index !== 0 && ', '}
                      <Link href={r.uri}>
                        <a className="italic hover:underline">{r.name}</a>
                      </Link>
                    </Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="text-center">
          {hasNextPage ? (
            <button className="btn" onClick={loadResults}>
              Load More Results
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}
