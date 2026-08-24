import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'

// ============================================================
// components/ui/EmptyState.tsx
//
// THEME-AGNOSTIC ON PURPOSE. This renders inside the dark
// marketing marketplace AND inside the light admin panel, so it
// must not commit to either ground:
//   - text colour is inherited (text-inherit + opacity), so it
//     is dark on light surfaces and light on dark ones
//   - the icon well uses a mid-grey at low alpha, which reads as
//     a subtle tint on both white and near-black
// Do not swap these for navy-* or white/* utilities — doing so
// breaks whichever half of the app you weren't looking at.
// ============================================================

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
    <div className="animate-soft-in flex flex-col items-center justify-center px-6 py-12 text-center text-inherit">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-500/20 bg-slate-500/10">
        <Icon className="h-6 w-6 opacity-50" />
      </div>

      <h3 className="mt-4 text-sm font-semibold">{title}</h3>

      <p className="mt-2 max-w-sm text-sm leading-relaxed opacity-60">
        {description}
      </p>

      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-5 rounded-lg border border-slate-500/25 px-4 py-2 text-xs font-semibold transition-colors duration-200 hover:border-slate-500/50 hover:bg-slate-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/40"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
