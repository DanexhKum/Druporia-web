import type { Metadata } from 'next'
import { LegalPage } from '@/components/layout/LegalPage'
import { CONTACT_EMAIL, LEGAL_UPDATED } from '@/lib/site-content'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Druporia collects, uses and protects personal data from our website, contact form, client accounts and downloads.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy | Druporia',
    description:
      'How Druporia collects, uses and protects personal data.',
    url: '/privacy',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Druporia' }],
  },
}

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated={LEGAL_UPDATED}>
      <p>
        This policy explains what personal data Druporia Technologies (&quot;Druporia&quot;,
        &quot;we&quot;, &quot;us&quot;) collects when you use this website, contact us or work
        with us, how we use it, and the choices you have.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Enquiries.</strong> When you use our contact form or email us, we receive your
          name, email address, the services you selected and anything you include in your message.
        </li>
        <li>
          <strong>Accounts.</strong> If you create an account, our authentication provider shares
          your name, email address and profile image with us.
        </li>
        <li>
          <strong>Orders and downloads.</strong> If you obtain one of our products, we keep a record
          of the order and of each download linked to your account.
        </li>
        <li>
          <strong>Technical data.</strong> Like most websites, our hosting provider records basic
          request data such as IP address, browser type and the pages requested, for security and
          performance.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To reply to your enquiry and arrange a discovery call</li>
        <li>To deliver projects, products and downloads you have asked for</li>
        <li>To operate, secure and improve the website</li>
        <li>To meet legal, tax and accounting obligations</li>
      </ul>
      <p>
        We do not sell your personal data and we do not use it for advertising.
      </p>

      <h2>Service providers</h2>
      <p>
        We use a small number of trusted providers to run this website. Each processes data only
        on our behalf and for the purposes described here:
      </p>
      <ul>
        <li><strong>Vercel</strong> for website hosting</li>
        <li><strong>Clerk</strong> for account sign in and authentication</li>
        <li><strong>Supabase</strong> for our database and file storage</li>
        <li><strong>Formspree</strong> for delivering contact form messages to our inbox</li>
      </ul>

      <h2>Cookies</h2>
      <p>
        We use only the cookies needed for the site to work, such as keeping you signed in. We do
        not use advertising or tracking cookies.
      </p>

      <h2>How long we keep data</h2>
      <p>
        We keep enquiry emails for as long as needed to respond and follow up, and project and
        order records for as long as required for accounting and legal purposes. You can ask us to
        delete your account and associated data at any time.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live, you may have the right to access, correct, export or delete
        your personal data, and to object to or restrict how we use it. To make a request, email
        us and we will respond within 30 days.
      </p>

      <h2>Security</h2>
      <p>
        We use encrypted connections, access controls and reputable infrastructure providers to
        protect your data. No system is perfectly secure, but we take reasonable steps to keep your
        information safe.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we change this policy, we will update the date at the top of this page.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about privacy can be sent to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  )
}
