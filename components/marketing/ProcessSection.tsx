// ============================================================
// components/marketing/ProcessSection.tsx
// Four-step engagement walkthrough.
//
// The numbering here is real information, not decoration — these
// steps happen in this order, and the connector line encodes that
// sequence. Do not reuse this numbered treatment for content that
// is merely a list.
// ============================================================

import { MessagesSquare, PencilRuler, Code2, Rocket } from 'lucide-react'
import { AnimateIn, StaggerGrid, StaggerItem } from '@/components/marketing/AnimateIn'

const STEPS = [
  {
    icon: MessagesSquare,
    title: 'Discovery call',
    description:
      'We walk through your platform, the workflow that is costing you time, and what success looks like. No charge, no obligation.',
  },
  {
    icon: PencilRuler,
    title: 'Scope & quote',
    description:
      'You get a written scope with deliverables, timeline, and a fixed price. If a smaller build solves the problem, we say so.',
  },
  {
    icon: Code2,
    title: 'Build & review',
    description:
      'Development happens in short cycles with a staging link you can click through. Feedback goes in before the work is finished, not after.',
  },
  {
    icon: Rocket,
    title: 'Launch & support',
    description:
      'We deploy, hand over documentation, and stay reachable. Post-launch fixes to the agreed scope are included.',
  },
]

export function ProcessSection() {
  return (
    <section id="process" className="bg-ink-900 py-20 sm:py-28">
      <div className="container-page">
        <AnimateIn className="mx-auto mb-16 max-w-2xl text-center">
          <p className="chip">02 · How we work</p>
          <h2 className="heading-dark mt-5">From first call to launched product</h2>
          <p className="body-dark mt-4">
            Four steps, no surprises. You always know what happens next and
            what it costs.
          </p>
        </AnimateIn>

        <StaggerGrid className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Connector line — the sequence made visible. Hidden on
              small screens where the cards stack vertically. */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent lg:block"
          />

          {STEPS.map((step, index) => {
            const Icon = step.icon
            return (
              <StaggerItem key={step.title} className="relative">
                <div className="flex flex-col items-start">
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-ink-900 shadow-card-dark">
                    <Icon className="h-6 w-6 text-white" />
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-teal-400 text-[11px] font-extrabold tabular-nums text-ink-950">
                      {index + 1}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-bold tracking-tight text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-white/55">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerGrid>
      </div>
    </section>
  )
}
