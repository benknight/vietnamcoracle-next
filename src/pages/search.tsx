import { gql } from 'graphql-request';
import _upperFirst from 'lodash/upperFirst';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, Fragment } from 'react';
import Layout, { LayoutMain } from '../components/Layout';
import SearchForm from '../components/SearchForm';
import APIClient from '../lib/APIClient';
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

const getInitialPageInfo = () => ({
  startCursor: '',
  hasNextPage: false,
});

export default function SearchPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [pageInfo, setPageInfo] = useState(getInitialPageInfo());
  const router = useRouter();

  useWaitCursor(loading);

  const loadResults = () => {
    if (!query) return;
    setLoading(true);
    APIClient.request(SEARCH_QUERY, {
      before: pageInfo.startCursor,
      query,
    }).then(response => {
      setResults([
        ...results,
        ...response.contentNodes.edges.map(({ node }) => node),
      ]);
      setPageInfo(response.contentNodes.pageInfo);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (results.length > 0) {
      setResults([]);
      setPageInfo(getInitialPageInfo());
    }
    setQuery(String(router.query.query) || '');
  }, [router.query.query]);

  useEffect(() => {
    loadResults();
  }, [query]);

  return (
    <>
      <Head>
        <title>
          Search results{router.query.query ? ` for ${router.query.query}` : ''}
        </title>
      </Head>
      <Layout>
        <LayoutMain>
          <div className="page-wrap pb-24 font-serif">
            <div className="max-w-md my-12">
              <SearchForm />
            </div>
            {results.map(r => (
              <div className="my-14" key={r.uri}>
                <div className="flex items-baseline">
                  <Link href={r.uri}>
                    <a className="link text-2xl font-display">
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
            ))}
            {loading ? (
              'Searching…'
            ) : pageInfo.hasNextPage ? (
              <button className="btn" onClick={loadResults}>
                Load More Results
              </button>
            ) : null}
          </div>
        </LayoutMain>
      </Layout>
    </>
  );
}
