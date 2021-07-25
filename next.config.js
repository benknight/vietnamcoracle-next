const axios = require('axios');

module.exports = {
  future: {
    // NOTE(2021-05-12): Disabling due to build issues
    // webpack5: true,
  },
  images: {
    domains: ['www.vietnamcoracle.com', 'res.cloudinary.com'],
  },
  async redirects() {
    const api = axios.create({
      auth: {
        username: process.env.WORDPRESS_API_USERNAME,
        password: process.env.WORDPRESS_API_PASSWORD,
      },
      baseURL: 'https://www.vietnamcoracle.com/wp-json/redirection/v1',
    });
    let cmsRedirects;
    try {
      const response = await api.get('/export/all/json');
      cmsRedirects = JSON.parse(response.data.data)?.redirects;
    } catch (error) {
      cmsRedirects = [];
    }
    return [
      {
        destination: '/browse/:path*',
        permanent: true,
        source: '/category/features-guides/:path*',
      },
      {
        destination: '/browse/:path*',
        permanent: true,
        source: '/category/:path*',
      },
      {
        destination: '/post',
        permanent: false,
        source: '/',
        has: [
          {
            type: 'query',
            key: 'p',
          },
        ],
      },
      ...cmsRedirects.map(config => ({
        destination: config.action_data.url.replace(
          /https?\:\/\/(www\.)?vietnamcoracle\.com/g,
          '',
        ),
        permanent: true,
        source: config.match_url,
      })),
    ];
  },
  async rewrites() {
    return [
      {
        destination: '/browse',
        source: '/',
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};
