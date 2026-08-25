'use client'

// ============================================================
// components/motion/CustomCursor.tsx
// Two-part cursor: a small solid dot that tracks precisely, and a
// larger ring that lags behind via spring physics.
//
// Magnetism: when the pointer is inside an element marked
// data-magnetic, the ring snaps to that element's centre and
// grows. MagneticButton moves the element itself toward the
// pointer at the same time, so the two meet in the middle — that
// is what makes the pull read as physical rather than as a
// tooltip following the mouse.
//
// Renders nothing at all when:
//   - the device has no fine pointer (touch), where a fake cursor
//     is pure overhead
//   - prefers-reduced-motion is set
// The real cursor is only hidden once this one is actually up, so
// a failure here can never leave the user with no pointer.
// ============================================================

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [down, setDown] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 320, damping: 30, mass: 0.6 })
  const ringY = useSpring(y, { stiffness: 320, damping: 30, mass: 0.6 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    setEnabled(true)
    document.documentElement.classList.add('has-custom-cursor')

    const onMove = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest?.('[data-magnetic]')

      if (target) {
        const r = target.getBoundingClientRect()
        // Ring locks to the element's centre; the element itself
        // is simultaneously pulled toward the pointer.
        x.set(r.left + r.width / 2)
        y.set(r.top + r.height / 2)
        setHovering(true)
      } else {
        x.set(e.clientX)
        y.set(e.clientY)
        setHovering(false)
      }
    }

    const onDown = () => setDown(true)
    const onUp = () => setDown(false)
    const onLeave = () => {
      x.set(-100)
      y.set(-100)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.addEventListener('pointerleave', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointerleave', onLeave)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <>
      {/* Ring — springs behind the pointer, grows over magnets */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full border border-cyan-400/70 mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: hovering ? 62 : 30,
          height: hovering ? 62 : 30,
          opacity: down ? 0.55 : 1,
          scale: down ? 0.85 : 1,
        }}
        transition={{ type: 'spring', stiffness: 340, damping: 26 }}
      />

      {/* Dot — tracks exactly, hides while over a magnet */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-cyan-400"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: hovering ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />
    </>
  )
}
