'use client'

// ============================================================
// components/motion/MagneticButton.tsx
// Button/link with magnetic cursor pull, a shine sweep on hover,
// a glowing border, and tap feedback.
//
// The pull is capped and eased: the element moves a fraction of
// the pointer's offset from its centre, so it leans toward the
// cursor rather than chasing it. Springs return it home on exit.
//
// data-magnetic is what CustomCursor looks for — the ring locks
// to this element's centre while the element leans out to meet
// it. Both halves are needed for the effect to read.
// ============================================================

import { useRef, type ReactNode } from 'react'
import Link from 'next/link'
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'glass'

interface MagneticButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: Variant
  className?: string
  /** How far the element leans, in px, at the edge of its box. */
  strength?: number
  ariaLabel?: string
}

export function MagneticButton({
  children,
  href,
  onClick,
  variant = 'primary',
  className,
  strength = 14,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 260, damping: 18, mass: 0.5 })
  const y = useSpring(my, { stiffness: 260, damping: 18, mass: 0.5 })

  function handleMove(e: React.PointerEvent) {
    if (reduceMotion || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    // Offset from centre, normalised to -1..1, then scaled.
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
    mx.set(Math.max(-1, Math.min(1, dx)) * strength)
    my.set(Math.max(-1, Math.min(1, dy)) * strength)
  }

  function handleLeave() {
    mx.set(0)
    my.set(0)
  }

  const base =
    'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-7 py-3.5 font-mono text-[13px] tracking-tight transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950'

  const skin =
    variant === 'primary'
      ? 'border border-cyan-400/30 bg-cyan-400/10 text-white shadow-cta hover:border-cyan-400/60 hover:bg-cyan-400/15'
      : 'border border-white/10 bg-white/[0.04] text-white/75 backdrop-blur-md hover:border-white/25 hover:bg-white/[0.08] hover:text-white'

  const inner = (
    <>
      {/* Shine sweep — a skewed highlight crossing on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 overflow-hidden rounded-xl"
      >
        <span className="absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:animate-shimmer" />
      </span>

      {/* Glowing border sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </>
  )

  return (
    <motion.div
      ref={ref}
      data-magnetic
      style={{ x, y }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
      className="inline-flex"
    >
      {href ? (
        <Link href={href} aria-label={ariaLabel} className={cn(base, skin, className)}>
          {inner}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onClick}
          aria-label={ariaLabel}
          className={cn(base, skin, className)}
        >
          {inner}
        </button>
      )}
    </motion.div>
  )
}
