// ============================================================
// app/(marketing)/layout.tsx
// Shared layout for public-facing marketing pages.
// ============================================================

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import { CustomCursor } from '@/components/motion/CustomCursor'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SmoothScroll>
      <div className="flex min-h-screen flex-col bg-ink-950 text-white">
        <CustomCursor />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </SmoothScroll>
  )
}
