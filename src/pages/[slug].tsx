import { gql } from 'graphql-request';
import type { InferGetStaticPropsType } from 'next';
import Post, { getPostPageProps, POST_QUERY } from '../components/Post';
import getGQLClient from '../lib/getGQLClient';

export default function SSGPost(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  return <Post data={props.data} html={props.html} postNav={props.postNav} />;
}

export async function getStaticPaths() {
  const query = gql`
    {
      contentNodes(first: 1000) {
        nodes {
          ... on ContentNode {
            uri
          }
        }
      }
    }
  `;
  const api = getGQLClient('admin');
  const data = await api.request(query);
  const result = {
    paths: [
      ...data.contentNodes.nodes.map(node => ({
        params: {
          slug: node.uri.split('/').filter(token => Boolean(token))[0],
        },
      })),
    ],
    fallback: 'blocking',
  };
  return result;
}

export async function getStaticProps({ params: { slug }, preview = false }) {
  const api = getGQLClient('admin');
  const data = await api.request(POST_QUERY, {
    preview,
    id: slug,
  });
  if (
    data.contentNode?.status === 'private' ||
    data.contentNode?.patreonLevel > 0
  ) {
    return {
      redirect: {
        destination: `/post?p=${data.contentNode.databaseId}`,
        permanent: false,
      },
    };
  }
  return {
    notFound: !data.contentNode,
    props: await getPostPageProps(data, preview),
    revalidate: 1,
  };
}
