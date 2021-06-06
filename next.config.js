const { redirects } = require('./redirection-plugin-export.json');

module.exports = {
  future: {
    // NOTE(2021-05-12): Disabling due to build issues
    // webpack5: true,
  },
  images: {
    domains: ['www.vietnamcoracle.com', 'res.cloudinary.com'],
  },
  async redirects() {
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
      ...redirects.map(config => ({
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
