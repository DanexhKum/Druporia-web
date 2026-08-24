import type { Config } from 'tailwindcss'

// ============================================================
// Druporia design tokens
//
// Brand navy  #1e3a5f  → navy-800
// Brand gold  #c9a55a  → gold-500
//
// CONTRAST NOTE: gold-500 on white is ~2:1 — decorative only,
// never body text. For gold text on a light surface use
// gold-700 (#8f6f36, ~4.8:1). On navy-800+, gold-400/500 are
// comfortably readable. The sweep through the marketing pages
// follows that rule.
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
      },
      borderRadius: {
        DEFAULT: '6px',
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
