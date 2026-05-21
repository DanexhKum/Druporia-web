'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CreateProductSchema } from '@/lib/validations'

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

  const product = await prisma.product.update({
    where: { id },
    data: parsed.data,
    select: { slug: true },
  })

  revalidatePath('/admin')
  revalidatePath('/marketplace')
  revalidatePath(`/marketplace/${current.slug}`)
  revalidatePath(`/marketplace/${product.slug}`)
  redirect('/admin')
}
