// ============================================================
// components/layout/Navbar.tsx
// Sticky header whose chrome appears only once you scroll.
//
// At the top of the page the header is fully transparent, so the
// hero reads edge-to-edge. Past a threshold it fades in
// backdrop-blur-md, bg-black/40 and a 1px white/10 rule. That
// transition is what makes the header feel attached to the page
// rather than parked on top of it.
//
// Scroll state is read from Lenis-driven native scroll via a
// passive listener and stored as a boolean, NOT the raw offset —
// re-rendering on every scroll frame would undo the smooth
// scrolling we just added.
// ============================================================

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from '@clerk/nextjs'
import { Logo } from '@/components/branding/Logo'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Services', href: '/#services' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' },
]

const EASE = [0.16, 1, 0.3, 1] as const

export function Navbar() {
  const pathname = usePathname()
  const { isSignedIn } = useAuth()
  const reduceMotion = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  // Boolean state only — see the note at the top of the file.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  // Lock the page while the drawer is open, and restore on close.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Escape closes the drawer.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-500',
        scrolled || open
          ? 'border-b border-white/10 bg-black/60 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      )}
      style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
    >
      <div className="container-page flex h-[72px] items-center justify-between gap-4">
        <Logo href="/" imageClassName="h-9 w-auto brightness-0 invert sm:h-10" />

        {/* Desktop nav — plain links with an underline indicator */}
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className="group relative py-1 text-sm text-white/60 transition-colors duration-300 hover:text-white"
              >
                {link.label}
                <span
                  aria-hidden
                  className={cn(
                    'absolute -bottom-0.5 left-0 h-px w-full origin-left bg-white transition-transform duration-500',
                    active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  )}
                  style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
                />
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="hidden rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/25 hover:text-white sm:inline-flex"
              >
                Dashboard
              </Link>
              <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="hidden px-3 py-2 text-sm text-white/60 transition-colors hover:text-white sm:inline-flex">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="group inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-ink-950 transition-transform duration-300 hover:scale-[1.03]">
                  Let&apos;s talk
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </SignUpButton>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="rounded-lg border border-white/10 p-2.5 text-white/70 transition-colors hover:border-white/25 hover:text-white lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ──────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 top-[72px] z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            />

            <motion.nav
              id="mobile-drawer"
              initial={reduceMotion ? { opacity: 0 } : { y: '-100%' }}
              animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { y: '-100%' }}
              transition={{ duration: 0.5, ease: EASE }}
              className="absolute inset-x-0 top-full z-50 border-b border-white/10 bg-ink-950 lg:hidden"
            >
              <div className="container-page flex flex-col py-4">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.06 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center justify-between border-b border-white/[0.06] py-4 font-display text-2xl font-semibold text-white/80 transition-colors hover:text-white"
                    >
                      {link.label}
                      <ArrowUpRight className="h-4 w-4 text-white/30" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
