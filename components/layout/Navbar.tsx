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
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="container-page flex h-14 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-bold text-slate-900"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded border border-blue-600 bg-blue-600 text-xs font-bold text-white shadow-sm">
            D
          </span>
          <span className="tracking-tight text-lg">Druporia</span>
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded px-3 py-1.5 text-sm font-medium transition-colors duration-150',
                pathname === link.href
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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
