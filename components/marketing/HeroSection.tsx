'use client'

// ============================================================
// components/marketing/HeroSection.tsx
//
// Composition:
//   - animated aurora (three drifting blurred blobs + fading grid)
//   - staggered word reveal on the headline
//   - magnetic CTAs with shine sweep
//   - floating glassmorphism widget with an animated chart
//
// The widget floats on a CSS keyframe rather than a JS loop, so
// it costs nothing on the main thread and stops dead under
// prefers-reduced-motion without extra branching.
//
// Its figures are illustrative and the chrome says "Preview", so
// they are never mistaken for live metrics.
// ============================================================

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Activity, Boxes, Rocket, ShieldCheck } from 'lucide-react'
import { RevealText } from '@/components/motion/RevealText'
import { MagneticButton } from '@/components/motion/MagneticButton'

const ease = [0.22, 1, 0.36, 1] as const

const WIDGET_ROWS = [
  { icon: Boxes, label: 'Active builds', value: '12' },
  { icon: Rocket, label: 'Deploys / wk', value: '38' },
  { icon: ShieldCheck, label: 'Uptime', value: '99.9%' },
]

const BARS = [34, 58, 42, 74, 52, 88, 66, 94]

export function HeroSection() {
  const reduceMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const animate = mounted && !reduceMotion

  const rise = (delay: number) => ({
    initial: animate ? { opacity: 0, y: 24 } : false,
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease, delay },
  })

  return (
    <section className="relative overflow-hidden bg-ink-950">
      {/* ── Ambient aurora ─────────────────────────────────── */}
      <div className="aurora">
        <div
          className="aurora-blob left-[8%] top-[-8%] h-[38rem] w-[38rem] bg-cyan-400/[0.22]"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="aurora-blob right-[2%] top-[6%] h-[34rem] w-[34rem] bg-indigo-500/[0.28]"
          style={{ animationDelay: '-6s' }}
        />
        <div
          className="aurora-blob bottom-[-14%] left-[32%] h-[36rem] w-[36rem] bg-indigo-500/[0.16]"
          style={{ animationDelay: '-11s' }}
        />
      </div>

      {/* Fine grid, fading out toward the bottom */}
      <div
        aria-hidden
        className="grid-backdrop pointer-events-none absolute inset-0 -z-10 opacity-[0.55] [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]"
      />

      <div className="container-page relative z-10 pb-20 pt-16 sm:pb-28 sm:pt-20">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          {/* ── Copy ─────────────────────────────────────── */}
          <div>
            <motion.div {...rise(0)} className="mb-8">
              <span className="chip chip-accent">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-70 motion-reduce:hidden" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
                </span>
                Enterprise technology solutions
              </span>
            </motion.div>

            <h1 className="display">
              <RevealText text="Custom commerce" delay={0.1} />
              <br />
              <RevealText
                text="software, engineered"
                delay={0.24}
                className="bg-gradient-to-r from-cyan-300 via-white to-indigo-300 bg-clip-text text-transparent"
              />
            </h1>

            <motion.p
              {...rise(0.5)}
              className="body-dark mt-7 max-w-lg sm:text-lg"
            >
              From strategy to execution — plugins, extensions, automation, and
              full-stack builds. Fixed price, documented, supported after launch.
            </motion.p>

            <motion.div
              {...rise(0.62)}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <MagneticButton href="/contact" variant="primary">
                Let&apos;s talk
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticButton>
              <MagneticButton href="/marketplace" variant="glass">
                Browse marketplace
              </MagneticButton>
            </motion.div>

            <motion.p {...rise(0.74)} className="mono-label mt-7 text-white/40">
              Free consultation · Fixed-price scoping · No obligation
            </motion.p>
          </div>

          {/* ── Floating glass widget ────────────────────── */}
          <motion.div
            initial={animate ? { opacity: 0, y: 40 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.34 }}
            className="relative"
          >
            <div className="animate-float motion-reduce:animate-none">
              <div className="glass relative overflow-hidden rounded-4xl p-2.5 shadow-glow-lg">
                <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-ink-990/80">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/25 blur-3xl"
                  />

                  {/* Chrome */}
                  <div className="relative flex items-center gap-2 border-b border-white/[0.07] px-5 py-3.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="mono-label ml-3 text-white/30">
                      delivery overview
                    </span>
                    <span className="chip ml-auto hidden sm:inline-flex">
                      Preview
                    </span>
                  </div>

                  <div className="relative space-y-5 p-5 sm:p-6">
                    {/* Chart */}
                    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
                      <div className="flex items-center justify-between">
                        <span className="mono-label text-white/40">
                          Throughput
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
                          <Activity className="h-3.5 w-3.5" />
                          +18%
                        </span>
                      </div>

                      <div className="mt-5 flex h-28 items-end gap-1.5 sm:gap-2">
                        {BARS.map((h, i) => (
                          <motion.div
                            key={i}
                            initial={animate ? { height: 0 } : false}
                            animate={{ height: `${h}%` }}
                            transition={{
                              duration: 0.8,
                              ease,
                              delay: 0.7 + i * 0.06,
                            }}
                            className="flex-1 rounded-t-md bg-gradient-to-t from-indigo-500/50 to-cyan-400/90"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Rows */}
                    <div className="grid gap-2.5 sm:grid-cols-3">
                      {WIDGET_ROWS.map((row, i) => {
                        const Icon = row.icon
                        return (
                          <motion.div
                            key={row.label}
                            initial={animate ? { opacity: 0, y: 12 } : false}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.5,
                              ease,
                              delay: 0.9 + i * 0.09,
                            }}
                            className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3.5"
                          >
                            <Icon className="h-4 w-4 text-cyan-300" />
                            <p className="mt-2.5 font-display text-lg font-bold tabular-nums text-white">
                              {row.value}
                            </p>
                            <p className="mono-label text-white/40">
                              {row.label}
                            </p>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
