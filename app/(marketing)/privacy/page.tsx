import type { Metadata } from 'next'
import { LegalPage, LegalCallout, type LegalSection } from '@/components/legal/LegalPage'

// ============================================================
// app/(marketing)/privacy/page.tsx
//
// ⚠ NOT LEGAL ADVICE. This describes what the codebase actually
// does — every processor, field and retention behaviour below was
// read out of the source, not assembled from a template. It still
// needs review by someone qualified in your jurisdiction before
// you rely on it.
//
// Grounded in: lib/auth.ts (Clerk sync), prisma/schema.prisma
// (Download stores ipAddress + userAgent), app/api/contact
// (Formspree), components/chat/TawkWidget, lib/storage.ts
// (Supabase), and the Clerk webhook's anonymise-on-delete.
//
// LAST_UPDATED is a constant on purpose: it previously rendered
// new Date(), so the page always claimed to have been revised
// today no matter how stale the text was.
// ============================================================

const LAST_UPDATED = '25 August 2026'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Druporia collects, uses and retains account, order, download and contact data — and which third parties process it.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy — Druporia',
    description:
      'What Druporia collects, why, and which processors are involved.',
    url: '/privacy',
  },
}

const SECTIONS: LegalSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    body: (
      <>
        <p>
          Druporia Technologies (&ldquo;Druporia&rdquo;, &ldquo;we&rdquo;)
          operates this website and the digital product marketplace on it. This
          policy explains what personal data we collect, why we collect it, who
          processes it on our behalf, and how long we keep it.
        </p>
        <LegalCallout>
          In short: we collect what is needed to run an account, deliver a
          purchase, and answer your message. We do not sell personal data, and
          we run no advertising or analytics trackers.
        </LegalCallout>
      </>
    ),
  },
  {
    id: 'data-we-collect',
    title: 'Data we collect',
    body: (
      <>
        <p>
          <strong className="text-zinc-200">Account details.</strong> When you
          sign in, we receive your name, email address and profile image from
          Clerk, our authentication provider, and store them against your
          account record.
        </p>
        <p>
          <strong className="text-zinc-200">Purchase history.</strong> Orders
          record the products bought, the price at the time of purchase, and the
          order status.
        </p>
        <p>
          <strong className="text-zinc-200">Download records.</strong> Each time
          you generate a download link we log the product, the timestamp, and
          the <strong className="text-zinc-200">IP address and browser
          user-agent</strong> of the request. This exists to detect licence
          abuse and to help us support you when a download fails.
        </p>
        <p>
          <strong className="text-zinc-200">Messages.</strong> Contact form and
          newsletter submissions include the name, email address and message
          body you provide.
        </p>
        <p>
          <strong className="text-zinc-200">Server logs.</strong> Our host
          records standard request logs, including IP address, for security and
          diagnostics.
        </p>
      </>
    ),
  },
  {
    id: 'why-we-use-it',
    title: 'Why we use it',
    body: (
      <>
        <p>
          To operate your account and authenticate you; to deliver digital
          products you are entitled to; to detect abuse of download links; to
          reply to your enquiries; and to keep the service secure and working.
        </p>
        <p>
          Where a legal basis is required, we rely on performance of a contract
          for account and order data, and on legitimate interests for security
          logging and abuse prevention.
        </p>
      </>
    ),
  },
  {
    id: 'processors',
    title: 'Third parties who process your data',
    body: (
      <>
        <p>
          We use the following processors. Each handles data only to provide
          their service to us.
        </p>
        <ul className="space-y-2.5 pl-5">
          <li className="list-disc">
            <strong className="text-zinc-200">Clerk</strong> — authentication
            and account management. Sets cookies required to keep you signed in.
          </li>
          <li className="list-disc">
            <strong className="text-zinc-200">Supabase</strong> — database and
            file storage for account, order and product data.
          </li>
          <li className="list-disc">
            <strong className="text-zinc-200">Formspree</strong> — delivers
            contact form and newsletter submissions to our inbox. Your name,
            email and message pass through their service.
          </li>
          <li className="list-disc">
            <strong className="text-zinc-200">Tawk.to</strong> — the live chat
            widget on our home and contact pages. Loads only on those pages and
            sets its own cookies.
          </li>
          <li className="list-disc">
            <strong className="text-zinc-200">Vercel</strong> — application
            hosting, including standard server request logs.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies',
    body: (
      <>
        <p>
          We use no advertising or analytics cookies. Clerk sets cookies
          necessary for authentication, and Tawk.to sets cookies to maintain
          your chat session on the pages where it appears.
        </p>
        <p>
          Blocking them will sign you out and disable live chat respectively.
          The rest of the site works without either.
        </p>
      </>
    ),
  },
  {
    id: 'retention',
    title: 'Retention and deletion',
    body: (
      <>
        <p>
          Account, order and download records are retained for as long as your
          account exists. Order history is kept afterwards where we are required
          to retain it for accounting purposes.
        </p>
        <LegalCallout>
          When an account is deleted we{' '}
          <strong className="text-white">anonymise</strong> it rather than
          removing the rows: your name and email are replaced and the avatar
          cleared, while the order records remain so the accounting history
          stays intact.
        </LegalCallout>
      </>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your rights',
    body: (
      <>
        <p>
          You can ask us for a copy of the personal data we hold about you, ask
          us to correct it, or ask us to delete your account. Email the address
          at the bottom of this page and we will respond within 30 days.
        </p>
        <p>
          Depending on where you live you may also have the right to object to
          certain processing, or to complain to your local data protection
          authority.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: (
      <p>
        We may update this policy as the service changes. The revision date at
        the top of this page reflects the last substantive change. Material
        changes affecting how we use your data will be communicated to
        account holders by email.
      </p>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="What we collect, why we collect it, and who processes it on our behalf."
      lastUpdated={LAST_UPDATED}
      sections={SECTIONS}
    />
  )
}
