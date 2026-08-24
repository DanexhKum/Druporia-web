// ============================================================
// middleware.ts — Clerk Authentication + Route Protection
//
// Route access matrix:
//   /                   → public
//   /marketplace        → public
//   /marketplace/[slug] → public
//   /sign-in, /sign-up  → public (Clerk-managed)
//   /dashboard/*        → requires authentication
//   /admin/*            → requires authentication here; the ADMIN
//                         role check happens in requireAdmin(), which
//                         app/admin/layout.tsx calls before rendering.
//                         No second factor is enforced anywhere.
//   /api/webhooks/*     → public (Clerk & payment webhooks)
//   /api/admin/*        → not matched here; the route handler calls
//                         requireAdmin() itself
//   /api/download/*     → requires authentication
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

// Admin pages. Signed-in check only here; the authoritative ADMIN
// role check is requireAdmin() in lib/auth.ts.
// /api/admin/* is intentionally absent — that handler calls
// requireAdmin() itself, so adding it here would be redundant.
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

// Routes requiring a signed-in user.
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/download(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

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
  // This is a signed-in check only. The authoritative ADMIN role check
  // is requireAdmin(), called by app/admin/layout.tsx and by every
  // admin Server Action — it reads the role from the database rather
  // than from session metadata, so it cannot go stale.
  //
  // An edge-level role check would need the role mirrored into Clerk
  // session claims and kept in sync on every change; the previous
  // attempt at that is deliberately not restored.
  if (isAdminRoute(req) && !userId) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
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
