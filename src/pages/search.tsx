import cx from 'classnames';
import { gql } from 'graphql-request';
import _flatten from 'lodash/flatten';
import _upperFirst from 'lodash/upperFirst';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWRInfinite from 'swr/infinite';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Footer from '../components/Footer';
import Layout, { LayoutMain, LayoutSidebar } from '../components/Layout';
import PostMediaBlock from '../components/PostMediaBlock';
import SidebarDefault from '../components/SidebarDefault';
import breakpoints from '../config/breakpoints';
import * as fragments from '../config/fragments';
import getGQLClient from '../lib/getGQLClient';
import RestClient from '../lib/RestClient';
import useWaitCursor from '../lib/useWaitCursor';

const PAGE_SIZE = 10;

const SEARCH_RESULTS_QUERY = gql`
  query SearchResults($in: [ID]) {
    contentNodes(where: { in: $in }) {
      nodes {
        ...PostCardData
        ...PostMediaBlockData
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${fragments.PostCardData}
  ${fragments.PostMediaBlockData}
`;

const gqlClient = getGQLClient();

const resultsFetcher = async (query: string, page: number) => {
  const { data: results } = await RestClient.get(
    `/search?search=${query}&page=${page}&pageSize=10`,
  );
  if (results.length === 0) {
    return [];
  }
  const data = await gqlClient.request(SEARCH_RESULTS_QUERY, {
    in: results.map(r => r.id),
  });
  return data.contentNodes.nodes;
};

export default function SearchPage(props) {
  const router = useRouter();
  const isSm = useMediaQuery(`(min-width: ${breakpoints.sm})`);
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

  const posts = data ? _flatten(data) : [];

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
          <div className="px-2 lg:px-8">
            <div className="flex justify-between items-baseline py-4 lg:pt-8">
              <div className="ml-2 sm:ml-4 lg:ml-0 mr-8 lg:font-display lg:text-xl">
                {isLoadingInitialData ? (
                  'Searching…'
                ) : isEmpty ? (
                  <>
                    No results found for <em>{query}</em>
                  </>
                ) : (
                  <>
                    Search results for <em>{query}</em>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="px-2 py-px lg:px-8">
            {posts.map(post => (
              <PostMediaBlock key={post.uri} post={post} />
            ))}
          </div>
          <div className="px-2 lg:px-8 text-center pt-2 pb-4 lg:my-8 xl:mb-32">
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
        </LayoutMain>
        <LayoutSidebar>
          <SidebarDefault />
          <Footer />
        </LayoutSidebar>
      </Layout>
    </>
  );
}
