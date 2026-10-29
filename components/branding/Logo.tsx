import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  href?: string | null
  size?: 'md' | 'sm'
  className?: string
}

const SIZES = {
  md: { tile: 'h-[38px] w-[38px] rounded-tile', mark: 26, text: 'text-[21px]' },
  sm: { tile: 'h-[34px] w-[34px] rounded-[9px]', mark: 22, text: 'text-[20px]' },
}

// The "dp" mark. `tone="light"` is the white variant for dark
// backgrounds (used inside the navy tile); `tone="dark"` is for light ones.
export function LogoMark({ size = 26, tone = 'light' }: { size?: number; tone?: 'light' | 'dark' }) {
  return (
    <Image
      src={tone === 'light' ? '/brand/druporia-mark-transparent-white.png' : '/brand/druporia-mark-transparent.png'}
      alt=""
      width={size}
      height={size}
      priority
    />
  )
}

export function Logo({ href = '/', size = 'md', className }: LogoProps) {
  const s = SIZES[size]
  const content = (
    <>
      <span className={cn('grid shrink-0 place-items-center bg-navy', s.tile)}>
        <LogoMark size={s.mark} />
      </span>
      <span className={cn('font-bold tracking-[-0.02em] text-ink', s.text)}>Druporia</span>
    </>
  )

  const classes = cn('inline-flex items-center gap-3', className)

  if (!href) return <span className={classes}>{content}</span>

  return (
    <Link href={href} className={cn(classes, 'rounded-tile')} aria-label="Druporia home">
      {content}
    </Link>
  )
}
