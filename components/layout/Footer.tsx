// ============================================================
// components/layout/Footer.tsx
// ============================================================

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-page py-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded border border-blue-600 bg-blue-600 text-[10px] font-bold text-white shadow-sm">
                D
              </span>
              Druporia
            </p>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed max-w-xs">
              Enterprise technology solutions, custom plugins, AI integrations, and full-stack development for modern commerce.
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
                { label: 'Contact', href: '/contact' },
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
            © {new Date().getFullYear()} Druporia. All rights reserved.
          </p>
          <p className="text-xs text-slate-400">
            Built with Next.js, Tailwind CSS & Clerk
          </p>
        </div>
      </div>
    </footer>
  )
}
