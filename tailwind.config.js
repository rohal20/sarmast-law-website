/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light:   '#E8C97A',
          dark:    '#A07C30',
          muted:   'rgba(201,168,76,0.18)',
        },
        ink: {
          DEFAULT: '#0A0A08',
          2: '#111110',
          3: '#0D0C0A',
          4: '#0E0D0B',
        },
        parchment: {
          DEFAULT: '#F5F0E8',
          2: '#EDE6D6',
        },
        muted: '#8A8270',
        jade: {
          DEFAULT: '#2CB9A8',
          dark: '#0E6F66',
          muted: 'rgba(44,185,168,0.18)',
        },
      },
      borderColor: {
        gold: 'rgba(201,168,76,0.22)',
        'gold-hover': 'rgba(201,168,76,0.5)',
      },
      animation: {
        ticker:    'ticker 25s linear infinite',
        'bulletin-scroll': 'bulletinScroll var(--bulletin-duration, 50s) linear infinite',
        'bulletin-horizontal': 'bulletinHorizontal var(--bulletin-duration, 40s) linear infinite',
        'fade-up': 'fadeUp 0.8s ease both',
        'scale-in':'scaleIn 1.2s ease both',
        'pulse-slow':'pulse 4s ease-in-out infinite',
      },
      keyframes: {
        ticker:  { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        bulletinScroll: { '0%': { transform: 'translateY(0)' }, '100%': { transform: 'translateY(-50%)' } },
        bulletinHorizontal: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        fadeUp:  { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.82)' }, to: { opacity: '1', transform: 'scale(1)' } },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
        'radial-gold':   'radial-gradient(ellipse at center, rgba(201,168,76,0.07) 0%, transparent 70%)',
        'radial-jade':   'radial-gradient(ellipse at center, rgba(44,185,168,0.08) 0%, transparent 70%)',
        'grid-gold':     "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: '44px 44px',
      },
    },
  },
  plugins: [],
}
