module.exports = {
  images: {
    domains: [
      'www.vietnamcoracle.com',
      'www.staging23.vietnamcoracle.com',
      'res.cloudinary.com',
    ],
    // How to Source from Cloudinary instead:
    // loader: 'cloudinary',
    // path: 'https://res.cloudinary.com/dfmev5psi/',
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};
