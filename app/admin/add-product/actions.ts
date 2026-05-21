// ============================================================
// app/admin/add-product/actions.ts
// Server Action: createProduct
//
// Security chain:
//   1. Clerk session verification (server-side via auth())
//   2. DB role check (ADMIN only) via requireAdmin()
//   3. Zod schema validation of all form fields
//   4. File type & size validation (.zip, max 100MB)
//   5. Secure file upload to private storage bucket
//   6. Prisma DB insert with sanitised data
//   7. Next.js cache revalidation of /marketplace
// ============================================================

'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadProductFile } from '@/lib/storage'
import {
  CreateProductSchema,
  type ActionState,
} from '@/lib/validations'
import type { Product } from '@prisma/client'

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024 // 100 MB
const ALLOWED_MIME_TYPES = [
  'application/zip',
  'application/x-zip-compressed',
  'application/octet-stream',
  'application/x-zip',
]
const ALLOWED_EXTENSIONS = ['.zip']

// ── Server Action ──────────────────────────────────────────────
export async function createProduct(
  _prevState: ActionState<Pick<Product, 'id' | 'slug'>>,
  formData: FormData
): Promise<ActionState<Pick<Product, 'id' | 'slug'>>> {

  // ── STEP 1: Verify admin session ───────────────────────────
  let adminUserId: string
  try {
    const { userId } = await requireAdmin()
    adminUserId = userId
  } catch {
    return {
      status: 'error',
      message: 'Unauthorized. Admin access required.',
    }
  }

  // ── STEP 2: Extract and validate file ─────────────────────
  const file = formData.get('zipFile') as File | null

  if (!file || file.size === 0) {
    return {
      status: 'error',
      message: 'Product .zip file is required.',
      fieldErrors: { zipFile: ['Please upload a .zip file.'] },
    }
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      status: 'error',
      message: 'File is too large.',
      fieldErrors: {
        zipFile: [`File must be under 100 MB. Received: ${(file.size / 1024 / 1024).toFixed(1)} MB`],
      },
    }
  }

  // Validate file extension (defense against MIME spoofing)
  const fileName = file.name.toLowerCase()
  const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) =>
    fileName.endsWith(ext)
  )
  if (!hasValidExtension) {
    return {
      status: 'error',
      message: 'Invalid file type.',
      fieldErrors: {
        zipFile: ['Only .zip files are accepted.'],
      },
    }
  }

  // Validate MIME type
  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      status: 'error',
      message: 'Invalid file MIME type.',
      fieldErrors: {
        zipFile: [
          'File must be a valid ZIP archive. Detected type: ' + file.type,
        ],
      },
    }
  }

  // ── STEP 3: Validate form fields via Zod ──────────────────
  const rawFields = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    price: formData.get('price'),
    category: formData.get('category'),
    version: formData.get('version') || undefined,
    thumbnailUrl: formData.get('thumbnailUrl') || '',
    isPublished: formData.get('isPublished') ?? 'false',
    isFeatured: formData.get('isFeatured') ?? 'false',
  }

  const parsed = CreateProductSchema.safeParse(rawFields)

  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {}
    for (const [key, errors] of Object.entries(
      parsed.error.flatten().fieldErrors
    )) {
      if (errors) fieldErrors[key] = errors
    }
    return {
      status: 'error',
      message: 'Please fix the form errors below.',
      fieldErrors,
    }
  }

  const { title, slug, description, price, category, version, thumbnailUrl, isPublished, isFeatured } =
    parsed.data

  // ── STEP 4: Check slug uniqueness ─────────────────────────
  const existingProduct = await prisma.product.findUnique({
    where: { slug },
    select: { id: true },
  })

  if (existingProduct) {
    return {
      status: 'error',
      message: 'A product with this slug already exists.',
      fieldErrors: {
        slug: ['This slug is already in use. Please choose a different one.'],
      },
    }
  }

  // ── STEP 5: Upload .zip to private storage ─────────────────
  let storagePath: string
  let fileSize: string

  try {
    const uploadResult = await uploadProductFile(file, slug)
    storagePath = uploadResult.storagePath
    fileSize = uploadResult.fileSize
  } catch (err) {
    console.error('[createProduct] Storage upload failed:', err)
    return {
      status: 'error',
      message: 'File upload failed. Please try again or contact support.',
    }
  }

  // ── STEP 6: Create DB record via Prisma ───────────────────
  let product: Pick<Product, 'id' | 'slug'>

  try {
    product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price,
        category,
        downloadUrl: storagePath, // PRIVATE path — never exposed to client
        thumbnailUrl: thumbnailUrl || null,
        version,
        fileSize,
        isPublished,
        isFeatured,
      },
      select: {
        id: true,
        slug: true,
      },
    })
  } catch (err) {
    console.error('[createProduct] DB insert failed:', err)
    // Best-effort: try to clean up the uploaded file
    try {
      const { deleteProductFile } = await import('@/lib/storage')
      await deleteProductFile(storagePath)
    } catch {
      // Non-fatal cleanup failure
    }
    return {
      status: 'error',
      message:
        'Failed to save product to database. The uploaded file has been removed.',
    }
  }

  // ── STEP 7: Revalidate Next.js cache ──────────────────────
  // Immediately reflects the new product on the live storefront
  // without requiring a redeploy or code push.
  revalidatePath('/marketplace')
  revalidatePath('/admin')
  revalidatePath(`/marketplace/${slug}`)

  console.info(
    `[createProduct] Product created: ${product.id} (${slug}) by admin: ${adminUserId}`
  )

  return {
    status: 'success',
    data: product,
    message: `"${title}" was published to the marketplace successfully.`,
  }
}
