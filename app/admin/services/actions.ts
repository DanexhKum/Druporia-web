'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const serviceSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().min(10).max(2000),
  iconKey: z.string().min(2).max(40).default('Code2'),
  tags: z.string().max(1000).optional().or(z.literal('')),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
  isPublished: z.coerce.boolean().optional(),
})

function parseTags(tags?: string) {
  return (tags ?? '')
    .split(/\r?\n|,/)
    .map((tag) => tag.trim())
    .filter(Boolean)
}

export async function createServiceItem(formData: FormData) {
  await requireAdmin()
  const parsed = serviceSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    iconKey: formData.get('iconKey') || 'Code2',
    tags: formData.get('tags') || '',
    sortOrder: formData.get('sortOrder') || 0,
    isPublished: formData.get('isPublished') === 'on',
  })

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? 'Invalid service data')
  }

  const data = parsed.data
  await prisma.serviceItem.create({
    data: {
      title: data.title,
      description: data.description,
      iconKey: data.iconKey,
      tags: parseTags(data.tags),
      sortOrder: data.sortOrder,
      isPublished: data.isPublished ?? true,
    },
  })

  revalidatePath('/')
  revalidatePath('/admin/services')
}

export async function updateServiceItem(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id')
  if (typeof id !== 'string') throw new Error('Invalid service id')

  const parsed = serviceSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    iconKey: formData.get('iconKey') || 'Code2',
    tags: formData.get('tags') || '',
    sortOrder: formData.get('sortOrder') || 0,
    isPublished: formData.get('isPublished') === 'on',
  })

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? 'Invalid service data')
  }

  const data = parsed.data
  await prisma.serviceItem.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      iconKey: data.iconKey,
      tags: parseTags(data.tags),
      sortOrder: data.sortOrder,
      isPublished: data.isPublished ?? false,
    },
  })

  revalidatePath('/')
  revalidatePath('/admin/services')
}

export async function deleteServiceItem(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id')
  if (typeof id !== 'string') throw new Error('Invalid service id')

  await prisma.serviceItem.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath('/admin/services')
}
