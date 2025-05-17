import { gql } from 'graphql-request';
import GraphQLClient from '../../lib/WPGraphQLClient';

export const config = {
  runtime: 'edge',
};

export default async function handler() {
  const api = new GraphQLClient('admin');

  const result = await api.request(gql`
    query Menu {
      menuItems(where: { location: HEADER_MENU_NEXT }, first: 1000) {
        nodes {
          id
          label
          parentId
          path
          url
        }
      }
    }
  `);

  const maxAgeSeconds = 60 * 60 * 24; // 24 hours

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `public, max-age=0, s-maxage=${maxAgeSeconds}`,
    },
  });
}
