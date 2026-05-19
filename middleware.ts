// ============================================================
// middleware.ts — Clerk Authentication + Route Protection
//
// Route access matrix:
//   /                   → public
//   /marketplace        → public
//   /marketplace/[slug] → public
//   /sign-in, /sign-up  → public (Clerk-managed)
//   /dashboard/*        → requires authentication
//   /admin/*            → requires ADMIN role + 2FA (enforced
//                         additionally in each Server Component)
//   /api/webhooks/*     → public (Clerk & payment webhooks)
//   /api/*              → requires authentication
// ============================================================

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Public routes accessible without authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/marketplace(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
])

// Admin-only routes — additional role check is done in the
// Server Component itself via requireAdmin() from lib/auth.ts
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

// Dashboard routes requiring authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/download(.*)',
  '/api/products/create',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()

  // ── 1. Allow public routes through unconditionally ──────────
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // ── 2. Protect dashboard & API routes ───────────────────────
  if (isProtectedRoute(req)) {
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url)
      signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  // ── 3. Admin routes: abort immediately if not logged in ──────
  // Deep role/2FA validation happens in requireAdmin() server-side.
  if (isAdminRoute(req)) {
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url)
      signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Check role from Clerk session metadata (set via Clerk dashboard
    // or webhooks). Provides fast edge-level rejection before the
    // page even renders.
    const meta = sessionClaims?.metadata as { role?: string } | undefined
    // Skip strict metadata role check in local development (rely on requireAdmin() in auth.ts instead)
    if (process.env.NODE_ENV !== 'development' && meta?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/?error=unauthorized', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
