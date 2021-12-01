/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      xs: '475px',
      ...defaultTheme.screens,
    },
    extend: {
      colors,
      rotate: {
        '-4': '-4deg',
      },
      transitionProperty: {
        gap: 'gap',
        width: 'width',
        height: 'height',
        spacing: 'margin, padding',
      },
      gridTemplateColumns: {
        table: 'minmax(80px, max-content) auto',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};