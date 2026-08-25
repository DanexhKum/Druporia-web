'use client'

// ============================================================
// components/marketing/ScrollBuildSection.tsx
// 3D software pipeline — pinned scroll-to-build.
//
// Three stages scrubbed to scroll progress:
//   0.00–0.33  01. Raw code & syntax
//              Three IDE cards float in 3D; their syntax lines
//              draw in left-to-right via clip-path.
//   0.33–0.66  02. Architecture & languages
//              Cards recede; an SVG graph assembles — runtime,
//              API and database nodes joined by vector edges
//              that draw via stroke-dashoffset.
//   0.66–1.00  03. Complete product assembly
//              The graph folds away and a perspective dashboard
//              resolves, then unpins.
//
// ── Why it is built this way ────────────────────────────────
//
// THREE LAYERS, ONE STACK. Each stage is an absolutely positioned
// layer in the same cell. The timeline cross-fades and transforms
// between them, so nothing reflows during the scrub — reflow
// mid-pin is what makes these sections judder.
//
// MOBILE RENDERS ALL THREE STACKED, STATICALLY. Below lg the
// layers drop out of absolute positioning, stay at opacity 1 with
// no transforms, and the pin never initialises. gsap.matchMedia()
// reverts everything when the breakpoint is crossed.
//
// SYNTAX COLOUR IS WEIGHT AND ALPHA, NOT HUE. The theme is
// monochrome; keywords are heavier and brighter, punctuation
// recedes. No highlighter library ships for three snippets.
//
// The dashboard figures come from one STATS constant and are
// labelled a preview, never presented as live telemetry.
// ============================================================

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Boxes, Database, Server, Workflow } from 'lucide-react'

const STAGES = [
  {
    n: '01',
    title: 'Raw code & syntax',
    body: 'It starts as source — components, handlers, queries. Reviewed line by line before anything is wired together.',
  },
  {
    n: '02',
    title: 'Architecture & languages',
    body: 'Modules resolve into a system: runtimes, API surfaces, and data stores, with the contracts between them made explicit.',
  },
  {
    n: '03',
    title: 'Complete product assembly',
    body: 'The pieces fold into a running product — deployed, instrumented, and documented for the team that inherits it.',
  },
]

const SNIPPETS = [
  {
    lang: 'tsx',
    file: 'ProductCard.tsx',
    lines: [
      [['export', 'kw'], [' function ', 'p'], ['ProductCard', 'fn'], ['() {', 'p']],
      [['  const', 'kw'], [' { data } = ', 'p'], ['useProduct', 'fn'], ['()', 'p']],
      [['  return', 'kw'], [' <', 'p'], ['article', 'tag'], [' />', 'p']],
      [['}', 'p']],
    ],
  },
  {
    lang: 'ts',
    file: 'orders.route.ts',
    lines: [
      [['router', 'fn'], ['.', 'p'], ['post', 'kw'], ["('/orders', ", 'str'], ['async', 'kw'], [' (req) => {', 'p']],
      [['  const', 'kw'], [' order = ', 'p'], ['await', 'kw'], [' db.', 'p'], ['insert', 'fn'], ['(body)', 'p']],
      [['  return', 'kw'], [' order', 'p']],
      [['})', 'p']],
    ],
  },
  {
    lang: 'py',
    file: 'sync_worker.py',
    lines: [
      [['def', 'kw'], [' ', 'p'], ['sync_orders', 'fn'], ['(since):', 'p']],
      [['    rows = ', 'p'], ['fetch', 'fn'], ['(since)', 'p']],
      [['    return', 'kw'], [' ', 'p'], ['upsert', 'fn'], ['(rows)', 'p']],
    ],
  },
]

const TONE: Record<string, string> = {
  kw: 'text-white font-semibold',
  fn: 'text-white/85',
  str: 'text-white/55',
  tag: 'text-white/70',
  p: 'text-white/35',
}

const NODES = [
  { id: 'runtime', icon: Server, label: 'Runtime', meta: 'Node · Python', x: 18, y: 26 },
  { id: 'api', icon: Workflow, label: 'API', meta: 'REST · webhooks', x: 50, y: 13 },
  { id: 'db', icon: Database, label: 'Database', meta: 'PostgreSQL', x: 82, y: 34 },
  { id: 'app', icon: Boxes, label: 'Client', meta: 'Next.js', x: 50, y: 76 },
]

const EDGES = [
  ['runtime', 'api'],
  ['api', 'db'],
  ['runtime', 'app'],
  ['api', 'app'],
  ['db', 'app'],
] as const

const STATS = [
  { k: 'Modules', v: '24' },
  { k: 'Checks', v: '128' },
  { k: 'Coverage', v: '94%' },
  { k: 'Deploys', v: '38' },
]

const BARS = [38, 55, 44, 70, 58, 82, 66, 91, 74, 88]

function nodeById(id: string) {
  return NODES.find((n) => n.id === id)!
}

export function ScrollBuildSection() {
  const rootRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const s1Ref = useRef<HTMLDivElement>(null)
  const s2Ref = useRef<HTMLDivElement>(null)
  const s3Ref = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const root = rootRef.current
    const pin = pinRef.current
    const s1 = s1Ref.current
    const s2 = s2Ref.current
    const s3 = s3Ref.current
    if (!root || !pin || !s1 || !s2 || !s3) return

    gsap.registerPlugin(ScrollTrigger)
    const mm = gsap.matchMedia()

    mm.add(
      '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      () => {
        const cards = gsap.utils.toArray<HTMLElement>(s1.querySelectorAll('[data-code]'))
        const codeLines = gsap.utils.toArray<HTMLElement>(s1.querySelectorAll('[data-line]'))
        const edges = gsap.utils.toArray<SVGPathElement>(s2.querySelectorAll('[data-edge]'))
        const nodes = gsap.utils.toArray<HTMLElement>(s2.querySelectorAll('[data-node]'))
        const tiles = gsap.utils.toArray<HTMLElement>(s3.querySelectorAll('[data-tile]'))

        gsap.set([s2, s3], { opacity: 0, pointerEvents: 'none' })
        gsap.set(s1, { opacity: 1 })
        gsap.set(edges, { strokeDasharray: 1, strokeDashoffset: 1 })
        gsap.set(codeLines, { clipPath: 'inset(0 100% 0 0)' })

        let last = -1

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: '+=340%',
            pin,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (barRef.current) {
                barRef.current.style.transform = `scaleY(${self.progress})`
              }
              const next = Math.min(2, Math.floor(self.progress * 3))
              if (next !== last) {
                last = next
                setStage(next)
              }
            },
          },
        })

        // ── 01: cards float in, syntax draws ───────────────
        tl.fromTo(
          cards,
          {
            opacity: 0,
            y: 60,
            rotateX: 24,
            rotateY: (i: number) => (i - 1) * 14,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 8,
            rotateY: (i: number) => (i - 1) * 7,
            scale: 1,
            duration: 0.85,
            stagger: 0.12,
            ease: 'power3.out',
          },
          0
        )
        tl.to(
          codeLines,
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.5,
            stagger: 0.035,
            ease: 'none',
          },
          0.4
        )

        // ── 02: cards recede, graph assembles ──────────────
        tl.to(s1, { opacity: 0, scale: 0.92, duration: 0.5 }, 1)
        tl.to(s2, { opacity: 1, duration: 0.5 }, 1.15)
        tl.fromTo(
          nodes,
          { opacity: 0, scale: 0.7 },
          { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)' },
          1.25
        )
        tl.to(
          edges,
          { strokeDashoffset: 0, duration: 0.6, stagger: 0.09, ease: 'none' },
          1.5
        )

        // ── 03: fold into the product ──────────────────────
        tl.to(s2, { opacity: 0, scale: 0.94, duration: 0.5 }, 2)
        tl.to(s3, { opacity: 1, duration: 0.5 }, 2.15)
        tl.fromTo(
          s3,
          { rotateX: 18, y: 50, scale: 0.92 },
          { rotateX: 0, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
          2.15
        )
        tl.fromTo(
          tiles,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' },
          2.4
        )

        return () => {
          tl.scrollTrigger?.kill()
          tl.kill()
        }
      }
    )

    mm.add('(max-width: 1023px), (prefers-reduced-motion: reduce)', () => {
      setStage(0)
    })

    return () => mm.revert()
  }, [])

  const active = STAGES[stage] ?? STAGES[0]

  return (
    <section
      ref={rootRef}
      id="how-we-build"
      className="relative overflow-x-clip border-t border-white/10 bg-ink-950"
    >
      <div ref={pinRef} className="relative">
        <div className="container-page py-24 sm:py-32 lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:py-0">
          <div className="mb-10 flex items-center gap-3 lg:mb-12">
            <span className="h-px w-10 bg-white/40" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
              03 · Pipeline
            </span>
          </div>

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            {/* ── Rail + stage copy ──────────────────────── */}
            <div className="lg:col-span-4">
              <div className="flex gap-6">
                <div className="relative hidden w-px shrink-0 bg-white/10 lg:block">
                  <span
                    ref={barRef}
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-full origin-top bg-white"
                    style={{ transform: 'scaleY(0)' }}
                  />
                </div>

                <ol className="min-w-0 flex-1 space-y-6">
                  {STAGES.map((s, i) => {
                    const on = i === stage
                    return (
                      <li key={s.n} className="flex items-start gap-4">
                        <span
                          className={`mt-1 font-mono text-[11px] tabular-nums transition-colors duration-500 ${
                            on ? 'text-white' : 'text-white/25'
                          }`}
                        >
                          {s.n}
                        </span>
                        <div className="min-w-0">
                          <p
                            className={`font-display text-xl font-bold tracking-tight transition-colors duration-500 ${
                              on ? 'title-fill' : 'text-white/30'
                            }`}
                          >
                            {s.title}
                          </p>
                          <p
                            className={`mt-2 text-sm leading-relaxed text-white/55 transition-opacity duration-500 ${
                              on ? 'lg:opacity-100' : 'lg:opacity-0'
                            }`}
                          >
                            {s.body}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </div>

              <div aria-hidden className="mt-8 flex gap-1.5 lg:hidden">
                {STAGES.map((s, i) => (
                  <span
                    key={s.n}
                    className={`h-px flex-1 transition-colors duration-500 ${
                      i <= stage ? 'bg-white' : 'bg-white/15'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* ── Stage layers ───────────────────────────── */}
            <div className="lg:col-span-8">
              <div className="relative space-y-6 [perspective:1600px] lg:h-[30rem] lg:space-y-0">
                {/* ── 01 · Code ──────────────────────────── */}
                <div
                  ref={s1Ref}
                  className="lg:absolute lg:inset-0 lg:flex lg:items-center"
                >
                  <div className="grid w-full gap-4 sm:grid-cols-3 [transform-style:preserve-3d]">
                    {SNIPPETS.map((snip) => (
                      <div
                        key={snip.file}
                        data-code
                        className="transform-gpu overflow-hidden rounded-xl border border-white/10 bg-ink-900"
                      >
                        <div className="flex items-center justify-between border-b border-white/10 px-3.5 py-2">
                          <span className="truncate font-mono text-[10px] text-white/40">
                            {snip.file}
                          </span>
                          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/25">
                            {snip.lang}
                          </span>
                        </div>
                        <pre className="overflow-x-auto px-3.5 py-3">
                          <code className="font-mono text-[10.5px] leading-[1.9]">
                            {snip.lines.map((line, li) => (
                              <span key={li} data-line className="block whitespace-pre">
                                {line.map(([txt, tone], ti) => (
                                  <span key={ti} className={TONE[tone]}>
                                    {txt}
                                  </span>
                                ))}
                              </span>
                            ))}
                          </code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── 02 · Architecture ──────────────────── */}
                <div
                  ref={s2Ref}
                  className="lg:absolute lg:inset-0 lg:flex lg:items-center"
                >
                  <div className="relative h-[19rem] w-full rounded-xl border border-white/10 bg-ink-900 sm:h-[21rem]">
                    <svg
                      aria-hidden
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="absolute inset-0 h-full w-full"
                    >
                      {EDGES.map(([a, b]) => {
                        const from = nodeById(a)
                        const to = nodeById(b)
                        return (
                          <path
                            key={`${a}-${b}`}
                            data-edge
                            d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
                            fill="none"
                            stroke="#FFFFFF"
                            strokeOpacity="0.3"
                            strokeWidth="1"
                            pathLength="1"
                            strokeDasharray="1"
                            strokeDashoffset="1"
                            vectorEffect="non-scaling-stroke"
                          />
                        )
                      })}
                    </svg>

                    {NODES.map((node) => {
                      const Icon = node.icon
                      return (
                        <div
                          key={node.id}
                          data-node
                          style={{ left: `${node.x}%`, top: `${node.y}%` }}
                          className="absolute -translate-x-1/2 -translate-y-1/2"
                        >
                          <div className="flex items-center gap-2.5 rounded-lg border border-white/15 bg-ink-850 px-3 py-2 shadow-card-dark">
                            <Icon className="h-3.5 w-3.5 shrink-0 text-white/70" />
                            <div className="min-w-0">
                              <p className="whitespace-nowrap text-xs font-semibold text-white">
                                {node.label}
                              </p>
                              <p className="whitespace-nowrap font-mono text-[9px] text-white/35">
                                {node.meta}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* ── 03 · Product ───────────────────────── */}
                <div
                  ref={s3Ref}
                  className="transform-gpu lg:absolute lg:inset-0 lg:flex lg:items-center"
                >
                  <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-ink-900">
                    <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                      <span className="font-mono text-[11px] text-white/40">
                        druporia · production
                      </span>
                      <span className="rounded border border-white/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/35">
                        Preview
                      </span>
                    </div>

                    <div className="grid grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
                      {STATS.map((s) => (
                        <div key={s.k} data-tile className="px-5 py-5">
                          <p className="font-display text-2xl font-bold tabular-nums text-white">
                            {s.v}
                          </p>
                          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
                            {s.k}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-white/10 p-5">
                      <div className="flex h-24 items-end justify-between gap-1.5">
                        {BARS.map((h, i) => (
                          <span
                            key={i}
                            data-tile
                            style={{ height: `${h}%` }}
                            className="w-full max-w-[1.75rem] rounded-t-sm bg-white/25"
                          />
                        ))}
                      </div>
                      <p className="mt-3 font-mono text-[10px] text-white/30">
                        throughput · last 10 weeks
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-6 hidden font-mono text-[11px] text-white/35 lg:block">
                {active.n} · {active.title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
