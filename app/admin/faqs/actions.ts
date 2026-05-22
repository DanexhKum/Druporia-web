'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const faqSchema = z.object({
  question: z.string().trim().min(2, 'Question must be at least 2 characters').max(200),
  answer: z.string().trim().min(2, 'Answer must be at least 2 characters').max(3000),
  category: z.string().max(80).optional().or(z.literal('')),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
  isPublished: z.coerce.boolean().optional(),
})

export async function createFAQ(formData: FormData) {
  await requireAdmin()
  const parsed = faqSchema.safeParse({
    question: formData.get('question'),
    answer: formData.get('answer'),
    category: formData.get('category') || '',
    sortOrder: formData.get('sortOrder') || 0,
    isPublished: formData.get('isPublished') === 'on',
  })

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? 'Invalid FAQ data')
  }

  const data = parsed.data
  await prisma.faq.create({
    data: {
      question: data.question,
      answer: data.answer,
      category: data.category || null,
      sortOrder: data.sortOrder,
      isPublished: data.isPublished ?? true,
    },
  })

  revalidatePath('/')
  revalidatePath('/admin/faqs')
}

export async function updateFAQ(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id')
  if (typeof id !== 'string') throw new Error('Invalid FAQ id')

  const parsed = faqSchema.safeParse({
    question: formData.get('question'),
    answer: formData.get('answer'),
    category: formData.get('category') || '',
    sortOrder: formData.get('sortOrder') || 0,
    isPublished: formData.get('isPublished') === 'on',
  })

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? 'Invalid FAQ data')
  }

  const data = parsed.data
  await prisma.faq.update({
    where: { id },
    data: {
      question: data.question,
      answer: data.answer,
      category: data.category || null,
      sortOrder: data.sortOrder,
      isPublished: data.isPublished ?? false,
    },
  })

  revalidatePath('/')
  revalidatePath('/admin/faqs')
}

export async function deleteFAQ(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id')
  if (typeof id !== 'string') throw new Error('Invalid FAQ id')

  await prisma.faq.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath('/admin/faqs')
}
