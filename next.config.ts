import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Next.js "N" dev menu (Route / Turbopack) — dev-only, not your app UI.
  // Hidden by default; set SHOW_NEXT_DEV_INDICATOR=true in .env.local on admin machines.
  devIndicators:
    process.env.SHOW_NEXT_DEV_INDICATOR === 'true'
      ? { position: 'bottom-left' }
      : false,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
      },
    ],
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://*.clerk.accounts.dev https://clerk.io https://embed.tawk.to https://*.tawk.to",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.tawk.to",
              "font-src 'self' https://fonts.gstatic.com https://*.tawk.to",
              "img-src 'self' data: https://img.clerk.com https://media.licdn.com https://*.supabase.co https://*.amazonaws.com https://*.tawk.to blob:",
              "connect-src 'self' https://*.supabase.co https://*.clerk.accounts.dev https://clerk-telemetry.com https://*.tawk.to https://va.tawk.to wss://*.clerk.accounts.dev wss://*.tawk.to",
              "frame-src https://*.clerk.accounts.dev https://*.tawk.to",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
