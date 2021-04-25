import axios from 'axios';

export default axios.create({
  auth: {
    username: process.env.WORDPRESS_API_USERNAME,
    password: process.env.WORDPRESS_API_PASSWORD,
  },
  baseURL: 'https://www.vietnamcoracle.com/wp-json/wp/v2',
});
