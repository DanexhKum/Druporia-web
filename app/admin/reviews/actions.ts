'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ReviewApprovalStatus, ReviewSource } from '@prisma/client'
import { z } from 'zod'

const reviewSchema = z.object({
  clientName: z.string().min(2).max(80),
  clientCountry: z.string().max(60).optional().or(z.literal('')),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(10).max(2000),
  projectTitle: z.string().max(120).optional().or(z.literal('')),
  source: z.nativeEnum(ReviewSource).default(ReviewSource.FIVERR),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
  approvalStatus: z.nativeEnum(ReviewApprovalStatus).default(ReviewApprovalStatus.APPROVED),
  isPublished: z.coerce.boolean().optional(),
})

export async function createReview(formData: FormData) {
  await requireAdmin()
  const parsed = reviewSchema.safeParse({
    clientName: formData.get('clientName'),
    clientCountry: formData.get('clientCountry') || '',
    rating: formData.get('rating') || 5,
    comment: formData.get('comment'),
    projectTitle: formData.get('projectTitle') || '',
    source: formData.get('source') || ReviewSource.FIVERR,
    avatarUrl: formData.get('avatarUrl') || '',
    sortOrder: formData.get('sortOrder') || 0,
    approvalStatus: formData.get('approvalStatus') || ReviewApprovalStatus.APPROVED,
    isPublished: formData.get('approvalStatus') === ReviewApprovalStatus.APPROVED,
  })
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? 'Invalid input')
  }
  const d = parsed.data
  await prisma.review.create({
    data: {
      clientName: d.clientName,
      clientCountry: d.clientCountry || null,
      rating: d.rating,
      comment: d.comment,
      projectTitle: d.projectTitle || null,
      source: d.source,
      avatarUrl: d.avatarUrl || null,
      sortOrder: d.sortOrder,
      approvalStatus: d.approvalStatus,
      isPublished: d.approvalStatus === ReviewApprovalStatus.APPROVED,
    },
  })
  revalidatePath('/')
  revalidatePath('/admin/reviews')
}

export async function updateReview(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id')
  if (typeof id !== 'string') throw new Error('Invalid id')

  const parsed = reviewSchema.safeParse({
    clientName: formData.get('clientName'),
    clientCountry: formData.get('clientCountry') || '',
    rating: formData.get('rating') || 5,
    comment: formData.get('comment'),
    projectTitle: formData.get('projectTitle') || '',
    source: formData.get('source') || ReviewSource.FIVERR,
    avatarUrl: formData.get('avatarUrl') || '',
    sortOrder: formData.get('sortOrder') || 0,
    approvalStatus: formData.get('approvalStatus') || ReviewApprovalStatus.PENDING,
    isPublished: formData.get('approvalStatus') === ReviewApprovalStatus.APPROVED,
  })

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? 'Invalid input')
  }

  const d = parsed.data
  await prisma.review.update({
    where: { id },
    data: {
      clientName: d.clientName,
      clientCountry: d.clientCountry || null,
      rating: d.rating,
      comment: d.comment,
      projectTitle: d.projectTitle || null,
      source: d.source,
      avatarUrl: d.avatarUrl || null,
      sortOrder: d.sortOrder,
      approvalStatus: d.approvalStatus,
      isPublished: d.approvalStatus === ReviewApprovalStatus.APPROVED,
    },
  })

  revalidatePath('/')
  revalidatePath('/admin/reviews')
}

export async function deleteReview(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id')
  if (typeof id !== 'string') throw new Error('Invalid id')
  await prisma.review.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath('/admin/reviews')
}
