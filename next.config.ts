import type { NextConfig } from 'next';
import WPRestClient from './src/lib/WPRestClient';

const nextConfig: NextConfig = {
  trailingSlash: true,
  // experimental: {
  //   staticGenerationRetryCount: 1,
  //   staticGenerationMaxConcurrency: 8,
  //   staticGenerationMinPagesPerWorker: 25,
  // },
  async headers() {
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
  async redirects() {
    const restClient = new WPRestClient('admin');
    const { data } = await restClient.get('/redirection/v1/export/all/json');
    const { redirects: cmsRedirects } = JSON.parse(data);

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
        destination: '/about/',
        permanent: true,
        source: '/author/tomdivers/',
      },
      {
        destination: '/browse/:path*/',
        permanent: true,
        source: '/category/features-guides/:path*',
      },
      {
        destination: '/browse/:path*/',
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
