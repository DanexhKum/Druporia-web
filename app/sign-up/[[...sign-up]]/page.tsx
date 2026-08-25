// ============================================================
// app/sign-up/[[...sign-up]]/page.tsx — Clerk Sign Up Page
// ============================================================

import { SignUp } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account',
}

export default function SignUpPage() {
  return (
    <div className="min-h-dvh bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded border border-slate-900 bg-slate-900 text-sm font-bold text-white mb-4">
            D
          </div>
          <h1 className="text-xl font-semibold text-slate-900">
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Get access to the marketplace and start downloading.
          </p>
        </div>
        <SignUp
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
