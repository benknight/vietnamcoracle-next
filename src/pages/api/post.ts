import type { NextApiRequest, NextApiResponse } from 'next';
import api from '../../lib/RestClient';

export default async function search(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { password, id } = req.query;
  try {
    const response = await api.get(`/posts/${id}?password=${password}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}
