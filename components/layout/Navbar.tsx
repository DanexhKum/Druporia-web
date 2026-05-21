// ============================================================
// components/layout/Navbar.tsx
// Top navigation — clean, 1px bordered, no shadows or gradients.
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
  { label: 'Contact', href: '/contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const { isSignedIn } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 shadow-sm shadow-slate-900/5 backdrop-blur-xl">
      <div className="container-page flex h-20 items-center justify-between">
        {/* Logo */}
        <Logo href="/" imageClassName="h-15 w-auto sm:h-15" />

        {/* Nav links — desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-full px-3.5 py-2 text-sm font-semibold transition-all duration-200',
                pathname === link.href
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
                afterSignOutUrl="/"
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
                <button className="btn-primary text-xs px-3 py-1.5">
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
