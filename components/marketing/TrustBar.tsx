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

// Icons live HERE, keyed by a plain string, because the server
// component that builds the stat list cannot hand a React
// component across the boundary — anything imported from a
// 'use client' module arrives there as a client reference, not
// the real value, so `SOME_ICONS.Boxes` would be undefined and
// React would throw "Element type is invalid".
// Only serializable data may cross. Hence: a string key.
const ICONS = {
  products: Boxes,
  rating: Star,
  reviews: Users,
  tech: Zap,
} as const

export type TrustIconKey = keyof typeof ICONS

export interface TrustStat {
  iconKey: TrustIconKey
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

  // Seed with the REAL value, not 0. This is what the server
  // renders and what a crawler or a JS-blocked visitor sees —
  // starting at 0 meant the page advertised "0 products shipped"
  // until an IntersectionObserver happened to fire.
  const [value, setValue] = useState(target)

  // Only drop to 0 to animate up, and only once we know we are
  // on the client with motion allowed.
  const [canAnimate, setCanAnimate] = useState(false)
  useEffect(() => setCanAnimate(true), [])

  useEffect(() => {
    if (!canAnimate || reduceMotion) return
    if (!active) {
      setValue(0)
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
  }, [active, target, reduceMotion, canAnimate])

  return value.toFixed(decimals)
}

function Stat({ stat, active }: { stat: TrustStat; active: boolean }) {
  const Icon = ICONS[stat.iconKey]
  const display = useCountUp(stat.value, active, stat.decimals ?? 0)

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white/80">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-3xl font-light tabular-nums tracking-tight text-white sm:text-4xl">
          {display}
          {stat.suffix}
        </p>
        <p className="mono-label mt-1 text-white/40">{stat.label}</p>
      </div>
    </div>
  )
}

export function TrustBar({ stats }: { stats: TrustStat[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  if (stats.length === 0) return null

  return (
    <section className="relative z-10 border-y border-white/[0.06] bg-ink-900">
      <div className="rule-teal" />
      <div
        ref={ref}
        className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <Stat key={stat.label} stat={stat} active={inView} />
        ))}
      </div>
      <div className="rule-teal" />
    </section>
  )
}
