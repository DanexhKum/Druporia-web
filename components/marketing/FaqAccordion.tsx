'use client'

// ============================================================
// components/marketing/FaqAccordion.tsx
// Accessible FAQ accordion.
//
// Built on native <details>/<summary> rather than a JS-driven
// disclosure: it is keyboard-operable and screen-reader-correct
// with no ARIA wiring, works before hydration, and lets the
// browser handle open/close state. Framer Motion is deliberately
// not used here — animating height on <details> fights the
// element's own behaviour.
// ============================================================

import { ChevronDown } from 'lucide-react'

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null

  return (
    <div className="mx-auto max-w-3xl divide-y divide-navy-100 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
      {items.map((item) => (
        <details key={item.id} className="group">
          <summary
            className="flex w-full cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left
                       transition-colors hover:bg-surface-50
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-navy-800"
          >
            <h3 className="text-base font-bold tracking-tight text-navy-900">
              {item.question}
            </h3>
            <ChevronDown
              className="h-5 w-5 shrink-0 text-navy-400 transition-transform duration-300 group-open:rotate-180 group-open:text-gold-600"
              aria-hidden
            />
          </summary>

          <div className="px-6 pb-5 pr-14">
            <p className="text-sm font-light leading-relaxed text-navy-600">
              {item.answer}
            </p>
          </div>
        </details>
      ))}
    </div>
  )
}
