import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue:       '#1B5DE5',
          'dark-blue':'#0D3A9E',
          navy:       '#0A1F4E',
          gold:       '#F0C646',
          'dark-gold':'#D4A82E',
          'light-gray':'#F4F6FA',
        },
      },
      borderRadius: {
        btn:   '8px',
        card:  '12px',
        input: '6px',
      },
      boxShadow: {
        card: '0 4px 20px rgba(10,31,78,0.08)',
        'card-hover': '0 8px 32px rgba(10,31,78,0.16)',
      },
      fontFamily: {
        heading: ['var(--font-montserrat)', 'sans-serif'],
        body:    ['var(--font-open-sans)',  'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-up':   'fade-up 0.6s ease-out forwards',
        'pulse-slow':'pulse 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 3s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
