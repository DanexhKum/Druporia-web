import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader, SectionHeading } from '@/components/ui/Section'
import { CtaBand, HowWeWork } from '@/components/marketing/HomeSections'
import { TeamSection } from '@/components/marketing/TeamSection'
import { DEFAULT_SERVICES } from '@/lib/default-services'
import { SERVICE_KEY_TO_OPTION, contactHref } from '@/lib/site-content'
import { getTeamMembers } from '@/lib/team'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'About',
  description:
    'Druporia is a small, senior engineering team building plugins, Shopify apps, automation, data and full platforms for commerce brands.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About | Druporia',
    description:
      'A small, senior engineering team for growing commerce brands.',
    url: '/about',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Druporia' }],
  },
}

const PRINCIPLES = [
  {
    title: 'Scope before code',
    description:
      'Every project starts with a written, fixed-price scope, so you know what you are getting and what it costs before any work begins.',
  },
  {
    title: 'Senior people on every project',
    description:
      'The engineers on your discovery call are the people writing your code. Nothing is passed down a chain.',
  },
  {
    title: 'Work in the open',
    description:
      'Weekly demos, a shared board and direct access to the team mean you always know where things stand.',
  },
  {
    title: 'Built to be handed over',
    description:
      'Readable code, clear documentation and a support window after launch. You own what we build and are never locked in.',
  },
]

export default async function AboutPage() {
  const team = await getTeamMembers()

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A small engineering team for growing commerce brands."
        description="Druporia designs and builds the software behind online stores: plugins, Shopify apps, automation, data and full platforms. We work directly with founders, operators and in-house teams who need senior engineers without the overhead of a large agency."
      />

      <section className="container-page grid gap-12 border-t border-line pb-20 pt-16 desk:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] desk:gap-16 desk:pb-section desk:pt-20">
        <SectionHeading eyebrow="How we think" title="What you can expect from us" size="sm" />
        <div className="grid gap-x-12 gap-y-10 tab:grid-cols-2">
          {PRINCIPLES.map((item) => (
            <div key={item.title} className="flex flex-col gap-2.5 border-t-2 border-ink pt-[22px]">
              <h3 className="text-[21px] font-semibold tracking-[-0.02em]">{item.title}</h3>
              <p className="text-[15.5px] leading-[1.6] text-body">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page grid gap-12 pb-20 desk:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] desk:gap-16 desk:pb-section">
        <SectionHeading
          eyebrow="What we do"
          title="Six things, done properly"
          size="sm"
        />
        <ul className="flex flex-col">
          {DEFAULT_SERVICES.map((service) => {
            const option = SERVICE_KEY_TO_OPTION[service.sourceKey]
            return (
              <li key={service.sourceKey} className="border-t border-line first:border-t-0 desk:first:border-t">
                <Link
                  href={contactHref(option ? [option] : [])}
                  className="group grid gap-2 py-6 tab:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] tab:gap-8"
                >
                  <span className="text-h3-sm font-semibold transition-colors group-hover:text-orange-text">
                    {service.title}
                  </span>
                  <span className="text-[15.5px] leading-[1.6] text-body">{service.description}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <HowWeWork />

      <div className="pt-20 desk:pt-section">
        <TeamSection members={team} />
      </div>

      <section className="container-page grid gap-10 pb-20 desk:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] desk:gap-16 desk:pb-[104px]">
        <SectionHeading eyebrow="Where we work" title="Remote-first, worldwide" size="sm" />
        <div className="flex flex-col gap-5 text-lead text-body">
          <p>
            We are a remote-first team and work with clients around the world. Projects run with
            planned overlap hours for the US, UK, Europe and the Gulf, so calls and reviews happen
            during your working day.
          </p>
          <p>
            Every engagement has one shared channel, a weekly demo and a single point of contact
            who knows your project end to end.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
