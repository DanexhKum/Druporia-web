// ============================================================
// components/marketplace/ProductCard.tsx
// 
// Design system: Clean white card with 1px navy-200 borders.
// NO gradients, NO glow, NO dark mode. Linear/Tailwind UI style.
// ============================================================

'use client'

import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Download, Eye, ShoppingCart, Sparkles, Star, Tag, X } from 'lucide-react'
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
  createdAt?: Date | string
  ratingAverage?: number
  reviewCount?: number
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
    APP: 'text-navy-800 bg-navy-50 border-navy-100',
    WOO_PLUGIN: 'text-purple-700 bg-purple-50 border-purple-100',
    CHROME_EXTENSION: 'text-amber-700 bg-amber-50 border-amber-100',
  }
  return map[category] ?? 'text-navy-600 bg-surface-50 border-navy-200'
}

function isNewProduct(createdAt?: Date | string) {
  if (!createdAt) return false
  const created = new Date(createdAt).getTime()
  if (Number.isNaN(created)) return false
  const thirtyDays = 1000 * 60 * 60 * 24 * 30
  return Date.now() - created <= thirtyDays
}

function RatingSummary({
  ratingAverage,
  reviewCount,
}: {
  ratingAverage: number
  reviewCount: number
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="flex items-center gap-0.5 text-amber-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className="h-3.5 w-3.5"
            fill={reviewCount > 0 && i < Math.round(ratingAverage) ? 'currentColor' : 'none'}
          />
        ))}
      </div>
      <span className="font-medium text-navy-600">
        {reviewCount > 0
          ? `${ratingAverage.toFixed(1)} (${reviewCount} review${reviewCount === 1 ? '' : 's'})`
          : 'No reviews yet'}
      </span>
    </div>
  )
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
  createdAt,
  ratingAverage = 5,
  reviewCount = 0,
}: ProductCardProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const priceNum = typeof price === 'string' ? parseFloat(price) : price
  const isFree = priceNum === 0
  const isNew = isNewProduct(createdAt)
  const categoryStyle = getCategoryStyle(category)
  const labels = [
    isNew ? { label: 'New', className: 'bg-navy-700 text-white border-navy-700' } : null,
    isFeatured ? { label: 'Best Seller', className: 'bg-amber-500 text-white border-amber-500' } : null,
    isFree
      ? { label: 'Free', className: 'bg-green-600 text-white border-green-600' }
      : { label: 'Premium', className: 'bg-navy-900 text-white border-navy-900' },
  ].filter(Boolean) as { label: string; className: string }[]

  return (
    <>
      <article className="motion-card group relative flex flex-col overflow-hidden rounded-2xl border border-navy-200 bg-white animate-soft-in">

        {/* ── Product labels ──────────────────────────────── */}
        <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
          {labels.map((label) => (
            <span
              key={label.label}
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold shadow-sm ${label.className}`}
            >
              {label.label === 'Best Seller' && <Sparkles className="h-3 w-3" />}
              {label.label}
            </span>
          ))}
        </div>

      {/* ── Thumbnail ────────────────────────────────────── */}
        <Link
          href={`/marketplace/${slug}`}
          className="motion-thumb block border-b border-navy-200"
          aria-label={`View ${title}`}
          tabIndex={-1}
        >
          <div className="relative h-56 w-full bg-navy-100 sm:h-60">
            {thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnailUrl}
                alt={`${title} thumbnail`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              /* Placeholder — clean grid pattern, no gradients */
              <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_42%),linear-gradient(135deg,_#f8fafc,_#e2e8f0)]">
                <div className="text-5xl opacity-25 select-none">
                  {CATEGORY_ICONS[category]}
                </div>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/20 via-transparent to-white/10 opacity-80" />
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
          <h3 className="text-sm font-semibold text-navy-900 group-hover/title:text-navy-700 leading-snug">
            {title}
          </h3>
        </Link>

        {/* Description */}
          <p className="mt-2 flex-1 text-xs leading-relaxed text-navy-500">
            {truncate(description, 110)}
          </p>

          <div className="mt-3">
            <RatingSummary ratingAverage={ratingAverage} reviewCount={reviewCount} />
          </div>

        {/* Meta row: version + file size */}
        {(version || fileSize) && (
          <div className="mt-3 flex items-center gap-3">
            {version && (
              <span className="flex items-center gap-1 text-xs text-navy-400">
                <Tag className="h-3 w-3" />
                v{version}
              </span>
            )}
            {fileSize && (
              <span className="flex items-center gap-1 text-xs text-navy-400">
                <Download className="h-3 w-3" />
                {fileSize}
              </span>
            )}
          </div>
        )}
        </div>

      {/* ── Divider ──────────────────────────────────────── */}
        <div className="border-t border-navy-100" />

      {/* ── Footer: Price + Action buttons ───────────────── */}
        <div className="flex items-center justify-between gap-3 px-5 py-4">

        {/* Price */}
        <div className="flex items-baseline gap-1">
          {isFree ? (
            <span className="text-sm font-semibold text-green-700">Free</span>
          ) : (
            <>
              <span className="text-base font-semibold text-navy-900">
                {formatPrice(priceNum)}
              </span>
              <span className="text-xs text-navy-400">USD</span>
            </>
          )}
        </div>

        {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsQuickViewOpen(true)}
              className="rounded border border-navy-200 bg-white px-3 py-1.5 text-xs font-medium text-navy-600 transition-all duration-150 hover:border-navy-300 hover:bg-surface-50 active:bg-navy-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 focus-visible:ring-offset-1"
              title="Quick product view"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>

            {/* Subscription placeholder button */}
          <button
            type="button"
            onClick={handleSubscriptionClick}
            className="rounded border border-navy-200 bg-white px-3 py-1.5 text-xs font-medium text-navy-600 transition-all duration-150 hover:border-navy-300 hover:bg-surface-50 active:bg-navy-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 focus-visible:ring-offset-1"
            title="Subscription tiers coming soon"
          >
            Subscribe
          </button>

          {/* Buy Now */}
            <Link
              href={`/marketplace/${slug}#purchase`}
              className="inline-flex items-center gap-1.5 rounded border border-navy-900 bg-navy-900 px-3 py-1.5 text-xs font-medium text-white transition-all duration-150 hover:bg-navy-800 active:bg-navy-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 focus-visible:ring-offset-1"
            >
              <ShoppingCart className="h-3 w-3" />
              Buy Now
            </Link>
          </div>
        </div>

      </article>

      {isQuickViewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} quick view`}
        >
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setIsQuickViewOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-navy-600 shadow-sm transition hover:bg-white hover:text-navy-950"
              aria-label="Close quick view"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid gap-0 lg:grid-cols-2">
              <div className="relative min-h-[320px] bg-navy-100">
                {thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbnailUrl}
                    alt={`${title} preview`}
                    className="h-full min-h-[320px] w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[320px] items-center justify-center text-6xl opacity-25">
                    {CATEGORY_ICONS[category]}
                  </div>
                )}
              </div>

              <div className="flex flex-col p-7">
                <div className="flex flex-wrap gap-2">
                  {labels.map((label) => (
                    <span
                      key={label.label}
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${label.className}`}
                    >
                      {label.label}
                    </span>
                  ))}
                </div>

                <span className={`mt-5 inline-flex w-fit items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${categoryStyle}`}>
                  <span>{CATEGORY_ICONS[category]}</span>
                  {CATEGORY_LABELS[category]}
                </span>

                <h2 className="mt-4 text-2xl font-bold text-navy-900">{title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-navy-600">
                  {truncate(description, 260)}
                </p>

                <div className="mt-5">
                  <RatingSummary ratingAverage={ratingAverage} reviewCount={reviewCount} />
                </div>

                {(version || fileSize) && (
                  <div className="mt-5 flex flex-wrap gap-3 text-xs text-navy-500">
                    {version && <span className="rounded-full bg-navy-100 px-3 py-1">v{version}</span>}
                    {fileSize && <span className="rounded-full bg-navy-100 px-3 py-1">{fileSize}</span>}
                  </div>
                )}

                <div className="mt-auto pt-8">
                  <div className="mb-4 text-2xl font-bold text-navy-900">
                    {isFree ? <span className="text-green-700">Free</span> : formatPrice(priceNum)}
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link href={`/marketplace/${slug}`} className="btn-secondary flex-1 justify-center">
                      View details
                    </Link>
                    <Link href={`/marketplace/${slug}#purchase`} className="btn-primary flex-1 justify-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
