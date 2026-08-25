'use client'

// ============================================================
// components/marketing/HeroSection.tsx
//
// Asymmetrical hero: a 7/5 split on a 12-column grid, with the
// mockup breaking out past the right gutter so the composition
// reads off-centre rather than as two balanced halves.
//
// Ambience is a crisp radial wash plus film grain — the blurred
// spheres are gone. Blur-sphere backdrops are the single most
// recognisable tell of generated design, and both references
// (Prolibu, Nash) let the product mockup carry the section
// instead.
//
// The mockup is INTERACTIVE: hovering or focusing a pipeline row
// promotes it, and the summary figures recompute from that row.
// Values are derived from one PIPELINE constant, so the panel can
// never drift out of sync with itself — and it is labelled a
// preview so it is never read as live data.
//
// Every entrance uses ease [0.16, 1, 0.3, 1].
// ============================================================

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, TrendingUp } from 'lucide-react'
import { RevealText } from '@/components/motion/RevealText'
import { MagneticButton } from '@/components/motion/MagneticButton'

const EASE = [0.16, 1, 0.3, 1] as const

// One source of truth for the panel. Summary figures are computed
// from this, never hardcoded alongside it.
const PIPELINE = [
  { id: 'woo', label: 'WooCommerce plugin', stage: 'In build', pct: 72, days: 6 },
  { id: 'ext', label: 'Chrome extension', stage: 'In review', pct: 94, days: 2 },
  { id: 'n8n', label: 'n8n order sync', stage: 'Scoping', pct: 28, days: 14 },
  { id: 'dash', label: 'Analytics dashboard', stage: 'In build', pct: 55, days: 9 },
]

export function HeroSection() {
  const reduceMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const [activeId, setActiveId] = useState(PIPELINE[0].id)
  useEffect(() => setMounted(true), [])
  const animate = mounted && !reduceMotion

  const active = PIPELINE.find((p) => p.id === activeId) ?? PIPELINE[0]

  const rise = (delay: number) => ({
    initial: animate ? { opacity: 0, y: 28 } : false,
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: EASE, delay },
  })

  return (
    <section className="relative overflow-hidden bg-ink-950">
      {/* Crisp wash — no blurred spheres */}
      <div aria-hidden className="wash-top" />

      {/* Hairline grid, fading downward */}
      <div
        aria-hidden
        className="grid-backdrop pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
      />

      <div className="container-page relative z-10 pb-20 pt-14 sm:pb-28 sm:pt-20">
        {/* 7/5 asymmetry, with the panel breaking the right gutter */}
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-8">
          {/* ── Copy: 7 of 12 ─────────────────────────────── */}
          <div className="lg:col-span-7 lg:pr-8">
            <motion.div {...rise(0)} className="mb-9 flex items-center gap-3">
              <span className="h-px w-10 bg-white/60" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
                Enterprise technology
              </span>
            </motion.div>

            <h1 className="font-display text-[clamp(2.5rem,5.2vw,4.25rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-white">
              <RevealText text="Commerce software," delay={0.12} />
              <br />
              <RevealText
                text="engineered to last."
                delay={0.28}
                className="text-white/40"
              />
            </h1>

            <motion.p
              {...rise(0.52)}
              className="mt-8 max-w-md text-base leading-relaxed text-white/55 sm:text-lg"
            >
              Plugins, extensions, automation, and full-stack builds — scoped to
              a fixed price, documented on handover, supported after launch.
            </motion.p>

            <motion.div
              {...rise(0.64)}
              className="mt-11 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <MagneticButton href="/contact" variant="primary">
                Start a project
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticButton>
              <MagneticButton href="/marketplace" variant="glass">
                Browse marketplace
              </MagneticButton>
            </motion.div>
          </div>

          {/* ── Mockup: 5 of 12, breaking the gutter ──────── */}
          <motion.div
            initial={animate ? { opacity: 0, y: 40 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.34 }}
            className="lg:col-span-5 lg:-mr-6 xl:-mr-16"
          >
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900/60 backdrop-blur-sm">
              {/* Chrome */}
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
                <span className="font-mono text-[11px] tracking-tight text-white/35">
                  delivery pipeline
                </span>
                <span className="rounded border border-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
                  Preview
                </span>
              </div>

              {/* Summary — recomputed from the active row */}
              <div className="grid grid-cols-3 divide-x divide-white/10 border-b border-white/10">
                {[
                  { k: 'Stage', v: active.stage },
                  { k: 'Complete', v: `${active.pct}%` },
                  { k: 'Ships in', v: `${active.days}d` },
                ].map((cell) => (
                  <div key={cell.k} className="px-5 py-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
                      {cell.k}
                    </p>
                    <motion.p
                      key={`${cell.k}-${cell.v}`}
                      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="mt-1.5 font-display text-lg font-bold tabular-nums text-white"
                    >
                      {cell.v}
                    </motion.p>
                  </div>
                ))}
              </div>

              {/* Interactive rows */}
              <div className="divide-y divide-white/[0.06]">
                {PIPELINE.map((row, i) => {
                  const on = row.id === activeId
                  return (
                    <motion.button
                      key={row.id}
                      type="button"
                      onMouseEnter={() => setActiveId(row.id)}
                      onFocus={() => setActiveId(row.id)}
                      onClick={() => setActiveId(row.id)}
                      aria-pressed={on}
                      initial={animate ? { opacity: 0, x: 18 } : false}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, ease: EASE, delay: 0.5 + i * 0.08 }}
                      className={`group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/60 ${
                        on ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`h-8 w-px transition-colors duration-300 ${
                          on ? 'bg-white' : 'bg-white/15'
                        }`}
                      />

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-white/85">
                          {row.label}
                        </span>

                        {/* Progress track */}
                        <span className="mt-2 block h-px w-full bg-white/10">
                          <motion.span
                            className="block h-px bg-white"
                            initial={animate ? { width: 0 } : false}
                            animate={{ width: `${row.pct}%` }}
                            transition={{
                              duration: 0.9,
                              ease: EASE,
                              delay: 0.7 + i * 0.08,
                            }}
                          />
                        </span>
                      </span>

                      <span className="font-mono text-[11px] tabular-nums text-white/35">
                        {row.pct}%
                      </span>

                      <ArrowUpRight
                        className={`h-3.5 w-3.5 transition-all duration-300 ${
                          on
                            ? 'translate-x-0 text-white opacity-100'
                            : '-translate-x-1 text-white/30 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                        }`}
                      />
                    </motion.button>
                  )
                })}
              </div>

              <div className="flex items-center gap-2 border-t border-white/10 px-5 py-3.5">
                <TrendingUp className="h-3.5 w-3.5 text-white" />
                <span className="font-mono text-[11px] text-white/40">
                  4 active engagements
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
