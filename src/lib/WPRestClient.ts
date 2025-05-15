type role = 'subscriber' | 'admin';

const credentials: Record<role, { username: string; password: string }> = {
  subscriber: {
    username: process.env.NEXT_PUBLIC_WORDPRESS_API_USERNAME || '',
    password: process.env.NEXT_PUBLIC_WORDPRESS_API_PASSWORD || '',
  },
  admin: {
    username: process.env.WORDPRESS_API_USERNAME_ADMIN || '',
    password: process.env.WORDPRESS_API_PASSWORD_ADMIN || '',
  },
};

export default class WPRestClient {
  private baseURL: string;
  private authHeader: string;

  constructor(role: 'subscriber' | 'admin') {
    this.baseURL = 'https://cms.vietnamcoracle.com/wp-json';
    const { username, password } = credentials[role];
    this.authHeader =
      'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
  }

  async get(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: this.authHeader,
      },
    });

    if (!response.ok) {
      throw new Error(
        `WPRestClient: error response received with status ${response.status}`,
      );
    }

    return await response.json();
  }

  // add other methods like post, put, delete here
}
