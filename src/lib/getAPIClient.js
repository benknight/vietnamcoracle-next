import { GraphQLClient } from 'graphql-request';

let client;

export default function getAPIClient() {
  if (!client) {
    client = new GraphQLClient(process.env.NEXT_PUBLIC_WORDPRESS_API_URL, {
      headers: {
        Authorization: process.env.WORDPRESS_AUTH_REFRESH_TOKEN
          ? `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`
          : null,
      },
    });
  }
  return client;
}
