'use client'

// ============================================================
// components/motion/SmoothScroll.tsx
// Lenis smooth scroll, driven by GSAP's ticker and wired into
// ScrollTrigger so both share one RAF loop and one scroll source.
//
// Running Lenis and ScrollTrigger on separate loops is the usual
// cause of jittery pinned sections — ScrollTrigger reads a scroll
// position Lenis has already moved past. scrollerProxy + a single
// ticker keeps them in lockstep.
//
// Disabled entirely for prefers-reduced-motion: hijacking scroll
// is exactly what that setting asks you not to do.
// ============================================================

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReduced) return

    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Native momentum on touch is better than anything we'd fake.
      syncTouch: false,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
