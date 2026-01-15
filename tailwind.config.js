/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#FDF8F6',
        elevated: '#FFFFFF',
        pink: {
          50: '#FFF0F3',
          100: '#FFE4EC',
          200: '#FFCCD9',
          300: '#FFB3C6',
          400: '#F472B6',
          500: '#EC4899',
          600: '#DB2777',
          700: '#BE185D',
        },
        text: {
          primary: '#1F1F23',
          secondary: '#6B6B76',
          muted: '#9CA3AF',
        },
        success: '#34D399',
        warning: '#FBBF24',
        error: '#F87171',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'sans-serif',
        ],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '20px',
      },
      boxShadow: {
        sm: '0 2px 8px rgba(0,0,0,0.04)',
        md: '0 4px 16px rgba(0,0,0,0.06)',
        lg: '0 8px 32px rgba(236,72,153,0.08)',
        sheet: '0 -4px 24px rgba(0,0,0,0.1)',
        glow: '0 4px 12px rgba(236,72,153,0.3)',
      },
      animation: {
        'ring-pulse': 'ringPulse 0.4s ease-out',
        'drop-fall': 'dropFall 0.6s ease-in forwards',
        ripple: 'ripple 0.4s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
        'slide-down': 'slideDown 0.2s ease-in',
        celebrate: 'celebrate 0.5s ease-in-out',
        'confetti-fall': 'confettiFall 1.2s ease-out forwards',
        'bar-rise': 'barRise 0.5s ease-out forwards',
        'page-in': 'pageIn 0.25s ease-out',
        'gentle-pulse': 'gentlePulse 2s ease-in-out infinite',
        'slide-in-down': 'slideInDown 0.4s ease-out',
      },
      keyframes: {
        ringPulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
        dropFall: {
          '0%': { transform: 'translateY(-40px) scale(1)', opacity: '1' },
          '60%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '80%': { transform: 'translateY(0) scale(1.3, 0.7)', opacity: '0.8' },
          '100%': { transform: 'translateY(0) scale(0)', opacity: '0' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
        celebrate: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-2deg)' },
          '75%': { transform: 'rotate(2deg)' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100px) rotate(720deg)', opacity: '0' },
        },
        barRise: {
          '0%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        },
        pageIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gentlePulse: {
          '0%, 100%': { boxShadow: '0 4px 12px rgba(251, 191, 36, 0.2)' },
          '50%': { boxShadow: '0 4px 20px rgba(251, 191, 36, 0.4)' },
        },
        slideInDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
