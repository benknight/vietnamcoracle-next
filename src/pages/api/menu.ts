import { gql } from 'graphql-request';
import type { NextApiRequest, NextApiResponse } from 'next';
import getGQLClient from '../../lib/getGQLClient';

export default async function preview(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  const api = getGQLClient();
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
  res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');
  res.send(result);
}
