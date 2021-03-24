import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient(
  `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/graphql`,
  {
    headers: {
      Authorization: process.env.WORDPRESS_AUTH_REFRESH_TOKEN
        ? `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`
        : null,
    },
  },
);

export default client;
