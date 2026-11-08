/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#F9F5EC',
          200: '#F0E9DA',
        },
        primary: {
          DEFAULT: '#FF5E36',
          50: '#FFF2EE',
          100: '#FFE2DB',
          200: '#FFC4B6',
          300: '#FFA18C',
          400: '#FF7B5E',
          500: '#FF5E36',
          600: '#ED451B',
          700: '#C7320D',
          800: '#A42B0E',
          900: '#842913',
        },
        surface: {
          light: '#FFFFFF',
          card: '#FFFFFF',
          muted: '#F8F9FA'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 10px 30px -4px rgba(0, 0, 0, 0.08)',
        'glow': '0 8px 24px -4px rgba(255, 94, 54, 0.25)',
      }
    },
  },
  plugins: [],
}

