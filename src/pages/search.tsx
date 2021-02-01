import { gql } from 'graphql-request';
import _upperFirst from 'lodash/upperFirst';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import Layout, { LayoutMain } from '../components/Layout';
import getAPIClient from '../lib/getAPIClient';
import useWaitCursor from '../lib/useWaitCursor';

const SEARCH_QUERY = gql`
  query SearchPage($before: String!, $query: String!) {
    contentNodes(
      before: $before
      first: 10
      where: { contentTypes: [PAGE, POST], search: $query }
    ) {
      edges {
        node {
          uri
          ... on Page {
            title
          }
          ... on Post {
            excerpt
            title
            categories(where: { exclude: "154" }) {
              nodes {
                name
                uri
              }
            }
          }
          contentType {
            node {
              name
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        startCursor
      }
    }
  }
`;

const client = getAPIClient();

const getInitialPageInfo = () => ({
  startCursor: '',
  hasNextPage: false,
});

export default function SearchPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [pageInfo, setPageInfo] = useState(getInitialPageInfo());
  const router = useRouter();

  useWaitCursor(loading);

  const loadResults = () => {
    if (router.query.query) {
      setLoading(true);
      client
        .request(SEARCH_QUERY, {
          before: pageInfo.startCursor,
          query: router.query.query,
        })
        .then(response => {
          setResults([
            ...results,
            ...response.contentNodes.edges.map(({ node }) => node),
          ]);
          setPageInfo(response.contentNodes.pageInfo);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    setResults([]);
    setPageInfo(getInitialPageInfo());
    loadResults();
  }, [router.query]);

  return (
    <Layout maxWidth="lg">
      <LayoutMain>
        <div className="page-wrap pb-24 font-serif">
          <h1 className="page-heading mt-12 mb-8">
            Search results for “{router.query.query}”
          </h1>
          {results.map(r => (
            <div className="my-8">
              <div className="flex items-baseline">
                <Link href={r.uri}>
                  <a className="link text-xl">
                    <div className="">{r.title}</div>
                  </a>
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
                <div className="text-sm italic text-gray-500">
                  Posted in{' '}
                  {r.categories.nodes.map((r, index) => (
                    <>
                      {index !== 0 && ', '}
                      <Link href={r.uri}>
                        <a className="link hover:underline">{r.name}</a>
                      </Link>
                    </>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading ? (
            'Searching…'
          ) : pageInfo.hasNextPage ? (
            <button onClick={loadResults}>Load more</button>
          ) : null}
        </div>
      </LayoutMain>
    </Layout>
  );
}
