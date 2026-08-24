// ============================================================
// components/layout/Navbar.tsx
// Dark sticky header with a floating capsule nav.
//
// The reference floats a fully transparent nav over the hero.
// This is a dark translucent bar instead, because the same
// Navbar renders above marketplace/contact/insights, which are
// still light — a transparent bar would vanish there. Once the
// remaining pages go dark this can drop to fully transparent.
//
// The logo is forced white (brightness-0 invert) so it reads on
// the dark ground regardless of the source PNG's own colours.
// ============================================================

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from '@clerk/nextjs'
import { cn } from '@/lib/utils'
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

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-ink-950/80 backdrop-blur-xl">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Logo
          href="/"
          imageClassName="h-11 w-auto brightness-0 invert sm:h-12"
        />

        {/* Floating capsule — centred on wide viewports */}
        <nav className="hidden md:absolute md:left-1/2 md:flex md:-translate-x-1/2">
          <div className="pill-nav">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-active={pathname === link.href ? 'true' : undefined}
                aria-current={pathname === link.href ? 'page' : undefined}
                className="pill-nav-item"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="btn-pill-ghost px-4 py-2 text-[12px]"
              >
                Dashboard
              </Link>
              <UserButton
                appearance={{ elements: { avatarBox: 'w-8 h-8' } }}
              />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button
                  className={cn(
                    'mono-label hidden rounded-full px-4 py-2 text-white/60',
                    'transition-colors hover:text-white sm:inline-flex'
                  )}
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn-pill-solid px-5 py-2 text-[12px]">
                  Get Started
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
