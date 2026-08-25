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

declare global {
  interface Window {
    __lenis?: {
      stop: () => void
      start: () => void
      resize: () => void
      scrollTo: (
        target: number | HTMLElement,
        opts?: { immediate?: boolean; force?: boolean; offset?: number; duration?: number }
      ) => void
    }
  }
}
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

    // Published so the mobile drawer can pause scrolling while it
    // is open. Lenis runs its own RAF loop and keeps applying
    // momentum no matter what `overflow` says, so a CSS-only lock
    // cannot hold it — it has to be told to stop.
    window.__lenis = lenis

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    ScrollTrigger.refresh()

    // ── Hash links ─────────────────────────────────────────
    // Lenis owns the scroll position, so a native #hash jump is
    // either ignored or fights the smoothing. Intercept in-page
    // anchors and hand them to lenis.scrollTo instead.
    // NOTE: this runs in the CAPTURE phase, deliberately. Next's
    // <Link> calls preventDefault() in its own onClick so it can do a
    // client-side navigation; a bubble-phase listener therefore sees
    // defaultPrevented === true and bails, and the browser's native
    // hash jump wins — landing the heading flush under the sticky
    // header with no offset. Capturing lets us claim the event first,
    // and <Link> then stands down because it checks defaultPrevented
    // before navigating.
    const onAnchorClick = (e: MouseEvent) => {
      // Let modified clicks (new tab, etc.) behave normally.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return
      if (e.shiftKey || e.altKey) return

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
      history.pushState(null, '', hash)

      // Capturing means this runs BEFORE the mobile drawer's React
      // handler has unpinned <body>. Two problems if we scroll now:
      // the pinned body collapses the document to viewport height so
      // the target measures wrong, and Lenis re-syncs to the clamped
      // offset when it restarts, cancelling the tween. So wait for the
      // unpin — a frame count would be a guess, since React does not
      // promise to flush the cleanup within any particular frame — and
      // give start() one more frame to land after it.
      const scrollWhenReady = (frames = 0) => {
        if (document.body.style.position === 'fixed' && frames < 40) {
          requestAnimationFrame(() => scrollWhenReady(frames + 1))
          return
        }
        requestAnimationFrame(() => {
          const el = document.querySelector(hash)
          if (!el) return
          // Pinning the body collapsed the document, so Lenis's
          // ResizeObserver recomputed its scroll limit to ~0. That
          // observer fires asynchronously and has not necessarily
          // caught up with the unpin yet — without this recompute the
          // target below is clamped to 0 and the page never moves.
          lenis.resize()
          // Offset by the sticky header so the heading isn't hidden.
          lenis.scrollTo(el as HTMLElement, {
            offset: -88,
            duration: 1.2,
            force: true,
          })
        })
      }
      scrollWhenReady()
    }

    document.addEventListener('click', onAnchorClick, true)

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
      document.removeEventListener('click', onAnchorClick, true)
      gsap.ticker.remove(tick)
      delete window.__lenis
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
