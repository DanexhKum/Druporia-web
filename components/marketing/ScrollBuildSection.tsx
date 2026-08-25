'use client'

// ============================================================
// components/marketing/ScrollBuildSection.tsx
// Pinned scroll-to-build showcase, driven by GSAP ScrollTrigger.
//
// Four stages mapped to scroll progress:
//   0.00–0.25  central card tilts in on rotateX / rotateY
//   0.25–0.50  card unfolds — sub-panels fly into an
//              asymmetrical bento grid
//   0.50–0.75  active panel gets a line-draw border
//              (stroke-dashoffset) and the step label updates
//   0.75–1.00  stage settles and unpins into the next section
//
// ── Why it is built this way ────────────────────────────────
//
// ANIMATE FROM, NOT TO. The panels sit at their FINAL grid
// positions in the DOM and GSAP animates them *from* a collapsed
// state. So the resting layout is pure CSS: without JS, on
// mobile, or under reduced motion, the finished bento renders
// correctly with no timeline involved. Animating *to* the layout
// would leave a pile of stacked panels whenever the timeline
// doesn't run.
//
// STATE UPDATES ARE THROTTLED BY STEP, NOT FRAME. onUpdate fires
// every scroll frame; calling setState there would re-render the
// tree ~60x/sec and undo Lenis's smoothing. React state changes
// only when the step INDEX changes (4 times total). The
// continuous progress bar is written straight to the DOM via a
// ref, bypassing React entirely.
//
// gsap.matchMedia() confines the pin to >=1024px and reverts it
// automatically below that — pinning a viewport on a phone traps
// the user mid-scroll. Cleanup is one mm.revert() call.
// ============================================================

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Boxes, Code2, GitBranch, ShieldCheck } from 'lucide-react'

const STEPS = [
  {
    n: '01',
    title: 'Scope',
    body: 'We map the workflow, agree deliverables, and fix the price before anyone writes code.',
  },
  {
    n: '02',
    title: 'Build',
    body: 'Work lands in short cycles against a staging link you can click through.',
  },
  {
    n: '03',
    title: 'Verify',
    body: 'Every module reviewed, tested, and documented against the agreed scope.',
  },
  {
    n: '04',
    title: 'Ship',
    body: 'Deployed, handed over, and supported — with the docs your team needs.',
  },
]

const PANELS = [
  {
    id: 'repo',
    icon: GitBranch,
    label: 'Repository',
    meta: 'main · 42 commits',
    // Asymmetrical spans — the bento is deliberately uneven
    span: 'lg:col-span-7 lg:row-span-2',
    from: { x: -70, y: -50, rotate: -6 },
  },
  {
    id: 'modules',
    icon: Boxes,
    label: 'Modules',
    meta: '6 packages',
    span: 'lg:col-span-5',
    from: { x: 70, y: -60, rotate: 5 },
  },
  {
    id: 'tests',
    icon: ShieldCheck,
    label: 'Checks',
    meta: '128 passing',
    span: 'lg:col-span-5',
    from: { x: 80, y: 50, rotate: -4 },
  },
  {
    id: 'deploy',
    icon: Code2,
    label: 'Deploy',
    meta: 'production',
    span: 'lg:col-span-12',
    from: { x: -60, y: 70, rotate: 3 },
  },
]

export function ScrollBuildSection() {
  const rootRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const panelsRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const root = rootRef.current
    const pin = pinRef.current
    const card = cardRef.current
    const panels = panelsRef.current
    if (!root || !pin || !card || !panels) return

    gsap.registerPlugin(ScrollTrigger)

    const mm = gsap.matchMedia()

    // Pinned timeline: desktop only, motion allowed.
    mm.add(
      '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      () => {
        const panelEls = gsap.utils.toArray<HTMLElement>(
          panels.querySelectorAll('[data-panel]')
        )
        const outlines = gsap.utils.toArray<SVGRectElement>(
          panels.querySelectorAll('[data-outline]')
        )

        // Normalised via pathLength="1", so dasharray/offset are
        // 0..1 regardless of each rect's actual perimeter.
        gsap.set(outlines, { strokeDasharray: 1, strokeDashoffset: 1 })

        let lastStep = -1

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: '+=320%',
            pin: pin,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => {
              // Continuous value written straight to the DOM.
              if (barRef.current) {
                barRef.current.style.transform = `scaleY(${self.progress})`
              }
              // React only hears about discrete step changes.
              const next = Math.min(3, Math.floor(self.progress * 4))
              if (next !== lastStep) {
                lastStep = next
                setStep(next)
              }
            },
          },
        })

        // ── Stage 1: card tilts in ─────────────────────────
        tl.fromTo(
          card,
          { rotateX: 26, rotateY: -20, scale: 0.9, opacity: 0 },
          { rotateX: 6, rotateY: -4, scale: 1, opacity: 1, duration: 1 },
          0
        )

        // ── Stage 2: card unfolds into the bento ───────────
        tl.to(card, { opacity: 0, scale: 0.94, duration: 0.6 }, 1)
        panelEls.forEach((el, i) => {
          const from = PANELS[i]?.from ?? { x: 0, y: 0, rotate: 0 }
          tl.fromTo(
            el,
            {
              opacity: 0,
              scale: 0.86,
              xPercent: from.x,
              yPercent: from.y,
              rotate: from.rotate,
            },
            {
              opacity: 1,
              scale: 1,
              xPercent: 0,
              yPercent: 0,
              rotate: 0,
              duration: 0.75,
              ease: 'power3.out',
            },
            1 + i * 0.12
          )
        })

        // ── Stage 3: line-draw the active outlines ─────────
        tl.to(
          outlines,
          {
            strokeDashoffset: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: 'none',
          },
          2
        )

        // ── Stage 4: settle, then unpin ────────────────────
        tl.to(panels, { scale: 0.985, duration: 1 }, 3)

        return () => {
          tl.scrollTrigger?.kill()
          tl.kill()
        }
      }
    )

    // Below lg, or reduced motion: no pin, no timeline. The CSS
    // resting layout is already the finished state, so there is
    // nothing to reset — only the step label needs a value.
    mm.add('(max-width: 1023px), (prefers-reduced-motion: reduce)', () => {
      setStep(0)
    })

    return () => mm.revert()
  }, [])

  const activeStep = STEPS[step] ?? STEPS[0]

  return (
    <section
      ref={rootRef}
      id="how-we-build"
      // overflow-clip stops any in-flight transform from creating
      // a horizontal scrollbar mid-animation.
      className="relative overflow-x-clip border-t border-white/10 bg-ink-950"
    >
      <div ref={pinRef} className="relative">
        <div className="container-page py-16 sm:py-24 lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:py-0">
          {/* ── Header ─────────────────────────────────── */}
          <div className="mb-10 flex items-center gap-3 lg:mb-12">
            <span className="h-px w-10 bg-cyan-400/60" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
              03 · How we build
            </span>
          </div>

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            {/* ── Progress rail + step copy ────────────── */}
            <div className="lg:col-span-4">
              <div className="flex gap-6">
                {/* Vertical rail (desktop) */}
                <div className="relative hidden w-px shrink-0 bg-white/10 lg:block">
                  <span
                    ref={barRef}
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-full origin-top bg-cyan-400"
                    style={{ transform: 'scaleY(0)' }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <ol className="space-y-4 lg:space-y-5">
                    {STEPS.map((s, i) => {
                      const on = i === step
                      return (
                        <li key={s.n} className="flex items-start gap-4">
                          <span
                            className={`mt-0.5 font-mono text-[11px] tabular-nums transition-colors duration-500 ${
                              on ? 'text-cyan-400' : 'text-white/25'
                            }`}
                          >
                            {s.n}
                          </span>
                          <div className="min-w-0">
                            <p
                              className={`font-display text-lg font-bold tracking-tight transition-colors duration-500 ${
                                on ? 'text-white' : 'text-white/35'
                              }`}
                            >
                              {s.title}
                            </p>
                            {/* Body only for the active step on
                                desktop; all shown when stacked. */}
                            <p
                              className={`mt-1.5 text-sm leading-relaxed text-white/55 transition-opacity duration-500 ${
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
              </div>

              {/* Horizontal rail (mobile) */}
              <div
                aria-hidden
                className="mt-8 flex gap-1.5 lg:hidden"
              >
                {STEPS.map((s, i) => (
                  <span
                    key={s.n}
                    className={`h-px flex-1 transition-colors duration-500 ${
                      i <= step ? 'bg-cyan-400' : 'bg-white/15'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* ── Stage ────────────────────────────────── */}
            <div className="relative lg:col-span-8">
              <div className="[perspective:1400px]">
                {/* Central card — overlays the bento on desktop
                    while the timeline runs; hidden when stacked,
                    where the bento is the whole story. */}
                <div
                  ref={cardRef}
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-10 hidden transform-gpu items-center justify-center [transform-style:preserve-3d] lg:flex"
                  style={{ opacity: 0 }}
                >
                  <div className="w-full max-w-md rounded-2xl border border-white/10 bg-ink-900/90 p-6 shadow-card-dark backdrop-blur-sm">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="font-mono text-[11px] text-white/35">
                        druporia · build
                      </span>
                      <span className="rounded border border-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
                        Preview
                      </span>
                    </div>
                    <p className="mt-5 font-display text-2xl font-bold tracking-tight text-white">
                      One engagement,
                      <br />
                      four moving parts.
                    </p>
                    <p className="mt-3 text-sm text-white/55">
                      Scroll to see how a project comes together.
                    </p>
                  </div>
                </div>

                {/* Bento — the resting layout, CSS-driven */}
                <div
                  ref={panelsRef}
                  className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-[repeat(3,minmax(0,1fr))]"
                >
                  {PANELS.map((panel, i) => {
                    const Icon = panel.icon
                    const lit = i <= step
                    return (
                      <div
                        key={panel.id}
                        data-panel
                        className={`relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900/60 p-5 transition-colors duration-500 ${panel.span} ${
                          lit ? 'bg-white/[0.045]' : ''
                        }`}
                      >
                        {/* Line-draw outline. pathLength="1"
                            normalises the perimeter so the same
                            dash values work at any card size. */}
                        <svg
                          aria-hidden
                          className="pointer-events-none absolute inset-0 h-full w-full"
                          preserveAspectRatio="none"
                        >
                          <rect
                            data-outline
                            x="0.5"
                            y="0.5"
                            width="99%"
                            height="99%"
                            rx="15"
                            fill="none"
                            stroke="#00F0FF"
                            strokeWidth="1"
                            pathLength="1"
                            strokeDasharray="1"
                            strokeDashoffset="1"
                          />
                        </svg>

                        <div className="relative flex h-full flex-col">
                          <div className="flex items-center justify-between">
                            <span
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors duration-500 ${
                                lit
                                  ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300'
                                  : 'border-white/10 bg-white/[0.03] text-white/45'
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">
                              {panel.meta}
                            </span>
                          </div>

                          <p className="mt-auto pt-6 font-display text-base font-bold tracking-tight text-white">
                            {panel.label}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Active-step caption, desktop only */}
              <p className="mt-6 hidden font-mono text-[11px] text-white/35 lg:block">
                {activeStep.n} · {activeStep.title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
