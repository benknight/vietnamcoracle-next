const _flatten = require('lodash/flatten');
// const { colors } = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'media',
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  plugins: [],
  purge: {
    content: ['./src/**/*.js'],
    options: {},
  },
  theme: {
    extend: {
      colors: {
        'black-25': 'rgba(0, 0, 0, 0.25)',
        'black-75': 'rgba(0, 0, 0, 0.75)',
        gray: {
          ...colors.gray,
          950: 'hsl(0deg 0% 5%)',
        },
        'lp-blue': '#297CBB',
      },
      fontFamily: {
        display: ['Baskervville', 'sans-serif'],
        // serif: ['Times New Romain', 'Times', 'serif'],
      },
      fontSize: {
        xxxs: '10px',
        xxs: '0.6875rem',
      },
      screens: {
        lg: '1025px',
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
