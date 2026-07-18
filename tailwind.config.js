/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Manrope"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
        ar: ['"IBM Plex Sans Arabic"', '"Cairo"', '"Alexandria"', 'system-ui', 'sans-serif'],
        bubblegum: ['"Bubblegum Sans"', 'cursive'],
      },
      colors: {
        bg: '#020202',
        bg2: '#0a0a0a',
        accent: '#E0FF00',
        glow: '#D4FF00',
        hover: '#F8FF66',
        muted: '#9F9FAA',
        border: 'rgba(255,255,255,.06)',
        card: 'rgba(255,255,255,.035)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.5rem',
      },
      boxShadow: {
        glow: '0 0 32px rgba(224,255,0,0.45)',
        'glow-lg': '0 0 72px rgba(224,255,0,0.6)',
        glass: '0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)',
        float: '0 28px 72px -16px rgba(0,0,0,0.8)',
        neon: '0 0 0 1px rgba(224,255,0,0.2), 0 16px 48px -12px rgba(224,255,0,0.3)',
      },
      backdropBlur: { xs: '3px', sm: '8px', md: '14px', lg: '20px', xl: '30px' },
      transitionTimingFunction: {
        premium: 'cubic-bezier(.22,1,.36,1)',
        spring: 'cubic-bezier(.5,1.7,.4,1)',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-mid': 'float 5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'orbit': 'orbit 24s linear infinite',
        'fade-in': 'fadeIn .6s cubic-bezier(.22,1,.36,1) both',
        'rise': 'rise .8s cubic-bezier(.22,1,.36,1) both',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0) translateX(0)' }, '50%': { transform: 'translateY(-12px) translateX(4px)' } },
        pulseGlow: { '0%,100%': { boxShadow: '0 0 24px rgba(214,255,0,0.35)' }, '50%': { boxShadow: '0 0 50px rgba(214,255,0,0.65)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        orbit: { '0%': { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' }, '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' } },
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        rise: { '0%': { opacity: 0, y: 18 }, '100%': { opacity: 1, y: 0 } },
      },
    },
  },
  plugins: [],
}