import axios from 'axios';

export default axios.create({
  auth: {
    username: process.env.NEXT_PUBLIC_WORDPRESS_API_USERNAME,
    password: process.env.NEXT_PUBLIC_WORDPRESS_API_PASSWORD,
  },
  baseURL: 'https://www.cms.vietnamcoracle.com/wp-json/wp/v2',
});
