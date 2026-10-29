// ============================================================
// app/sign-up/[[...sign-up]]/page.tsx — Clerk Sign Up Page
// ============================================================

import { SignUp } from '@clerk/nextjs'
import { Logo } from '@/components/branding/Logo'
import { GradientRing } from '@/components/ui/GradientRing'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account',
}

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-5 py-16">
      <GradientRing className="-right-[150px] -top-[230px] h-[380px] w-[380px] [--ring-width:60px]" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-8 flex justify-center">
            <Logo href="/" />
          </div>
          <h1 className="text-[28px] font-semibold tracking-[-0.03em]">Create your account</h1>
          <p className="mt-2 text-[15px] text-body">Keep track of your projects and downloads in one place.</p>
        </div>
        <SignUp
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
