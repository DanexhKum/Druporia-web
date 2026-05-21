import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Terms of Service' }

export default function TermsPage() {
  return (
    <div className="container-page py-16 max-w-3xl prose prose-slate">
      <h1>Terms of Service</h1>
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
      <p>Contact hello@druporia.com for licensing and support inquiries.</p>
    </div>
  )
}
