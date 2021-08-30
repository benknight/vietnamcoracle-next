import { GraphQLClient } from 'graphql-request';

export default function getGQLClient(authType?: 'admin' | 'user') {
  if (typeof authType !== 'undefined' && typeof window !== 'undefined') {
    throw new Error(
      'Can only instantiate client with auth type in server-side environments',
    );
  }
  const config = {
    headers: {},
  };
  if (authType === 'admin') {
    config.headers = {
      Authorization: `Basic ${Buffer.from(
        `${process.env.WORDPRESS_API_USERNAME_ADMIN}:${process.env.WORDPRESS_API_PASSWORD_ADMIN}`,
        'utf-8',
      ).toString('base64')}`,
    };
  }
  if (authType === 'user') {
    config.headers = {
      Authorization: `Basic ${Buffer.from(
        `${process.env.NEXT_PUBLIC_WORDPRESS_API_USERNAME}:${process.env.NEXT_PUBLIC_WORDPRESS_API_PASSWORD}`,
        'utf-8',
      ).toString('base64')}`,
    };
  }
  return new GraphQLClient(
    `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/graphql`,
    config,
  );
}
