import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export const darkMode = ['class'];
export const content = ['./index.html', './src/**/*.{js,ts,jsx,tsx}'];
export const theme = {
  container: {
    center: true,
    padding: '2rem',
    screens: {
      '2xl': '1400px',
    },
  },
  extend: {
    colors: {
      brown: {
        800: '#6B4B5B',
        700: '#926259',
        600: '#A97959',
        500: '#B98667',
        400: '#C4996C',
        300: '#DDB985',
        200: '#E8D0A6',
        100: '#F2E5C1',
      },
      gray: {
        800: '#363738',
      },
    },
    borderRadius: {
      lg: `var(--radius)`,
      md: `calc(var(--radius) - 2px)`,
      sm: 'calc(var(--radius) - 4px)',
    },
    // fontFamily: {
    //   sans: ['var(--font-sans)', ...fontFamily.sans],
    //   mono: ['VT323', ...fontFamily.mono],
    // },
    keyframes: {
      'accordion-down': {
        from: { height: 0 },
        to: { height: 'var(--radix-accordion-content-height)' },
      },
      'accordion-up': {
        from: { height: 'var(--radix-accordion-content-height)' },
        to: { height: 0 },
      },
    },
    animation: {
      'accordion-down': 'accordion-down 0.2s ease-out',
      'accordion-up': 'accordion-up 0.2s ease-out',
    },
  },
  fontFamily: {
    sans: ['VT323', ...fontFamily.mono],
  },
};
export const plugins = [require('tailwindcss-animate')];
