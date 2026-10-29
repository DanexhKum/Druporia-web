import type { Config } from 'tailwindcss'
import { colors, gradients, shadows } from './lib/design-tokens'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Design breakpoints: 1 column ≤640px, 2 columns ≤1024px.
      screens: {
        tab: '641px',
        desk: '1025px',
      },
      fontFamily: {
        sans: ['var(--font-geist)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors,
      backgroundImage: {
        brand: gradients.brand,
        'brand-text': gradients.brandText,
      },
      boxShadow: {
        hero: shadows.hero,
        cta: shadows.cta,
        pop: shadows.pop,
        card: '0 1px 2px 0 rgba(15, 20, 32, 0.04)',
        'card-hover': shadows.pop,
        dropdown: shadows.pop,
      },
      borderRadius: {
        DEFAULT: '10px',
        tile: '10px',
        faq: '20px',
        card: '22px',
        'card-lg': '24px',
        section: '36px',
      },
      fontSize: {
        h1: ['clamp(2.75rem, 1.4rem + 4.6vw, 4.875rem)', { lineHeight: '1.02', letterSpacing: '-0.045em' }],
        h2: ['clamp(2.125rem, 1.35rem + 2.7vw, 3.375rem)', { lineHeight: '1.05', letterSpacing: '-0.04em' }],
        'h2-sm': ['clamp(2rem, 1.4rem + 2vw, 3rem)', { lineHeight: '1.05', letterSpacing: '-0.04em' }],
        'h2-lg': ['clamp(2.25rem, 1.3rem + 3.2vw, 3.625rem)', { lineHeight: '1.02', letterSpacing: '-0.045em' }],
        h3: ['1.4375rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
        'h3-sm': ['1.25rem', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        lead: ['clamp(1.0625rem, 0.95rem + 0.35vw, 1.1875rem)', { lineHeight: '1.6' }],
      },
      spacing: {
        section: '112px',
        gutter: '72px',
      },
      maxWidth: {
        page: '1280px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: colors.body,
            maxWidth: 'none',
            fontSize: '1.0625rem',
            lineHeight: '1.7',
            h1: { color: colors.ink.DEFAULT, fontWeight: '600', letterSpacing: '-0.04em' },
            h2: { color: colors.ink.DEFAULT, fontWeight: '600', letterSpacing: '-0.03em' },
            h3: { color: colors.ink.DEFAULT, fontWeight: '600', letterSpacing: '-0.02em' },
            strong: { color: colors.ink.DEFAULT },
            a: {
              color: colors.orange.text,
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': { color: colors.orange.deep },
            },
            'ul > li::marker': { color: colors.orange.DEFAULT },
            code: {
              backgroundColor: colors.surface.DEFAULT,
              borderRadius: '6px',
              padding: '2px 6px',
              fontWeight: '500',
            },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
