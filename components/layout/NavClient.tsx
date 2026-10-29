'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, useAuth } from '@clerk/nextjs'
import { buttonClasses } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

// Sign in / account controls. Clerk session state is client-side,
// so this small island hydrates while the rest of the nav stays static.
export function NavAuth({ stacked = false }: { stacked?: boolean }) {
  const { isLoaded, isSignedIn } = useAuth()

  if (isLoaded && isSignedIn) {
    return (
      <div className={cn('flex items-center gap-2.5', stacked && 'justify-between')}>
        <Link href="/dashboard" className={buttonClasses('ghost', 'md')}>
          Dashboard
        </Link>
        <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
      </div>
    )
  }

  return (
    <Link href="/sign-in" className={buttonClasses('ghost', 'md', stacked ? 'justify-start px-0 hover:bg-transparent' : undefined)}>
      Sign in
    </Link>
  )
}

export function MobileMenu({ links }: { links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close on navigation and on Escape.
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="ml-auto desk:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="grid h-11 w-11 place-items-center rounded-full border border-line-chip text-ink transition-colors hover:bg-surface-hover"
      >
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-line bg-canvas shadow-pop"
      >
        <div className="container-page flex flex-col py-4">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-line py-3.5 text-[17px] font-medium text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-3">
            <NavAuth stacked />
            <Link href="/contact" onClick={() => setOpen(false)} className={buttonClasses('dark', 'lg', 'w-full')}>
              Book a call
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
