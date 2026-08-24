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

// Cell spans by index. Index 0 is the lead service and takes the
// double-width cell on large viewports; everything else is 1×1.
function spanFor(index: number) {
  if (index === 0) return 'lg:col-span-2'
  if (index === 3) return 'md:col-span-2 lg:col-span-1'
  return ''
}

export function BentoGrid({ items }: { items: BentoItem[] }) {
  const reduceMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const animate = mounted && !reduceMotion

  if (items.length === 0) return null

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
        return (
          <motion.article
            key={item.title}
            variants={{
              hidden: { opacity: 0, y: 26 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, ease }}
            className={`group sweep-host card-dark-hover relative p-7 ${spanFor(index)}`}
          >
            {/* Gradient fill that reveals on hover */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-electric-500/[0.14] via-teal-400/[0.05] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />

            <div className="relative">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-teal-300 transition-all duration-500 group-hover:border-teal-400/40 group-hover:bg-teal-400/15 group-hover:text-teal-200">
                <Icon className="h-5 w-5" />
              </span>

              <h3 className="mt-6 text-lg font-bold tracking-tight text-white">
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
          </motion.article>
        )
      })}
    </motion.div>
  )
}
