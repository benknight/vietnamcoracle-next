import { GraphQLClient } from 'graphql-request';

// Fetch WordPress to check if the provided `id` exists
let client;

export default function getAPIClient() {
  if (!client) {
    client = new GraphQLClient(process.env.WORDPRESS_API_URL, {
      headers: {
        Authorization: `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`,
      },
    });
  }
  return client;
}
