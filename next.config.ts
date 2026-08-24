import type { NextConfig } from 'next'

// ── Server Action origin allowlist ────────────────────────────
// This is the CSRF boundary for every admin mutation in the app
// (createProduct, updateProduct, deleteFAQ, …). A wildcard entry
// here means any host matching it can invoke those actions, so
// this list must stay exact — never `*.anything`.
function getServerActionOrigins(): string[] {
  const origins = new Set<string>()

  // Canonical production host, from the same variable the rest of
  // the app uses for canonical URLs (app/layout.tsx, robots.ts).
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (siteUrl) {
    try {
      origins.add(new URL(siteUrl).host)
    } catch {
      throw new Error(
        `NEXT_PUBLIC_SITE_URL is not a valid URL: ${siteUrl}`
      )
    }
  }

  // Explicit fallback so deploys keep working before the env var is set.
  origins.add('druporia.vercel.app')

  // This deployment's own Vercel host, so preview builds work too.
  if (process.env.VERCEL_URL) origins.add(process.env.VERCEL_URL)

  // Local dev ports — never present in a production build.
  if (process.env.NODE_ENV !== 'production') {
    origins.add('localhost:3000')
    origins.add('localhost:3002')
    origins.add('localhost:3003')
  }

  return [...origins]
}

const nextConfig: NextConfig = {
  // Next.js "N" dev menu (Route / Turbopack) — dev-only, not your app UI.
  // Hidden by default; set SHOW_NEXT_DEV_INDICATOR=true in .env.local on admin machines.
  devIndicators:
    process.env.SHOW_NEXT_DEV_INDICATOR === 'true'
      ? { position: 'bottom-left' }
      : false,
  experimental: {
    serverActions: {
      allowedOrigins: getServerActionOrigins(),
      // Headroom over the 100 MB cap enforced in add-product/actions.ts.
      // Only reachable by an authenticated ADMIN via the allowlist above.
      bodySizeLimit: '110mb',
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
              // 'unsafe-eval' removed — nothing here needs it.
              // cdn.tailwindcss.com and cdn.jsdelivr.net removed —
              // nothing in this app loads from either. Dropping
              // jsdelivr is also what blocks Tawk's optional
              // emojione script (see components/chat/TawkWidget).
              //
              // 'unsafe-inline' still required by Clerk's bootstrap
              // and the Tawk loader. Removing it means generating a
              // per-request nonce in middleware.ts and threading it
              // through with 'strict-dynamic' — worth doing, but a
              // change big enough to verify on its own.
              "script-src 'self' 'unsafe-inline' https://*.clerk.accounts.dev https://clerk.io https://embed.tawk.to https://*.tawk.to",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.tawk.to",
              "font-src 'self' https://fonts.gstatic.com https://*.tawk.to",
              "img-src 'self' data: blob: https://img.clerk.com https://media.licdn.com https://*.supabase.co https://*.amazonaws.com https://*.tawk.to",
              // Redundant va.tawk.to entry dropped; it already matches
              // the *.tawk.to wildcard, so Tawk's performance beacon
              // is still permitted. That is deliberate — it is harmless
              // telemetry, and enumerating Tawk's subdomains to block
              // one of them would break the widget on their next change.
              "connect-src 'self' https://*.supabase.co https://*.clerk.accounts.dev https://clerk-telemetry.com https://*.tawk.to wss://*.clerk.accounts.dev wss://*.tawk.to",
              "frame-src https://*.clerk.accounts.dev https://*.tawk.to",
              "worker-src 'self' blob:",
              // Previously missing entirely:
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self' https://*.clerk.accounts.dev",
              "object-src 'none'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
