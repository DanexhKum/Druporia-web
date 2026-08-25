'use client'

// ============================================================
// components/marketing/ScrollBuildSection.tsx
// 3D software pipeline — pinned scroll-to-build.
//
//   0.00–0.33  01. Syntax & Code
//              IDE mockups float in on rotateX/rotateY while code
//              TYPES itself out, with a blinking caret per card.
//   0.33–0.66  02. Architecture & APIs
//              Code recedes; runtime / API / database / client
//              nodes assemble, joined by vector edges drawn with
//              stroke-dashoffset. A live schema panel sits beside
//              them. Nodes are HOVERABLE — focusing one isolates
//              its edges and swaps the schema.
//   0.66–1.00  03. Assembled Solution
//              Nodes fold into a perspective dashboard whose
//              metrics count up as the stage lands.
//
// ── Why it is built this way ────────────────────────────────
//
// NO RASTER ASSETS. Every element here is DOM or SVG — code
// tokens, node graph, schema table, charts. Nothing scales
// badly, nothing needs a network request, and the whole thing
// re-themes from tokens.
//
// TYPING IS steps() ON clip-path, NOT DOM CHURN. A per-character
// text rewrite would re-render on every scroll frame. Clipping
// each line with an easing of steps(charCount) reveals it one
// character-width at a time — identical result, zero reflow, and
// it scrubs backwards correctly when the user scrolls up.
//
// THREE LAYERS, ONE STACK. Stages are absolutely positioned in
// the same cell and cross-faded, so nothing reflows mid-pin.
//
// MOBILE: layers leave absolute positioning, the pin never
// initialises, and all three render stacked. gsap.matchMedia()
// reverts on breakpoint change.
// ============================================================

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Boxes, Database, Server, Workflow, type LucideIcon } from 'lucide-react'

const STAGES = [
  {
    n: '01',
    title: 'Syntax & Code',
    body: 'It starts as source — components, handlers, queries. Reviewed line by line before anything is wired together.',
  },
  {
    n: '02',
    title: 'Architecture & APIs',
    body: 'Modules resolve into a system: runtimes, API surfaces, and data stores, with the contracts between them made explicit.',
  },
  {
    n: '03',
    title: 'Assembled Solution',
    body: 'The pieces fold into a running product — deployed, instrumented, and documented for the team that inherits it.',
  },
]

type Tok = [string, keyof typeof TONE]

const TONE = {
  kw: 'text-white font-semibold',
  fn: 'text-white/85',
  str: 'text-white/55',
  tag: 'text-white/70',
  num: 'text-white/70',
  p: 'text-white/35',
} as const

const SNIPPETS: { lang: string; file: string; lines: Tok[][] }[] = [
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

interface NodeDef {
  id: string
  icon: LucideIcon
  label: string
  meta: string
  x: number
  y: number
  schema: { name: string; type: string }[]
}

const NODES: NodeDef[] = [
  {
    id: 'runtime',
    icon: Server,
    label: 'Runtime',
    meta: 'Node · Python',
    x: 18,
    y: 24,
    schema: [
      { name: 'worker', type: 'process' },
      { name: 'queue', type: 'redis' },
      { name: 'retries', type: 'int' },
    ],
  },
  {
    id: 'api',
    icon: Workflow,
    label: 'API',
    meta: 'REST · webhooks',
    x: 50,
    y: 12,
    schema: [
      { name: 'POST /orders', type: '201' },
      { name: 'GET /products', type: '200' },
      { name: 'POST /webhooks', type: '202' },
    ],
  },
  {
    id: 'db',
    icon: Database,
    label: 'Database',
    meta: 'PostgreSQL',
    x: 82,
    y: 32,
    schema: [
      { name: 'id', type: 'uuid pk' },
      { name: 'order_id', type: 'uuid fk' },
      { name: 'total', type: 'numeric' },
      { name: 'created_at', type: 'timestamptz' },
    ],
  },
  {
    id: 'app',
    icon: Boxes,
    label: 'Client',
    meta: 'Next.js',
    x: 50,
    y: 78,
    schema: [
      { name: 'route', type: 'app/' },
      { name: 'cache', type: 'ISR' },
      { name: 'bundle', type: '84 kB' },
    ],
  },
]

const EDGES: [string, string][] = [
  ['runtime', 'api'],
  ['api', 'db'],
  ['runtime', 'app'],
  ['api', 'app'],
  ['db', 'app'],
]

const METRICS = [
  { k: 'Modules', to: 24, suffix: '' },
  { k: 'Checks', to: 128, suffix: '' },
  { k: 'Coverage', to: 94, suffix: '%' },
  { k: 'Deploys', to: 38, suffix: '' },
]

const BARS = [38, 55, 44, 70, 58, 82, 66, 91, 74, 88]

const nodeById = (id: string) => NODES.find((n) => n.id === id)!
const lineChars = (line: Tok[]) => line.reduce((n, [t]) => n + t.length, 0)

export function ScrollBuildSection() {
  const rootRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const s1Ref = useRef<HTMLDivElement>(null)
  const s2Ref = useRef<HTMLDivElement>(null)
  const s3Ref = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const metricRefs = useRef<(HTMLSpanElement | null)[]>([])

  const [stage, setStage] = useState(0)
  const [activeNode, setActiveNode] = useState<string | null>(null)

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
        const lines = gsap.utils.toArray<HTMLElement>(s1.querySelectorAll('[data-line]'))
        const carets = gsap.utils.toArray<HTMLElement>(s1.querySelectorAll('[data-caret]'))
        const edges = gsap.utils.toArray<SVGPathElement>(s2.querySelectorAll('[data-edge]'))
        const nodes = gsap.utils.toArray<HTMLElement>(s2.querySelectorAll('[data-node]'))
        const schema = s2.querySelector('[data-schema]')
        const tiles = gsap.utils.toArray<HTMLElement>(s3.querySelectorAll('[data-tile]'))

        gsap.set([s2, s3], { opacity: 0 })
        gsap.set(s1, { opacity: 1 })
        gsap.set(edges, { strokeDasharray: 1, strokeDashoffset: 1 })
        gsap.set(lines, { clipPath: 'inset(0 100% 0 0)' })
        gsap.set(carets, { opacity: 0 })

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

        // ── 01 · cards float in, code types ────────────────
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
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
          },
          0
        )

        // Typing: each line clips open in character-width steps.
        lines.forEach((line, i) => {
          const chars = Number(line.dataset.chars) || 24
          tl.to(
            line,
            {
              clipPath: 'inset(0 0% 0 0)',
              duration: 0.34,
              ease: `steps(${chars})`,
            },
            0.35 + i * 0.055
          )
        })

        // Caret blinks while its card is typing, then retires.
        carets.forEach((caret, i) => {
          tl.to(caret, { opacity: 1, duration: 0.05 }, 0.35 + i * 0.35)
          tl.to(
            caret,
            { opacity: 0, duration: 0.05, repeat: 5, yoyo: true },
            0.4 + i * 0.35
          )
          tl.to(caret, { opacity: 0, duration: 0.05 }, 0.95)
        })

        // ── 02 · graph assembles ───────────────────────────
        tl.to(s1, { opacity: 0, scale: 0.92, duration: 0.5 }, 1)
        tl.to(s2, { opacity: 1, duration: 0.5 }, 1.15)
        tl.fromTo(
          nodes,
          { opacity: 0, scale: 0.7 },
          { opacity: 1, scale: 1, duration: 0.45, stagger: 0.1, ease: 'back.out(1.7)' },
          1.25
        )
        tl.to(
          edges,
          { strokeDashoffset: 0, duration: 0.55, stagger: 0.08, ease: 'none' },
          1.45
        )
        if (schema) {
          tl.fromTo(
            schema,
            { opacity: 0, x: 24 },
            { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' },
            1.6
          )
        }

        // ── 03 · fold into the product ─────────────────────
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
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' },
          2.4
        )

        // Metrics count up. Written straight to textContent — a
        // React state update per frame would re-render the tree.
        METRICS.forEach((m, i) => {
          const el = metricRefs.current[i]
          if (!el) return
          const proxy = { v: 0 }
          tl.to(
            proxy,
            {
              v: m.to,
              duration: 0.9,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = `${Math.round(proxy.v)}${m.suffix}`
              },
            },
            2.45 + i * 0.06
          )
        })

        return () => {
          tl.scrollTrigger?.kill()
          tl.kill()
        }
      }
    )

    mm.add('(max-width: 1023px), (prefers-reduced-motion: reduce)', () => {
      setStage(0)
      // No timeline runs here, so seed the metrics with their
      // final values rather than leaving them at zero.
      METRICS.forEach((m, i) => {
        const el = metricRefs.current[i]
        if (el) el.textContent = `${m.to}${m.suffix}`
      })
    })

    return () => mm.revert()
  }, [])

  const active = STAGES[stage] ?? STAGES[0]
  const focused = activeNode ? nodeById(activeNode) : null
  const schemaNode = focused ?? nodeById('db')

  const edgeIsLit = (a: string, b: string) =>
    !activeNode || a === activeNode || b === activeNode

  // Only the active layer is hit-testable. GSAP applies non-numeric
  // props at tween boundaries, which left stage 3 intercepting
  // pointer events over stage 2's nodes — they were unreachable.
  // Constrained to lg, since below that the layers do not overlap.
  const hits = (i: number) =>
    stage === i ? 'lg:pointer-events-auto' : 'lg:pointer-events-none'

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
            {/* ── Progress rail + labels ─────────────────── */}
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
                          {s.n}.
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
                {/* ── 01 · Syntax & Code ─────────────────── */}
                <div
                  ref={s1Ref}
                  className={`lg:absolute lg:inset-0 lg:flex lg:items-center ${hits(0)}`}
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
                              <span
                                key={li}
                                data-line
                                data-chars={lineChars(line)}
                                className="block whitespace-pre"
                              >
                                {line.map(([txt, tone], ti) => (
                                  <span key={ti} className={TONE[tone]}>
                                    {txt}
                                  </span>
                                ))}
                              </span>
                            ))}
                            <span
                              data-caret
                              aria-hidden
                              className="mt-0.5 inline-block h-3 w-[6px] bg-white/70 align-middle"
                            />
                          </code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── 02 · Architecture & APIs ───────────── */}
                <div
                  ref={s2Ref}
                  className={`lg:absolute lg:inset-0 lg:flex lg:items-center ${hits(1)}`}
                >
                  <div className="grid w-full gap-4 lg:grid-cols-5">
                    {/* Node graph */}
                    <div className="relative h-[17rem] rounded-xl border border-white/10 bg-ink-900 sm:h-[19rem] lg:col-span-3 lg:h-[21rem]">
                      <svg
                        aria-hidden
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        className="absolute inset-0 h-full w-full"
                      >
                        {EDGES.map(([a, b]) => {
                          const from = nodeById(a)
                          const to = nodeById(b)
                          const lit = edgeIsLit(a, b)
                          return (
                            <path
                              key={`${a}-${b}`}
                              data-edge
                              d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
                              fill="none"
                              stroke="#FFFFFF"
                              strokeOpacity={lit ? 0.4 : 0.08}
                              strokeWidth="1"
                              pathLength="1"
                              strokeDasharray="1"
                              strokeDashoffset="1"
                              vectorEffect="non-scaling-stroke"
                              className="transition-[stroke-opacity] duration-300"
                            />
                          )
                        })}
                      </svg>

                      {NODES.map((node) => {
                        const Icon = node.icon
                        const on = activeNode === node.id
                        return (
                          <button
                            key={node.id}
                            data-node
                            type="button"
                            onMouseEnter={() => setActiveNode(node.id)}
                            onFocus={() => setActiveNode(node.id)}
                            onMouseLeave={() => setActiveNode(null)}
                            onBlur={() => setActiveNode(null)}
                            aria-pressed={on}
                            style={{ left: `${node.x}%`, top: `${node.y}%` }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none"
                          >
                            <span
                              className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 transition-all duration-300 ${
                                on
                                  ? 'scale-105 border-white/45 bg-ink-800'
                                  : 'border-white/15 bg-ink-850'
                              }`}
                            >
                              <Icon className="h-3.5 w-3.5 shrink-0 text-white/70" />
                              <span className="min-w-0 text-left">
                                <span className="block whitespace-nowrap text-xs font-semibold text-white">
                                  {node.label}
                                </span>
                                <span className="block whitespace-nowrap font-mono text-[9px] text-white/35">
                                  {node.meta}
                                </span>
                              </span>
                            </span>
                          </button>
                        )
                      })}
                    </div>

                    {/* Schema panel — follows the focused node */}
                    <div
                      data-schema
                      className="rounded-xl border border-white/10 bg-ink-900 lg:col-span-2"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
                        <span className="font-mono text-[10px] text-white/45">
                          {schemaNode.id === 'db'
                            ? 'schema · orders'
                            : `contract · ${schemaNode.id}`}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/25">
                          {schemaNode.label}
                        </span>
                      </div>
                      <ul className="divide-y divide-white/[0.06]">
                        {schemaNode.schema.map((row) => (
                          <li
                            key={row.name}
                            className="flex items-center justify-between gap-3 px-4 py-2.5"
                          >
                            <span className="truncate font-mono text-[11px] text-white/70">
                              {row.name}
                            </span>
                            <span className="shrink-0 font-mono text-[10px] text-white/30">
                              {row.type}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <p className="border-t border-white/10 px-4 py-2.5 font-mono text-[9px] text-white/25">
                        hover a node to inspect
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── 03 · Assembled Solution ────────────── */}
                <div
                  ref={s3Ref}
                  className={`transform-gpu lg:absolute lg:inset-0 lg:flex lg:items-center ${hits(2)}`}
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
                      {METRICS.map((m, i) => (
                        <div key={m.k} data-tile className="px-5 py-5">
                          <span
                            ref={(el) => {
                              metricRefs.current[i] = el
                            }}
                            className="block font-display text-2xl font-bold tabular-nums text-white"
                          >
                            {m.to}
                            {m.suffix}
                          </span>
                          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
                            {m.k}
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
                {active.n}. {active.title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
