'use client'

// ============================================================
// app/admin/error.tsx
// Admin Server Actions signal validation failures by throwing
// Error with a message meant for the operator — e.g. "Another
// product already uses this slug". Without this boundary those
// surfaced as the default Next error screen.
// ============================================================

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RotateCw } from 'lucide-react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[admin-error-boundary]', error)
  }, [error])

  return (
    <div className="max-w-2xl">
      <div className="card border-amber-200 bg-amber-50/50 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100">
            <AlertTriangle className="h-4 w-4 text-amber-700" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-semibold text-amber-900">
              That action could not be completed
            </h1>
            <p className="mt-1.5 text-sm text-amber-800">
              {error.message ||
                'An unexpected error occurred. Your changes were not saved.'}
            </p>

            {error.digest && (
              <p className="mt-2 font-mono text-xs text-amber-700/70">
                Reference: {error.digest}
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={reset}
                className="btn-primary gap-2"
              >
                <RotateCw className="h-4 w-4" />
                Try again
              </button>
              <Link href="/admin" className="btn-secondary">
                Back to overview
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
