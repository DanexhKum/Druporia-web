// ============================================================
// app/api/download/[productId]/route.ts
// Secure download endpoint — generates signed URL for verified buyers.
//
// Security chain:
//   1. Verify Clerk session
//   2. Look up user in DB
//   3. Verify user has a COMPLETED order containing the product
//   4. Generate a 15-minute signed URL (never expose raw path)
//   5. Log the download attempt for audit trail
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { generateSignedDownloadUrl } from '@/lib/storage'

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

  // ── 3. Verify ownership ───────────────────────────────────
  // Admins can download any product (for testing)
  const isAdmin = user.role === 'ADMIN'

  if (!isAdmin) {
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

  // ── 4. Get product storage path ───────────────────────────
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      title: true,
      downloadUrl: true,
      isPublished: true,
    },
  })

  if (!product || (!product.isPublished && !isAdmin)) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  // ── 5. Generate signed URL ────────────────────────────────
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
    // ── 6. Audit log (always, even on failure) ───────────────
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      'unknown'
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

  // ── 7. Redirect to signed URL ─────────────────────────────
  // Use 302 redirect so the browser fetches the file directly.
  // The signed URL is NEVER returned as JSON to prevent caching.
  return NextResponse.redirect(signedUrl!, { status: 302 })
}
