module.exports = {
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
