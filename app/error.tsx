'use client'

// ============================================================
// app/error.tsx — root error boundary
// Catches render and Server Action errors below the root layout.
// ============================================================

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RotateCw } from 'lucide-react'

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[error-boundary]', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
          <AlertTriangle className="h-6 w-6 text-amber-600" />
        </div>

        <h1 className="mt-5 text-xl font-semibold text-navy-900">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-navy-500">
          {error.message ||
            'The page could not be loaded. Trying again often resolves it.'}
        </p>

        {error.digest && (
          <p className="mt-3 font-mono text-xs text-navy-400">
            Reference: {error.digest}
          </p>
        )}

        <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="btn-primary justify-center gap-2"
          >
            <RotateCw className="h-4 w-4" />
            Try again
          </button>
          <Link href="/" className="btn-secondary justify-center">
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
