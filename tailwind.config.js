/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00C897',
          light: '#33D4AC',
          dark: '#00A87E',
        },
        secondary: {
          DEFAULT: '#00A8FF',
          light: '#33BAFF',
          dark: '#0088CC',
        },
        dark: '#111827',
        background: '#F5F7FA',
        // BMI classification colors
        underweight: '#00A8FF',
        normal: '#00C897',
        overweight: '#FFB020',
        obese: '#FF5C5C',
      },
      borderRadius: {
        card: '24px',
        pill: '999px',
      },
      fontFamily: {
        sans: ['Inter_400Regular'],
        medium: ['Inter_500Medium'],
        semibold: ['Inter_600SemiBold'],
        bold: ['Inter_700Bold'],
      },
    },
  },
  plugins: [],
};
