// ============================================================
// components/layout/Navbar.tsx
// Sticky blurred header with chip-style navigation.
//
// Direction reference: "Paradigm — Tech Consulting Landing Page"
// by Phenomenon Studio. Borrowed: separate bordered nav chips
// rather than one capsule, hairline underline on the header,
// near-black translucent ground.
//
// Includes a mobile drawer — the previous version simply hid the
// links below md with no way to reach them.
// ============================================================

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from '@clerk/nextjs'
import { Logo } from '@/components/branding/Logo'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Services', href: '/#services' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const { isSignedIn } = useAuth()
  const [open, setOpen] = useState(false)

  // Close the drawer on navigation, and lock body scroll while open.
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="header-blur">
      <div className="container-page flex h-[72px] items-center justify-between gap-4">
        <Logo
          href="/"
          imageClassName="h-10 w-auto brightness-0 invert sm:h-11"
        />

        {/* Desktop chips */}
        <nav className="hidden items-center gap-2 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-active={pathname === link.href ? 'true' : undefined}
              aria-current={pathname === link.href ? 'page' : undefined}
              className="nav-chip"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="nav-chip hidden sm:inline-flex"
              >
                Dashboard
              </Link>
              <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="nav-chip hidden sm:inline-flex">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn-dark-solid px-5 py-2.5 text-[12px]">
                  Let&apos;s talk
                </button>
              </SignUpButton>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="nav-chip p-2.5 lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/[0.07] bg-ink-950/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container-page flex flex-col gap-2 py-5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  data-active={pathname === link.href ? 'true' : undefined}
                  className="nav-chip w-full justify-start px-4 py-3 text-left"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
