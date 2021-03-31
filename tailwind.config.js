const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');
const breakpoints = require('./src/config/breakpoints');

module.exports = {
  darkMode: 'media',
  plugins: [require('@tailwindcss/aspect-ratio')],
  purge: {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    layers: ['utilities'],
    options: {},
  },
  theme: {
    extend: {
      colors: {
        amber: colors.amber,
        'black-25': 'rgba(0, 0, 0, 0.25)',
        'black-75': 'rgba(0, 0, 0, 0.75)',
        gray: {
          ...colors.gray,
          950: 'hsl(0deg 0% 5%)',
        },
        'lp-blue': '#297CBB',
        'near-black': 'hsl(0deg 0% 2%)',
      },
      fontFamily: {
        display: ['Libre Baskerville', ...defaultTheme.fontFamily.serif],
      },
      fontSize: {
        xxxxs: '9px',
        xxxs: '10px',
        xxs: '11px',
      },
      width: {
        '3/7': '42.8571429%',
        '3/8': '37.5%',
      },
    },
    screens: {
      ...breakpoints,
      pointer: { raw: '(pointer: fine)' },
    },
  },
  variants: {
    extend: {
      backgroundOpacity: [
        'responsive',
        'dark',
        'group-hover',
        'focus-within',
        'hover',
        'focus',
      ],
      fontSmoothing: ['dark'],
      margin: ['dark', 'responsive'],
      padding: ['dark', 'responsive'],
      width: ['focus'],
    },
  },
};
