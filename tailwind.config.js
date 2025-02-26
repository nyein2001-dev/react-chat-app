/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#2563eb',
          dark: '#3b82f6',
        },
        background: {
          light: '#f3f4f6',
          dark: '#111827',
        },
        surface: {
          light: '#ffffff',
          dark: '#1f2937',
        },
        text: {
          light: {
            primary: '#111827',
            secondary: '#4b5563',
          },
          dark: {
            primary: '#f9fafb',
            secondary: '#e5e7eb',
          },
        },
      },
    },
  },
  plugins: [],
}