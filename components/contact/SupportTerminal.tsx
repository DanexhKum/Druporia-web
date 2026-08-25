'use client'

// ============================================================
// components/contact/SupportTerminal.tsx
// Terminal-style support widget for the contact page's left rail.
//
// The transcript replays on scroll-in, one line at a time, then
// stops. It is a scripted illustration of what an engagement
// looks like — NOT a live shell and not a chat you can type into.
// The prompt is inert and labelled, because a blinking cursor
// that ignores keystrokes is a worse lie than no cursor at all.
//
// Runs on one interval that clears itself at the end, and does
// not start until the element is on screen.
// ============================================================

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Globe, MapPin } from 'lucide-react'

type Line = { kind: 'in' | 'out' | 'note'; text: string }

const TRANSCRIPT: Line[] = [
  { kind: 'in', text: 'druporia scope --new' },
  { kind: 'out', text: 'What workflow is costing you time?' },
  { kind: 'in', text: 'Manual order sync between Shopify and our ERP' },
  { kind: 'out', text: 'Understood. Mapping integration points…' },
  { kind: 'note', text: 'scope drafted · fixed price · 2 week estimate' },
  { kind: 'out', text: 'Written scope sent. No commitment until you approve.' },
]

// Coverage rows. The clocks are genuinely live — computed in the
// visitor's browser from the IANA zone, ticking every second — so
// nothing here is a static string pretending to be real-time.
const ZONES = [
  { city: 'Karachi', zone: 'Asia/Karachi' },
  { city: 'London', zone: 'Europe/London' },
  { city: 'New York', zone: 'America/New_York' },
]

const STEP_MS = 620

// One interval for every clock. Rendering on the client only —
// a server-rendered time is stale the instant it is sent, and
// would hydrate-mismatch against the browser's own zone.
function useClock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

export function SupportTerminal() {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [shown, setShown] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (reduceMotion) {
      setShown(TRANSCRIPT.length)
      return
    }

    let timer = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        timer = window.setInterval(() => {
          setShown((n) => {
            if (n >= TRANSCRIPT.length) {
              window.clearInterval(timer)
              return n
            }
            return n + 1
          })
        }, STEP_MS)
      },
      { threshold: 0.3 }
    )

    io.observe(el)
    return () => {
      io.disconnect()
      window.clearInterval(timer)
    }
  }, [reduceMotion])

  const done = shown >= TRANSCRIPT.length
  const now = useClock()

  return (
    <div ref={ref} className="flex flex-col gap-5">
      {/* ── Terminal ─────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="ml-2 font-mono text-[11px] text-white/35">
              scoping session
            </span>
          </div>
          <span className="rounded border border-white/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/30">
            Example
          </span>
        </div>

        <div className="min-h-[16rem] space-y-3 p-5 font-mono text-[12px] leading-relaxed">
          {TRANSCRIPT.slice(0, shown).map((line, i) => (
            <p
              key={i}
              className={
                line.kind === 'in'
                  ? 'text-white'
                  : line.kind === 'note'
                    ? 'text-white/35'
                    : 'text-white/60'
              }
            >
              {line.kind === 'in' && <span className="text-white/30">$ </span>}
              {line.kind === 'note' && <span className="text-white/25">— </span>}
              {line.text}
            </p>
          ))}

          {/* Inert prompt — labelled so it never reads as a chat */}
          {done && (
            <p className="flex items-center gap-2 pt-1 text-white/30">
              <span>$</span>
              <span className="inline-block h-3.5 w-[7px] animate-pulse bg-white/40 motion-reduce:animate-none" />
              <span className="text-[11px]">
                use the form to start a real one
              </span>
            </p>
          )}
        </div>
      </div>

      {/* ── Live coverage ────────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-ink-900">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <span className="flex items-center gap-2 font-mono text-[11px] text-white/45">
            <Globe className="h-3.5 w-3.5" />
            coverage
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Online
          </span>
        </div>

        <ul className="divide-y divide-white/[0.06]">
          {ZONES.map((z) => (
            <li
              key={z.zone}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <span className="flex items-center gap-2.5 text-sm text-zinc-400">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-white/30" />
                {z.city}
              </span>
              <span
                className="font-mono text-[12px] tabular-nums text-white"
                suppressHydrationWarning
              >
                {now
                  ? new Intl.DateTimeFormat('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      timeZone: z.zone,
                      hour12: false,
                    }).format(now)
                  : '--:--:--'}
              </span>
            </li>
          ))}
        </ul>

        <p className="border-t border-white/10 px-4 py-2.5 font-mono text-[9px] text-white/25">
          local time in your browser · remote-first team
        </p>
      </div>
    </div>
  )
}
