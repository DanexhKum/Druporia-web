'use client'

// ============================================================
// components/marketing/HeroSection.tsx
// 55/45 split hero.
//
// The right panel is a designed composition of the three product
// categories rather than stock photography — there is no image
// library for this brand, and an invented photo would say less
// than the actual catalogue does.
// ============================================================

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Boxes, Chrome, ShoppingCart, Sparkles } from 'lucide-react'

const CAPABILITIES = [
  {
    icon: ShoppingCart,
    title: 'WooCommerce plugins',
    detail: 'Checkout, inventory, and pricing logic that survives updates.',
  },
  {
    icon: Chrome,
    title: 'Chrome extensions',
    detail: 'Browser-native tools your team actually opens every day.',
  },
  {
    icon: Boxes,
    title: 'Full-stack apps',
    detail: 'Next.js and PostgreSQL builds, deployed and documented.',
  },
]

const ease = [0.22, 1, 0.36, 1] as const

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Ambient wash — navy top-left, a whisper of gold bottom-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 premium-surface"
      />

      <div className="container-page relative py-20 sm:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[55fr_45fr] lg:gap-16">
          {/* ── Left: the pitch ───────────────────────────── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-gold-300 bg-gold-50 px-3.5 py-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-gold-700" />
              <span className="eyebrow">Enterprise technology solutions</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.08 }}
              className="mt-7 text-4xl font-extrabold leading-[1.08] tracking-tight text-navy-900 sm:text-5xl lg:text-6xl"
            >
              Commerce technology,{' '}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10">built to last</span>
                {/* Gold underline drawn in after the headline lands */}
                <motion.span
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, ease, delay: 0.5 }}
                  className="absolute bottom-1 left-0 z-0 h-3 w-full origin-left rounded-sm bg-gold-500/35"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.16 }}
              className="mt-6 max-w-xl text-lg font-light leading-relaxed text-navy-600"
            >
              Druporia builds the plugins, extensions, and automation that
              commerce teams run their operations on — scoped to a fixed price,
              shipped with documentation, and supported after launch.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.24 }}
              className="mt-10 flex flex-col gap-3 sm:flex-row"
            >
              <Link href="/contact" className="btn-primary gap-2 px-7 py-3.5 text-base">
                Book a discovery call
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/marketplace"
                className="btn-secondary px-7 py-3.5 text-base"
              >
                Browse the marketplace
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.34 }}
              className="mt-6 text-sm font-light text-navy-500"
            >
              Free consultation · Fixed-price scoping · No obligation
            </motion.p>
          </div>

          {/* ── Right: capability panel ───────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.2 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-3xl bg-navy-900 p-7 shadow-navy sm:p-9">
              {/* Fine grid, the way a blueprint reads */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.18]"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(201,165,90,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(201,165,90,0.35) 1px, transparent 1px)',
                  backgroundSize: '38px 38px',
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold-500/10 blur-3xl"
              />

              <div className="relative">
                <p className="eyebrow-on-navy">What we build</p>

                <div className="mt-6 space-y-3">
                  {CAPABILITIES.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          ease,
                          delay: 0.4 + index * 0.11,
                        }}
                        className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm transition-colors duration-300 hover:border-gold-500/40 hover:bg-white/[0.1]"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500/15 text-gold-400 transition-colors duration-300 group-hover:bg-gold-500 group-hover:text-navy-900">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs font-light leading-relaxed text-navy-200">
                            {item.detail}
                          </p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
