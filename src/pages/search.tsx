import cx from 'classnames';
import { gql } from 'graphql-request';
import _upperFirst from 'lodash/upperFirst';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { useSWRInfinite } from 'swr';
import SearchForm from '../components/SearchForm';
import GraphQLClient from '../lib/GraphQLClient';
import RestClient from '../lib/RestClient';
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

const resultsFetcher = async (query: string, page: number) => {
  const { data: results } = await RestClient.get(
    `/search?search=${query}&page=${page}&pageSize=10`,
  );
  if (results.length === 0) {
    return [];
  }
  const data = await GraphQLClient.request(SEARCH_RESULTS_QUERY, {
    in: results.map(r => r.id),
  });
  return data.contentNodes.nodes;
};

export default function SearchPage() {
  const router = useRouter();
  const { query } = router.query;
  const initialSize = router.query.size
    ? parseInt(String(router.query.size))
    : 1;
  const { data, error, size, setSize } = useSWRInfinite(
    index => (query ? [query, index + 1] : null),
    resultsFetcher,
    {
      initialSize,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);

  useWaitCursor(isLoadingInitialData || isLoadingMore);

  return (
    <>
      <Head>
        <title>
          Search results
          {router.query.query ? ` for ${router.query.query}` : ''}
        </title>
      </Head>
      <div className="px-3 pb-24 max-w-5xl mx-auto">
        <div className="text-center lg:text-left my-8 xl:mt-12 xl:font-display xl:text-lg">
          {isLoadingInitialData ? (
            'Searching…'
          ) : (
            <>
              Search results for <em>{query}</em>
            </>
          )}
        </div>
        {isEmpty && (
          <div className="text-center lg:text-left my-8 lg:my-12 xl:mb-12 xl:mt-16">
            No results found for <em>{query}</em>
          </div>
        )}
        {data?.map(results =>
          results.map(result => (
            <SearchResult data={result} key={result.uri} />
          )),
        )}
        <div className="text-center lg:my-8">
          <button
            className={cx('btn w-full h-12 lg:h-10 lg:w-auto', {
              'opacity-50': isLoadingMore,
              hidden: isLoadingInitialData || isReachingEnd,
            })}
            disabled={isLoadingMore}
            onClick={() => {
              router.replace(
                {
                  pathname: '/search',
                  query: { query, size: size + 1 },
                },
                null,
                { scroll: false },
              );
              setSize(size + 1);
            }}>
            Load More Results
          </button>
        </div>
      </div>
    </>
  );
}

function SearchResult({ data }) {
  return (
    <div
      className="
        relative sm:flex my-2 p-4 lg:px-0 rounded overflow-hidden
        bg-white dark:bg-gray-900 lg:bg-transparent shadow lg:shadow-none"
      key={data.uri}>
      <Link href={data.uri}>
        <a className="absolute inset-0 sm:hidden" />
      </Link>
      {data.featuredImage && (
        <div
          className="
            w-24 h-24 sm:w-auto sm:h-auto ml-4 mb-3 sm:mr-6 sm:ml-0 sm:mb-0
            float-right flex-shrink-0">
          <Link href={data.uri}>
            <a>
              <Image
                alt={data.featuredImage.node.altText}
                className="rounded"
                height={150}
                layout="intrinsic"
                loading="lazy"
                src={`https://res.cloudinary.com/vietnam-coracle/image/fetch/${data.featuredImage.node.sourceUrl}`}
                width={150}
              />
            </a>
          </Link>
        </div>
      )}
      <div className="flex-auto">
        <div className="flex items-baseline">
          <Link href={data.uri}>
            <a className="link sm:mt-1 text-base sm:text-2xl font-display">
              {data.title}
            </a>
          </Link>
          {data.contentType.node.name !== 'post' && (
            <div className="ml-2 italic opacity-50">
              {_upperFirst(data.contentType.node.name)}
            </div>
          )}
        </div>
        <div
          className="my-1 text-sm sm:text-base lg:font-serif"
          dangerouslySetInnerHTML={{ __html: data.excerpt }}
        />
        {data.categories?.nodes.length > 0 && (
          <div className="hidden sm:block text-gray-500 lg:font-serif">
            Posted in{' '}
            {data.categories.nodes.map((cat, i) => (
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
  );
}
