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
import { TiltCard } from '@/components/motion/TiltCard'
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

const ease = [0.16, 1, 0.3, 1] as const

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
            className={`h-full ${isWide ? 'lg:col-span-2' : ''}`}
          >
            {/* Uniform internal structure on EVERY card, wide or
                narrow. Wide cards previously laid icon and text side
                by side while narrow ones stacked them, so headings
                and chips landed at different heights across a row.
                justify-between + mt-auto pins the chips to the
                bottom edge regardless of the copy above them. */}
            <TiltCard className="group sweep-host card-dark-hover relative flex h-full flex-col justify-between p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.07] via-white/[0.05] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />

              {/* Top block */}
              <div className="relative">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/80 transition-all duration-500 group-hover:border-white/40 group-hover:bg-white/15 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>

                <h3 className="mt-6 text-lg font-bold leading-snug tracking-tight text-white">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">
                  {item.description}
                </p>
              </div>

              {/* Bottom block — pinned by mt-auto */}
              {item.tags.length > 0 && (
                <div className="relative mt-auto flex flex-wrap gap-2 pt-8">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-zinc-500 transition-colors duration-500 group-hover:border-white/15 group-hover:text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </TiltCard>
          </motion.article>
        )
      })}
    </motion.div>
  )
}
