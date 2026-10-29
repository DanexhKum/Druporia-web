import type { Metadata } from 'next'
import { LegalPage } from '@/components/layout/LegalPage'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Review Druporia terms for using the website, purchasing digital products, licensing, support, and custom development services.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms of Service — Druporia',
    description:
      'Terms for Druporia website usage, digital product purchases, licensing, and support.',
    url: '/terms',
  },
}

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <p>
        By using Druporia&apos;s website and purchasing digital products, you agree to
        these terms. Products are licensed for use per product documentation. Redistribution
        or resale without permission is prohibited unless stated otherwise.
      </p>
      <h2>Payments</h2>
      <p>
        Checkout and automated delivery will be enabled via our payment provider. Until
        then, purchases may be arranged directly with our team.
      </p>
      <h2>Support</h2>
      <p>Contact <a href="mailto:dhanesh.kumar15@gmail.com">dhanesh.kumar15@gmail.com</a> for licensing and support inquiries.</p>
    </LegalPage>
  )
}
