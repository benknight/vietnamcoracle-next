import { gql } from 'graphql-request';
import NotFound from '../components/NotFound';
import GraphQLClient from '../lib/GraphQLClient';

// This page should only ever redirect
export default function PostById() {
  return null;
}

export async function getServerSideProps({ query }) {
  if (!query.p) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  const data = await GraphQLClient.request(
    gql`
      query PostById($id: ID!) {
        post(id: $id, idType: DATABASE_ID) {
          uri
        }
      }
    `,
    {
      id: query.p,
    },
  );

  if (data?.post) {
    return {
      redirect: {
        destination: data.post.uri,
        permanent: true,
      },
    };
  }

  return {
    notFound: true,
  };
}
