'use client'

// ============================================================
// components/motion/TiltCard.tsx
// 3D tilt on hover plus a spotlight that tracks the pointer.
//
// Built on useMotionValue/useTransform: pointer position maps to
// rotateX/rotateY through springs, and the same values drive a
// radial-gradient highlight so the light appears to come from
// where the cursor is. Perspective lives on the wrapper, not the
// card, or the rotation reads as a flat skew.
//
// transform-gpu + will-change keeps this off the main thread;
// without it a grid of these judders on scroll.
// ============================================================

import { useRef, type ReactNode } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { cn } from '@/lib/utils'

interface TiltCardProps {
  children: ReactNode
  className?: string
  /** Max rotation in degrees at the card's edge. */
  intensity?: number
  spotlight?: boolean
}

export function TiltCard({
  children,
  className,
  intensity = 7,
  spotlight = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  // -0.5 .. 0.5 across each axis
  const px = useMotionValue(0)
  const py = useMotionValue(0)

  const sx = useSpring(px, { stiffness: 240, damping: 22, mass: 0.5 })
  const sy = useSpring(py, { stiffness: 240, damping: 22, mass: 0.5 })

  const rotateX = useTransform(sy, [-0.5, 0.5], [intensity, -intensity])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-intensity, intensity])

  // Spotlight follows the raw pointer, not the spring, so the
  // light feels attached to the cursor while the card lags.
  const glowX = useTransform(px, [-0.5, 0.5], ['0%', '100%'])
  const glowY = useTransform(py, [-0.5, 0.5], ['0%', '100%'])

  function handleMove(e: React.PointerEvent) {
    if (reduceMotion || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }

  function handleLeave() {
    px.set(0)
    py.set(0)
  }

  return (
    <div className="[perspective:1200px]">
      <motion.div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={reduceMotion ? undefined : { rotateX, rotateY }}
        className={cn(
          'group relative h-full transform-gpu [transform-style:preserve-3d] will-change-transform',
          className
        )}
      >
        {spotlight && (
          <motion.div
            aria-hidden
            style={{
              background: useTransform(
                [glowX, glowY],
                ([gx, gy]) =>
                  `radial-gradient(340px circle at ${gx} ${gy}, rgba(255,255,255,0.13), transparent 70%)`
              ),
            }}
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}
        {children}
      </motion.div>
    </div>
  )
}
