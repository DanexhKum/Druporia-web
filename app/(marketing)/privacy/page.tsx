import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read how Druporia handles account data, contact submissions, marketplace orders, downloads, and technical logs.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy — Druporia',
    description:
      'How Druporia handles account, contact, order, download, and technical data.',
    url: '/privacy',
  },
}

// Bump this by hand whenever the policy text changes. It previously
// rendered new Date(), so the page always claimed to have been updated
// today no matter how stale the content was.
const LAST_UPDATED = 'August 24, 2026'

export default function PrivacyPage() {
  return (
    <div className="container-page py-16 max-w-3xl prose prose-slate">
      <h1>Privacy Policy</h1>
      <p>Last updated: {LAST_UPDATED}</p>
      <p>
        Druporia (&quot;we&quot;) respects your privacy. This page describes what
        we collect, why, and which third parties process it on our behalf.
      </p>

      <h2>Data we collect</h2>
      <ul>
        <li>
          <strong>Account details</strong> — your name, email address, and
          profile image, received from Clerk when you sign in.
        </li>
        <li>
          <strong>Purchase history</strong> — the products you order, the price
          paid at the time, and order status.
        </li>
        <li>
          <strong>Download records</strong> — each time you generate a download
          link we record the product, the time, and the{' '}
          <strong>IP address and browser user-agent</strong> of the request.
          This exists to detect licence abuse and to support you if a download
          fails.
        </li>
        <li>
          <strong>Contact form submissions</strong> — the name, email address,
          and message you send us.
        </li>
      </ul>

      <h2>Third parties who process your data</h2>
      <ul>
        <li>
          <strong>Clerk</strong> — authentication and account management. Sets
          cookies required to keep you signed in.
        </li>
        <li>
          <strong>Supabase</strong> — database and file storage hosting for
          account, order, and product data.
        </li>
        <li>
          <strong>Formspree</strong> — delivers contact form submissions to our
          inbox. Your name, email, and message pass through their service.
        </li>
        <li>
          <strong>Tawk.to</strong> — the live chat widget on our home and
          contact pages. Loads on those pages and sets its own cookies.
        </li>
        <li>
          <strong>Vercel</strong> — application hosting, including standard
          server request logs.
        </li>
      </ul>

      <h2>Cookies</h2>
      <p>
        We do not use advertising or analytics cookies. Clerk sets cookies
        necessary for authentication, and Tawk.to sets cookies to maintain your
        chat session on the pages where it appears. Blocking them will sign you
        out and disable live chat respectively.
      </p>

      <h2>Retention</h2>
      <p>
        Account, order, and download records are retained for as long as your
        account exists, and order history is kept afterwards where we are
        required to for accounting purposes. If you delete your account, we
        anonymise your personal details rather than removing the order rows.
      </p>

      <h2>Your rights</h2>
      <p>
        You can request a copy of your data, ask us to correct it, or ask us to
        delete your account, by emailing the address below.
      </p>

      <h2>Contact</h2>
      <p>Questions: dhanesh.kum15@gmail.com</p>
    </div>
  )
}
