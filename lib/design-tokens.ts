// ============================================================
// lib/design-tokens.ts
// Single source of truth for the Druporia visual system.
// tailwind.config.ts reads from here; components use the
// generated Tailwind classes, never raw hex values.
// ============================================================

export const colors = {
  ink: { DEFAULT: '#0b0f17', hover: '#262c38' },
  body: '#4a5260',
  nav: '#3b4250',
  muted: { DEFAULT: '#6b7280', soft: '#8a909b', note: '#5b6472' },
  canvas: '#ffffff',
  surface: { DEFAULT: '#f7f7f5', hover: '#f4f4f2', photo: '#f2f2f0' },
  line: {
    DEFAULT: '#eeeeec',
    card: '#ececea',
    chip: '#e2e2df',
    strong: '#dcdcd8',
    soft: '#f0f0ee',
  },
  navy: { DEFAULT: '#0f1420', card: '#161c2a', fg: '#f3f4f6', body: '#a9b0bd' },
  orange: {
    DEFAULT: '#f26b2a',
    text: '#d4561c',
    deep: '#a8410f',
    tint: '#fff3ea',
  },
  amber: { DEFAULT: '#f8a53b' },
  status: '#2fb36b',
  selection: '#ffd9c2',
  cta: { ink: '#1a0d05', body: '#3a1c0a' },
  danger: { DEFAULT: '#c2410c', tint: '#fff1ec' },
  success: { DEFAULT: '#1f8a52', tint: '#ecf8f1' },
} as const

export const gradients = {
  brand: `linear-gradient(135deg, ${colors.orange.DEFAULT}, ${colors.amber.DEFAULT})`,
  brandText: `linear-gradient(90deg, ${colors.orange.DEFAULT}, ${colors.amber.DEFAULT})`,
} as const

export const shadows = {
  hero: '0 24px 60px rgba(15, 20, 32, 0.1)',
  cta: '0 10px 26px rgba(242, 107, 42, 0.3)',
  pop: '0 16px 40px rgba(15, 20, 32, 0.12)',
} as const
