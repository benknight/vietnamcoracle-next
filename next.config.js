const axios = require('axios');

module.exports = {
  images: {
    domains: ['www.cms.vietnamcoracle.com', 'res.cloudinary.com'],
  },
  trailingSlash: true,
  async redirects() {
    const api = axios.create({
      auth: {
        username: process.env.WORDPRESS_API_USERNAME_ADMIN,
        password: process.env.WORDPRESS_API_PASSWORD_ADMIN,
      },
      baseURL: 'https://www.cms.vietnamcoracle.com/wp-json/redirection/v1',
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
        destination: '/post/',
        permanent: false,
        source: '/',
        has: [
          {
            type: 'query',
            key: 'p',
          },
        ],
      },
      {
        destination: '/search/?query=:s',
        permanent: false,
        source: '/',
        has: [
          {
            type: 'query',
            key: 's',
          },
        ],
      },
      {
        destination: 'https://www.cms.vietnamcoracle.com/wp-content/:path*',
        permanent: true,
        source: '/wp-content/:path*',
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
        destination: '/browse/',
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
