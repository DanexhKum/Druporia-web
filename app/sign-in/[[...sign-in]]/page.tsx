// ============================================================
// app/sign-in/[[...sign-in]]/page.tsx — Clerk Sign In Page
// ============================================================

import { SignIn } from '@clerk/nextjs'
import { Logo } from '@/components/branding/Logo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
}

export default function SignInPage() {
  return (
    <div className="min-h-dvh bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-6">
            <Logo href="/" imageClassName="h-10 w-auto" />
          </div>
          <h1 className="text-xl font-semibold text-slate-900">
            Sign in to Druporia
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
