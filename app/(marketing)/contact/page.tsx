// ============================================================
// app/(marketing)/contact/page.tsx
// Modern Contact Page with Formspree Integration
// ============================================================

import type { Metadata } from 'next'
import { Mail } from 'lucide-react'
import { ContactForm } from '@/components/contact/ContactForm'
import { SupportTerminal } from '@/components/contact/SupportTerminal'
import { TrustBadges } from '@/components/contact/TrustBadges'
import { TawkWidget } from '@/components/chat/TawkWidget'

export const metadata: Metadata = {
  title: 'Contact Druporia',
  description:
    'Contact Druporia for custom plugins, Shopify apps, AI automation, data analytics, and full-stack product development.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Druporia',
    description:
      'Start a project with Druporia for commerce technology, automation, analytics, and custom development.',
    url: '/contact',
    type: 'website',
    images: [
      {
        url: '/icon.svg',
        width: 64,
        height: 64,
        alt: 'Contact Druporia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Druporia',
    description:
      'Start a project with Druporia for commerce technology, automation, analytics, and custom development.',
    images: ['/icon.svg'],
  },
}

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden bg-ink-950">
      <TawkWidget />
      <div aria-hidden className="wash-top" />
      <div aria-hidden className="blueprint-field" />

      <div className="container-page relative z-10 py-24 sm:py-32">
        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-white/40" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
            Contact
          </span>
        </div>

        <h1 className="mt-6 max-w-2xl font-display text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">
          <span className="title-fill">Tell us what is</span>
          <br />
          <span className="text-white/35">costing you time.</span>
        </h1>

        <p className="mt-6 max-w-lg text-base leading-relaxed text-white/55">
          You get a written scope, a fixed price, and a timeline — before
          anyone writes a line of code.
        </p>

        {/* ── Asymmetrical split: 5 / 7 ─────────────────── */}
        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SupportTerminal />

            <div className="mt-8 space-y-3 border-t border-white/10 pt-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                Direct
              </p>
              <a
                href="mailto:dhanesh.kum15@gmail.com"
                className="flex items-center gap-2.5 text-sm text-white/60 transition-colors hover:text-white"
              >
                <Mail className="h-3.5 w-3.5 shrink-0" />
                dhanesh.kum15@gmail.com
              </a>
              <p className="text-sm text-white/35">Remote-first · Worldwide</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ContactForm />
            <TrustBadges />
          </div>
        </div>
      </div>
    </div>
  )
}
