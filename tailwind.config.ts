import type { Config } from 'tailwindcss'

// ============================================================
// Druporia design tokens
//
// DARK SYSTEM (marketing surfaces)
//   ink-950 #050b12   page ground, near-black
//   teal-500 #06b6d4  the accent, carried mostly as a glow
//   Display type is LIGHT (300/400) and large — weight is not
//   how emphasis is made here; scale and the glow are.
//   Mono (JetBrains) carries all UI chrome: nav, buttons, labels.
//
// LIGHT SYSTEM (admin, forms, docs)
//   navy-800 #1e3a5f + gold-500 #c9a55a retained so the admin
//   panel and any light surface keep working unchanged.
//
// CONTRAST NOTES
//   gold-500 on white is ~2:1 — decorative only; use gold-700
//   for gold text on light. teal-400 on ink-950 is ~8:1 and is
//   the safe accent-text pairing on dark.
// ============================================================

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: [
          'Sora',
          'Space Grotesk',
          'Plus Jakarta Sans',
          '-apple-system',
          'sans-serif',
        ],
        sans: [
          'Plus Jakarta Sans',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        // ── Dark grounds ────────────────────────────────────
        ink: {
          990: '#060606',
          950: '#0A0A0A', // page ground
          900: '#121212', // card surface
          850: '#161616',
          800: '#18181B', // zinc-900
          700: '#212124',
          600: '#2A2A2E',
          500: '#3F3F46', // zinc-700
        },
        // ── Teal accent (the glow) ──────────────────────────
        // Neutral ramp. Named cyan/teal only so existing utility
        // classes resolve — every value is achromatic.
        cyan: {
          200: '#FFFFFF',
          300: '#F4F4F5',
          400: '#E4E4E7',
          500: '#A1A1AA',
          600: '#71717A',
          700: '#52525B',
          800: '#3F3F46',
          900: '#27272A',
        },
        teal: {
          200: '#FFFFFF',
          300: '#F4F4F5',
          400: '#E4E4E7',
          500: '#A1A1AA',
          600: '#71717A',
          700: '#52525B',
          800: '#3F3F46',
          900: '#27272A',
        },
        // Deeper blue used in the ambient bloom and card gradients
        indigo: {
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          900: '#27272A',
        },
        electric: {
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          900: '#27272A',
        },
        // ── Brand navy ──────────────────────────────────────
        navy: {
          50: '#f2f6fa',
          100: '#e4ecf4',
          200: '#c6d8e9',
          300: '#9cbad6',
          400: '#6b94bb',
          500: '#4a74a0',
          600: '#365a84',
          700: '#294a6d',
          800: '#1e3a5f', // brand
          900: '#172c47',
          950: '#0d1a2b',
        },
        // ── Brand gold ──────────────────────────────────────
        gold: {
          50: '#fbf8f1',
          100: '#f7f0dd',
          200: '#eedfb7',
          300: '#e3c887',
          400: '#d6b16b',
          500: '#c9a55a', // brand
          600: '#b08c42',
          700: '#8f6f36', // text-safe on light surfaces
          800: '#745a31',
          900: '#604b2c',
        },
        // ── Light blue-grey surfaces ────────────────────────
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e6edf4',
          300: '#d4e0ea',
        },
        // Kept so the admin panel and existing utilities are
        // unaffected by the marketing rebrand.
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(30,58,95,0.07), 0 1px 2px -1px rgba(30,58,95,0.05)',
        'card-hover':
          '0 8px 24px -8px rgba(30,58,95,0.16), 0 2px 6px -2px rgba(30,58,95,0.08)',
        dropdown: '0 4px 16px 0 rgba(30,58,95,0.10)',
        navy: '0 10px 30px -18px rgba(0,0,0,0.9)',
        gold: '0 10px 30px -18px rgba(0,0,0,0.9)',
        teal: '0 10px 40px -18px rgba(0,0,0,0.9)',
        cyan: '0 10px 40px -18px rgba(0,0,0,0.9)',
        'glow-lg': '0 24px 70px -30px rgba(0,0,0,0.95)',
        pill: '0 1px 0 0 rgba(255,255,255,0.08) inset, 0 8px 24px -12px rgba(0,0,0,0.6)',
        // Under-glow beneath the primary CTA, as in the reference
        cta: '0 1px 0 0 rgba(255,255,255,0.10) inset, 0 12px 30px -16px rgba(0,0,0,0.9)',
        'card-dark': '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 24px 60px -32px rgba(0,0,0,0.9)',
        'glow-sm': '0 0 0 1px rgba(255,255,255,0.14) inset',
      },
      borderRadius: {
        DEFAULT: '6px',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        marquee: 'marquee 38s linear infinite',
        'marquee-slow': 'marquee 60s linear infinite',
        aurora: 'aurora 18s ease-in-out infinite',
        float: 'float 7s ease-in-out infinite',
        'float-slow': 'float 11s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 5s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(6%,-4%) scale(1.12)' },
          '66%': { transform: 'translate(-5%,3%) scale(0.94)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-150%) skewX(-18deg)' },
          '100%': { transform: 'translateX(250%) skewX(-18deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        sweep: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(120%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.7' },
        },
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
            color: '#294a6d',
            maxWidth: 'none',
            'h1, h2, h3, h4': { color: '#1e3a5f' },
            a: {
              color: '#1e3a5f',
              textDecoration: 'underline',
              textDecorationColor: '#c9a55a',
              textUnderlineOffset: '3px',
            },
            strong: { color: '#172c47' },
            code: {
              backgroundColor: '#f1f5f9',
              borderRadius: '4px',
              padding: '2px 5px',
              fontWeight: '500',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
