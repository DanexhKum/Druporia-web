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

interface Props {
  activeCategory: string
  counts: Record<string, number>
  query?: string
}

export function ProductFilters({ activeCategory, counts, query }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [searchValue, setSearchValue] = useState(query ?? '')

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams()
      if (updates.category && updates.category !== 'all') {
        params.set('category', updates.category)
      }
      if (updates.q) {
        params.set('q', updates.q)
      }
      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname)
    },
    [router, pathname]
  )

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    updateParams({
      category: activeCategory !== 'all' ? activeCategory : undefined,
      q: searchValue.trim() || undefined,
    })
  }

  function clearSearch() {
    setSearchValue('')
    updateParams({
      category: activeCategory !== 'all' ? activeCategory : undefined,
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
        <ul className="space-y-0.5">
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
                      q: searchValue.trim() || undefined,
                    })
                  }
                  className={cn(
                    'flex w-full items-center justify-between rounded px-3 py-2 text-left text-xs font-medium transition-colors duration-150',
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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
    </div>
  )
}
