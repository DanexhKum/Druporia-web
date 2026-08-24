'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  deleteProductFile,
  deleteThumbnailsByUrl,
  uploadProductThumbnail,
} from '@/lib/storage'
import { CreateProductSchema } from '@/lib/validations'
import { getGalleryUrls } from '@/lib/utils'

const MAX_THUMBNAIL_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_THUMBNAIL_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]
const ALLOWED_THUMBNAIL_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

function validateImageFile(file: File, label: string) {
  if (!file || file.size === 0) return

  const fileName = file.name.toLowerCase()
  const hasValidExtension = ALLOWED_THUMBNAIL_EXTENSIONS.some((ext) =>
    fileName.endsWith(ext)
  )

  if (!hasValidExtension) {
    throw new Error(`${label} must be a JPG, PNG, WebP, or GIF image`)
  }

  if (file.size > MAX_THUMBNAIL_SIZE_BYTES) {
    throw new Error(`${label} must be under 5 MB`)
  }

  if (file.type && !ALLOWED_THUMBNAIL_MIME_TYPES.includes(file.type)) {
    throw new Error(`${label} must be a JPG, PNG, WebP, or GIF image`)
  }
}

function parseGalleryUrls(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((url) => url.trim())
    .filter(Boolean)
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

export async function updateProduct(formData: FormData) {
  await requireAdmin()

  const id = formData.get('id')
  if (typeof id !== 'string') {
    throw new Error('Invalid product id')
  }

  const current = await prisma.product.findUnique({
    where: { id },
    select: { slug: true, thumbnailUrl: true, galleryUrls: true },
  })

  if (!current) {
    throw new Error('Product not found')
  }

  const parsed = CreateProductSchema.safeParse({
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
    isPublished: formData.get('status') === 'PUBLISHED' ? 'true' : 'false',
    isFeatured: formData.get('isFeatured') === 'on' ? 'true' : 'false',
  })

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? 'Invalid product data')
  }

  const existingSlug = await prisma.product.findFirst({
    where: {
      slug: parsed.data.slug,
      NOT: { id },
    },
    select: { id: true },
  })

  if (existingSlug) {
    throw new Error('Another product already uses this slug')
  }

  const thumbnailFile = formData.get('thumbnailFile') as File | null
  const galleryFiles = formData
    .getAll('galleryFiles')
    .filter((item): item is File => item instanceof File && item.size > 0)
  const galleryUrls = parseGalleryUrls(parsed.data.galleryImageUrls)
  const removeThumbnail = formData.get('removeThumbnail') === 'on'
  const data = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    description: parsed.data.description,
    price: parsed.data.price,
    category: parsed.data.category,
    version: parsed.data.version,
    thumbnailUrl: removeThumbnail ? null : parsed.data.thumbnailUrl || null,
    galleryUrls,
    changelog: parsed.data.changelog || null,
    documentation: parsed.data.documentation || null,
    status: parsed.data.status,
    isPublished: parsed.data.status === 'PUBLISHED',
    isFeatured: parsed.data.isFeatured,
  }

  if (thumbnailFile && thumbnailFile.size > 0) {
    validateImageFile(thumbnailFile, 'Thumbnail')
    try {
      const uploadResult = await uploadProductThumbnail(
        thumbnailFile,
        parsed.data.slug
      )
      data.thumbnailUrl = uploadResult.publicUrl
    } catch (error) {
      throw new Error(getUploadErrorMessage(error, 'Thumbnail'))
    }
  }

  for (const galleryFile of galleryFiles) {
    validateImageFile(galleryFile, 'Gallery image')
    try {
      const uploadResult = await uploadProductThumbnail(
        galleryFile,
        parsed.data.slug,
        'product-gallery'
      )
      galleryUrls.push(uploadResult.publicUrl)
    } catch (error) {
      throw new Error(getUploadErrorMessage(error, 'Gallery image'))
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data,
    select: { slug: true },
  })

  // ── Clean up images this edit orphaned ────────────────────
  // Only after the update commits, and only for files in our own
  // bucket that the new record no longer references.
  const previousUrls = [
    current.thumbnailUrl,
    ...getGalleryUrls(current.galleryUrls),
  ]
  const survivingUrls = new Set([data.thumbnailUrl, ...galleryUrls])
  await deleteThumbnailsByUrl(
    previousUrls.filter((url) => url && !survivingUrls.has(url))
  )

  revalidatePath('/admin')
  revalidatePath('/marketplace')
  revalidatePath(`/marketplace/${current.slug}`)
  revalidatePath(`/marketplace/${product.slug}`)
  redirect('/admin')
}

// ── Delete a product and everything it owns ────────────────────
export async function deleteProduct(formData: FormData) {
  await requireAdmin()

  const id = formData.get('id')
  if (typeof id !== 'string') {
    throw new Error('Invalid product id')
  }

  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      slug: true,
      title: true,
      downloadUrl: true,
      thumbnailUrl: true,
      galleryUrls: true,
      _count: { select: { orderItems: true } },
    },
  })

  if (!product) {
    throw new Error('Product not found')
  }

  // OrderItem.product is onDelete: Restrict, so a sold product cannot
  // be removed without destroying purchase history. Archive instead —
  // buyers keep their downloads, and the storefront stops listing it.
  if (product._count.orderItems > 0) {
    throw new Error(
      `"${product.title}" has been purchased and cannot be deleted. ` +
        'Set its status to ARCHIVED instead.'
    )
  }

  await prisma.product.delete({ where: { id } })

  // Storage cleanup after the row is gone. Best-effort: a failure here
  // leaves an orphaned file, which is better than a dangling record.
  await deleteThumbnailsByUrl([
    product.thumbnailUrl,
    ...getGalleryUrls(product.galleryUrls),
  ])

  try {
    await deleteProductFile(product.downloadUrl)
  } catch (err) {
    console.error('[deleteProduct] Archive cleanup failed:', err)
  }

  revalidatePath('/admin')
  revalidatePath('/marketplace')
  revalidatePath(`/marketplace/${product.slug}`)
  redirect('/admin')
}
