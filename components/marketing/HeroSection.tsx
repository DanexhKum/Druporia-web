'use client'

// ============================================================
// components/marketing/HeroSection.tsx
//
// Direction reference: "Paradigm — Tech Consulting Landing Page"
// by Phenomenon Studio. Borrowed: near-black ground with a deep
// blue bloom, a large hairline-bordered frame around the hero
// copy, bold high-contrast display type, and a rounded-rect CTA
// with an under-glow. Composition and copy are ours.
//
// The dashboard preview is drawn in DOM, not an image: it stays
// crisp at any density, themes with the tokens, and costs no
// extra network request.
// ============================================================

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Activity, Boxes, Download, TrendingUp } from 'lucide-react'

const PLATFORMS = [
  'WooCommerce',
  'Shopify',
  'Next.js',
  'PostgreSQL',
  'n8n',
  'OpenAI',
]

const ease = [0.22, 1, 0.36, 1] as const

// Illustrative figures for the preview card. Labelled as a
// product preview in the UI so it is never read as live data.
const PANEL_METRICS = [
  { icon: Boxes, label: 'Active builds', value: '12' },
  { icon: Download, label: 'Deploys / wk', value: '38' },
  { icon: TrendingUp, label: 'Uptime', value: '99.9%' },
]

const BARS = [38, 62, 45, 78, 56, 91, 70]

export function HeroSection() {
  const reduceMotion = useReducedMotion()

  // Animate only after mount, so the server-rendered hero is
  // fully visible rather than shipping at opacity:0.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const animate = mounted && !reduceMotion

  const rise = (delay: number) => ({
    initial: animate ? { opacity: 0, y: 26 } : false,
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.75, ease, delay },
  })

  return (
    <section className="dark-shell">
      <div aria-hidden className="glow-teal" />
      <div aria-hidden className="glow-top" />

      <div className="container-page relative z-10 pb-16 pt-12 sm:pb-24 sm:pt-16">
        {/* ── Framed hero copy ──────────────────────────────── */}
        <div className="relative mx-auto max-w-5xl">
          {/* The hairline frame from the reference */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-6 -inset-y-10 rounded-5xl border border-white/[0.07] sm:-inset-x-12 sm:-inset-y-14"
          />

          <div className="relative text-center">
            <motion.div {...rise(0)} className="mb-8 flex justify-center">
              <span className="chip chip-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                Enterprise technology solutions
              </span>
            </motion.div>

            <motion.h1 {...rise(0.08)} className="display">
              Custom commerce software
              <br />
              <span className="display-muted">built to scale with you</span>
            </motion.h1>

            <motion.p
              {...rise(0.16)}
              className="body-dark mx-auto mt-7 max-w-xl sm:text-lg"
            >
              From strategy to execution — plugins, extensions, automation, and
              full-stack builds, delivered at a fixed price and supported after
              launch.
            </motion.p>

            <motion.div
              {...rise(0.24)}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link href="/contact" className="btn-dark-primary group w-full sm:w-auto">
                Let&apos;s talk
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link href="/marketplace" className="btn-dark-ghost w-full sm:w-auto">
                Browse marketplace
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ── Dashboard preview ─────────────────────────────── */}
        <motion.div
          {...rise(0.34)}
          className="relative mx-auto mt-20 max-w-5xl sm:mt-24"
        >
          <div className="sweep-host card-dark overflow-hidden rounded-4xl p-2 sm:p-3">
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-ink-990">
              <div aria-hidden className="absolute inset-0 grid-backdrop opacity-40" />
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-electric-500/20 blur-3xl"
              />

              {/* Window chrome */}
              <div className="relative flex items-center gap-2 border-b border-white/[0.07] px-5 py-3.5">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="mono-label ml-3 text-white/40">
                  druporia — delivery overview
                </span>
                <span className="chip ml-auto hidden sm:inline-flex">
                  Product preview
                </span>
              </div>

              <div className="relative grid gap-5 p-5 sm:grid-cols-3 sm:p-7">
                {/* Metrics */}
                <div className="flex flex-col gap-3">
                  {PANEL_METRICS.map((m, i) => {
                    const Icon = m.icon
                    return (
                      <motion.div
                        key={m.label}
                        initial={animate ? { opacity: 0, x: -14 } : false}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease, delay: 0.45 + i * 0.1 }}
                        className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3.5"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-lg font-bold tabular-nums text-white">
                            {m.value}
                          </span>
                          <span className="mono-label block text-white/45">
                            {m.label}
                          </span>
                        </span>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Chart */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="mono-label text-white/40">
                      Throughput
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-300">
                      <Activity className="h-3.5 w-3.5" />
                      +18%
                    </span>
                  </div>

                  <div className="mt-6 flex h-32 items-end gap-2 sm:gap-3">
                    {BARS.map((h, i) => (
                      <motion.div
                        key={i}
                        initial={animate ? { height: 0 } : false}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.7,
                          ease,
                          delay: 0.55 + i * 0.07,
                        }}
                        className="flex-1 rounded-t-md bg-gradient-to-t from-electric-600/40 to-teal-400/80"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Floating platform pills ───────────────────────── */}
        <motion.div {...rise(0.5)} className="mt-16 sm:mt-20">
          <p className="mono-label text-center text-white/40">
            Built on the platforms your business runs on
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {PLATFORMS.map((name) => (
              <span key={name} className="tech-pill">
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
