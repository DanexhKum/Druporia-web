// ============================================================
// app/(marketing)/contact/page.tsx
// Modern Contact Page with Formspree Integration
// ============================================================

import type { Metadata } from 'next'
import { Mail, MessageSquare, Building } from 'lucide-react'
import { ContactForm } from '@/components/contact/ContactForm'
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
    <div className="bg-ink-950 min-h-screen">
      <TawkWidget />
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="bg-ink-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(30,58,95,0.22),transparent_34rem)] opacity-80"></div>
        <div className="container-page py-20 relative z-10 text-center max-w-3xl mx-auto">
          <p className="text-sm font-bold uppercase tracking-widest text-white/80 mb-4">
            Contact Druporia
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Let's build something great together.
          </h1>
          <p className="mt-6 text-lg text-white/60">
            Have a project in mind or a question about our products? Fill out the form below and our team will get back to you within 24 hours.
          </p>
        </div>
      </div>

      {/* ── Main Content ────────────────────────────────────── */}
      <div className="container-page py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-8 max-w-6xl mx-auto">
          
          {/* Contact Info Sidebar */}
          <div className="space-y-8 lg:col-span-1">
            <div>
              <h3 className="text-xl font-bold text-white">Reach Out Directly</h3>
              <p className="mt-2 text-sm text-white/55">
                We're always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-white/80">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Email Us</p>
                  <p className="text-sm text-white/55">dhanesh.kum15@gmail.com</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-white/80">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Support</p>
                  <p className="text-sm text-white/55">support@druporia.com</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-white/80">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">HQ</p>
                  <p className="text-sm text-white/55">Global Remote Team</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

        </div>
      </div>
    </div>
  )
}
