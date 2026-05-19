// ============================================================
// components/layout/Footer.tsx
// ============================================================

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-page py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">DevPortfolio</p>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Freelance full-stack developer. Building premium web apps,
              WooCommerce plugins, and Chrome extensions.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Navigate
            </p>
            <ul className="space-y-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'Marketplace', href: '/marketplace' },
                { label: 'Services', href: '/#services' },
                { label: 'Contact', href: '/#contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Account
            </p>
            <ul className="space-y-2">
              {[
                { label: 'Sign In', href: '/sign-in' },
                { label: 'Dashboard', href: '/dashboard' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="section-divider" />
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} DevPortfolio. All rights reserved.
          </p>
          <p className="text-xs text-slate-400">
            Built with Next.js, Tailwind CSS & Clerk
          </p>
        </div>
      </div>
    </footer>
  )
}
