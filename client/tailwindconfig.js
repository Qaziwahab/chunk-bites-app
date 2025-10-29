/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        heading: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // Gradient from warm orange to coral
        primary: {
          light: '#F28705',
          DEFAULT: '#F27405',
          dark: '#F25C05',
        },
        secondary: {
          DEFAULT: '#04BFBF', // Teal accent
          dark: '#04A6A6',
        },
        coral: {
          DEFAULT: '#F25C05',
        }
      },
      // Keyframes for subtle animations
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px -5px theme(colors.primary.light)' },
          '50%': { boxShadow: '0 0 10px 0px theme(colors.primary.light)' },
        }
      },
      animation: {
        'subtle-glow': 'glow 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
