'use client'

// ============================================================
// components/legal/LegalPage.tsx
// Shared shell for /privacy, /terms and /refund.
//
// Two columns: a sticky table of contents that highlights the
// section you are reading, and the document itself.
//
// SCROLL SPY USES IntersectionObserver, NOT A SCROLL HANDLER.
// A scroll listener would fire on every frame and fight the Lenis
// smoothing; the observer only fires when a heading crosses the
// band. The rootMargin picks the section whose heading sits in
// the upper third, which is what a reader perceives as "current"
// — using the exact top edge makes the highlight flicker between
// neighbours mid-scroll.
//
// Clicking a ToC entry lets the global anchor handler in
// SmoothScroll take it, so legal links scroll with the same
// easing as the rest of the site.
//
// "Print" calls window.print(). It is labelled Print, not
// "Download PDF", because nothing here generates a PDF — the
// browser's own dialog offers Save as PDF, which is the honest
// description of what the button does.
// ============================================================

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Printer } from 'lucide-react'

export interface LegalSection {
  id: string
  title: string
  body: ReactNode
}

interface LegalPageProps {
  eyebrow: string
  title: string
  intro: string
  lastUpdated: string
  sections: LegalSection[]
}

export function LegalPage({
  eyebrow,
  title,
  intro,
  lastUpdated,
  sections,
}: LegalPageProps) {
  const [active, setActive] = useState(sections[0]?.id ?? '')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => Boolean(n))
    if (nodes.length === 0) return

    const io = new IntersectionObserver(
      (entries) => {
        // Prefer the entry nearest the top of the band, so a tall
        // section does not keep the highlight after the next
        // heading has already scrolled past it.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-88px 0px -66% 0px', threshold: 0 }
    )

    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [sections])

  return (
    <div className="relative overflow-hidden bg-ink-950">
      <div aria-hidden className="blueprint-field" />

      <div className="container-page relative z-10 py-20 sm:py-28">
        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex flex-col gap-6 border-b border-white/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-white/40" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
                {eyebrow}
              </span>
            </div>
            <h1 className="mt-5 font-display text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">
              <span className="title-fill">{title}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-400">
              {intro}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="font-mono text-[11px] text-zinc-300">
                Updated {lastUpdated}
              </span>
            </span>

            <PrintButton />
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────── */}
        <div ref={ref} className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14 [&>*]:min-w-0">
          {/* Sticky ToC */}
          <nav
            aria-label="On this page"
            className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start print:hidden"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white">
              On this page
            </p>
            <ol className="mt-5 space-y-1">
              {sections.map((s, i) => {
                const on = active === s.id
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      aria-current={on ? 'true' : undefined}
                      className={`flex items-start gap-3 rounded-lg border-l-2 py-2 pl-3 pr-2 text-sm transition-colors duration-300 ${
                        on
                          ? 'border-white/60 bg-white/[0.04] text-white'
                          : 'border-transparent text-zinc-400 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <span className="mt-px font-mono text-[10px] tabular-nums text-zinc-500">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {s.title}
                    </a>
                  </li>
                )
              })}
            </ol>
          </nav>

          {/* Document */}
          <article className="min-w-0 lg:col-span-8">
            <div className="space-y-12">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-24">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[11px] tabular-nums text-zinc-500">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                      {s.title}
                    </h2>
                  </div>
                  <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-zinc-400">
                    {s.body}
                  </div>
                </section>
              ))}
            </div>

            <p className="mt-14 border-t border-white/10 pt-8 text-sm text-zinc-500">
              Questions about this document? Email{' '}
              <a
                href="mailto:dhanesh.kum15@gmail.com"
                className="text-zinc-300 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white"
              >
                dhanesh.kum15@gmail.com
              </a>
              .
            </p>
          </article>
        </div>
      </div>
    </div>
  )
}

function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] text-zinc-300 transition-colors duration-300 hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 print:hidden"
    >
      <Printer className="h-3.5 w-3.5" />
      Print / Save as PDF
    </button>
  )
}

/* ── Callout ───────────────────────────────────────────────
   For the one or two points in a section a reader must not
   miss. Used sparingly — a page where everything is highlighted
   highlights nothing. */
export function LegalCallout({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-r-lg border-l-2 border-white/30 bg-white/[0.02] p-4 text-[15px] leading-relaxed text-zinc-300">
      {children}
    </div>
  )
}
