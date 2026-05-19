// ============================================================
// app/(app)/layout.tsx — Authenticated app layout
// ============================================================

import { requireAuth } from '@/lib/auth'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-slate-50/50">{children}</main>
      <Footer />
    </div>
  )
}
