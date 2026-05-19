// ============================================================
// app/sign-in/[[...sign-in]]/page.tsx — Clerk Sign In Page
// ============================================================

import { SignIn } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded border border-slate-900 bg-slate-900 text-sm font-bold text-white mb-4">
            D
          </div>
          <h1 className="text-xl font-semibold text-slate-900">
            Sign in to DevPortfolio
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Access your purchased products and downloads.
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'w-full shadow-none border border-slate-200 rounded-lg',
            },
          }}
        />
      </div>
    </div>
  )
}
