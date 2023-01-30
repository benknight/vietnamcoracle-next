const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');
const breakpoints = require('./src/config/breakpoints');

module.exports = {
  plugins: [require('@tailwindcss/line-clamp')],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        heavy: '5px 5px 5px rgb(0 0 0 / 25%)',
      },
      colors: {
        amber: colors.amber,
        current: 'currentColor',
        'black-25': 'rgba(0, 0, 0, 0.25)',
        'black-50': 'rgba(0, 0, 0, 0.5)',
        'black-75': 'rgba(0, 0, 0, 0.75)',
        gray: {
          ...colors.stone,
          950: 'hsl(0deg 0% 5%)',
        },
        'lp-blue': '#297CBB',
        'near-black': 'hsl(0deg 0% 2%)',
        purple: colors.purple,
        primary: colors.indigo,
      },
      fontFamily: {
        lora: ['Lora', ...defaultTheme.fontFamily.serif],
        display: ['Libre Baskerville', ...defaultTheme.fontFamily.serif],
      },
      fontSize: {
        xxxxs: '9px',
        xxxs: '10px',
        xxs: '11px',
      },
      letterSpacing: {
        wide: '.01em',
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
};
