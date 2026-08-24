'use client'

// ============================================================
// components/marketing/HeroSection.tsx
// Dark centred hero with a teal bloom.
//
// Direction reference: "Hexacore — IT Consulting" by Nija Design
// (dribbble.com/worksbynija). Borrowed: the dark ground with a
// teal glow rising from the fold, light-weight display type at
// large scale, monospace UI chrome, pill geometry, and a
// desaturated client logo wall. Not a copy — the type scale,
// copy, and composition are ours.
//
// Emphasis here comes from SCALE and the glow, not weight. The
// headline is font-light on purpose; bolding it collapses the
// whole effect.
// ============================================================

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

// Platforms Druporia actually builds on. Rendered as wordmarks
// rather than logo files — we have no licensed client marks, and
// inventing a "trusted by" wall of brands we don't work with
// would be a straightforward lie.
const PLATFORMS = [
  'WooCommerce',
  'Shopify',
  'Next.js',
  'PostgreSQL',
  'n8n',
  'OpenAI',
]

const ease = [0.22, 1, 0.36, 1] as const

export function HeroSection() {
  const reduceMotion = useReducedMotion()

  const rise = (delay: number) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease, delay },
  })

  return (
    <section className="dark-shell">
      {/* The bloom. Behind everything, never clickable. */}
      <div aria-hidden className="glow-teal" />

      <div className="container-page relative z-10 pb-24 pt-16 sm:pb-32 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            {...rise(0)}
            className="mono-label mb-8 text-teal-300/80"
          >
            [ Enterprise technology solutions ]
          </motion.p>

          <motion.h1 {...rise(0.08)} className="display">
            Transform your commerce
            <br />
            <span className="display-muted">with future-ready technology</span>
          </motion.h1>

          <motion.p
            {...rise(0.18)}
            className="mx-auto mt-7 max-w-xl text-base font-light leading-relaxed text-white/55 sm:text-lg"
          >
            From strategy to execution — plugins, extensions, automation, and
            full-stack builds for teams that run on their software.
          </motion.p>

          <motion.div
            {...rise(0.26)}
            className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link href="/contact" className="btn-pill-ghost">
              Book a Call
            </Link>
            <Link href="/marketplace" className="btn-pill-solid group">
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>

        {/* ── Platform wall ─────────────────────────────────── */}
        <motion.div {...rise(0.4)} className="mt-24 sm:mt-32">
          <p className="mono-label text-center text-white/35">
            Built on the platforms your business runs on
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 sm:gap-x-14">
            {PLATFORMS.map((name) => (
              <span
                key={name}
                className="text-sm font-medium tracking-tight text-white/40 transition-colors duration-300 hover:text-white/75"
              >
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
