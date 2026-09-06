/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Super BDC Brand Colors
        navy: {
          50: '#f5f7fb',
          100: '#e8ecf5',
          200: '#c9d7e8',
          300: '#a0b8d8',
          400: '#6d8fc7',
          500: '#475a9c',
          600: '#3a4578',
          700: '#2d365e',
          800: '#1f2543',
          900: '#0f1629',
        },
        lavender: {
          50: '#faf8fc',
          100: '#f3eff8',
          200: '#e8dff2',
          300: '#dcc7e8',
          400: '#c8a3d8',
          500: '#a876c8',
          600: '#8f5eb8',
          700: '#6b47a0',
          800: '#483088',
          900: '#2d1a70',
        },
        // Semantic colors
        urgent: '#dc2626',
        success: '#16a34a',
        warning: '#ea580c',
        info: '#0284c7',
      },
      fontFamily: {
        heading: ['Poppins', 'system-ui', 'sans-serif'],
        body: ['Figtree', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
      },
    },
  },
  plugins: [],
};
