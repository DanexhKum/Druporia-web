'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadProductThumbnail } from '@/lib/storage'
import { z } from 'zod'

const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_AVATAR_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]
const ALLOWED_AVATAR_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

function validateAvatarFile(file: File) {
  if (!file || file.size === 0) return

  const fileName = file.name.toLowerCase()
  const hasValidExtension = ALLOWED_AVATAR_EXTENSIONS.some((ext) =>
    fileName.endsWith(ext)
  )

  if (!hasValidExtension) {
    throw new Error('Avatar must be a JPG, PNG, WebP, or GIF image')
  }

  if (file.size > MAX_AVATAR_SIZE_BYTES) {
    throw new Error('Avatar must be under 5 MB')
  }

  if (file.type && !ALLOWED_AVATAR_MIME_TYPES.includes(file.type)) {
    throw new Error('Avatar must be a JPG, PNG, WebP, or GIF image')
  }
}

const teamSchema = z.object({
  name: z.string().min(2).max(80),
  role: z.string().min(2).max(80),
  bio: z.string().min(10).max(2000),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  linkedInUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
  isPublished: z.coerce.boolean().optional(),
})

export async function createTeamMember(formData: FormData) {
  await requireAdmin()
  const parsed = teamSchema.safeParse({
    name: formData.get('name'),
    role: formData.get('role'),
    bio: formData.get('bio'),
    avatarUrl: formData.get('avatarUrl') || '',
    linkedInUrl: formData.get('linkedInUrl') || '',
    githubUrl: formData.get('githubUrl') || '',
    sortOrder: formData.get('sortOrder') || 0,
    isPublished: formData.get('isPublished') === 'on',
  })
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? 'Invalid input')
  }
  const d = parsed.data
  const avatarFile = formData.get('avatarFile') as File | null
  let avatarUrl = d.avatarUrl || null

  if (avatarFile && avatarFile.size > 0) {
    validateAvatarFile(avatarFile)
    const uploadResult = await uploadProductThumbnail(avatarFile, d.name, 'team')
    avatarUrl = uploadResult.publicUrl
  }

  await prisma.teamMember.create({
    data: {
      name: d.name,
      role: d.role,
      bio: d.bio,
      avatarUrl,
      linkedInUrl: d.linkedInUrl || null,
      githubUrl: d.githubUrl || null,
      sortOrder: d.sortOrder,
      isPublished: d.isPublished ?? true,
    },
  })
  revalidatePath('/')
  revalidatePath('/admin/team')
}

export async function updateTeamMember(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id')
  if (typeof id !== 'string') throw new Error('Invalid id')

  const parsed = teamSchema.safeParse({
    name: formData.get('name'),
    role: formData.get('role'),
    bio: formData.get('bio'),
    avatarUrl: formData.get('avatarUrl') || '',
    linkedInUrl: formData.get('linkedInUrl') || '',
    githubUrl: formData.get('githubUrl') || '',
    sortOrder: formData.get('sortOrder') || 0,
    isPublished: formData.get('isPublished') === 'on',
  })

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? 'Invalid input')
  }

  const d = parsed.data
  const avatarFile = formData.get('avatarFile') as File | null
  let avatarUrl = d.avatarUrl || null

  if (avatarFile && avatarFile.size > 0) {
    validateAvatarFile(avatarFile)
    const uploadResult = await uploadProductThumbnail(avatarFile, d.name, 'team')
    avatarUrl = uploadResult.publicUrl
  }

  await prisma.teamMember.update({
    where: { id },
    data: {
      name: d.name,
      role: d.role,
      bio: d.bio,
      avatarUrl,
      linkedInUrl: d.linkedInUrl || null,
      githubUrl: d.githubUrl || null,
      sortOrder: d.sortOrder,
      isPublished: d.isPublished ?? false,
    },
  })

  revalidatePath('/')
  revalidatePath('/admin/team')
}

export async function deleteTeamMember(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id')
  if (typeof id !== 'string') throw new Error('Invalid id')
  await prisma.teamMember.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath('/admin/team')
}
