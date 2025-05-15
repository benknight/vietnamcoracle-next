import { gql } from 'graphql-request';
import type { NextApiRequest, NextApiResponse } from 'next';
import GraphQLClient from '../../lib/WPGraphQLClient';

export default async function menu(_req: NextApiRequest, res: NextApiResponse) {
  const api = new GraphQLClient();
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
  res.setHeader(
    'Cache-Control',
    `public, max-age=0, s-maxage=${maxAgeSeconds}`,
  );
  res.send(result);
}
