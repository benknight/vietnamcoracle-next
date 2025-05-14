import axios from 'axios';

export const RestClientSubscriber = axios.create({
  auth: {
    username: process.env.NEXT_PUBLIC_WORDPRESS_API_USERNAME || '',
    password: process.env.NEXT_PUBLIC_WORDPRESS_API_PASSWORD || '',
  },
  baseURL: 'https://cms.vietnamcoracle.com/wp-json/wp/v2',
});

export const RestClientAdmin = axios.create({
  auth: {
    username: process.env.WORDPRESS_API_USERNAME_ADMIN || '',
    password: process.env.WORDPRESS_API_PASSWORD_ADMIN || '',
  },
  baseURL: 'https://cms.vietnamcoracle.com/wp-json/wp/v2',
});
