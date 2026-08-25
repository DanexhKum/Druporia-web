import type { Metadata } from 'next'
import { LegalPage, LegalCallout, type LegalSection } from '@/components/legal/LegalPage'

// ============================================================
// app/(marketing)/terms/page.tsx
//
// ⚠ NOT LEGAL ADVICE, AND NOT COMPLETE. Written to match how the
// platform actually behaves today, but a terms document carries
// real liability and this one has not been reviewed by a lawyer.
//
// TWO THINGS MUST BE FILLED IN BEFORE THIS IS RELIED ON — both
// marked [TO CONFIRM] in the text below:
//   • the governing jurisdiction
//   • the registered entity name and address
// I have deliberately NOT invented either. Naming a jurisdiction
// you have no connection to would be worse than leaving it blank,
// because it reads as settled when it is not.
//
// Grounded in: no checkout exists yet (ProductPurchase shows a
// "coming soon" toast), free products download directly after
// sign-in, and the download route enforces a COMPLETED order for
// paid items.
// ============================================================

const LAST_UPDATED = '25 August 2026'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The terms governing use of the Druporia website, marketplace and digital products.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms of Service — Druporia',
    description: 'Terms governing use of Druporia and its digital products.',
    url: '/terms',
  },
}

const SECTIONS: LegalSection[] = [
  {
    id: 'agreement',
    title: 'Agreement to these terms',
    body: (
      <>
        <p>
          These terms govern your use of the Druporia website, the marketplace,
          and any digital product obtained through it. By using the site or
          downloading a product you agree to them.
        </p>
        <LegalCallout>
          <strong className="text-white">[TO CONFIRM]</strong> The registered
          entity name and address behind &ldquo;Druporia&rdquo; must be inserted
          here before these terms are relied on.
        </LegalCallout>
      </>
    ),
  },
  {
    id: 'accounts',
    title: 'Accounts',
    body: (
      <>
        <p>
          Some features require an account, which is created through our
          authentication provider. You are responsible for keeping your
          credentials secure and for activity that occurs under your account.
        </p>
        <p>
          You must provide accurate information and be legally capable of
          entering into this agreement. We may suspend or close an account that
          is used to abuse the service, including attempts to redistribute
          licensed material.
        </p>
      </>
    ),
  },
  {
    id: 'licence',
    title: 'Product licence',
    body: (
      <>
        <p>
          Digital products are licensed, not sold. Unless a product states
          otherwise, obtaining it grants you a non-exclusive, non-transferable
          licence to use and modify it for your own projects or those of your
          clients.
        </p>
        <p>You may not:</p>
        <ul className="space-y-2 pl-5">
          <li className="list-disc">
            resell, sublicense or redistribute the product as-is, or as part of
            a competing product or template marketplace;
          </li>
          <li className="list-disc">
            share download links or account access with third parties;
          </li>
          <li className="list-disc">
            remove or obscure licence, attribution or copyright notices included
            with the files.
          </li>
        </ul>
        <p>
          Intellectual property in the products, the site and its content
          remains with Druporia or its licensors.
        </p>
      </>
    ),
  },
  {
    id: 'purchases',
    title: 'Purchases and delivery',
    body: (
      <>
        <LegalCallout>
          Paid checkout is <strong className="text-white">not yet live</strong>.
          Free products download immediately once you are signed in; paid
          products are currently arranged directly with us, and the terms of any
          such arrangement are confirmed in writing before payment.
        </LegalCallout>
        <p>
          Prices are shown in US dollars and exclude any taxes or duties that
          may apply where you are. Delivery of a digital product is the
          provision of a download link to your account; no physical goods are
          shipped.
        </p>
        <p>
          Download links are time-limited and rate-limited. Generating an
          unusual volume of links may temporarily restrict access while we
          investigate.
        </p>
      </>
    ),
  },
  {
    id: 'services',
    title: 'Custom development services',
    body: (
      <>
        <p>
          Custom development, integration and consulting work is not covered by
          these terms. That work is governed by a separate written agreement
          setting out scope, price, timeline and ownership of deliverables,
          agreed before work begins.
        </p>
        <p>
          Nothing on this site constitutes an offer to perform such work; a
          quotation is an invitation to agree terms, not a binding contract.
        </p>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable use',
    body: (
      <>
        <p>You agree not to:</p>
        <ul className="space-y-2 pl-5">
          <li className="list-disc">
            probe, scan or test the security of the site or attempt to bypass
            access controls;
          </li>
          <li className="list-disc">
            use automated means to scrape content or place unreasonable load on
            the service;
          </li>
          <li className="list-disc">
            submit unlawful, misleading or infringing material through any form
            on the site.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'warranties',
    title: 'Warranties and liability',
    body: (
      <>
        <p>
          Products are provided &ldquo;as is&rdquo;. We warrant that a product
          will materially match its description at the time you obtain it, and
          the refund policy sets out your remedy if it does not.
        </p>
        <p>
          To the fullest extent permitted by law, we exclude liability for
          indirect or consequential loss, loss of profit, and loss of data. Our
          total liability in connection with a product is limited to the amount
          you paid for it.
        </p>
        <p>
          Nothing in these terms limits liability that cannot be limited by law,
          including for fraud or for death or personal injury caused by
          negligence.
        </p>
      </>
    ),
  },
  {
    id: 'termination',
    title: 'Termination',
    body: (
      <p>
        You may stop using the service at any time and request account deletion.
        We may suspend or terminate access where these terms are breached.
        Licences already granted for products you legitimately obtained survive
        termination; the restrictions on redistribution survive with them.
      </p>
    ),
  },
  {
    id: 'governing-law',
    title: 'Governing law',
    body: (
      <LegalCallout>
        <strong className="text-white">[TO CONFIRM]</strong> The governing law
        and the courts having jurisdiction must be specified here. This has been
        left blank deliberately rather than filled with a plausible-looking
        jurisdiction, because the choice has real legal consequences and depends
        on where the entity is registered.
      </LegalCallout>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to these terms',
    body: (
      <p>
        We may revise these terms as the service changes. The revision date at
        the top of this page reflects the last substantive change. Continued use
        after a change constitutes acceptance of the revised terms.
      </p>
    ),
  },
]

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      intro="The terms governing use of this site, the marketplace, and the digital products available through it."
      lastUpdated={LAST_UPDATED}
      sections={SECTIONS}
    />
  )
}
