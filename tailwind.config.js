/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 0.21s ease-out',
        fadeOut: 'fadeOut 0.3s ease-in',
        slideInUp: 'slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both',
        slideInDown: 'slideInDown 0.6s cubic-bezier(0.4, 0, 0.2, 1) both',
        slideInLeft: 'slideInLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1) both',
        slideInRight: 'slideInRight 0.6s cubic-bezier(0.4, 0, 0.2, 1) both',
        cardSlideIn: 'cardSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) both',
        shake: 'shake 0.5s ease-in-out',
        staggerChildren: 'staggerChildren 0.8s ease-out both',
      },
      keyframes: {
        fadeIn: {
          '0%': {
            opacity: 0,
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: 1,
            transform: 'scale(1)',
          },
        },
        fadeOut: {
          '0%': { opacity: 1, transform: 'scale(1)' },
          '100%': { opacity: 0, transform: 'scale(0.95)' },
        },
        slideInUp: {
          '0%': { opacity: 0, transform: 'translateY(40px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideInDown: {
          '0%': { opacity: 0, transform: 'translateY(-40px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: 0, transform: 'translateX(-50px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: 0, transform: 'translateX(50px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        cardSlideIn: {
          '0%': { 
            opacity: 0, 
            transform: 'translateY(60px) scale(0.95)' 
          },
          '100%': { 
            opacity: 1, 
            transform: 'translateY(0) scale(1)' 
          },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
        staggerChildren: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      boxShadow: {
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
};
