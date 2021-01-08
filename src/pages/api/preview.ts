export default async function preview(req, res) {
  const { secret, redirect } = req.query;

  // Check the secret and next parameters
  // This secret should only be known by this API route
  if (
    !process.env.WORDPRESS_PREVIEW_SECRET ||
    secret !== process.env.WORDPRESS_PREVIEW_SECRET
  ) {
    return res.status(401).json({ message: 'Invalid request' });
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({});

  // Redirect to the path provided
  if (redirect) {
    res.writeHead(307, { Location: redirect });
  }
  res.end();
}
