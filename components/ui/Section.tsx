import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

// ── Eyebrow ─────────────────────────────────────────────────────
// Sentence-case label above a heading ("Services", "How we work").
export function Eyebrow({
  children,
  tone = 'orange',
  className,
}: {
  children: ReactNode
  tone?: 'orange' | 'amber'
  className?: string
}) {
  return (
    <p className={cn('eyebrow', tone === 'amber' && 'text-amber', className)}>{children}</p>
  )
}

// ── SectionHeading ──────────────────────────────────────────────
// Eyebrow + H2, with an optional supporting paragraph placed to the
// right on desktop (layout="split") or underneath (layout="stack").
interface SectionHeadingProps {
  eyebrow: ReactNode
  title: ReactNode
  description?: ReactNode
  layout?: 'split' | 'stack'
  size?: 'md' | 'sm'
  as?: 'h1' | 'h2'
  tone?: 'orange' | 'amber'
  className?: string
  titleClassName?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  layout = 'stack',
  size = 'md',
  as: Heading = 'h2',
  tone = 'orange',
  className,
  titleClassName,
}: SectionHeadingProps) {
  const heading = (
    <div>
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <Heading
        className={cn(
          'mt-[18px] font-semibold',
          size === 'md' ? 'text-h2' : 'text-h2-sm',
          titleClassName
        )}
      >
        {title}
      </Heading>
    </div>
  )

  if (!description) return <div className={className}>{heading}</div>

  if (layout === 'split') {
    return (
      <div
        className={cn(
          'grid gap-6 desk:grid-cols-2 desk:items-end desk:gap-16',
          className
        )}
      >
        {heading}
        <p className="max-w-[48ch] text-[17px] leading-[1.65] text-body">{description}</p>
      </div>
    )
  }

  return (
    <div className={className}>
      {heading}
      <p className="mt-6 max-w-[56ch] text-lead text-body">{description}</p>
    </div>
  )
}

// ── PageHeader ──────────────────────────────────────────────────
// Top-of-page hero for interior routes: eyebrow + H1 + lead.
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow: ReactNode
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <header className={cn('container-page pb-14 pt-16 desk:pb-20 desk:pt-24', className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-[18px] max-w-[20ch] text-[clamp(2.5rem,1.6rem+3.2vw,4rem)] font-semibold leading-[1.04] tracking-[-0.045em]">
        {title}
      </h1>
      {description && (
        <p className="mt-6 max-w-[58ch] text-lead text-body">{description}</p>
      )}
      {children}
    </header>
  )
}
