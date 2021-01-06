const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'media',
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  plugins: [],
  purge: {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
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
    },
  },
  variants: {
    width: ['responsive', 'focus'],
    backgroundOpacity: [
      'responsive',
      'dark',
      'group-hover',
      'focus-within',
      'hover',
      'focus',
    ],
  },
};
