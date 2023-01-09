import algoliasearch from 'algoliasearch/lite';
import type { NextApiRequest, NextApiResponse } from 'next';

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_KEY_ADMIN,
);

const index = client.initIndex('wp_post');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { q, page = 1, pageSize } = req.query;
    const result = await index.search(String(q), {
      attributesToRetrieve: ['excerpt', 'slug', 'thumbnail', 'title'],
      hitsPerPage: Math.min(100, Number(pageSize)),
      page: Number(page) - 1,
    });
    res.json(result);
  } catch (error) {
    res.status(503).send(null);
  }
}
