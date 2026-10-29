import type { Metadata } from 'next'
import { LegalPage } from '@/components/layout/LegalPage'
import { CONTACT_EMAIL, LEGAL_UPDATED } from '@/lib/site-content'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms for using the Druporia website, engaging our development services and using our digital products.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms of Service | Druporia',
    description:
      'Terms for using the Druporia website, services and digital products.',
    url: '/terms',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Druporia' }],
  },
}

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated={LEGAL_UPDATED}>
      <p>
        These terms apply to your use of the Druporia website and to digital products obtained
        from it. By using the site you agree to them. If you do not agree, please do not use the
        site.
      </p>

      <h2>Development services</h2>
      <p>
        Custom development, automation and consulting work is carried out under a written scope
        agreed with each client before work begins. That scope sets out the deliverables,
        milestones, price, payment schedule and support period for the project. Where a project
        scope and these terms differ, the project scope applies.
      </p>

      <h2>Digital products</h2>
      <p>
        Plugins, extensions and other products are licensed, not sold. Unless a product&apos;s
        documentation states otherwise, your licence lets you use the product on your own projects
        or on projects for your clients. You may not resell, redistribute or publish the product
        as your own.
      </p>

      <h2>Accounts</h2>
      <p>
        You are responsible for keeping your sign in details secure and for activity on your
        account. We may suspend accounts that are used to abuse the site or breach these terms.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Do not attempt to disrupt the site, access areas you are not authorised to use, or use the
        site for anything unlawful.
      </p>

      <h2>Intellectual property</h2>
      <p>
        Website content, branding and product code remain the property of Druporia unless agreed
        otherwise. Ownership of work created for clients is set out in each project scope.
      </p>

      <h2>Liability</h2>
      <p>
        The website and its content are provided as is. To the extent permitted by law, Druporia
        is not liable for indirect or consequential losses arising from use of the site or its
        products. Nothing in these terms limits liability that cannot be limited by law.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms from time to time. The date at the top of this page shows when
        they last changed.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms can be sent to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  )
}
