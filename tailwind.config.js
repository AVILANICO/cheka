/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cheka: {
          cream: '#FAF7F2',
          gold: '#C4A77D',
          brown: '#5C4033',
          dark: '#2C1810',
          accent: '#8B6914',
          warm: '#F5EDE4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
