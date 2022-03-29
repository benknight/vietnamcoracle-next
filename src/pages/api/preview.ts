import type { NextApiRequest, NextApiResponse } from 'next';

export default async function preview(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { secret, redirect } = req.query;

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({
    isAdminPreview: secret == process.env.WORDPRESS_PREVIEW_SECRET,
  });

  // Redirect to the path provided
  res.writeHead(307, { Location: redirect || '/' });
  res.end();
}
