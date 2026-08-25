'use client'

// ============================================================
// components/marketing/ParticleCTA.tsx
// Closing CTA with a canvas particle field.
//
// Canvas, not DOM nodes: ~70 animated elements as divs would
// thrash layout every frame. One canvas is a single composited
// layer.
//
// Guards that matter:
//   - the RAF loop only runs while the section is on screen
//     (IntersectionObserver), so it costs nothing when scrolled
//     past — otherwise it burns battery for the whole session
//   - prefers-reduced-motion draws ONE static frame and stops
//   - DPR-aware sizing, re-run on resize, so it stays crisp
//   - the canvas is aria-hidden and purely decorative
// ============================================================

import { useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { MagneticButton } from '@/components/motion/MagneticButton'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  a: number
}

const COUNT = 70
const LINK_DISTANCE = 130

export function ParticleCTA() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let particles: Particle[] = []
    let raf = 0
    let visible = false
    let w = 0
    let h = 0

    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas!.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas!.width = Math.floor(w * dpr)
      canvas!.height = Math.floor(h * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function seed() {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.7 + 0.6,
        a: Math.random() * 0.45 + 0.2,
      }))
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h)

      // Links first, so dots sit on top of the web
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d = Math.hypot(dx, dy)
          if (d < LINK_DISTANCE) {
            ctx!.strokeStyle = `rgba(0,240,255,${(1 - d / LINK_DISTANCE) * 0.16})`
            ctx!.lineWidth = 1
            ctx!.beginPath()
            ctx!.moveTo(particles[i].x, particles[i].y)
            ctx!.lineTo(particles[j].x, particles[j].y)
            ctx!.stroke()
          }
        }
      }

      for (const p of particles) {
        ctx!.fillStyle = `rgba(0,240,255,${p.a})`
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    function step() {
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        // Wrap rather than bounce — bouncing makes the edges read
        // as walls, which draws attention to the canvas bounds.
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0
      }
      draw()
      raf = requestAnimationFrame(step)
    }

    size()
    seed()

    if (reduced) {
      draw() // one static frame, no loop
      return () => {}
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible) {
          visible = true
          raf = requestAnimationFrame(step)
        } else if (!entry.isIntersecting && visible) {
          visible = false
          cancelAnimationFrame(raf)
        }
      },
      { threshold: 0.05 }
    )
    io.observe(section)

    const onResize = () => {
      size()
      seed()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-white/[0.07] bg-ink-950"
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(60%_100%_at_50%_100%,rgba(99,102,241,0.20),transparent_72%)]"
      />

      <div className="container-page relative z-10 py-24 text-center sm:py-32">
        <div className="mx-auto max-w-2xl">
          <p className="chip mx-auto">Start a project</p>

          <h2 className="display mt-6">
            Ready to build
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-white to-indigo-300 bg-clip-text text-transparent">
              something serious?
            </span>
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
