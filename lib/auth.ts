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

// ── Ensure Clerk user exists in DB (webhook may not have fired yet) ─
export async function ensureDbUser(clerkUserId: string) {
  const existing = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  })

  if (existing) return existing

  return syncUserToDb(clerkUserId)
}

export function isAdminRole(role: Role | string | undefined) {
  return role === Role.ADMIN
}

// ── Decide the role for a newly-synced account ────────────────
// ADMIN is granted by exact match against ADMIN_EMAIL. If that
// variable is missing or blank, nobody can ever become an admin —
// so say so loudly rather than silently creating only USERs.
export function resolveRoleForEmail(email: string): Role {
  const adminEmail = process.env.ADMIN_EMAIL?.trim()

  if (!adminEmail) {
    console.warn(
      '[auth] ADMIN_EMAIL is not set — every new account will be created ' +
        'as USER and no admin will ever be provisioned.'
    )
    return Role.USER
  }

  return email.trim().toLowerCase() === adminEmail.toLowerCase()
    ? Role.ADMIN
    : Role.USER
}

// ── Require authentication — redirect to sign-in if not authed ─
export async function requireAuth() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')
  await ensureDbUser(userId)
  return userId
}

// ── Require ADMIN role ─────────────────────────────────────────
// Checks the DB role only — see the note at the end about 2FA.
export async function requireAdmin() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in?redirect_url=/admin')
  }

  let dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  })

  // Auto-sync user locally if webhooks haven't fired
  if (!dbUser && process.env.NODE_ENV !== 'production') {
    await syncUserToDb(userId)
    dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    })
  }

  const isAdmin = dbUser?.role === Role.ADMIN

  if (!isAdmin) {
    // Log the unauthorized attempt before redirecting
    console.warn(
      `[SECURITY] Unauthorized admin access attempt by clerkId: ${userId}`
    )
    redirect('/?error=unauthorized')
  }

  // ⚠ NO SECOND FACTOR IS ENFORCED HERE.
  //
  // Admin access is gated by the DB role check above and nothing else.
  // To add 2FA: enable MFA in the Clerk dashboard, add a JWT template
  // that exposes the verification status as a session claim, then read
  // that claim here and redirect when it is absent. Until that template
  // exists the claim is always undefined, so enabling the check without
  // it locks every admin out — which is why it is not merely commented.
  //
  // Do not describe this function as enforcing 2FA until it does.

  return { userId, dbUser }
}

// ── Sync Clerk user to DB (called on first sign-in via webhook) ─
// NOTE: this reads currentUser(), which is the *signed-in* user, so it
// can only ever sync the caller's own account. The clerkUserId argument
// is therefore checked rather than used to fetch — passing anyone else's
// id is a programming error, and silently writing their row would be
// worse than refusing. To sync an arbitrary user (e.g. from a webhook),
// fetch them with clerkClient() instead.
export async function syncUserToDb(clerkUserId: string) {
  const clerkUser = await currentUser()
  if (!clerkUser) return null

  if (clerkUser.id !== clerkUserId) {
    console.error(
      `[auth] syncUserToDb called with ${clerkUserId} but the session ` +
        `belongs to ${clerkUser.id}. Refusing to sync.`
    )
    return null
  }

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
      role: resolveRoleForEmail(email),
    },
  })

  return user
}
