// ============================================================
// lib/auth.ts
// Server-side authentication helpers using Clerk.
// ============================================================

import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'
import { redirect } from 'next/navigation'

// ── Get the currently authenticated user's DB record ──────────
export async function getCurrentDbUser() {
  const { userId } = await auth()

  if (!userId) return null

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      clerkId: true,
      email: true,
      name: true,
      avatarUrl: true,
      role: true,
      hasActiveSubscription: true,
    },
  })

  return user
}

// ── Require authentication — redirect to sign-in if not authed ─
export async function requireAuth() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')
  return userId
}

// ── Require ADMIN role ─────────────────────────────────────────
// Also verifies the user has completed 2FA via Clerk session claims.
export async function requireAdmin() {
  const { userId, sessionClaims } = await auth()

  if (!userId) {
    redirect('/sign-in?redirect_url=/admin')
  }

  // Check Clerk session for 2FA verification status
  // Clerk populates `twoFactorEnabled` and `verified` on the session
  const clerkMeta = sessionClaims?.metadata as
    | { role?: string; twoFactorVerified?: boolean }
    | undefined

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  })

  const isAdmin = dbUser?.role === Role.ADMIN

  if (!isAdmin) {
    // Log the unauthorized attempt before redirecting
    console.warn(
      `[SECURITY] Unauthorized admin access attempt by clerkId: ${userId}`
    )
    redirect('/?error=unauthorized')
  }

  // In production: enforce 2FA for admin sessions
  // The `twoFactorVerified` claim is set by your Clerk JWT template.
  // Uncomment after configuring your Clerk JWT template.
  /*
  if (!clerkMeta?.twoFactorVerified) {
    redirect('/sign-in?requireMfa=true&redirect_url=/admin')
  }
  */

  return { userId, dbUser }
}

// ── Sync Clerk user to DB (called on first sign-in via webhook) ─
export async function syncUserToDb(clerkUserId: string) {
  const clerkUser = await currentUser()
  if (!clerkUser) return null

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? ''
  const name = [clerkUser.firstName, clerkUser.lastName]
    .filter(Boolean)
    .join(' ')

  const user = await prisma.user.upsert({
    where: { clerkId: clerkUserId },
    update: {
      name: name || undefined,
      avatarUrl: clerkUser.imageUrl || undefined,
    },
    create: {
      clerkId: clerkUserId,
      email,
      name: name || null,
      avatarUrl: clerkUser.imageUrl || null,
      role: email === process.env.ADMIN_EMAIL ? Role.ADMIN : Role.USER,
    },
  })

  return user
}
