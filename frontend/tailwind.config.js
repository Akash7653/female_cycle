/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF1F6',
          100: '#FFE4EE',
          200: '#FFC9DD',
          300: '#FF9DBE',
          400: '#FF6B9A',
          500: '#F94B83',
          600: '#E0296A',
          700: '#B91E55',
          800: '#931843',
          900: '#6B1230',
        },
        secondary: {
          50: '#F6F2FC',
          100: '#EDE5F8',
          200: '#DCCBF2',
          300: '#C9A7EB',
          400: '#B384DE',
          500: '#9B62D0',
          600: '#8249BC',
          700: '#693A99',
          800: '#4F2B72',
          900: '#3A1F54',
        },
        accent: {
          50: '#F0FAFE',
          100: '#D9F2FD',
          200: '#B6E7FB',
          300: '#87CEEB',
          400: '#5BB6DA',
          500: '#3E9BC0',
          600: '#2F7BA0',
          700: '#24607D',
          800: '#1A485C',
          900: '#123240',
        },
        success: {
          400: '#A5D6A7',
          500: '#81C784',
          600: '#66BB6A',
        },
        warning: {
          400: '#FFE082',
          500: '#FFD54F',
          600: '#FFCA28',
        },
        error: {
          400: '#EF9A9A',
          500: '#EF5350',
          600: '#E53935',
        },
        ink: {
          50: '#FFF8FC',
          100: '#FCEAF1',
          200: '#F7D5E3',
          900: '#111827',
          800: '#1F2937',
          700: '#374151',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(255, 107, 154, 0.25)',
        glass: '0 8px 32px rgba(31, 38, 135, 0.12)',
        glow: '0 0 40px rgba(255, 107, 154, 0.35)',
      },
      backgroundImage: {
        'hero-glow':
          'radial-gradient(60% 60% at 50% 20%, rgba(255,107,154,0.25) 0%, rgba(201,167,235,0.12) 40%, rgba(135,206,235,0.0) 70%)',
        'mesh':
          'radial-gradient(at 20% 20%, rgba(255,107,154,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(201,167,235,0.15) 0px, transparent 50%), radial-gradient(at 0% 80%, rgba(135,206,235,0.12) 0px, transparent 50%)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};
