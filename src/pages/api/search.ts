import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function preview(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { page = 1, pageSize = 10, query } = req.query;
  try {
    const response = await axios({
      auth: {
        username: process.env.WORDPRESS_API_USERNAME,
        password: process.env.WORDPRESS_API_PASSWORD,
      },
      url: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/search?search=${query}&page=${page}&pageSize=${pageSize}`,
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}
