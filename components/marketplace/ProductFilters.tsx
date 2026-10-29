// ============================================================
// components/marketplace/ProductFilters.tsx
// Sidebar category filters — client component for URL params.
// ============================================================

'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProductCategory } from '@prisma/client'

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'APP', label: 'Apps' },
  { key: 'WOO_PLUGIN', label: 'WooCommerce plugins' },
  { key: 'CHROME_EXTENSION', label: 'Chrome extensions' },
]

const PRICE_FILTERS = [
  { key: 'all', label: 'All prices' },
  { key: 'free', label: 'Free' },
  { key: 'paid', label: 'Paid' },
  { key: 'under-50', label: 'Under $50' },
  { key: 'under-100', label: 'Under $100' },
]

const SORT_OPTIONS = [
  { key: 'featured', label: 'Featured first' },
  { key: 'newest', label: 'Newest first' },
  { key: 'price-low', label: 'Price: low to high' },
  { key: 'price-high', label: 'Price: high to low' },
]

const chip = (active: boolean) =>
  cn(
    'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors',
    active
      ? 'border-orange bg-orange-tint text-orange-deep'
      : 'border-line-chip bg-canvas text-nav hover:bg-surface'
  )

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
  const [searchValue, setSearchValue] = useState(query ?? '')

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams()
      const nextCategory = updates.category ?? activeCategory
      const nextQuery = updates.q ?? query
      const nextPrice = updates.price ?? price
      const nextSort = updates.sort ?? sort

      if (nextCategory && nextCategory !== 'all') {
        params.set('category', nextCategory)
      }
      if (nextQuery) {
        params.set('q', nextQuery)
      }
      if (nextPrice && nextPrice !== 'all') {
        params.set('price', nextPrice)
      }
      if (nextSort && nextSort !== 'featured') {
        params.set('sort', nextSort)
      }
      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname)
    },
    [activeCategory, pathname, price, query, router, sort]
  )

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    updateParams({
      q: searchValue.trim() || undefined,
    })
  }

  function clearSearch() {
    setSearchValue('')
    updateParams({
      q: undefined,
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 desk:flex-row desk:items-end desk:justify-between">
        <form onSubmit={handleSearch} role="search" className="w-full desk:max-w-sm">
          <label htmlFor="marketplace-search" className="form-label">Search</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-soft" aria-hidden="true" />
            <input
              id="marketplace-search"
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search products"
              className="!rounded-full !py-3 !pl-10 !pr-10"
            />
            {searchValue && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-soft hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>

        <div className="w-full tab:max-w-[240px]">
          <label className="form-label" htmlFor="marketplace-sort">
            Sort by
          </label>
          <select
            id="marketplace-sort"
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="!rounded-full !py-3"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3 desk:flex-row desk:items-center desk:justify-between">
        <div role="group" aria-label="Category" className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key
            return (
              <button
                key={cat.key}
                type="button"
                aria-pressed={isActive}
                onClick={() => updateParams({ category: cat.key })}
                className={chip(isActive)}
              >
                {cat.label}
                <span className="text-[13px] opacity-70">{counts[cat.key] ?? 0}</span>
              </button>
            )
          })}
        </div>
        <div role="group" aria-label="Price" className="flex flex-wrap gap-2">
          {PRICE_FILTERS.map((option) => (
            <button
              key={option.key}
              type="button"
              aria-pressed={price === option.key}
              onClick={() => updateParams({ price: option.key })}
              className={chip(price === option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
