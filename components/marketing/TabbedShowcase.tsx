'use client'

// ============================================================
// components/marketing/TabbedShowcase.tsx
// Tabbed capability showcase with a shared layout indicator.
//
// The active pill is a single element animated between tabs with
// Framer Motion's layoutId, so it slides rather than cross-fading
// — one element moving reads as one control, which is the point.
//
// Keyboard: arrow keys move between tabs, Home/End jump to the
// ends, matching the WAI-ARIA tabs pattern. Panels are wired with
// role/aria-controls so the relationship is announced.
// ============================================================

import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Check,
  ShoppingCart,
  Chrome,
  Workflow,
  BarChart3,
  type LucideIcon,
} from 'lucide-react'

interface Tab {
  id: string
  label: string
  icon: LucideIcon
  headline: string
  body: string
  points: string[]
}

const TABS: Tab[] = [
  {
    id: 'commerce',
    label: 'Commerce',
    icon: ShoppingCart,
    headline: 'Plugins that survive the next update',
    body: 'WooCommerce, Shopify, and Magento extensions built against the platform’s own APIs rather than patched around them.',
    points: [
      'Checkout, pricing, and inventory logic',
      'Upgrade-safe, hook-driven architecture',
      'Handover docs written for your team',
    ],
  },
  {
    id: 'extensions',
    label: 'Extensions',
    icon: Chrome,
    headline: 'Browser tools people actually open',
    body: 'Chrome and Chromium extensions for the internal workflow that currently lives in a spreadsheet.',
    points: [
      'Manifest V3 from the start',
      'Scoped permissions, reviewed before submission',
      'Store listing and rollout handled',
    ],
  },
  {
    id: 'automation',
    label: 'Automation',
    icon: Workflow,
    headline: 'The manual step, removed',
    body: 'n8n workflows and integrations connecting the systems your operation already runs on.',
    points: [
      'Order, CRM, and fulfilment sync',
      'Failure alerts that reach a human',
      'Auditable runs, not a black box',
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    headline: 'Dashboards teams trust',
    body: 'A clean data model first, then the reporting — so the numbers agree with each other.',
    points: [
      'Revenue, cohort, and channel reporting',
      'One definition per metric',
      'Built on your warehouse, not a silo',
    ],
  },
]

const ease = [0.16, 1, 0.3, 1] as const

export function TabbedShowcase() {
  const [active, setActive] = useState(0)
  const reduceMotion = useReducedMotion()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  function onKeyDown(e: React.KeyboardEvent) {
    let next = active
    if (e.key === 'ArrowRight') next = (active + 1) % TABS.length
    else if (e.key === 'ArrowLeft') next = (active - 1 + TABS.length) % TABS.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = TABS.length - 1
    else return

    e.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  const tab = TABS[active]

  return (
    <section id="capabilities" className="relative bg-ink-950 py-16 sm:py-24">
      <div className="container-page">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="chip">02 · Capabilities</p>
          <h2 className="heading-dark mt-5">What we build, in detail</h2>
        </div>

        {/* ── Tab list ─────────────────────────────────────── */}
        <div
          role="tablist"
          aria-label="Capabilities"
          onKeyDown={onKeyDown}
          className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2"
        >
          {TABS.map((t, i) => {
            const Icon = t.icon
            const selected = i === active
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={selected}
                aria-controls={`panel-${t.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                className="relative rounded-xl px-4 py-2.5 font-mono text-[13px] tracking-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
              >
                {selected && (
                  <motion.span
                    layoutId="tab-pill"
                    aria-hidden
                    className="absolute inset-0 rounded-xl border border-cyan-400/40 bg-cyan-400/10"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 380, damping: 32 }
                    }
                  />
                )}
                <span
                  className={`relative z-10 inline-flex items-center gap-2 ${
                    selected ? 'text-white' : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* ── Panel ────────────────────────────────────────── */}
        <div className="mx-auto mt-10 max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab.id}
              role="tabpanel"
              id={`panel-${tab.id}`}
              aria-labelledby={`tab-${tab.id}`}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease }}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900/60 p-8 sm:p-10"
            >
              {/* Crisp corner wash, not a blurred sphere */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_100%_0%,rgba(99,102,241,0.10),transparent_65%)]"
              />

              <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
                <div>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-white">
                    {tab.headline}
                  </h3>
                  <p className="body-dark mt-4">{tab.body}</p>
                </div>

                <ul className="space-y-3">
                  {tab.points.map((point, i) => (
                    <motion.li
                      key={point}
                      initial={reduceMotion ? false : { opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, ease, delay: 0.08 + i * 0.08 }}
                      className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                      <span className="text-sm text-white/70">{point}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
