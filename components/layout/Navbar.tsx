// ============================================================
// components/layout/Navbar.tsx
// Site navigation. Server-rendered; only the auth controls and
// the mobile menu toggle hydrate (see NavClient.tsx).
// ============================================================

import Link from 'next/link'
import { Logo } from '@/components/branding/Logo'
import { Button } from '@/components/ui/Button'
import { NAV_LINKS } from '@/lib/site-content'
import { NavAuth, MobileMenu } from '@/components/layout/NavClient'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/95 backdrop-blur supports-[backdrop-filter]:bg-canvas/85">
      <nav
        aria-label="Main"
        className="container-page flex h-[70px] items-center gap-9 desk:h-[83px]"
      >
        <Logo href="/" />

        <ul className="ml-5 hidden items-center gap-[30px] desk:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-md text-[15px] font-medium text-nav transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto hidden items-center gap-2.5 desk:flex">
          <NavAuth />
          <Button href="/contact" variant="dark">
            Book a call
          </Button>
        </div>

        <MobileMenu links={NAV_LINKS} />
      </nav>
    </header>
  )
}
