'use client'

import { useState } from 'react'
import Link from 'next/link'
import { buttonClasses } from '@/components/ui/Button'
import { SERVICE_OPTIONS, contactHref, type ServiceOptionValue } from '@/lib/site-content'
import { cn } from '@/lib/utils'

export function ServicePicker() {
  const [picked, setPicked] = useState<ServiceOptionValue[]>([])

  function toggle(value: ServiceOptionValue) {
    setPicked((current) =>
      current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    )
  }

  return (
    <div className="relative rounded-card-lg border border-line-card bg-canvas p-6 shadow-hero tab:p-7">
      <p className="text-sm font-semibold text-ink">Start a project</p>
      <h2 id="picker-heading" className="mt-2.5 text-[22px] font-semibold tracking-[-0.02em]">
        What do you need help with?
      </h2>

      <div role="group" aria-labelledby="picker-heading" className="mt-[18px] flex flex-wrap gap-2">
        {SERVICE_OPTIONS.map((option) => {
          const on = picked.includes(option.value)
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(option.value)}
              className={cn(
                'rounded-full border px-3.5 py-[9px] text-sm font-medium transition-colors',
                on
                  ? 'border-orange bg-orange-tint text-orange-deep'
                  : 'border-line-chip bg-canvas text-nav hover:bg-surface'
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      <div className="mt-[22px] flex items-center gap-3 border-t border-line-soft pt-5">
        <p aria-live="polite" className="flex-1 text-[13.5px] leading-[1.45] text-muted-note">
          {picked.length
            ? `${picked.length} selected · free 30-min call, no commitment`
            : 'Pick one or more · free 30-min call'}
        </p>
        <Link href={contactHref(picked)} className={buttonClasses('dark', 'sm')}>
          Continue <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  )
}
