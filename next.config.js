module.exports = {
  images: {
    domains: ['www.vietnamcoracle.com', 'res.cloudinary.com'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};
