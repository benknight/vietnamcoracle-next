import { GraphQLClient } from 'graphql-request';

type RoleType = 'admin' | 'preview' | 'user';

const credentials: Record<RoleType, { username: string; password: string }> = {
  admin: {
    username: process.env.WORDPRESS_API_USERNAME_ADMIN || '',
    password: process.env.WORDPRESS_API_PASSWORD_ADMIN || '',
  },
  preview: {
    username: process.env.WORDPRESS_API_USERNAME_PREVIEW || '',
    password: process.env.WORDPRESS_API_PASSWORD_PREVIEW || '',
  },
  user: {
    username: process.env.NEXT_PUBLIC_WORDPRESS_API_USERNAME || '',
    password: process.env.NEXT_PUBLIC_WORDPRESS_API_PASSWORD || '',
  },
};

export default class WPGraphQLClient extends GraphQLClient {
  constructor(role?: 'admin' | 'preview' | 'user') {
    if (role && typeof window !== 'undefined') {
      throw new Error(
        'Can only instantiate client with role in server-side environments',
      );
    }

    super(
      `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/graphql`,
      role
        ? {
            headers: {
              Authorization: `Basic ${Buffer.from(
                `${credentials[role].username}:${credentials[role].password}`,
                'utf-8',
              ).toString('base64')}`,
            },
          }
        : {},
    );
  }
}
