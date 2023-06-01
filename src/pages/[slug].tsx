import { gql } from 'graphql-request';
import Post, { getPostPageProps, POST_QUERY } from '../components/Post';
import getGQLClient from '../lib/getGQLClient';
import { RestClientAdmin } from '../lib/RestClient';

export default function SSGPost(props) {
  return <Post data={props.data} html={props.html} postNav={props.postNav} />;
}

export async function getStaticPaths() {
  const query = gql`
    {
      contentNodes(first: 1000, where: { contentTypes: [PAGE, POST] }) {
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

async function fetchFirstValidId(slug: string, endpoints: string[]) {
  for (let endpoint of endpoints) {
    const url = `/${endpoint}?slug=${encodeURIComponent(
      slug,
    )}&_fields=id&status=private,publish`;
    const response = await RestClientAdmin.get(url);
    if (response.data?.[0]?.id) {
      return response.data[0].id;
    }
  }
  return null;
}

export async function getStaticProps({ params: { slug }, preview = false }) {
  const api = getGQLClient(preview ? 'preview' : 'admin');
  let databaseId;
  try {
    databaseId = await fetchFirstValidId(slug, ['posts', 'pages']);
  } catch (error) {
    databaseId = null;
  }
  if (!databaseId) {
    return {
      notFound: true,
    };
  }
  const data = await api.request(POST_QUERY, {
    preview,
    id: databaseId,
    idType: 'DATABASE_ID',
  });
  if (
    data.contentNode?.status === 'private' ||
    data.contentNode?.patreonLevel > 0
  ) {
    return {
      redirect: {
        destination: `/post/?p=${data.contentNode.databaseId}`,
        permanent: false,
      },
    };
  }
  if (
    !data.contentNode ||
    !['post', 'page'].includes(data.contentNode.contentType?.node.name)
  ) {
    return {
      notFound: true,
    };
  }
  return {
    props: await getPostPageProps(data, preview),
  };
}
