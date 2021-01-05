import { gql } from 'graphql-request';
import getAPIClient from '../../lib/getAPIClient';

export default async function preview(req, res) {
  const { secret, slug } = req.query;

  // Check the secret and next parameters
  // This secret should only be known by this API route
  if (
    !process.env.WORDPRESS_PREVIEW_SECRET ||
    secret !== process.env.WORDPRESS_PREVIEW_SECRET ||
    !slug
  ) {
    return res.status(401).json({ message: 'Invalid request' });
  }

  const client = getAPIClient();

  const result = await client.request(
    gql`
      query PreviewComponent($id: ID!) {
        component(id: $id, idType: SLUG) {
          id
          previewRevisionId
          slug
        }
      }
    `,
    {
      id: slug,
    },
  );

  const { component } = result;

  // If the post doesn't exist prevent preview mode from being enabled
  if (!component?.previewRevisionId) {
    return res.status(401).json({ message: 'No preview revision found' });
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({
    component,
  });

  // Redirect to the path from the fetched post
  // We don't redirect to `req.query.slug` as that might lead to open redirect vulnerabilities
  res.writeHead(307, { Location: `/browse/${component.slug}` });
  res.end();
}
