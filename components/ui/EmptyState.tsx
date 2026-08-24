import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'

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
    <div className="animate-soft-in flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-navy-200 bg-surface-50 text-navy-500 shadow-sm">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-navy-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-navy-500">
        {description}
      </p>
      {actionHref && actionLabel && (
        <Link href={actionHref} className="btn-secondary mt-5 text-xs">
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
