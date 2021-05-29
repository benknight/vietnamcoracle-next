import { GraphQLClient } from 'graphql-request';

const config = {
  headers: {},
};

if (typeof window === 'undefined') {
  config.headers = {
    Authorization: `Basic ${Buffer.from(
      `${process.env.WORDPRESS_API_USERNAME}:${process.env.WORDPRESS_API_PASSWORD}`,
      'utf-8',
    ).toString('base64')}`,
  };
}

const client = new GraphQLClient(
  `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/graphql`,
  config,
);

export default client;
