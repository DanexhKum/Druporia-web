'use client'

// ============================================================
// components/marketing/TrustBar.tsx
// Scroll-triggered count-up statistics.
//
// Values are passed in from the server, counted from the
// database — see getTrustStats() in lib/site-data.ts. Nothing
// here invents a number.
// ============================================================

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { Boxes, Star, Users, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface TrustStat {
  icon: LucideIcon
  value: number
  /** Rendered after the number, e.g. "+" */
  suffix?: string
  /** Decimal places — ratings want 1, counts want 0. */
  decimals?: number
  label: string
}

const COUNT_DURATION_MS = 1400

function useCountUp(target: number, active: boolean, decimals: number) {
  const reduceMotion = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return

    // Respect the user's motion preference — show the final
    // figure immediately rather than animating to it.
    if (reduceMotion) {
      setValue(target)
      return
    }

    let frame = 0
    let start: number | null = null

    const step = (timestamp: number) => {
      if (start === null) start = timestamp
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / COUNT_DURATION_MS, 1)
      // easeOutExpo — fast to begin, settles gently on the value
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)

      setValue(target * eased)
      if (progress < 1) frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [active, target, reduceMotion])

  return value.toFixed(decimals)
}

function Stat({ stat, active }: { stat: TrustStat; active: boolean }) {
  const Icon = stat.icon
  const display = useCountUp(stat.value, active, stat.decimals ?? 0)

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold-500/30 bg-gold-500/10 text-gold-400">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-extrabold tabular-nums tracking-tight text-white sm:text-3xl">
          {display}
          {stat.suffix}
        </p>
        <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-navy-200">
          {stat.label}
        </p>
      </div>
    </div>
  )
}

export function TrustBar({ stats }: { stats: TrustStat[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  if (stats.length === 0) return null

  return (
    <section className="relative z-10 border-y border-navy-700 bg-navy-800">
      <div className="rule-gold" />
      <div
        ref={ref}
        className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <Stat key={stat.label} stat={stat} active={inView} />
        ))}
      </div>
      <div className="rule-gold" />
    </section>
  )
}

// Icons re-exported so the server component can build the stat
// list without importing lucide separately.
export const TRUST_ICONS = { Boxes, Star, Users, Zap }
