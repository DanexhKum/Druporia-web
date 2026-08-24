'use client'

// ============================================================
// components/marketing/AnimateIn.tsx
// Scroll-triggered entrance animation.
//
// FAILS VISIBLE, NOT INVISIBLE. An earlier version set
// initial="hidden" (opacity 0) directly, which meant the
// server-rendered HTML shipped ~38 elements at opacity:0. If JS
// was slow, blocked, or errored, most of the page was blank.
//
// Now the hidden state is only applied after mount, so the
// server output is fully visible and the animation is a
// progressive enhancement. prefers-reduced-motion skips it.
// ============================================================

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { useEffect, useState, type ReactNode } from 'react'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

/** True only after the component has mounted on the client. */
function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}

interface AnimateInProps {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'article'
}

export function AnimateIn({
  children,
  className,
  delay = 0,
  as = 'div',
}: AnimateInProps) {
  const Component = motion[as]
  const mounted = useMounted()
  const reduceMotion = useReducedMotion()
  const animate = mounted && !reduceMotion

  return (
    <Component
      initial={animate ? 'hidden' : false}
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      variants={fadeUp}
      className={className}
    >
      {children}
    </Component>
  )
}

interface StaggerGridProps {
  children: ReactNode
  className?: string
}

export function StaggerGrid({ children, className }: StaggerGridProps) {
  const mounted = useMounted()
  const reduceMotion = useReducedMotion()
  const animate = mounted && !reduceMotion

  return (
    <motion.div
      initial={animate ? 'hidden' : false}
      whileInView="visible"
      viewport={{ once: true, margin: '-48px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
