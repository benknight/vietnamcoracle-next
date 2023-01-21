import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { paths } = req.query;
  const { secret } = req.body;
  if (secret !== process.env.WORDPRESS_PREVIEW_SECRET) {
    return res.status(401).json({ message: 'Invalid request' });
  }
  try {
    await Promise.all(
      String(paths)
        .split(',')
        .map(path => res.revalidate(path)),
    );
    return res.send({ success: true });
  } catch (err) {
    return res.status(500).send({ success: false });
  }
}
