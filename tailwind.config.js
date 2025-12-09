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
          600: '#be6c31',
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
          100: '#F9F4E0',
          200: '#F0E2B6',
          300: '#E6C675',
          400: '#D4AF37', // Metallic Gold
          500: '#C5A028',
          600: '#A6841C',
          700: '#856614',
          800: '#634b0e',
          900: '#423108',
        },
        bronze: {
          100: '#f5ebe0',
          200: '#e3d5c6',
          300: '#d4bfae',
          400: '#c5a996',
          500: '#b08d74',
          600: '#9b765d',
          700: '#826049',
          800: '#6a4d3a',
          900: '#3a1b10',
        }
      },
      fontFamily: {
        sans: ['"Outfit"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      animation: {
        'fade-up': 'fade-up 0.8s ease-out forwards',
        'slow-zoom': 'slow-zoom 20s ease-in-out infinite alternate',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': "url('https://www.transparenttextures.com/patterns/cubes.png')",
      }
    },
  },
  plugins: [],
};
