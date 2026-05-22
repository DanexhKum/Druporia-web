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
import {
  deleteProductFile,
  deleteProductThumbnail,
  uploadProductFile,
  uploadProductThumbnail,
} from '@/lib/storage'
import {
  CreateProductSchema,
  type ActionState,
} from '@/lib/validations'

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024 // 100 MB
const MAX_THUMBNAIL_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
const ALLOWED_MIME_TYPES = [
  'application/zip',
  'application/x-zip-compressed',
  'application/octet-stream',
  'application/x-zip',
]
const ALLOWED_EXTENSIONS = ['.zip']
const ALLOWED_THUMBNAIL_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]
const ALLOWED_THUMBNAIL_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

type CreatedProductResult = {
  id: string
  slug: string
  status: string
}

function parseGalleryUrls(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((url) => url.trim())
    .filter(Boolean)
}

function getImageValidationError(file: File) {
  const fileName = file.name.toLowerCase()
  const hasValidExtension = ALLOWED_THUMBNAIL_EXTENSIONS.some((ext) =>
    fileName.endsWith(ext)
  )

  if (!hasValidExtension) return 'Use a JPG, PNG, WebP, or GIF image.'
  if (file.size > MAX_THUMBNAIL_SIZE_BYTES) return 'Image must be under 5 MB.'
  if (file.type && !ALLOWED_THUMBNAIL_MIME_TYPES.includes(file.type)) {
    return 'Use a JPG, PNG, WebP, or GIF image.'
  }

  return null
}

function getUploadErrorMessage(error: unknown, label: string) {
  const message = error instanceof Error ? error.message : String(error)

  if (message.includes('row-level security') || message.includes('Unauthorized')) {
    return `${label} upload failed because Supabase storage permissions are blocking the request. Check the service role key and bucket policy.`
  }

  if (message.includes('Bucket not found') || message.includes('bucket')) {
    return `${label} upload failed because the Supabase storage bucket is missing or unavailable.`
  }

  if (message.includes('payload') || message.includes('too large')) {
    return `${label} upload failed because the file is too large. Try a smaller or compressed file.`
  }

  return `${label} upload failed: ${message}`
}

// ── Server Action ──────────────────────────────────────────────
export async function createProduct(
  _prevState: ActionState<CreatedProductResult>,
  formData: FormData
): Promise<ActionState<CreatedProductResult>> {

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
  const thumbnailFile = formData.get('thumbnailFile') as File | null
  const galleryFiles = formData
    .getAll('galleryFiles')
    .filter((item): item is File => item instanceof File && item.size > 0)

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

  if (thumbnailFile && thumbnailFile.size > 0) {
    const error = getImageValidationError(thumbnailFile)
    if (error) {
      return {
        status: 'error',
        message: 'Invalid thumbnail image type.',
        fieldErrors: {
          thumbnailFile: [error],
        },
      }
    }
  }

  for (const galleryFile of galleryFiles) {
    const error = getImageValidationError(galleryFile)
    if (error) {
      return {
        status: 'error',
        message: 'Invalid gallery image.',
        fieldErrors: {
          galleryFiles: [error],
        },
      }
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
    galleryImageUrls: formData.get('galleryImageUrls') || '',
    changelog: formData.get('changelog') || '',
    documentation: formData.get('documentation') || '',
    status: formData.get('status') || 'DRAFT',
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

  const { title, slug, description, price, category, version, changelog, documentation, status, isFeatured } =
    parsed.data
  const isPublished = status === 'PUBLISHED'

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
  let thumbnailUrl = parsed.data.thumbnailUrl || ''
  const galleryUrls = parseGalleryUrls(parsed.data.galleryImageUrls)
  let thumbnailStoragePath: string | null = null
  const galleryStoragePaths: string[] = []

  try {
    const uploadResult = await uploadProductFile(file, slug)
    storagePath = uploadResult.storagePath
    fileSize = uploadResult.fileSize
  } catch (err) {
    console.error('[createProduct] Storage upload failed:', err)
    return {
      status: 'error',
      message: getUploadErrorMessage(err, 'Product file'),
    }
  }

  if (thumbnailFile && thumbnailFile.size > 0) {
    try {
      const uploadResult = await uploadProductThumbnail(thumbnailFile, slug)
      thumbnailUrl = uploadResult.publicUrl
      thumbnailStoragePath = uploadResult.storagePath
    } catch (err) {
      console.error('[createProduct] Thumbnail upload failed:', err)
      try {
        await deleteProductFile(storagePath)
      } catch {
        // Non-fatal cleanup failure
      }
      return {
        status: 'error',
        message: getUploadErrorMessage(err, 'Thumbnail'),
      }
    }
  }

  for (const galleryFile of galleryFiles) {
    try {
      const uploadResult = await uploadProductThumbnail(
        galleryFile,
        slug,
        'product-gallery'
      )
      galleryUrls.push(uploadResult.publicUrl)
      galleryStoragePaths.push(uploadResult.storagePath)
    } catch (err) {
      console.error('[createProduct] Gallery upload failed:', err)
      try {
        await deleteProductFile(storagePath)
        if (thumbnailStoragePath) {
          await deleteProductThumbnail(thumbnailStoragePath)
        }
        for (const galleryStoragePath of galleryStoragePaths) {
          await deleteProductThumbnail(galleryStoragePath)
        }
      } catch {
        // Non-fatal cleanup failure
      }
      return {
        status: 'error',
        message: getUploadErrorMessage(err, 'Gallery image'),
      }
    }
  }

  // ── STEP 6: Create DB record via Prisma ───────────────────
  let product: CreatedProductResult

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
        galleryUrls,
        version,
        fileSize,
        changelog: changelog || null,
        documentation: documentation || null,
        status,
        isPublished,
        isFeatured,
      },
      select: {
        id: true,
        slug: true,
        status: true,
      },
    })
  } catch (err) {
    console.error('[createProduct] DB insert failed:', err)
    // Best-effort: try to clean up the uploaded file
    try {
      await deleteProductFile(storagePath)
      if (thumbnailStoragePath) {
        await deleteProductThumbnail(thumbnailStoragePath)
      }
      for (const galleryStoragePath of galleryStoragePaths) {
        await deleteProductThumbnail(galleryStoragePath)
      }
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
    message:
      status === 'PUBLISHED'
        ? `"${title}" was published to the marketplace successfully.`
        : `"${title}" was saved as ${status.toLowerCase()}.`,
  }
}
