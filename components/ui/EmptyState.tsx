import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { buttonClasses } from '@/components/ui/Button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionHref?: string
  actionLabel?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionHref,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="animate-soft-in card-surface flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-canvas text-muted">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-h3-sm font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-body">{description}</p>
      {actionHref && actionLabel && (
        <Link href={actionHref} className={buttonClasses('outline', 'md', 'mt-6')}>
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
