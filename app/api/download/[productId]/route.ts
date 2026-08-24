// ============================================================
// app/api/download/[productId]/route.ts
// Secure download endpoint — generates signed URL for verified buyers.
//
// Security chain:
//   1. Verify Clerk session
//   2. Look up user in DB
//   3. Rate limit per account and per account+product
//   4. Load the product; 404 if unknown or unpublished
//   5. Require a COMPLETED order — unless the product is free,
//      or the caller is an admin
//   6. Generate a 15-minute signed URL (never expose raw path)
//   7. Log the attempt for audit trail
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { generateSignedDownloadUrl } from '@/lib/storage'
import { getClientIp, rateLimit, rateLimitHeaders } from '@/lib/rate-limit'

// Each request mints a fresh 15-minute signed URL, so an unbounded
// endpoint is an unbounded link generator. Two tiers: a per-product
// cap that stops one product being farmed, and a per-account cap
// that stops the whole catalogue being swept.
const PER_PRODUCT_LIMIT = 10
const PER_ACCOUNT_LIMIT = 40
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hour

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  // ── 1. Auth check ─────────────────────────────────────────
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { productId } = await params

  if (!productId || typeof productId !== 'string') {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
  }

  // ── 2. Get user from DB ───────────────────────────────────
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, role: true },
  })

  if (!user) {
    return NextResponse.json(
      { error: 'User account not found' },
      { status: 403 }
    )
  }

  const isAdmin = user.role === 'ADMIN'

  // ── 3. Rate limit ─────────────────────────────────────────
  // Keyed on the DB user id, not IP, so it follows the account
  // across networks. Admins are exempt for testing.
  if (!isAdmin) {
    const perProduct = rateLimit(
      `download:${user.id}:${productId}`,
      PER_PRODUCT_LIMIT,
      RATE_WINDOW_MS
    )
    const perAccount = rateLimit(
      `download:${user.id}`,
      PER_ACCOUNT_LIMIT,
      RATE_WINDOW_MS
    )
    const breached = !perProduct.ok ? perProduct : !perAccount.ok ? perAccount : null

    if (breached) {
      console.warn(
        `[download] Rate limit hit by user ${user.id} on product ${productId}`
      )
      return NextResponse.json(
        {
          error: `Too many download links generated. Try again in ${Math.ceil(
            breached.retryAfterSeconds / 60
          )} minutes.`,
        },
        { status: 429, headers: rateLimitHeaders(breached) }
      )
    }
  }

  // ── 4. Get the product ────────────────────────────────────
  // Fetched before the ownership check so an unknown or unpublished
  // product returns 404 rather than leaking "you haven't bought this".
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      title: true,
      price: true,
      downloadUrl: true,
      isPublished: true,
    },
  })

  if (!product || (!product.isPublished && !isAdmin)) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  // ── 5. Verify entitlement ─────────────────────────────────
  // Free products need no order — there is no checkout that would
  // ever create one. Admins can download anything, for testing.
  const isFree = Number(product.price) === 0

  if (!isAdmin && !isFree) {
    // Check for a completed order containing this product
    const purchaseVerified = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: user.id,
          status: 'COMPLETED',
        },
      },
      select: { id: true },
    })

    if (!purchaseVerified) {
      return NextResponse.json(
        { error: 'Purchase not found. Please buy this product first.' },
        { status: 403 }
      )
    }
  }

  // ── 6. Generate signed URL ────────────────────────────────
  let signedUrl: string
  let downloadSuccess = true

  try {
    signedUrl = await generateSignedDownloadUrl(product.downloadUrl)
  } catch (err) {
    console.error('[download] Failed to generate signed URL:', err)
    downloadSuccess = false
    return NextResponse.json(
      { error: 'Failed to generate download link. Please try again.' },
      { status: 500 }
    )
  } finally {
    // ── 7. Audit log (always, even on failure) ───────────────
    const ip = getClientIp(req)
    const userAgent = req.headers.get('user-agent') ?? undefined

    try {
      await prisma.download.create({
        data: {
          userId: user.id,
          productId,
          ipAddress: ip,
          userAgent,
          success: downloadSuccess,
        },
      })
    } catch (logErr) {
      // Non-fatal — never block the download due to audit log failure
      console.error('[download] Audit log failed:', logErr)
    }
  }

  // ── 8. Redirect to signed URL ─────────────────────────────
  // Use 302 redirect so the browser fetches the file directly.
  // The signed URL is NEVER returned as JSON to prevent caching.
  return NextResponse.redirect(signedUrl!, { status: 302 })
}
