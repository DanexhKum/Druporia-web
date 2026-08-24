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
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <FileQuestion className="h-6 w-6 text-slate-500" />
        </div>

        <h1 className="mt-5 text-xl font-semibold text-slate-900">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          This page may have been moved, or the product is no longer
          published.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
          <Link href="/marketplace" className="btn-primary justify-center">
            Browse marketplace
          </Link>
          <Link href="/" className="btn-secondary justify-center">
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
