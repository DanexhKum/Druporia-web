import type { Metadata } from 'next'
import { LegalPage } from '@/components/layout/LegalPage'
import { CONTACT_EMAIL, LEGAL_UPDATED } from '@/lib/site-content'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description:
    'Refund terms for Druporia digital products and custom development services.',
  alternates: { canonical: '/refund' },
  openGraph: {
    title: 'Refund Policy | Druporia',
    description:
      'Refund terms for Druporia digital products and custom development services.',
    url: '/refund',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Druporia' }],
  },
}

export default function RefundPage() {
  return (
    <LegalPage title="Refund Policy" updated={LEGAL_UPDATED}>
      <h2>Digital products</h2>
      <p>
        If a product you obtained from us is defective or does not work as described, contact us
        within 14 days of purchase. We will first try to fix the problem. If we cannot, we will
        refund you in full.
      </p>
      <p>
        To help us resolve things quickly, please include your order details, the platform and
        versions you are using, and a short description of the issue.
      </p>

      <h2>Custom development and consulting</h2>
      <p>
        Project work is billed against the milestones in your written scope. Payment, refund and
        cancellation terms for a project are set out in that scope and agreed before work begins.
        If you are unhappy with any part of a project, tell us as early as possible so we can put
        it right.
      </p>

      <h2>How to request a refund</h2>
      <p>
        Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with your order or project
        details. We reply within one business day, and approved refunds are returned to the
        original payment method.
      </p>
    </LegalPage>
  )
}
