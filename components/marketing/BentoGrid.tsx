'use client'

// ============================================================
// components/marketing/BentoGrid.tsx
// Responsive bento layout for the services grid.
//
// Direction reference: "Paradigm" by Phenomenon Studio — the
// hovered card takes a blue gradient fill and a glow while its
// neighbours stay flat, which is what makes the grid feel
// interactive rather than decorative.
//
// The bento spans are DATA, not decoration: the first card is
// the lead service and gets the wide cell. If the service list
// is reordered in /admin, the emphasis follows the order.
// ============================================================

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Box,
  Layers,
  Bot,
  Code2,
  Workflow,
  BarChart3,
  type LucideIcon,
} from 'lucide-react'

// Icons resolved here, keyed by string, so a Server Component
// can pass plain data across the boundary. Passing the component
// itself would arrive as a client reference and render undefined.
const ICONS: Record<string, LucideIcon> = {
  Box,
  Layers,
  Bot,
  Code2,
  Workflow,
  BarChart3,
}

export interface BentoItem {
  title: string
  description: string
  iconKey: string
  tags: string[]
}

const ease = [0.22, 1, 0.36, 1] as const

// ── Span planning ─────────────────────────────────────────────
// Hardcoded spans left an orphan: 6 items with one double-wide is
// 7 cells in a 3-column grid, so the last card sat alone on its
// own row. This computes spans so the final row is ALWAYS full,
// for any number of services — the list is admin-managed, so the
// count is not fixed.
//
// Widening is applied only at `lg` (3 columns). At `md` every card
// is 1×1, which fills cleanly for any even count and avoids a
// second, different orphan at that breakpoint.
const LG_COLS = 3

function planSpans(count: number): number[] {
  const spans = Array<number>(count).fill(1)
  if (count < 4) return spans // too few to be worth a bento rhythm

  // Cells needed to round the grid up to whole rows. Each widened
  // card contributes one extra cell. When the count already divides
  // evenly, widen a full row's worth so the layout still has rhythm
  // rather than collapsing to a uniform grid.
  const deficit = (LG_COLS - (count % LG_COLS)) % LG_COLS
  let wides = deficit === 0 ? LG_COLS : deficit
  if (wides > count) wides = deficit

  // Place each wide only where two columns actually remain in the
  // current row, so no card is ever split across a row boundary.
  let col = 0
  for (let i = 0; i < count && wides > 0; i++) {
    if (LG_COLS - col >= 2) {
      spans[i] = 2
      wides -= 1
      col = (col + 2) % LG_COLS
    } else {
      col = (col + 1) % LG_COLS
    }
  }
  return spans
}

export function BentoGrid({ items }: { items: BentoItem[] }) {
  const reduceMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const animate = mounted && !reduceMotion

  if (items.length === 0) return null

  const spans = planSpans(items.length)

  return (
    <motion.div
      initial={animate ? 'hidden' : false}
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((item, index) => {
        const Icon = ICONS[item.iconKey] ?? Code2
        const isWide = spans[index] === 2
        return (
          <motion.article
            key={item.title}
            variants={{
              hidden: { opacity: 0, y: 26 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, ease }}
            className={`group sweep-host card-dark-hover relative p-7 ${
              isWide ? 'lg:col-span-2 lg:flex lg:flex-col lg:justify-center' : ''
            }`}
          >
            {/* Gradient fill that reveals on hover */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-electric-500/[0.14] via-teal-400/[0.05] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />

            <div className={`relative ${isWide ? "lg:flex lg:items-center lg:gap-7" : ""}`}>
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-teal-300 transition-all duration-500 group-hover:border-teal-400/40 group-hover:bg-teal-400/15 group-hover:text-teal-200">
                <Icon className="h-5 w-5" />
              </span>

              <div className={isWide ? 'lg:min-w-0 lg:flex-1' : ''}>
              <h3 className={`text-lg font-bold tracking-tight text-white ${isWide ? 'lg:mt-0 mt-6' : 'mt-6'}`}>
                {item.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-white/60">
                {item.description}
              </p>

              {item.tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-white/40 transition-colors duration-500 group-hover:border-white/15 group-hover:text-white/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              </div>
            </div>
          </motion.article>
        )
      })}
    </motion.div>
  )
}
