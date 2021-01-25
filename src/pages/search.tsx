import { gql } from 'graphql-request';
import _upperFirst from 'lodash/upperFirst';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout, { LayoutMain } from '../components/Layout';
import getAPIClient from '../lib/getAPIClient';
import useWaitCursor from '../lib/useWaitCursor';

const SEARCH_QUERY = gql`
  query SearchPage($query: String!) {
    contentNodes(
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
    }
  }
`;

export default function SearchPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const router = useRouter();

  useWaitCursor(loading);

  useEffect(() => {
    if (router.query.query) {
      const client = getAPIClient();
      setLoading(true);
      client
        .request(SEARCH_QUERY, {
          query: router.query.query,
        })
        .then(response => {
          setResults(response.contentNodes.edges.map(({ node }) => node));
          setLoading(false);
        });
    }
  }, [router.query]);

  return (
    <Layout>
      <LayoutMain>
        <div className="page-wrap pb-24">
          <h1 className="page-heading mt-12 mb-8">
            Search results for “{router.query.query}”
          </h1>
          {loading
            ? 'Searching…'
            : results.length > 0
            ? results.map(r => (
                <div className="my-8">
                  <div className="flex items-baseline">
                    <Link href={r.uri}>
                      <a className="link font-serif text-xl">
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
                    className="my-1 max-w-2xl font-serif"
                    dangerouslySetInnerHTML={{ __html: r.excerpt }}
                  />
                  {r.categories?.nodes.length > 0 && (
                    <div className="font-serif text-sm italic text-gray-400">
                      Posted in{' '}
                      {r.categories.nodes.map((r, index) => (
                        <>
                          {index !== 0 && ', '}
                          <Link href={r.uri}>
                            <a className="text-gray-500 hover:underline">
                              {r.name}
                            </a>
                          </Link>
                        </>
                      ))}
                    </div>
                  )}
                </div>
              ))
            : 'No results found.'}
        </div>
      </LayoutMain>
    </Layout>
  );
}
