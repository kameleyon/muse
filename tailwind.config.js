/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#fcbf23', // Yellow
          hover: '#e3ab16',
          active: '#d9a315',
        },
        secondary: {
          DEFAULT: '#1b1e27', // Dark Gray
          hover: '#16191f',
          active: '#12151a',
        },
        neutral: {
          white: '#F9F9F9', // Off-White
          light: '#E5E5E5', // Light Grey
          medium: '#9195A1', // Medium Grey
          dark: '#fcbf23', // Deep Grey (Note: This matches the yellow color as specified)
        },
        success: '#00b81e', // Success Green
        error: '#f40000', // Alert Red
        warning: '#ff9856', // Orange
        accent: {
          // Removed teal accent color
        },
      },
      fontFamily: {
        heading: ['Comfortaa', 'cursive'],
        body: ['Questrial', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'dropdown': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'button': '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-light': 'pulseLight 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseLight: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      backdropBlur: {
        'xl': '30px',
      },
    },
  },
  plugins: [],
}