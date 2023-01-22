import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { paths } = request.query;
  const { secret } = request.body;
  if (secret !== process.env.WORDPRESS_PREVIEW_SECRET) {
    return response.status(401).send({ message: 'Invalid request' });
  }
  try {
    await Promise.all(
      String(paths)
        .split(',')
        .map(path => response.revalidate(path)),
    );
    return response.send({ success: true });
  } catch (error) {
    return response.status(500).send({ error, success: false });
  }
}
