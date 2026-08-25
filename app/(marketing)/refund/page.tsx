import type { Metadata } from 'next'
import { LegalPage, LegalCallout, type LegalSection } from '@/components/legal/LegalPage'

// ============================================================
// app/(marketing)/refund/page.tsx
//
// ⚠ NOT LEGAL ADVICE. Structured to match how the platform
// behaves and to stay consistent with /terms, but not reviewed by
// a lawyer.
//
// The 14-day window is carried over from the previous version of
// this page — an existing commitment, not one invented here.
//
// Consumer law in several jurisdictions (notably UK/EU) treats
// digital downloads specially: the right to cancel can end once
// download begins, but ONLY with express prior consent. That is
// called out in "Statutory rights" rather than buried, because
// getting it wrong is the most common way a digital refund policy
// becomes unenforceable.
// ============================================================

const LAST_UPDATED = '25 August 2026'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description:
    'When Druporia issues refunds for digital products, how to request one, and how custom development work is treated.',
  alternates: { canonical: '/refund' },
  openGraph: {
    title: 'Refund Policy — Druporia',
    description: 'Refund terms for Druporia digital products and services.',
    url: '/refund',
  },
}

const SECTIONS: LegalSection[] = [
  {
    id: 'summary',
    title: 'Summary',
    body: (
      <>
        <LegalCallout>
          Digital products may be refunded within{' '}
          <strong className="text-white">14 days</strong> of purchase if the
          product is defective or materially not as described. Custom
          development work is governed by its own written agreement.
        </LegalCallout>
        <p>
          The rest of this page explains what qualifies, what does not, and how
          to raise a request.
        </p>
      </>
    ),
  },
  {
    id: 'eligible',
    title: 'When a refund applies',
    body: (
      <>
        <p>We will refund a digital product where:</p>
        <ul className="space-y-2 pl-5">
          <li className="list-disc">
            the files are corrupt, incomplete, or cannot be installed as
            documented;
          </li>
          <li className="list-disc">
            the product does not materially match its description on the
            marketplace listing;
          </li>
          <li className="list-disc">
            a defect prevents the product working as documented and we cannot
            resolve it within a reasonable period;
          </li>
          <li className="list-disc">
            you were charged more than once for the same item.
          </li>
        </ul>
        <p>
          Where a defect is fixable, we will usually offer a corrected build
          first. If that does not resolve it, the refund stands.
        </p>
      </>
    ),
  },
  {
    id: 'not-eligible',
    title: 'When it does not',
    body: (
      <>
        <p>We are generally unable to refund where:</p>
        <ul className="space-y-2 pl-5">
          <li className="list-disc">
            the product works as described and you have changed your mind, or
            bought it by mistake;
          </li>
          <li className="list-disc">
            you lack the technical environment the listing states is required —
            requirements are published on each product page before purchase;
          </li>
          <li className="list-disc">
            the request falls outside the 14-day window;
          </li>
          <li className="list-disc">
            the product has been modified, redistributed, or used in breach of
            its licence.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'statutory',
    title: 'Statutory rights',
    body: (
      <>
        <p>
          Nothing in this policy removes rights you have under the consumer law
          that applies to you. Where that law grants a stronger remedy than this
          policy, the law applies.
        </p>
        <LegalCallout>
          Some jurisdictions treat digital downloads specially: a statutory
          right to cancel can end once the download begins, but only where the
          buyer expressly agreed to that beforehand. If you are unsure of your
          position, ask us before downloading.
        </LegalCallout>
      </>
    ),
  },
  {
    id: 'how-to-request',
    title: 'How to request a refund',
    body: (
      <>
        <p>
          Email us with your order reference, the product name, and a
          description of the problem — including any error messages or
          screenshots that show it. Address at the bottom of this page.
        </p>
        <p>
          We aim to acknowledge requests within one working day and to reach a
          decision within five. Approved refunds are returned to the original
          payment method; how long the funds take to appear depends on your
          provider.
        </p>
      </>
    ),
  },
  {
    id: 'services',
    title: 'Custom development and consulting',
    body: (
      <>
        <p>
          Custom development, integration and consulting engagements are not
          covered by this policy. Each is governed by its own written agreement
          setting out scope, milestones, payment terms and what happens if
          either party ends the engagement early.
        </p>
        <p>
          Where work has been delivered and accepted against an agreed scope, it
          is not refundable. Where an engagement is cancelled mid-way, billing
          is settled against work completed to that point.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: (
      <p>
        We may revise this policy as the service changes. The version that
        applies to a purchase is the one published at the time you made it. The
        revision date at the top of this page reflects the last substantive
        change.
      </p>
    ),
  },
]

export default function RefundPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Refund Policy"
      intro="When we refund digital products, how to request one, and how custom work is treated."
      lastUpdated={LAST_UPDATED}
      sections={SECTIONS}
    />
  )
}
