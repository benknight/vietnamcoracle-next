import { GraphQLClient } from 'graphql-request';

const APIClient = new GraphQLClient(process.env.NEXT_PUBLIC_WORDPRESS_API_URL, {
  headers: {
    Authorization: process.env.WORDPRESS_AUTH_REFRESH_TOKEN
      ? `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`
      : null,
  },
});

export default APIClient;
