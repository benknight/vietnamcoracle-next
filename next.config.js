module.exports = {
  images: {
    domains: ['www.vietnamcoracle.com', 'res.cloudinary.com'],
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/browse',
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
