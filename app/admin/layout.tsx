// ============================================================
// app/admin/layout.tsx
// Admin area layout — stripped, minimal, high-contrast.
// Server-side ADMIN role check via requireAdmin() before render.
// ============================================================

import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { UserButton } from '@clerk/nextjs'
import { Logo } from '@/components/branding/Logo'
import {
  LayoutDashboard,
  PackagePlus,
  ShieldCheck,
  Users,
  MessageSquareQuote,
  Wrench,
  CircleHelp,
} from 'lucide-react'

const ADMIN_NAV = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Add Product', href: '/admin/add-product', icon: PackagePlus },
  { label: 'Services', href: '/admin/services', icon: Wrench },
  { label: 'FAQs', href: '/admin/faqs', icon: CircleHelp },
  { label: 'Team', href: '/admin/team', icon: Users },
  { label: 'Reviews', href: '/admin/reviews', icon: MessageSquareQuote },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // ── Enforce ADMIN role on every admin page render ────────────
  // If unauthorized, requireAdmin() calls redirect() internally.
  // No second factor is enforced — see the note in lib/auth.ts.
  await requireAdmin()

  return (
    <div className="light-surface min-h-screen bg-slate-50 text-slate-900">
      {/* Admin top bar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo href="/" imageClassName="h-8 w-auto" />
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Admin
              </span>
            </div>
          </div>
          <UserButton />
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-0 lg:flex-row">
        {/* Sidebar nav */}
        <aside className="border-b border-slate-200 bg-white lg:w-56 lg:border-b-0 lg:border-r lg:min-h-[calc(100vh-53px)]">
          <nav className="p-4 space-y-0.5">
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Management
            </p>
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 rounded px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <Icon className="h-4 w-4 text-slate-400" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
