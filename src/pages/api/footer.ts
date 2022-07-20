import { gql } from 'graphql-request';
import type { NextApiRequest, NextApiResponse } from 'next';
import getGQLClient from '../../lib/getGQLClient';

export default async function footer(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  const api = getGQLClient();
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
  res.setHeader('Cache-Control', 'max-age=0, s-maxage=3600');
  res.send(result);
}
