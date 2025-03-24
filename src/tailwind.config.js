/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ae5630', // Terracotta - based on #ae5630 from the image
          hover: '#9d4e2b',
          active: '#8b4526',
        },
        secondary: {
          DEFAULT: '#232321', // Nearly black - based on #232321 from the image
          hover: '#1e1e1c',
          active: '#191917',
        },
        neutral: {
          white: '#faf9f5', // Soft cream - based on #faf9f5 from the image
          light: '#EDEAE2', // Light beige - based on #edeae2 from the image
          medium: '#3d3d3a', // Dark olive - based on #3d3d3a from the image
          dark: '#30302e', // Charcoal - based on #30302e from the image
        },
        terracotta: {
          light: '#9d4e2c', // Lighter terracotta - based on #9d4e2c from the image
          DEFAULT: '#ae5630', // Terracotta
          dark: '#8b4526', // Darker terracotta
        },
        earth: {
          light: '#edeae2', // Light earth tone - based on #edeae2 from the image
          DEFAULT: '#9d4e2c', // Earth tone - based on #9d4e2c from the image
          dark: '#3d3d3a', // Dark earth tone - based on #3d3d3a from the image
        },
        clay: {
          DEFAULT: '#ae5630', // Clay - based on #ae5630 from the image
          dark: '#9d4e2c', // Dark clay
        },
        stone: {
          light: '#edeae2', // Light stone - based on #edeae2 from the image
          DEFAULT: '#30302e', // Stone - based on #30302e from the image
          dark: '#232321', // Dark stone - based on #232321 from the image
        },
        success: '#1a1918', // Dark success - based on #1a1918 from the image
        error: '#ae5630', // Error - using terracotta color
        warning: '#9d4e2c', // Warning - using darker terracotta
      },
      fontFamily: {
        heading: ['Comfortaa', 'cursive'],
        body: ['Questrial', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
        accent: ['Nunito Sans', 'sans-serif'],
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
          '0%': { opacity: '1' },
          '100%': { opacity: '0.7' },
        },
      },
      backdropBlur: {
        'xl': '30px',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}