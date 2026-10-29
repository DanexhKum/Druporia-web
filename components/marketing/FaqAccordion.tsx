'use client'

import { useId, useState } from 'react'
import { cn } from '@/lib/utils'

export interface FaqItem {
  id: string
  question: string
  answer: string
}

// Single-open accordion; the first item starts open.
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState(0)
  const baseId = useId()

  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item, i) => {
        const open = openIndex === i
        const buttonId = `${baseId}-q-${i}`
        const panelId = `${baseId}-a-${i}`
        return (
          <div
            key={item.id}
            className={cn('rounded-faq transition-colors', open ? 'bg-orange-tint' : 'bg-surface')}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 rounded-faq px-5 py-5 text-left tab:px-[26px] tab:py-[22px]"
              >
                <span className="text-[17px] font-semibold tracking-[-0.01em] tab:text-lg">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'grid h-[34px] w-[34px] flex-none place-items-center rounded-full',
                    open ? 'bg-orange text-white' : 'bg-canvas text-ink'
                  )}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14" />
                    {!open && <path d="M12 5v14" />}
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!open}
              className="px-5 pb-[22px] tab:px-[26px]"
            >
              <p className="-mt-2 max-w-[60ch] text-[15.5px] leading-[1.6] text-body">
                {item.answer}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
