import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { secret, path } = req.query;
  if (secret !== process.env.WORDPRESS_PREVIEW_SECRET) {
    return res.status(401).json({ message: 'Invalid secret' });
  }
  try {
    await res.unstable_revalidate(String(path));
    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating');
  }
}
