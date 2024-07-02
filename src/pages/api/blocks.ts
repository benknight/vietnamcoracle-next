import { gql } from 'graphql-request';
import type { NextApiRequest, NextApiResponse } from 'next';
import getGQLClient from '../../lib/getGQLClient';

export default async function sidebar(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  const api = getGQLClient('admin');
  const result = await api.request(gql`
    query Sidebar {
      about: block(id: "cG9zdDozNjExOA==") {
        ...Block
      }
      subscribe: block(id: "cG9zdDozNzcwNQ==") {
        ...Block
      }
      support: block(id: "cG9zdDozNzY4Nw==") {
        ...Block
      }
    }
    fragment Block on Block {
      block {
        description
        title
        image {
          sourceUrl
        }
        link {
          title
          url
        }
        messages {
          key
          value
        }
      }
    }
  `);
  res.setHeader('Cache-Control', 'public, maxage=0, s-maxage=3600');
  res.send(result);
}
