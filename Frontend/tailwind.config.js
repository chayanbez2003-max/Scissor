/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // support class-based dark mode
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0B0F19',
          card: 'rgba(17, 24, 39, 0.7)',
          darker: '#06080F',
        },
        border: {
          glass: 'rgba(255, 255, 255, 0.08)',
          glassHover: 'rgba(255, 255, 255, 0.15)',
        },
        primary: {
          purple: '#8B5CF6',
          blue: '#3B82F6',
          pink: '#EC4899',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
