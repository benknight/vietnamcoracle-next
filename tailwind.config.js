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
      },
      fontFamily: {
        display: ['Baskervville', 'sans-serif'],
      },
      fontSize: {
        xxxs: '10px',
        xxs: '0.6875rem',
      },
      screens: {
        md: [
          // Sidebar appears at 768px, so revert to `sm:` styles between 768px
          // and 868px, after which the main content area is wide enough again to
          // apply the `md:` styles.
          { min: '768px', max: '1023px' },
          { min: '1280px' },
        ],
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
