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
          990: '#05070D',
          950: '#0B0F19', // deep slate — page ground
          900: '#0F1421',
          850: '#141A2A',
          800: '#1A2133',
          700: '#232B40',
          600: '#2E374F',
          500: '#3D4763',
        },
        // ── Teal accent (the glow) ──────────────────────────
        // Electric cyan — the primary accent
        cyan: {
          200: '#B3FBFF',
          300: '#66F6FF',
          400: '#00F0FF', // brand accent
          500: '#00C4D4',
          600: '#0098A8',
          700: '#00707D',
          800: '#064E58',
          900: '#083942',
        },
        // Alias kept so existing teal-* utilities keep resolving
        teal: {
          200: '#B3FBFF',
          300: '#66F6FF',
          400: '#00F0FF',
          500: '#00C4D4',
          600: '#0098A8',
          700: '#00707D',
          800: '#064E58',
          900: '#083942',
        },
        // Deeper blue used in the ambient bloom and card gradients
        // Indigo — secondary accent, used in gradients opposite cyan
        indigo: {
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1', // brand accent
          600: '#4F46E5',
          700: '#4338CA',
          900: '#312E81',
        },
        electric: {
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          900: '#312E81',
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
        navy: '0 10px 30px -12px rgba(30,58,95,0.45)',
        gold: '0 10px 30px -12px rgba(201,165,90,0.45)',
        teal: '0 10px 40px -12px rgba(0,240,255,0.30)',
        cyan: '0 10px 40px -12px rgba(0,240,255,0.35)',
        'glow-lg': '0 0 60px -12px rgba(0,240,255,0.40)',
        pill: '0 1px 0 0 rgba(255,255,255,0.08) inset, 0 8px 24px -12px rgba(0,0,0,0.6)',
        // Under-glow beneath the primary CTA, as in the reference
        cta: '0 10px 30px -10px rgba(0,240,255,0.40), 0 0 0 1px rgba(255,255,255,0.10) inset',
        'card-dark': '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 24px 60px -32px rgba(0,0,0,0.9)',
        'glow-sm': '0 0 24px -6px rgba(0,240,255,0.35)',
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
