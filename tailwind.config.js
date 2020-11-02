const _flatten = require('lodash/flatten');
// const { colors } = require('tailwindcss/defaultTheme');
const { default: gray } = require('@material-ui/core/colors/grey');
const { themes } = require('./src/config/themes');

module.exports = {
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  plugins: [],
  purge: {
    content: ['./src/**/*.js'],
    options: {
      whitelist: _flatten(
        Object.values(themes).map(theme => [
          `bg-${theme}-200`,
          `from-${theme}-200`,
          `to-${theme}-200`,
          `dark:bg-${theme}-900`,
          `dark:from-${theme}-800`,
          `dark:to-${theme}-900`,
        ]),
      ),
    },
  },
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
        // => @media (prefers-color-scheme: dark) { ... }
        dark: { raw: '(prefers-color-scheme: dark)' },
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
