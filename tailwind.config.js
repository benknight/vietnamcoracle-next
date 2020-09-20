module.exports = {
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  plugins: [],
  purge: ['./src/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Baskervville', 'sans-serif'],
        serif: ['Times New Romain', 'Times', 'serif'],
      },
      fontSize: {
        xxs: '0.625rem',
      },
    },
  },
  variants: {},
};
