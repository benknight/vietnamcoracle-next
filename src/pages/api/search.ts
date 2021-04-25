import type { NextApiRequest, NextApiResponse } from 'next';
import api from '../../lib/RestClient';

export default async function search(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { page = 1, pageSize = 10, query } = req.query;
  try {
    const response = await api.get(
      `/search?search=${query}&page=${page}&pageSize=${pageSize}`,
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}
