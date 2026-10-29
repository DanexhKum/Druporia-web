import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Card({
  children,
  variant = 'surface',
  className,
}: {
  children: ReactNode
  /** surface: warm grey fill (service cards). outline: white with border. */
  variant?: 'surface' | 'outline'
  className?: string
}) {
  return (
    <div
      className={cn(
        variant === 'surface' ? 'card-surface' : 'card',
        'p-7 tab:p-8',
        className
      )}
    >
      {children}
    </div>
  )
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('tag', className)}>{children}</span>
}

export function ArrowChip({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid h-[38px] w-[38px] place-items-center rounded-full bg-canvas text-ink',
        className
      )}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17 17 7M7 7h10v10" />
      </svg>
    </span>
  )
}
