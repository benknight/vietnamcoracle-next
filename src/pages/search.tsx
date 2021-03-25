import cx from 'classnames';
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
      <div className="px-3 pb-24 max-w-5xl mx-auto">
        <div className="lg:max-w-sm my-4 lg:my-12 xl:mb-12 xl:mt-16">
          <SearchForm />
        </div>
        {results.map(r => (
          <div
            className="relative sm:flex my-2 p-4 xl:px-0 rounded overflow-hidden bg-white dark:bg-gray-900 xl:bg-transparent shadow xl:shadow-none"
            key={r.uri}>
            <Link href={r.uri}>
              <a className="absolute inset-0 sm:hidden" />
            </Link>
            {r.featuredImage ? (
              <div className="float-right w-24 h-24 sm:w-auto sm:h-auto flex-shrink-0 ml-4 mb-3 sm:mr-6 sm:ml-0 sm:mb-0">
                <Link href={r.uri}>
                  <a>
                    <Image
                      alt={r.featuredImage.node.altText}
                      className="rounded"
                      height={150}
                      layout="intrinsic"
                      loading="lazy"
                      src={`https://res.cloudinary.com/vietnam-coracle/image/fetch/${r.featuredImage.node.sourceUrl}`}
                      width={150}
                    />
                  </a>
                </Link>
              </div>
            ) : null}
            <div className="flex-auto">
              <div className="flex items-baseline">
                <Link href={r.uri}>
                  <a className="link sm:mt-1 text-base sm:text-2xl font-display">
                    {r.title}
                  </a>
                </Link>
                {r.contentType.node.name !== 'post' && (
                  <div className="ml-2 italic opacity-50">
                    {_upperFirst(r.contentType.node.name)}
                  </div>
                )}
              </div>
              <div
                className="my-1 text-sm sm:text-base"
                dangerouslySetInnerHTML={{ __html: r.excerpt }}
              />
              {r.categories?.nodes.length > 0 && (
                <div className="hidden sm:block text-gray-500">
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
            <button
              className={cx('btn w-full h-12 xl:w-auto', {
                'opacity-50': loading,
              })}
              disabled={loading}
              onClick={loadResults}>
              Load More Results
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}
