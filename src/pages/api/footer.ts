import { gql } from 'graphql-request';
import type { NextApiRequest, NextApiResponse } from 'next';
import GraphQLClient from '../../lib/WPGraphQLClient';

export default async function footer(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  const api = new GraphQLClient();
  const result = await api.request(gql`
    query Footer {
      menu(id: "dGVybTo0MDk=") {
        menuItems {
          nodes {
            path
            label
          }
        }
      }
    }
  `);
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600');
  res.send(result);
}
