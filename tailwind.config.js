const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'media',
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
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
        display: ['Baskervville', 'sans-serif'],
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
      width: ['focus'],
    },
  },
};
