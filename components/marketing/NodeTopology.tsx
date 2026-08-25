'use client'

// ============================================================
// components/marketing/NodeTopology.tsx
// Horizontal delivery topology: Source → Build → Deployment.
//
// The connectors are SVG paths. Two things ride them:
//   - a draw-in via stroke-dashoffset, triggered on scroll-in
//   - packet dots moving along the SAME path with <animateMotion>
//     + <mpath>, so a dot is guaranteed to follow the connector
//     exactly rather than being keyframed alongside it. Change
//     the path and the packets follow with no other edits.
//
// SMIL rather than a JS loop: the browser drives it off the main
// thread and it costs nothing to idle. For reduced motion the
// <animateMotion> elements are simply not rendered — the paths
// still draw, the packets just do not move.
//
// vectorEffect="non-scaling-stroke" keeps the connectors 1px
// under the non-uniform viewBox scaling.
// ============================================================

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { GitBranch, Globe, Hammer } from 'lucide-react'

const NODES = [
  {
    id: 'source',
    icon: GitBranch,
    label: 'Source code',
    meta: 'git push',
    detail: 'Commit lands on main',
  },
  {
    id: 'build',
    icon: Hammer,
    label: 'Build engine',
    meta: 'typecheck · test · bundle',
    detail: 'Fails loudly, never silently',
  },
  {
    id: 'deploy',
    icon: Globe,
    label: 'Global deployment',
    meta: '3 regions',
    detail: 'Atomic, instantly reversible',
  },
]

// Two connectors between three nodes. Coordinates are in the
// 0..100 viewBox; the slight curve stops the run reading flat.
const PATHS = [
  { id: 'p1', d: 'M 2 50 C 22 50, 28 50, 48 50' },
  { id: 'p2', d: 'M 52 50 C 72 50, 78 50, 98 50' },
]

const PACKETS = [0, 1.1, 2.2]

export function NodeTopology() {
  const ref = useRef<HTMLDivElement>(null)
  const [drawn, setDrawn] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduceMotion) {
      setDrawn(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDrawn(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduceMotion])

  return (
    <div ref={ref} className="relative">
      {/* ── Connectors (desktop only) ───────────────────── */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-24 w-full -translate-y-1/2 md:block"
      >
        {PATHS.map((p) => (
          <path
            key={p.id}
            id={p.id}
            d={p.d}
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity="0.22"
            strokeWidth="1"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={drawn ? 0 : 1}
            vectorEffect="non-scaling-stroke"
            style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1)' }}
          />
        ))}

        {/* Packets ride the same paths via <mpath>. */}
        {!reduceMotion &&
          drawn &&
          PATHS.map((p) =>
            PACKETS.map((delay) => (
              <circle key={`${p.id}-${delay}`} r="1.4" fill="#FFFFFF">
                <animateMotion
                  dur="3.2s"
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                  rotate="auto"
                >
                  <mpath href={`#${p.id}`} />
                </animateMotion>
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.12;0.85;1"
                  dur="3.2s"
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))
          )}
      </svg>

      {/* ── Nodes ───────────────────────────────────────── */}
      <ol className="relative grid gap-4 md:grid-cols-3 md:gap-8">
        {NODES.map((node, i) => {
          const Icon = node.icon
          return (
            <li
              key={node.id}
              className="rounded-xl border border-white/10 bg-black/60 p-5 backdrop-blur-md transition-colors duration-500 hover:border-white/25"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] text-white/70">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="font-mono text-[10px] tabular-nums text-white/25">
                  0{i + 1}
                </span>
              </div>

              <p className="mt-5 font-display text-base font-bold tracking-tight text-white">
                {node.label}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">
                {node.meta}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {node.detail}
              </p>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
