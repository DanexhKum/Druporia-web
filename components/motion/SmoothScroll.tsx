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

    // ── Hash links ─────────────────────────────────────────
    // Lenis owns the scroll position, so a native #hash jump is
    // either ignored or fights the smoothing. Intercept in-page
    // anchors and hand them to lenis.scrollTo instead.
    const onAnchorClick = (e: MouseEvent) => {
      // Let modified clicks (new tab, etc.) behave normally.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return

      const link = (e.target as HTMLElement)?.closest?.('a')
      if (!link) return

      const href = link.getAttribute('href')
      if (!href) return

      // Same-page anchors only: "#id" or "/#id" while already on "/".
      const hash = href.startsWith('#')
        ? href
        : href.startsWith('/#') && window.location.pathname === '/'
          ? href.slice(1)
          : null
      if (!hash || hash === '#') return

      const target = document.querySelector(hash)
      if (!target) return

      e.preventDefault()
      // Offset by the sticky header so the heading isn't hidden.
      lenis.scrollTo(target as HTMLElement, { offset: -88, duration: 1.2 })
      history.pushState(null, '', hash)
    }

    document.addEventListener('click', onAnchorClick)

    // Arriving from another route with a hash: the element may not
    // exist until after paint, so settle first, then scroll.
    const initialHash = window.location.hash
    let settle = 0
    if (initialHash && initialHash.length > 1) {
      settle = window.setTimeout(() => {
        const target = document.querySelector(initialHash)
        if (target) lenis.scrollTo(target as HTMLElement, { offset: -88, immediate: true })
      }, 260)
    }

    return () => {
      window.clearTimeout(settle)
      document.removeEventListener('click', onAnchorClick)
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
