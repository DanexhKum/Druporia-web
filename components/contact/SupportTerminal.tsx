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
import { Clock, ShieldCheck, Zap } from 'lucide-react'

type Line = { kind: 'in' | 'out' | 'note'; text: string }

const TRANSCRIPT: Line[] = [
  { kind: 'in', text: 'druporia scope --new' },
  { kind: 'out', text: 'What workflow is costing you time?' },
  { kind: 'in', text: 'Manual order sync between Shopify and our ERP' },
  { kind: 'out', text: 'Understood. Mapping integration points…' },
  { kind: 'note', text: 'scope drafted · fixed price · 2 week estimate' },
  { kind: 'out', text: 'Written scope sent. No commitment until you approve.' },
]

// Claims we can actually stand behind. The site already tells
// people "within 24 hours" on the contact form, so anything
// faster stated here would contradict it.
const BADGES = [
  { icon: Clock, label: 'Reply within 24h', sub: 'stated policy' },
  { icon: ShieldCheck, label: 'Fixed-price scoping', sub: 'before any code' },
  { icon: Zap, label: 'Post-launch support', sub: 'included in scope' },
]

const STEP_MS = 620

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

      {/* ── Trust badges ─────────────────────────────────── */}
      <div className="grid gap-2.5 sm:grid-cols-3">
        {BADGES.map((badge) => {
          const Icon = badge.icon
          return (
            <div
              key={badge.label}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
            >
              <Icon className="h-4 w-4 text-white/60" />
              <p className="mt-3 text-sm font-semibold text-white">
                {badge.label}
              </p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">
                {badge.sub}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
