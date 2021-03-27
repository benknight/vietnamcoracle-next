import cx from 'classnames';
import { gql } from 'graphql-request';
import _upperFirst from 'lodash/upperFirst';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, Fragment } from 'react';
import useSWR from 'swr';
import SearchForm from '../components/SearchForm';
import GraphQLClient from '../lib/GraphQLClient';
import useWaitCursor from '../lib/useWaitCursor';

const PAGE_SIZE = 10;

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

const resultsFetcher = (url: string) => fetch(url).then(res => res.json());

const postsFetcher = (query: string, ids: string) =>
  GraphQLClient.request(query, {
    in: ids.split(',').map(i => window.parseInt(i)),
  });

function Page({ query, index, isLast, onLoadMore }) {
  const results = useSWR(
    `/api/search?query=${query}&page=${index}&pageSize=${PAGE_SIZE}`,
    resultsFetcher,
  );
  const posts = useSWR(
    results.data
      ? [SEARCH_RESULTS_QUERY, results.data.map(r => r.id).join(',')]
      : null,
    postsFetcher,
  );
  const loading = !posts.data && !posts.error;
  useWaitCursor(loading);
  return (
    <>
      {posts.data?.contentNodes?.nodes.map(post => (
        <div
          className="relative sm:flex my-2 p-4 xl:px-0 rounded overflow-hidden bg-white dark:bg-gray-900 xl:bg-transparent shadow xl:shadow-none"
          key={post.uri}>
          <Link href={post.uri}>
            <a className="absolute inset-0 sm:hidden" />
          </Link>
          {post.featuredImage ? (
            <div className="float-right w-24 h-24 sm:w-auto sm:h-auto flex-shrink-0 ml-4 mb-3 sm:mr-6 sm:ml-0 sm:mb-0">
              <Link href={post.uri}>
                <a>
                  <Image
                    alt={post.featuredImage.node.altText}
                    className="rounded"
                    height={150}
                    layout="intrinsic"
                    loading="lazy"
                    src={`https://res.cloudinary.com/vietnam-coracle/image/fetch/${post.featuredImage.node.sourceUrl}`}
                    width={150}
                  />
                </a>
              </Link>
            </div>
          ) : null}
          <div className="flex-auto">
            <div className="flex items-baseline">
              <Link href={post.uri}>
                <a className="link sm:mt-1 text-base sm:text-2xl font-display">
                  {post.title}
                </a>
              </Link>
              {post.contentType.node.name !== 'post' && (
                <div className="ml-2 italic opacity-50">
                  {_upperFirst(post.contentType.node.name)}
                </div>
              )}
            </div>
            <div
              className="my-1 text-sm sm:text-base"
              dangerouslySetInnerHTML={{ __html: post.excerpt }}
            />
            {post.categories?.nodes.length > 0 && (
              <div className="hidden sm:block text-gray-500">
                Posted in{' '}
                {post.categories.nodes.map((cat, i) => (
                  <Fragment key={cat.uri}>
                    {i !== 0 && ', '}
                    <Link href={cat.uri}>
                      <a className="italic hover:underline">{cat.name}</a>
                    </Link>
                  </Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      {index === 1 && loading ? (
        <div className="text-center xl:text-left">Loading…</div>
      ) : isLast ? (
        <div className="text-center xl:my-8">
          <button
            className={cx('btn w-full h-12 xl:h-10 xl:w-auto', {
              'opacity-50': loading,
              hidden: posts.data?.contentNodes?.nodes.length < PAGE_SIZE,
            })}
            disabled={loading}
            onClick={onLoadMore}>
            Load More Results
          </button>
        </div>
      ) : null}
    </>
  );
}

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!router.query.query || query === router.query.query) return;
    setPage(1);
    setQuery(String(router.query.query) || '');
  }, [router.query.query]);

  const pages = [];

  if (query) {
    for (let i = 1; i <= page; i++) {
      pages.push(
        <Page
          index={i}
          isLast={i === page}
          key={i}
          query={query}
          onLoadMore={() => setPage(page => page + 1)}
        />,
      );
    }
  }

  return (
    <>
      <Head>
        <title>
          Search results
          {router.query.query ? ` for ${router.query.query}` : ''}
        </title>
      </Head>
      <div className="px-3 pb-24 max-w-5xl mx-auto">
        <div className="lg:max-w-sm my-4 lg:my-12 xl:mb-12 xl:mt-16">
          <SearchForm />
        </div>
        {pages}
      </div>
    </>
  );
}
