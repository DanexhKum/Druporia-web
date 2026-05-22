import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description:
    'Review Druporia refund rules for digital products, custom development, consulting services, and support inquiries.',
  alternates: { canonical: '/refund' },
  openGraph: {
    title: 'Refund Policy — Druporia',
    description:
      'Refund rules for Druporia digital products, custom development, and consulting services.',
    url: '/refund',
  },
}

export default function RefundPage() {
  return (
    <div className="container-page py-16 max-w-3xl prose prose-slate">
      <h1>Refund Policy</h1>
      <p>
        Digital products may be refunded within 14 days of purchase if the product is
        defective or not as described. Contact us with your order details at
        dhanesh.kumar15@gmail.com.
      </p>
      <p>
        Custom development and consulting services are governed by separate agreements.
      </p>
    </div>
  )
}
