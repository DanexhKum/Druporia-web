// ============================================================
// app/api/webhooks/clerk/route.ts
// Clerk webhook handler — syncs user lifecycle events to Supabase.
//
// Events handled:
//   - user.created → create User record in DB
//   - user.updated → update name/avatar
//   - user.deleted → soft-delete or anonymise (GDPR)
//
// Setup: Add this URL in your Clerk Dashboard → Webhooks.
// Requires CLERK_WEBHOOK_SECRET env variable.
// ============================================================

import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { prisma } from '@/lib/prisma'
import { resolveRoleForEmail } from '@/lib/auth'

// Install svix: npm add svix
// Clerk uses svix to sign webhooks
type ClerkUserEventData = {
  id: string
  email_addresses: { email_address: string; id: string }[]
  first_name: string | null
  last_name: string | null
  image_url: string | null
}

type ClerkWebhookEvent =
  | { type: 'user.created'; data: ClerkUserEventData }
  | { type: 'user.updated'; data: ClerkUserEventData }
  | { type: 'user.deleted'; data: { id: string } }

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    console.error('[clerk-webhook] CLERK_WEBHOOK_SECRET is not configured')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  // ── Verify svix signature ─────────────────────────────────
  const headerPayload = await headers()
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: 'Missing svix headers' },
      { status: 400 }
    )
  }

  const payload = await req.text()
  const wh = new Webhook(WEBHOOK_SECRET)

  let event: ClerkWebhookEvent
  try {
    event = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as ClerkWebhookEvent
  } catch (err) {
    console.error('[clerk-webhook] Signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid webhook signature' },
      { status: 401 }
    )
  }

  // ── Handle events ─────────────────────────────────────────
  try {
    switch (event.type) {
      case 'user.created': {
        const { id: clerkId, email_addresses, first_name, last_name, image_url } =
          event.data
        const email = email_addresses[0]?.email_address ?? ''
        const name = [first_name, last_name].filter(Boolean).join(' ') || null

        await prisma.user.upsert({
          where: { clerkId },
          update: {},
          create: {
            clerkId,
            email,
            name,
            avatarUrl: image_url,
            role: resolveRoleForEmail(email),
          },
        })
        console.info(`[clerk-webhook] User created: ${clerkId} (${email})`)
        break
      }

      case 'user.updated': {
        const { id: clerkId, email_addresses, first_name, last_name, image_url } =
          event.data
        const email = email_addresses[0]?.email_address ?? ''
        const name = [first_name, last_name].filter(Boolean).join(' ') || null

        await prisma.user.upsert({
          where: { clerkId },
          update: {
            email,
            name,
            avatarUrl: image_url,
          },
          create: {
            clerkId,
            email,
            name,
            avatarUrl: image_url,
            role: resolveRoleForEmail(email),
          },
        })
        console.info(`[clerk-webhook] User updated: ${clerkId}`)
        break
      }

      case 'user.deleted': {
        // GDPR: anonymise rather than hard delete to preserve order history
        const { id: clerkId } = event.data
        await prisma.user.updateMany({
          where: { clerkId },
          data: {
            email: `deleted_${clerkId}@deleted.invalid`,
            name: 'Deleted User',
            avatarUrl: null,
          },
        })
        console.info(`[clerk-webhook] User anonymised: ${clerkId}`)
        break
      }

      default:
        // Ignore unhandled event types
        break
    }
  } catch (err) {
    console.error('[clerk-webhook] DB operation failed:', err)
    return NextResponse.json(
      { error: 'Database error' },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
