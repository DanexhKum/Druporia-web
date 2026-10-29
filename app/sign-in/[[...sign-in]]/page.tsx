// ============================================================
// app/sign-in/[[...sign-in]]/page.tsx — Clerk Sign In Page
// ============================================================

import { SignIn } from '@clerk/nextjs'
import { Logo } from '@/components/branding/Logo'
import { GradientRing } from '@/components/ui/GradientRing'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
}

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-5 py-16">
      <GradientRing className="-right-[150px] -top-[230px] h-[380px] w-[380px] [--ring-width:60px]" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-8 flex justify-center">
            <Logo href="/" />
          </div>
          <h1 className="text-[28px] font-semibold tracking-[-0.03em]">Sign in to Druporia</h1>
          <p className="mt-2 text-[15px] text-body">Access your projects, downloads and account.</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: 'w-full',
              cardBox: 'w-full shadow-hero rounded-card-lg',
              card: 'w-full shadow-none',
            },
          }}
        />
      </div>
    </div>
  )
}
