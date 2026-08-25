'use client'

// ============================================================
// components/marketing/ApiPlayground.tsx
// Interactive API console — routes left, response right.
//
// These are EXAMPLE responses, not a live API. The console is
// labelled "example" in its own chrome and the status line says
// so, because a widget that looks like a terminal invites people
// to believe it is one. Nothing here performs a network request.
//
// The reveal is a character-count animation over a pre-formatted
// string, driven by one rAF loop that cancels on route change and
// on unmount. Re-rendering JSON.stringify per frame would be far
// more work for an identical result.
//
// Reduced motion prints the response immediately.
// ============================================================

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Terminal, Zap } from 'lucide-react'

interface Route {
  method: 'POST' | 'GET'
  path: string
  summary: string
  status: number
  ms: number
  body: unknown
}

const ROUTES: Route[] = [
  {
    method: 'POST',
    path: '/v1/deploy',
    summary: 'Ship a build to production',
    status: 201,
    ms: 412,
    body: {
      id: 'dpl_8Fq2xK',
      state: 'READY',
      target: 'production',
      commit: 'a3f19c2',
      regions: ['iad1', 'fra1', 'sin1'],
      durationMs: 41200,
    },
  },
  {
    method: 'GET',
    path: '/v1/metrics',
    summary: 'Read delivery metrics',
    status: 200,
    ms: 38,
    body: {
      window: '24h',
      requests: 184203,
      p50Ms: 41,
      p99Ms: 212,
      errorRate: 0.0004,
      cacheHitRate: 0.93,
    },
  },
  {
    method: 'GET',
    path: '/v1/products',
    summary: 'List marketplace products',
    status: 200,
    ms: 54,
    body: {
      total: 2,
      items: [
        { slug: 'woocommerce-tawk-integrator', price: 35, version: '1.0.0' },
        { slug: 'chrome-scraper', price: 0, version: '1.2.1' },
      ],
    },
  },
]

const CHARS_PER_FRAME = 4

// Monochrome "syntax": weight and alpha, never hue.
function renderJson(text: string) {
  return text.split('\n').map((line, i) => {
    const m = line.match(/^(\s*)("[^"]+"):\s*(.*)$/)
    if (!m) {
      return (
        <span key={i} className="block whitespace-pre text-white/30">
          {line}
        </span>
      )
    }
    const [, indent, key, rest] = m
    return (
      <span key={i} className="block whitespace-pre">
        {indent}
        <span className="text-white/55">{key}</span>
        <span className="text-white/25">: </span>
        <span className="text-white/90">{rest}</span>
      </span>
    )
  })
}

export function ApiPlayground() {
  const [active, setActive] = useState(0)
  const [shown, setShown] = useState(0)
  const rafRef = useRef(0)
  const reduceMotion = useReducedMotion()

  const route = ROUTES[active]
  const full = JSON.stringify(route.body, null, 2)

  useEffect(() => {
    cancelAnimationFrame(rafRef.current)

    if (reduceMotion) {
      setShown(full.length)
      return
    }

    setShown(0)
    let n = 0
    const step = () => {
      n = Math.min(full.length, n + CHARS_PER_FRAME)
      setShown(n)
      if (n < full.length) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)

    return () => cancelAnimationFrame(rafRef.current)
  }, [full, reduceMotion])

  const typing = shown < full.length

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/60 backdrop-blur-md">
      {/* Chrome */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <span className="flex items-center gap-2 font-mono text-[11px] text-white/45">
          <Terminal className="h-3.5 w-3.5" />
          api console
        </span>
        <span className="rounded border border-white/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/30">
          Example
        </span>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,17rem)_1fr]">
        {/* ── Routes ─────────────────────────────────────── */}
        <div
          role="tablist"
          aria-label="API routes"
          aria-orientation="vertical"
          className="divide-y divide-white/[0.06] border-b border-white/10 lg:border-b-0 lg:border-r"
        >
          {ROUTES.map((r, i) => {
            const on = i === active
            return (
              <button
                key={r.path}
                role="tab"
                aria-selected={on}
                type="button"
                onClick={() => setActive(i)}
                className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/40 ${
                  on ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                }`}
              >
                <span
                  className={`mt-0.5 shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px] font-semibold ${
                    r.method === 'POST'
                      ? 'border-white/25 bg-white/10 text-white'
                      : 'border-white/10 text-white/50'
                  }`}
                >
                  {r.method}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-mono text-[12px] text-white/85">
                    {r.path}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-white/35">
                    {r.summary}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        {/* ── Response ───────────────────────────────────── */}
        <div className="min-w-0">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">
              response
            </span>
            <span className="flex items-center gap-3 font-mono text-[10px] text-white/40">
              <span className="inline-flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    route.status < 300 ? 'bg-emerald-400' : 'bg-white/40'
                  }`}
                />
                {route.status}
              </span>
              <span className="inline-flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {route.ms}ms
              </span>
            </span>
          </div>

          <pre
            aria-live="polite"
            aria-busy={typing}
            className="max-h-[15rem] overflow-auto px-4 py-4 font-mono text-[11px] leading-[1.85]"
          >
            <code>
              {renderJson(full.slice(0, shown))}
              {typing && (
                <span
                  aria-hidden
                  className="ml-0.5 inline-block h-3 w-[6px] bg-white/60 align-middle"
                />
              )}
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}
