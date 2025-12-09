/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        amber: {
          50: '#fbf8f2',
          100: '#f6efe1',
          200: '#eddcc1',
          300: '#e2c195',
          400: '#d5a165',
          500: '#cb8640',
          600: '#be6c31', // Base Primary
          700: '#9e5228',
          800: '#814126',
          900: '#683623',
          950: '#3a1b10',
        },
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
        gold: {
          100: '#F9F1D8',
          200: '#F0DEAA',
          300: '#E6C675',
          400: '#D4AF37', // Classic Gold
          500: '#C5A028',
          600: '#A6841C',
          700: '#856614',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
};
