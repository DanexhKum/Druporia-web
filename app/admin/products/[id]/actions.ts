'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadProductThumbnail } from '@/lib/storage'
import { CreateProductSchema } from '@/lib/validations'

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

export async function updateProduct(formData: FormData) {
  await requireAdmin()

  const id = formData.get('id')
  if (typeof id !== 'string') {
    throw new Error('Invalid product id')
  }

  const current = await prisma.product.findUnique({
    where: { id },
    select: { slug: true },
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
    isPublished: formData.get('isPublished') === 'on' ? 'true' : 'false',
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
  const data = { ...parsed.data }

  if (thumbnailFile && thumbnailFile.size > 0) {
    validateImageFile(thumbnailFile, 'Thumbnail')
    const uploadResult = await uploadProductThumbnail(
      thumbnailFile,
      parsed.data.slug
    )
    data.thumbnailUrl = uploadResult.publicUrl
  }

  const product = await prisma.product.update({
    where: { id },
    data,
    select: { slug: true },
  })

  revalidatePath('/admin')
  revalidatePath('/marketplace')
  revalidatePath(`/marketplace/${current.slug}`)
  revalidatePath(`/marketplace/${product.slug}`)
  redirect('/admin')
}
