// ============================================================
// app/(marketing)/contact/page.tsx
// Contact / discovery-call request. Reads ?service= params from
// the homepage picker to pre-select services in the form.
// ============================================================

import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact/ContactForm'
import { PageHeader } from '@/components/ui/Section'
import { CONTACT_EMAIL, PROCESS_STEPS, parseServiceParam } from '@/lib/site-content'

export const metadata: Metadata = {
  title: 'Book a free discovery call',
  description:
    'Tell Druporia what you are building: custom plugins, Shopify apps, AI automation, data dashboards or full-stack platforms. We reply within one business day.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Book a free discovery call | Druporia',
    description:
      'Start a project with Druporia: a free 30-minute call, then a fixed-price scope.',
    url: '/contact',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Contact Druporia' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book a free discovery call | Druporia',
    description:
      'Start a project with Druporia: a free 30-minute call, then a fixed-price scope.',
    images: ['/og.png'],
  },
}

interface PageProps {
  searchParams: Promise<{ service?: string | string[] }>
}

export default async function ContactPage({ searchParams }: PageProps) {
  const { service } = await searchParams
  const initialServices = parseServiceParam(service)

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Book a free discovery call"
        description="Tell us what you’re building. We’ll reply within one business day with next steps and a time for a free 30-minute call, with no commitment."
      />

      <section className="container-page grid gap-12 pb-20 desk:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] desk:gap-16 desk:pb-section">
        <aside className="flex flex-col gap-10">
          <div>
            <h2 className="text-h3-sm font-semibold">Reach us directly</h2>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-3 inline-block font-medium text-orange-text transition-colors hover:text-orange-deep"
            >
              {CONTACT_EMAIL}
            </a>
            <p className="mt-1.5 text-[15px] text-muted-soft">Remote-first · Worldwide</p>
          </div>

          <div>
            <h2 className="text-h3-sm font-semibold">What happens next</h2>
            <ol className="mt-5 flex flex-col gap-5">
              {PROCESS_STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="grid h-[30px] w-[30px] flex-none place-items-center rounded-full bg-brand text-[13px] font-semibold text-white"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="mt-1 text-[15px] leading-[1.55] text-body">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <ContactForm key={initialServices.join(',')} initialServices={initialServices} />
      </section>
    </>
  )
}
