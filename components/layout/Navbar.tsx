// ============================================================
// components/layout/Navbar.tsx
// Top navigation — sticky, translucent, gold underline on links.
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
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 shadow-sm shadow-navy-900/5 backdrop-blur-xl">
      <div className="container-page flex h-20 items-center justify-between">
        {/* Logo */}
        <Logo href="/" imageClassName="h-15 w-auto sm:h-15" />

        {/* Nav links — desktop. Gold underline scales from the left
            on hover, and stays extended on the current page. */}
        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-active={pathname === link.href ? 'true' : undefined}
              aria-current={pathname === link.href ? 'page' : undefined}
              className={cn(
                'nav-link',
                pathname === link.href && 'text-navy-900'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth controls */}
        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <>
              <Link href="/dashboard" className="btn-secondary text-xs px-3 py-1.5">
                Dashboard
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-7 h-7',
                  },
                }}
              />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="btn-ghost text-xs px-3 py-1.5">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn-gold text-xs px-4 py-2">
                  Get started
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
