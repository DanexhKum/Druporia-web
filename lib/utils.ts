// ============================================================
// lib/utils.ts
// Shared utility helpers.
// ============================================================

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ProductCategory } from '@prisma/client'

// ── Tailwind class merging helper ─────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Currency formatting ───────────────────────────────────────
export function formatPrice(
  price: number | string,
  currency = 'USD'
): string {
  const amount = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
}

// ── Date formatting ───────────────────────────────────────────
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

// ── Product category labels ───────────────────────────────────
export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  [ProductCategory.APP]: 'App',
  [ProductCategory.WOO_PLUGIN]: 'WooCommerce Plugin',
  [ProductCategory.CHROME_EXTENSION]: 'Chrome Extension',
}

export const CATEGORY_ICONS: Record<ProductCategory, string> = {
  [ProductCategory.APP]: '📱',
  [ProductCategory.WOO_PLUGIN]: '🛒',
  [ProductCategory.CHROME_EXTENSION]: '🧩',
}

// ── Gallery URLs ──────────────────────────────────────────────
// Product.galleryUrls is a Json column, so Prisma types it as
// JsonValue. Narrow it to the string[] the app actually stores.
export function getGalleryUrls(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []
}

// ── Slug generation ───────────────────────────────────────────
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// ── Truncate text ─────────────────────────────────────────────
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str

  // Break on a word boundary rather than mid-word. Falling back to a
  // hard cut only when the last space is very early, so a single long
  // token can't collapse the whole string.
  const cut = str.slice(0, length)
  const lastSpace = cut.lastIndexOf(' ')
  const base = lastSpace > length * 0.6 ? cut.slice(0, lastSpace) : cut

  // Strip trailing punctuation before the ellipsis — otherwise a clause
  // ending in a comma renders as "architecture,…", which reads broken.
  return `${base.trimEnd().replace(/[,;:.\-–—]+$/, '')}…`
}
