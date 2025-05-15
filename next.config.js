const axios = require('axios');

const nextConfig = {
  headers() {
    return [
      {
        source: '/search/',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex',
          },
        ],
      },
      {
        source: '/post/',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex',
          },
        ],
      },
    ];
  },
  images: {
    domains: [
      'cms.vietnamcoracle.com',
      'res.cloudinary.com',
      'via.placeholder.com',
    ],
  },
  trailingSlash: true,
  async redirects() {
    const api = axios.create({
      auth: {
        username: process.env.WORDPRESS_API_USERNAME_ADMIN,
        password: process.env.WORDPRESS_API_PASSWORD_ADMIN,
      },
      baseURL: 'https://cms.vietnamcoracle.com/wp-json/redirection/v1',
    });
    const response = await api.get('/export/all/json');
    const cmsRedirects = JSON.parse(response.data.data)?.redirects;
    const redirects = [
      ...cmsRedirects.map(config => ({
        destination: config.action_data.url.replace(
          /https?\:\/\/(www\.)?(cms\.)?vietnamcoracle\.com/g,
          '',
        ),
        permanent: true,
        source: config.match_url.replace(':', '\\:'),
      })),
      {
        destination: 'https://cms.vietnamcoracle.com/feed/',
        permanent: true,
        source: '/feed/',
      },
      {
        destination: '/',
        permanent: true,
        source: '/browse/',
      },
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
        destination: 'https://cms.vietnamcoracle.com/wp-content/:path*',
        permanent: true,
        source: '/wp-content/:path*',
      },
      {
        destination: '/',
        permanent: true,
        source: '/search/',
        missing: [
          {
            type: 'query',
            key: 'query',
          },
        ],
      },
    ];
    return redirects;
  },
  async rewrites() {
    return [
      {
        destination: '/browse/features-guides/',
        source: '/',
      },
      {
        destination: '/browse/features-guides/',
        source: '//',
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    });
    return config;
  },
};

module.exports = nextConfig;
