import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.query.secret !== process.env.WORDPRESS_SECRET) {
    return response.status(401).send({ message: 'Forbidden' });
  }

  try {
    const paths = request.query.paths as string;
    await Promise.all(paths.split(',').map(path => response.revalidate(path)));
    return response.send({ success: true });
  } catch (error) {
    return response.status(500).send({ error, success: false });
  }
}
