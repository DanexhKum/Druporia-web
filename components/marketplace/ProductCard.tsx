// ============================================================
// components/marketplace/ProductCard.tsx
// 
// Design system: Clean white card with 1px slate-200 borders.
// NO gradients, NO glow, NO dark mode. Linear/Tailwind UI style.
// ============================================================

'use client'

import Link from 'next/link'
import toast from 'react-hot-toast'
import { ShoppingCart, Sparkles, Download, Tag } from 'lucide-react'
import { formatPrice, CATEGORY_LABELS, CATEGORY_ICONS, truncate } from '@/lib/utils'
import type { ProductCategory } from '@prisma/client'

// ── Props ─────────────────────────────────────────────────────
export interface ProductCardProps {
  id: string
  title: string
  slug: string
  description: string
  price: number | string
  category: ProductCategory
  thumbnailUrl?: string | null
  version?: string | null
  fileSize?: string | null
  isFeatured?: boolean
}

// ── Subscription coming-soon toast ────────────────────────────
function handleSubscriptionClick(e: React.MouseEvent) {
  e.preventDefault()
  e.stopPropagation()

  toast(
    '🚀 Subscription tiers are launching soon! Contact me directly for early access.',
    {
      duration: 5000,
      style: {
        background: '#ffffff',
        color: '#0f172a',
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '500',
        maxWidth: '380px',
        padding: '14px 16px',
        boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)',
      },
      icon: null,
    }
  )
}

// ── Category accent colours (very subtle — text only, no bg fills) ─
function getCategoryStyle(category: ProductCategory) {
  const map: Record<string, string> = {
    APP: 'text-blue-700 bg-blue-50 border-blue-100',
    WOO_PLUGIN: 'text-purple-700 bg-purple-50 border-purple-100',
    CHROME_EXTENSION: 'text-amber-700 bg-amber-50 border-amber-100',
  }
  return map[category] ?? 'text-slate-600 bg-slate-50 border-slate-200'
}

// ── Main Component ─────────────────────────────────────────────
export function ProductCard({
  id,
  title,
  slug,
  description,
  price,
  category,
  thumbnailUrl,
  version,
  fileSize,
  isFeatured,
}: ProductCardProps) {
  const priceNum = typeof price === 'string' ? parseFloat(price) : price
  const isFree = priceNum === 0
  const categoryStyle = getCategoryStyle(category)

  return (
    <article className="group relative flex flex-col rounded-lg border border-slate-200 bg-white transition-shadow duration-200 hover:shadow-card-hover">

      {/* ── Featured ribbon ──────────────────────────────── */}
      {isFeatured && (
        <div className="absolute right-3 top-3 z-10">
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
            <Sparkles className="h-3 w-3" />
            Featured
          </span>
        </div>
      )}

      {/* ── Thumbnail ────────────────────────────────────── */}
      <Link
        href={`/marketplace/${slug}`}
        className="block overflow-hidden rounded-t-lg border-b border-slate-200"
        aria-label={`View ${title}`}
        tabIndex={-1}
      >
        <div className="relative h-40 w-full bg-slate-50">
          {thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnailUrl}
              alt={`${title} thumbnail`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
          ) : (
            /* Placeholder — clean grid pattern, no gradients */
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-4xl opacity-20 select-none">
                {CATEGORY_ICONS[category]}
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* ── Content ──────────────────────────────────────── */}
      <div className="flex flex-1 flex-col p-5">

        {/* Category tag */}
        <div className="mb-3">
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${categoryStyle}`}
          >
            <span className="text-xs">{CATEGORY_ICONS[category]}</span>
            {CATEGORY_LABELS[category]}
          </span>
        </div>

        {/* Title */}
        <Link
          href={`/marketplace/${slug}`}
          className="group/title focus-ring rounded"
        >
          <h3 className="text-sm font-semibold text-slate-900 group-hover/title:text-slate-700 leading-snug">
            {title}
          </h3>
        </Link>

        {/* Description */}
        <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-500">
          {truncate(description, 110)}
        </p>

        {/* Meta row: version + file size */}
        {(version || fileSize) && (
          <div className="mt-3 flex items-center gap-3">
            {version && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Tag className="h-3 w-3" />
                v{version}
              </span>
            )}
            {fileSize && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Download className="h-3 w-3" />
                {fileSize}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Divider ──────────────────────────────────────── */}
      <div className="border-t border-slate-100" />

      {/* ── Footer: Price + Action buttons ───────────────── */}
      <div className="flex items-center justify-between gap-3 px-5 py-4">

        {/* Price */}
        <div className="flex items-baseline gap-1">
          {isFree ? (
            <span className="text-sm font-semibold text-green-700">Free</span>
          ) : (
            <>
              <span className="text-base font-semibold text-slate-900">
                {formatPrice(priceNum)}
              </span>
              <span className="text-xs text-slate-400">USD</span>
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Subscription placeholder button */}
          <button
            type="button"
            onClick={handleSubscriptionClick}
            className="rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1"
            title="Subscription tiers coming soon"
          >
            Subscribe
          </button>

          {/* Buy Now */}
          <Link
            href={`/marketplace/${slug}#purchase`}
            className="inline-flex items-center gap-1.5 rounded border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition-all duration-150 hover:bg-slate-800 active:bg-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1"
          >
            <ShoppingCart className="h-3 w-3" />
            Buy Now
          </Link>
        </div>
      </div>
    </article>
  )
}
