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
  { key: 'all', label: 'All Products', icon: '🛍️' },
  { key: 'APP', label: 'Apps', icon: '📱' },
  { key: 'WOO_PLUGIN', label: 'WooCommerce Plugins', icon: '🛒' },
  { key: 'CHROME_EXTENSION', label: 'Chrome Extensions', icon: '🧩' },
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
  { key: 'price-low', label: 'Price low-high' },
  { key: 'price-high', label: 'Price high-low' },
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
    <div className="space-y-6">
      {/* Search */}
      <form onSubmit={handleSearch}>
        <label className="form-label">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search products…"
            className="pl-9 pr-8"
          />
          {searchValue && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </form>

      {/* Category filters */}
      <div>
        <p className="form-label">Category</p>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key
            const count = counts[cat.key] ?? 0
            return (
              <li key={cat.key}>
                <button
                  type="button"
                  onClick={() =>
                    updateParams({
                      category: cat.key,
                    })
                  }
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition-colors duration-150',
                    isActive
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">{cat.icon}</span>
                    {cat.label}
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 text-xs',
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-500'
                    )}
                  >
                    {count}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Price filters */}
      <div>
        <p className="form-label">Price</p>
        <div className="flex flex-wrap gap-2 lg:flex-col">
          {PRICE_FILTERS.map((option) => {
            const isActive = price === option.key
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => updateParams({ price: option.key })}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                  isActive
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Sorting */}
      <div>
        <label className="form-label" htmlFor="marketplace-sort">
          Sort by
        </label>
        <select
          id="marketplace-sort"
          value={sort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="text-sm"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
