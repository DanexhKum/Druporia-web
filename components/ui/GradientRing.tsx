import { cn } from '@/lib/utils'

// Decorative hollow gradient ring. Always position it partly
// off-canvas inside an `overflow-hidden` parent, clear of content.
// Size, position and thickness come from className, e.g.
// "h-[480px] w-[480px] -right-40 -top-40 [--ring-width:78px]".
export function GradientRing({ className }: { className: string }) {
  return <div aria-hidden="true" className={cn('gradient-ring', className)} />
}
