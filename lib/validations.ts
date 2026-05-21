// ============================================================
// lib/validations.ts
// Zod schemas for all server-action form validation.
// ============================================================

import { z } from 'zod'
import { ProductCategory } from '@prisma/client'

// ── Product creation/editing ──────────────────────────────────
export const CreateProductSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be under 100 characters')
    .trim(),

  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(80, 'Slug must be under 80 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase letters, numbers, and hyphens only'
    ),

  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(10000, 'Description too long'),

  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number (e.g. 29.99)')
    .transform((val) => parseFloat(val))
    .refine((val) => val >= 0, 'Price must be zero or positive')
    .refine((val) => val <= 9999.99, 'Price cannot exceed 9999.99'),

  category: z.nativeEnum(ProductCategory, {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),

  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, 'Version must follow semver (e.g. 1.0.0)')
    .optional()
    .default('1.0.0'),

  thumbnailUrl: z
    .string()
    .url('Thumbnail must be a valid image URL')
    .optional()
    .or(z.literal('')),

  isPublished: z
    .string()
    .optional()
    .transform((val) => val === 'true'),

  isFeatured: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
})

export type CreateProductInput = z.infer<typeof CreateProductSchema>

// ── Server action state types ─────────────────────────────────
export type ActionState<T = unknown> =
  | { status: 'idle' }
  | { status: 'success'; data: T; message: string }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string[]> }
