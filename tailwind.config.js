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
        // serif: ['Times New Romain', 'Times', 'serif'],
      },
      fontSize: {
        xxs: '0.625rem',
      },
      screens: {
        dark: { raw: '(prefers-color-scheme: dark)' }, // => @media (prefers-color-scheme: dark) { ... }
      },
      width: {
        '1/7': '14.2857143%',
        '2/7': '28.5714286%',
        '3/7': '42.8571429%',
        '4/7': '57.1428571%',
        '5/7': '71.4285714%',
        '6/7': '85.7142857%',
      },
    },
  },
  variants: {
    width: ['responsive', 'focus'],
  },
};
