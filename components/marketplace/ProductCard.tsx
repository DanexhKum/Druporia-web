'use client'

// ============================================================
// components/marketplace/ProductCard.tsx
// 3D tilt card with a JSON manifest preview.
//
// The JSON is BUILT FROM THE PRODUCT'S OWN FIELDS — id, version,
// price, category, file size — not invented sample data. It is a
// real manifest of the record you are looking at, so it can never
// disagree with the card around it.
//
// perspective sits on the wrapper, not the tilting element; on
// the element itself the rotation flattens into a skew.
//
// The status badge reflects actual state: price 0 -> Free,
// isFeatured -> Featured, otherwise the version. Nothing here
// claims availability or stock that the schema does not track.
// ============================================================

import { useRef } from 'react'
import Link from 'next/link'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { ArrowUpRight, Download, Tag } from 'lucide-react'
import { formatPrice, CATEGORY_LABELS, truncate } from '@/lib/utils'
import type { ProductCategory } from '@prisma/client'

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
}

const TILT = 6

export function ProductCard({
  id,
  title,
  slug,
  description,
  price,
  category,
  version,
  fileSize,
  isFeatured,
}: ProductCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 240, damping: 22, mass: 0.5 })
  const sy = useSpring(py, { stiffness: 240, damping: 22, mass: 0.5 })
  const rotateX = useTransform(sy, [-0.5, 0.5], [TILT, -TILT])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-TILT, TILT])
  const glowX = useTransform(px, [-0.5, 0.5], ['0%', '100%'])
  const glowY = useTransform(py, [-0.5, 0.5], ['0%', '100%'])
  const glow = useTransform(
    [glowX, glowY],
    ([gx, gy]) =>
      `radial-gradient(320px circle at ${gx} ${gy}, rgba(255,255,255,0.07), transparent 68%)`
  )

  const amount = typeof price === 'string' ? parseFloat(price) : price
  const isFree = amount === 0

  function onMove(e: React.PointerEvent) {
    if (reduceMotion || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }

  function onLeave() {
    px.set(0)
    py.set(0)
  }

  // Manifest derived from the record itself — never sample data.
  const manifest: [string, string][] = [
    ['id', `"${id.slice(0, 8)}…"`],
    ['type', `"${category.toLowerCase()}"`],
    ['version', `"${version ?? '1.0.0'}"`],
    ['price', isFree ? '0' : String(amount)],
    ...(fileSize ? ([['size', `"${fileSize}"`]] as [string, string][]) : []),
  ]

  const badge = isFree
    ? { label: 'Free', tone: 'border-white/25 bg-white/10 text-white' }
    : isFeatured
      ? { label: 'Featured', tone: 'border-white/20 bg-white/[0.06] text-white/80' }
      : { label: `v${version ?? '1.0.0'}`, tone: 'border-white/10 bg-white/[0.03] text-white/50' }

  return (
    <div className="h-full [perspective:1000px]">
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={reduceMotion ? undefined : { rotateX, rotateY }}
        className="group relative h-full transform-gpu [transform-style:preserve-3d] will-change-transform"
      >
        <Link
          href={`/marketplace/${slug}`}
          className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-900 transition-colors duration-500 hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          {/* Pointer-tracking spotlight */}
          <motion.span
            aria-hidden
            style={reduceMotion ? undefined : { background: glow }}
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />

          {/* ── JSON manifest preview ─────────────────── */}
          <div className="relative border-b border-white/10 bg-ink-990/60 px-4 py-3.5">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="font-mono text-[10px] text-white/30">
                manifest.json
              </span>
              <span
                className={`rounded border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] ${badge.tone}`}
              >
                {badge.label}
              </span>
            </div>

            <pre className="overflow-hidden font-mono text-[10px] leading-[1.75]">
              <code>
                <span className="text-white/25">{'{'}</span>
                {manifest.map(([k, v]) => (
                  <span key={k} className="block whitespace-pre">
                    <span className="text-white/25">{'  "'}</span>
                    <span className="text-white/60">{k}</span>
                    <span className="text-white/25">{'": '}</span>
                    <span className="text-white/85">{v}</span>
                    <span className="text-white/25">,</span>
                  </span>
                ))}
                <span className="text-white/25">{'}'}</span>
              </code>
            </pre>
          </div>

          {/* ── Body ──────────────────────────────────── */}
          <div className="relative flex flex-1 flex-col p-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">
              {CATEGORY_LABELS[category]}
            </span>

            <h3 className="mt-2.5 font-display text-base font-bold tracking-tight text-white">
              {title}
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-white/50">
              {truncate(description.replace(/[#*_`>]/g, ''), 96)}
            </p>

            <div className="mt-auto flex items-center justify-between gap-3 pt-5">
              <span className="inline-flex items-baseline gap-1.5">
                <span className="font-display text-lg font-bold tabular-nums text-white">
                  {isFree ? 'Free' : formatPrice(amount)}
                </span>
                {!isFree && (
                  <span className="font-mono text-[10px] text-white/30">USD</span>
                )}
              </span>

              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-white/45 transition-colors duration-300 group-hover:text-white">
                {isFree ? (
                  <>
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </>
                ) : (
                  <>
                    View
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </>
                )}
              </span>
            </div>

            {fileSize && (
              <p className="mt-3 flex items-center gap-1.5 border-t border-white/[0.06] pt-3 font-mono text-[10px] text-white/25">
                <Tag className="h-3 w-3" />
                {fileSize}
              </p>
            )}
          </div>
        </Link>
      </motion.div>
    </div>
  )
}
