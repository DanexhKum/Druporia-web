// ============================================================
// app/api/contact/route.ts
// Public contact form → Formspree.
//
// This endpoint is unauthenticated by design, so it is rate
// limited and strictly validated: without both, it is an open
// relay into your inbox and Formspree quota.
// ============================================================

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getClientIp, rateLimit, rateLimitHeaders } from '@/lib/rate-limit'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xojypayy'

// 5 submissions per IP per 10 minutes.
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 10 * 60 * 1000

const ContactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(100),
  email: z
    .string()
    .trim()
    .min(3)
    .max(254)
    .email('Please enter a valid email address'),
  subject: z.string().trim().max(150).optional().or(z.literal('')),
  message: z
    .string()
    .trim()
    .min(10, 'Please tell us a little more')
    .max(5000, 'Message is too long'),
})

export async function POST(request: Request) {
  // ── 1. Rate limit by IP ───────────────────────────────────
  const ip = getClientIp(request)
  const limit = rateLimit(`contact:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)

  if (!limit.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: `Too many messages sent. Try again in ${Math.ceil(
          limit.retryAfterSeconds / 60
        )} minutes.`,
      },
      { status: 429, headers: rateLimitHeaders(limit) }
    )
  }

  // ── 2. Parse and validate ─────────────────────────────────
  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Could not read the form submission.' },
      { status: 400 }
    )
  }

  const parsed = ContactSchema.safeParse({
    name: formData.get('name') ?? '',
    email: formData.get('email') ?? '',
    subject: formData.get('subject') ?? '',
    message: formData.get('message') ?? '',
  })

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message:
          parsed.error.errors[0]?.message ??
          'Please fill in all required fields.',
      },
      { status: 400, headers: rateLimitHeaders(limit) }
    )
  }

  const { name, email, subject, message } = parsed.data

  // ── 3. Forward to Formspree ───────────────────────────────
  const payload = new URLSearchParams({
    name,
    email,
    subject: subject || 'Website contact form',
    message,
    _replyto: email,
  })

  let response: Response
  try {
    response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload,
      signal: AbortSignal.timeout(10_000),
    })
  } catch (err) {
    console.error('[contact] Formspree request failed:', err)
    return NextResponse.json(
      { ok: false, message: 'Message could not be sent.' },
      { status: 502, headers: rateLimitHeaders(limit) }
    )
  }

  if (!response.ok) {
    console.error(
      `[contact] Formspree returned ${response.status} ${response.statusText}`
    )
    return NextResponse.json(
      { ok: false, message: 'Message could not be sent.' },
      { status: 502, headers: rateLimitHeaders(limit) }
    )
  }

  return NextResponse.json(
    { ok: true },
    { status: 200, headers: rateLimitHeaders(limit) }
  )
}
