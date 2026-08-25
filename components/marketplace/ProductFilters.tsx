'use client'

// ============================================================
// components/marketplace/ProductFilters.tsx
// Glassmorphic filter bar.
//
// The active pill is ONE element moved between tabs with Framer
// Motion's layoutId, so it slides rather than cross-fading — one
// element travelling reads as one control.
//
// Filter state lives in the URL, not component state, so a
// filtered view is shareable, survives refresh, and the back
// button works. updateParams tests for KEY PRESENCE rather than
// value, because passing `undefined` means "clear this" and a
// nullish fallback would silently restore the old value.
// ============================================================

import { useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'APP', label: 'Apps' },
  { key: 'WOO_PLUGIN', label: 'WooCommerce' },
  { key: 'CHROME_EXTENSION', label: 'Extensions' },
]

const PRICE_FILTERS = [
  { key: 'all', label: 'Any price' },
  { key: 'free', label: 'Free' },
  { key: 'paid', label: 'Paid' },
  { key: 'under-50', label: 'Under $50' },
]

const SORT_OPTIONS = [
  { key: 'featured', label: 'Featured' },
  { key: 'newest', label: 'Newest' },
  { key: 'price-low', label: 'Price ↑' },
  { key: 'price-high', label: 'Price ↓' },
]

interface Props {
  activeCategory: string
  counts: Record<string, number>
  query?: string
  price?: string
  sort?: string
}

export function ProductFilters({
  activeCategory,
  counts,
  query,
  price = 'all',
  sort = 'featured',
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams()

      // Key presence, not value — `undefined` means "clear".
      const pick = (key: string, current: string | undefined) =>
        key in updates ? updates[key] : current

      const nextCategory = pick('category', activeCategory)
      const nextQuery = pick('q', query)
      const nextPrice = pick('price', price)
      const nextSort = pick('sort', sort)

      if (nextCategory && nextCategory !== 'all') params.set('category', nextCategory)
      if (nextQuery) params.set('q', nextQuery)
      if (nextPrice && nextPrice !== 'all') params.set('price', nextPrice)
      if (nextSort && nextSort !== 'featured') params.set('sort', nextSort)

      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [activeCategory, pathname, price, query, router, sort]
  )

  const pillTransition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 380, damping: 32 }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* ── Category tabs ────────────────────────────────── */}
      <div
        role="tablist"
        aria-label="Product category"
        className="flex flex-wrap items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-md"
      >
        {CATEGORIES.map((cat) => {
          const on = activeCategory === cat.key
          const count = counts[cat.key] ?? 0
          return (
            <button
              key={cat.key}
              role="tab"
              aria-selected={on}
              type="button"
              onClick={() => updateParams({ category: cat.key })}
              className="relative rounded-lg px-3.5 py-2 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              {on && (
                <motion.span
                  layoutId="category-pill"
                  aria-hidden
                  className="absolute inset-0 rounded-lg border border-white/15 bg-white/10"
                  transition={pillTransition}
                />
              )}
              <span
                className={cn(
                  'relative z-10 inline-flex items-center gap-2 whitespace-nowrap',
                  on ? 'text-white' : 'text-white/50 hover:text-white/80'
                )}
              >
                {cat.label}
                <span className="font-mono text-[10px] tabular-nums text-white/30">
                  {count}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Price + sort ─────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-md">
          {PRICE_FILTERS.map((option) => {
            const on = price === option.key
            return (
              <button
                key={option.key}
                type="button"
                aria-pressed={on}
                onClick={() => updateParams({ price: option.key })}
                className="relative rounded-lg px-3 py-1.5 text-xs transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                {on && (
                  <motion.span
                    layoutId="price-pill"
                    aria-hidden
                    className="absolute inset-0 rounded-lg border border-white/15 bg-white/10"
                    transition={pillTransition}
                  />
                )}
                <span
                  className={cn(
                    'relative z-10 whitespace-nowrap',
                    on ? 'text-white' : 'text-white/45 hover:text-white/75'
                  )}
                >
                  {option.label}
                </span>
              </button>
            )
          })}
        </div>

        <label className="sr-only" htmlFor="marketplace-sort">
          Sort products
        </label>
        <select
          id="marketplace-sort"
          value={sort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 backdrop-blur-md focus:border-white/30 focus:outline-none focus:ring-0"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.key} value={option.key} className="bg-ink-900">
              {option.label}
            </option>
          ))}
        </select>

        {query && (
          <button
            type="button"
            onClick={() => updateParams({ q: undefined })}
            className="rounded-xl border border-white/10 px-3 py-2 font-mono text-[11px] text-white/50 transition-colors hover:border-white/25 hover:text-white"
          >
            Clear “{query}” ✕
          </button>
        )}
      </div>
    </div>
  )
}
