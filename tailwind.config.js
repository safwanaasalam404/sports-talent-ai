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
        athletic: {
          dark: '#0a0d14',
          card: '#121722',
          cardBorder: '#1e2638',
          cardHover: '#182030',
          volt: '#10b981', // energetic athletic volt green
          voltGlow: '#059669',
          orange: '#f97316', // solar orange
          amber: '#f59e0b',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          slate: '#94a3b8',
          muted: '#64748b'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Cabinet Grotesk', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        },
        radarScan: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'radar-scan': 'radarScan 4s linear infinite'
      }
    },
  },
  plugins: [],
}
