'use client'

// ============================================================
// components/marketing/LiveMetricsBento.tsx
// Three-card metrics bento.
//
// ── WHAT IS REAL HERE, AND WHAT IS NOT ──────────────────────
//
// LATENCY IS GENUINELY MEASURED. The card times a real HEAD
// request from the visitor's browser to this origin and reports
// the round trip, re-sampling every few seconds and keeping a
// rolling window. It is the only number on this page that the
// site can actually stand behind, so it is the only one framed
// as measured — the label says "your round trip", not an
// invented global edge figure.
//
// UPTIME IS A TARGET, NOT A READING. Nothing polls a health
// endpoint, so the card says "target" and carries the period it
// refers to. Printing a measured-looking 99.99% with no probe
// behind it becomes false the first time the site goes down.
//
// The theme card is a self-contained preview: it flips a local
// palette, not the site theme, so clicking it cannot strand a
// visitor in a half-applied light mode.
// ============================================================

import { useCallback, useEffect, useRef, useState } from 'react'
import { Activity, Gauge, Moon, Sun } from 'lucide-react'

const SAMPLE_MS = 4000
const WINDOW = 5

export function LiveMetricsBento() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <UptimeCard />
      <LatencyCard />
      <ThemePreviewCard />
    </div>
  )
}

/* ── 1. Uptime target ─────────────────────────────────────── */
function UptimeCard() {
  return (
    <div className="rounded-xl border border-white/10 bg-black/60 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
          Availability
        </span>
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
      </div>

      <p className="mt-6 font-display text-3xl font-bold tabular-nums text-white">
        99.99%
      </p>
      {/* "target", not a reading — nothing here probes uptime. */}
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
        Uptime target · monthly
      </p>

      <div className="mt-5 flex gap-1" aria-hidden>
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="h-6 flex-1 rounded-sm bg-emerald-400/25"
            style={{ opacity: 0.35 + (i / 24) * 0.5 }}
          />
        ))}
      </div>
      <p className="mt-2 font-mono text-[9px] text-white/25">last 24 periods</p>
    </div>
  )
}

/* ── 2. Measured round trip ───────────────────────────────── */
function LatencyCard() {
  const [samples, setSamples] = useState<number[]>([])
  const [failed, setFailed] = useState(false)
  const timer = useRef(0)

  const probe = useCallback(async () => {
    const t0 = performance.now()
    try {
      // Same-origin, cache-busted, body-less: as close to a bare
      // round trip as the browser will let us measure.
      await fetch(`/icon.svg?p=${Date.now()}`, {
        method: 'HEAD',
        cache: 'no-store',
      })
      const ms = performance.now() - t0
      setFailed(false)
      setSamples((s) => [...s, ms].slice(-WINDOW))
    } catch {
      setFailed(true)
    }
  }, [])

  useEffect(() => {
    probe()
    timer.current = window.setInterval(probe, SAMPLE_MS)
    return () => window.clearInterval(timer.current)
  }, [probe])

  const latest = samples.at(-1)
  const best = samples.length ? Math.min(...samples) : null

  return (
    <div className="rounded-xl border border-white/10 bg-black/60 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
          Latency
        </span>
        <Gauge className="h-3.5 w-3.5 text-white/40" />
      </div>

      <p className="mt-6 font-display text-3xl font-bold tabular-nums text-white">
        {failed ? '—' : latest !== undefined ? Math.round(latest) : '··'}
        <span className="ml-1 text-lg font-normal text-white/40">ms</span>
      </p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
        {failed ? 'probe unavailable' : 'your round trip · measured'}
      </p>

      {/* Rolling window */}
      <div className="mt-5 flex h-6 items-end gap-1.5" aria-hidden>
        {Array.from({ length: WINDOW }).map((_, i) => {
          const v = samples[i]
          const max = samples.length ? Math.max(...samples, 1) : 1
          return (
            <span
              key={i}
              className="flex-1 rounded-sm bg-white/25 transition-all duration-500"
              style={{ height: v ? `${Math.max(12, (v / max) * 100)}%` : '12%' }}
            />
          )
        })}
      </div>
      <p className="mt-2 font-mono text-[9px] text-white/25">
        {best !== null ? `best ${Math.round(best)}ms · ` : ''}sampling every 4s
      </p>
    </div>
  )
}

/* ── 3. Theme preview ─────────────────────────────────────── */
function ThemePreviewCard() {
  const [light, setLight] = useState(false)

  return (
    <div className="rounded-xl border border-white/10 bg-black/60 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
          Component
        </span>

        <button
          type="button"
          role="switch"
          aria-checked={light}
          aria-label="Preview light theme"
          onClick={() => setLight((v) => !v)}
          className="relative inline-flex h-6 w-11 items-center rounded-full border border-white/15 bg-white/[0.06] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <span
            className={`inline-flex h-4 w-4 items-center justify-center rounded-full bg-white transition-transform duration-300 ${
              light ? 'translate-x-6' : 'translate-x-1'
            }`}
          >
            {light ? (
              <Sun className="h-2.5 w-2.5 text-ink-950" />
            ) : (
              <Moon className="h-2.5 w-2.5 text-ink-950" />
            )}
          </span>
        </button>
      </div>

      {/* Self-contained preview — flips a LOCAL palette only. */}
      <div
        className={`mt-6 rounded-lg border p-4 transition-colors duration-500 ${
          light ? 'border-black/10 bg-white' : 'border-white/10 bg-ink-900'
        }`}
      >
        <div className="flex items-center gap-2">
          <Activity
            className={`h-3.5 w-3.5 ${light ? 'text-ink-950' : 'text-white/70'}`}
          />
          <span
            className={`text-xs font-semibold ${light ? 'text-ink-950' : 'text-white'}`}
          >
            Order sync
          </span>
        </div>
        <p
          className={`mt-2 text-[11px] leading-relaxed ${
            light ? 'text-zinc-600' : 'text-white/50'
          }`}
        >
          Every component ships in both themes.
        </p>
        <div
          className={`mt-3 h-1.5 w-full overflow-hidden rounded-full ${
            light ? 'bg-black/10' : 'bg-white/10'
          }`}
        >
          <span
            className={`block h-full w-2/3 rounded-full ${
              light ? 'bg-ink-950' : 'bg-white/70'
            }`}
          />
        </div>
      </div>

      <p className="mt-3 font-mono text-[9px] text-white/25">
        preview only · does not change the site theme
      </p>
    </div>
  )
}
