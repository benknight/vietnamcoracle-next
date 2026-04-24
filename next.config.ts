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
      {
        // Regenerated each deploy by scripts/fetch-baolau.mjs. The file is
        // not content-hashed, so invalidation relies on:
        //   1. new deploys regenerating the file (Vercel isolates edge cache
        //      per deployment, so a new deploy ships the new file immediately);
        //   2. stale-while-revalidate at the edge, which lets the CDN serve a
        //      cached copy instantly and refresh in the background.
        // Browser max-age is kept short (1h) so users see updated data within
        // an hour of a deploy without hitting the origin on every page load.
        source: '/baolau_locations.json',
        headers: [
          {
            key: 'Cache-Control',
            value:
              'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cms.vietnamcoracle.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
    ],
    minimumCacheTTL: 2678400,
  },
  async redirects() {
    const restClient = new WPRestClient('admin');

    // Parallelize independent API calls
    const [{ data }, categories] = await Promise.all([
      restClient.get('/redirection/v1/export/all/json'),
      restClient.get('/wp/v2/categories?per_page=100'),
    ]);

    const { redirects: cmsRedirects } = JSON.parse(data);

    // Helper to get slug path for a category
    function getCategoryPath(catId) {
      const cat = categories.find(c => c.id === catId);

      if (!cat) return null;

      let path = cat.slug;
      let parentId = cat.parent;

      while (parentId) {
        const parentCat = categories.find(c => c.id === parentId);
        if (!parentCat) break;
        path = parentCat.slug + '/' + path;
        parentId = parentCat.parent;
      }
      return path;
    }

    // Build redirects for all categories
    const categoryRedirects = categories.map(cat => ({
      destination: `/category/${getCategoryPath(cat.id)}/`,
      permanent: true,
      source: '/',
      has: [
        {
          type: 'query',
          key: 'cat',
          value: String(cat.id),
        },
      ],
    }));

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
      ...categoryRedirects,
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
