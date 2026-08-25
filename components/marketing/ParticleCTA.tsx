'use client'

// ============================================================
// components/marketing/ParticleCTA.tsx
// Closing CTA — architectural blueprint grid + mouse spotlight.
//
// The canvas particle constellation that used to live here is
// gone. It read as generic generated ambience and cost a RAF loop
// plus O(n²) link math for ~70 particles; a static grid and one
// composited gradient do more for the page at a fraction of the
// budget.
//
// The spotlight is a Framer motion value driving a radial
// gradient, so pointer moves never touch React state — a
// setState per mousemove would re-render this subtree dozens of
// times a second.
//
// The grid is MASKED by the spotlight rather than painted over,
// so lines brighten under the cursor instead of a pale disc
// floating above them. A fainter base grid sits underneath so
// the section never looks empty away from the pointer.
//
// Touch and reduced-motion visitors get the grid at a flat
// readable opacity with no follow behaviour — there is no
// pointer to follow and no reason to animate.
// ============================================================

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { MagneticButton } from '@/components/motion/MagneticButton'

export function ParticleCTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const [interactive, setInteractive] = useState(false)

  const mx = useMotionValue(50)
  const my = useMotionValue(50)
  const x = useSpring(mx, { stiffness: 120, damping: 22, mass: 0.6 })
  const y = useSpring(my, { stiffness: 120, damping: 22, mass: 0.6 })

  // Percentages, so the mask tracks correctly at any width.
  const spotlight = useMotionTemplate`radial-gradient(38rem circle at ${x}% ${y}%, black 0%, rgba(0,0,0,0.35) 45%, transparent 78%)`

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    setInteractive(fine && !reduceMotion)
  }, [reduceMotion])

  function onMove(e: React.PointerEvent) {
    if (!interactive || !sectionRef.current) return
    const r = sectionRef.current.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width) * 100)
    my.set(((e.clientY - r.top) / r.height) * 100)
  }

  return (
    <section
      ref={sectionRef}
      onPointerMove={onMove}
      className="relative overflow-hidden border-t border-white/10 bg-ink-950"
    >
      {/* Faint base grid, always present */}
      {interactive && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem]"
        />
      )}

      {/* Spotlit grid — masked to follow the pointer */}
      <motion.div
        aria-hidden
        style={
          interactive
            ? { maskImage: spotlight, WebkitMaskImage: spotlight }
            : undefined
        }
        className={`pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] ${
          interactive ? '' : 'opacity-70'
        }`}
      />

      {/* Vignette — stops the grid meeting the edges hard */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_50%,transparent_35%,#0A0A0A_88%)]"
      />

      <div className="container-page relative z-10 py-24 text-center sm:py-32">
        <div className="mx-auto max-w-2xl">
          <p className="chip mx-auto">Start a project</p>

          <h2 className="display mt-6">
            Ready to build
            <br />
            <span className="title-fill">something serious?</span>
          </h2>

          <p className="body-dark mx-auto mt-6 max-w-lg sm:text-lg">
            Tell us the workflow that is costing you time. You get a written
            scope, a fixed price, and a timeline — before anyone writes code.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MagneticButton href="/contact" variant="primary">
              Book a discovery call
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>
            <MagneticButton href="/marketplace" variant="glass">
              Browse marketplace
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  )
}
