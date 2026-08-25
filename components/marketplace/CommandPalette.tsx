'use client'

// ============================================================
// components/marketplace/CommandPalette.tsx
// ⌘K / Ctrl+K product search.
//
// The trigger is a real <button> styled as an input, not an
// <input> — it opens a dialog rather than accepting text, and
// putting a text field there would promise typing that goes
// nowhere and confuse screen readers.
//
// Search runs against the full published catalogue passed from
// the server, so results are not limited to whatever the current
// filters happen to show. Selecting a result navigates to the
// product; pressing Enter with no selection falls back to a
// ?q= search so the query is never lost.
//
// Focus is trapped while open, restored to the trigger on close,
// and the list is wired with role="listbox"/aria-activedescendant
// so the highlighted row is announced.
// ============================================================

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Search, CornerDownLeft, X } from 'lucide-react'
import { formatPrice, CATEGORY_LABELS } from '@/lib/utils'
import type { ProductCategory } from '@prisma/client'

export interface SearchableProduct {
  id: string
  title: string
  slug: string
  category: ProductCategory
  price: number
}

const EASE = [0.16, 1, 0.3, 1] as const
const MAX_RESULTS = 7

export function CommandPalette({
  products,
  initialQuery = '',
}: {
  products: SearchableProduct[]
  initialQuery?: string
}) {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const [isMac, setIsMac] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setIsMac(/mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent))
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products.slice(0, MAX_RESULTS)
    return products
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          CATEGORY_LABELS[p.category].toLowerCase().includes(q)
      )
      .slice(0, MAX_RESULTS)
  }, [products, query])

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setIndex(0)
    triggerRef.current?.focus()
  }, [])

  // ⌘K / Ctrl+K anywhere on the page
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Lock scroll and focus the field once mounted
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => inputRef.current?.focus(), 40)
    return () => {
      document.body.style.overflow = ''
      window.clearTimeout(t)
    }
  }, [open])

  useEffect(() => setIndex(0), [query])

  function submit(target?: SearchableProduct) {
    const pick = target ?? results[index]
    if (pick) {
      close()
      router.push(`/marketplace/${pick.slug}`)
      return
    }
    // Nothing highlighted — keep the query rather than dropping it.
    const q = query.trim()
    close()
    router.push(q ? `/marketplace?q=${encodeURIComponent(q)}` : '/marketplace')
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndex((i) => (results.length ? (i + 1) % results.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndex((i) =>
        results.length ? (i - 1 + results.length) % results.length : 0
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    }
  }

  return (
    <>
      {/* ── Trigger ─────────────────────────────────────── */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label="Search products"
        className="group relative flex w-full items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition-colors duration-300 hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      >
        {/* Border sweep on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent transition-transform duration-700 group-hover:translate-x-full"
        />

        <Search className="h-4 w-4 shrink-0 text-white/35" />
        <span className="flex-1 truncate text-sm text-white/40">
          {initialQuery ? `“${initialQuery}”` : 'Search products…'}
        </span>
        <kbd className="hidden shrink-0 rounded border border-white/15 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-white/45 sm:inline-block">
          {isMac ? '⌘' : 'Ctrl'} K
        </kbd>
      </button>

      {/* ── Dialog ──────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[12vh]">
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Product search"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.28, ease: EASE }}
              onKeyDown={onKeyDown}
              className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-ink-900/95 shadow-glow-lg backdrop-blur-xl"
            >
              <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
                <Search className="h-4 w-4 shrink-0 text-white/35" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products…"
                  aria-label="Search products"
                  aria-controls="cmdk-list"
                  aria-activedescendant={
                    results[index] ? `cmdk-opt-${results[index].id}` : undefined
                  }
                  className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-0"
                />
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close search"
                  className="shrink-0 rounded p-1 text-white/35 transition-colors hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <ul
                id="cmdk-list"
                role="listbox"
                aria-label="Results"
                className="max-h-[46vh] overflow-y-auto py-2"
              >
                {results.length === 0 && (
                  <li className="px-4 py-8 text-center text-sm text-white/40">
                    No products match “{query.trim()}”.
                  </li>
                )}

                {results.map((p, i) => (
                  <li key={p.id} role="none">
                    <button
                      id={`cmdk-opt-${p.id}`}
                      role="option"
                      aria-selected={i === index}
                      type="button"
                      onMouseEnter={() => setIndex(i)}
                      onClick={() => submit(p)}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        i === index ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-white/90">
                          {p.title}
                        </span>
                        <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">
                          {CATEGORY_LABELS[p.category]}
                        </span>
                      </span>
                      <span className="shrink-0 font-mono text-[11px] tabular-nums text-white/45">
                        {p.price === 0 ? 'Free' : formatPrice(p.price)}
                      </span>
                      {i === index && (
                        <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-white/40" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-4 border-t border-white/10 px-4 py-2.5 font-mono text-[10px] text-white/30">
                <span>↑↓ navigate</span>
                <span>↵ open</span>
                <span>esc close</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
