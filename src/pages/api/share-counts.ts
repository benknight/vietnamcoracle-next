import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function preview(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let fbShareCount: number = null;

  try {
    const response = await axios.get(
      `https://graph.facebook.com/v10.0/?access_token=${
        process.env.FACEBOOK_ACCESS_TOKEN
      }&id=${encodeURIComponent(
        String(req.query.link),
      )}&fields=og_object{engagement}`,
    );
    fbShareCount = response.data?.og_object?.engagement?.count ?? 0;
  } catch (error) {
    console.error(error);
  }

  res.setHeader('max-age', 1);
  res.setHeader('stale-while-revalidate', 6 * 60 * 60);
  res.send({
    facebook: fbShareCount,
  });
}
