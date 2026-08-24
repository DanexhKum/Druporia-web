// ============================================================
// app/not-found.tsx
// Renders for notFound() — called by the marketplace product page
// and the admin product editor — and for unmatched routes.
// ============================================================

import Link from 'next/link'
import { FileQuestion } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page not found',
}

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04]">
          <FileQuestion className="h-6 w-6 text-white/45" />
        </div>

        <h1 className="mt-5 text-xl font-semibold text-white">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-white/45">
          This page may have been moved, or the product is no longer
          published.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
          <Link href="/marketplace" className="btn-dark-primary justify-center">
            Browse marketplace
          </Link>
          <Link href="/" className="btn-dark-ghost justify-center">
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
