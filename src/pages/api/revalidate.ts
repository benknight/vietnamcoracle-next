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
    const ip =
      request.headers['x-forwarded-for'] || request.socket.remoteAddress;

    await Promise.all(paths.split(',').map(path => response.revalidate(path)));

    console.log(`Revalidated paths: ${paths} | IP: ${ip}`);

    return response.send({ success: true });
  } catch (error: any) {
    console.error('Revalidation error:', error);

    return response
      .status(500)
      .send({ error: error?.message || 'Unknown error', success: false });
  }
}
