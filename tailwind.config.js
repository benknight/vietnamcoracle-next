const { colors } = require('tailwindcss/defaultTheme');
const { default: gray } = require('@material-ui/core/colors/grey');

module.exports = {
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  plugins: [],
  purge: ['./src/**/*.js'],
  theme: {
    extend: {
      colors: {
        'black-25': 'rgba(0, 0, 0, 0.25)',
        'black-75': 'rgba(0, 0, 0, 0.75)',
        gray: {
          ...gray,
        },
      },
      fontFamily: {
        display: ['Baskervville', 'sans-serif'],
        serif: ['Times New Romain', 'Times', 'serif'],
      },
      fontSize: {
        xxs: '0.625rem',
      },
      screens: {
        dark: { raw: '(prefers-color-scheme: dark)' }, // => @media (prefers-color-scheme: dark) { ... }
      },
    },
  },
  variants: {},
};
