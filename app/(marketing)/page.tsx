// ============================================================
// app/(marketing)/page.tsx — Home / Landing Page
// ============================================================

import { Hero, StackStrip } from '@/components/marketing/Hero'
import {
  CtaBand,
  HowWeWork,
  ServicesSection,
  WhyDruporia,
  type ServiceCardData,
} from '@/components/marketing/HomeSections'
import { TeamSection } from '@/components/marketing/TeamSection'
import { FaqAccordion } from '@/components/marketing/FaqAccordion'
import { SectionHeading } from '@/components/ui/Section'
import { getHomepageServices, getPublishedFaqs } from '@/lib/site-data'
import { getTeamMembers } from '@/lib/team'
import { DEFAULT_SERVICES } from '@/lib/default-services'
import {
  DEFAULT_FAQS,
  SERVICE_KEY_TO_OPTION,
  TECH_STACK,
  contactHref,
} from '@/lib/site-content'

// Re-render at most every 60s so admin edits show up, and so a build
// that couldn't reach the database doesn't pin the fallback copy.
export const revalidate = 60

function getTags(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []
}

// Admin-managed content is optional; fall back to defaults if the
// database is unreachable rather than failing the whole page.
async function orEmpty<T>(promise: Promise<T[]>): Promise<T[]> {
  try {
    return await promise
  } catch (error) {
    console.error('[home] content query failed, using defaults', error)
    return []
  }
}

function serviceHref(sourceKey?: string | null) {
  const option = sourceKey ? SERVICE_KEY_TO_OPTION[sourceKey] : undefined
  return contactHref(option ? [option] : [])
}

export default async function HomePage() {
  const [managedServices, managedFaqs, team] = await Promise.all([
    orEmpty(getHomepageServices()),
    orEmpty(getPublishedFaqs()),
    getTeamMembers(),
  ])

  const managedKeys = new Set(
    managedServices
      .map((service) => service.sourceKey)
      .filter((sourceKey): sourceKey is string => Boolean(sourceKey))
  )
  const services: ServiceCardData[] = [
    ...managedServices.map((service) => ({
      title: service.title,
      description: service.description,
      tags: getTags(service.tags),
      href: serviceHref(service.sourceKey),
    })),
    ...DEFAULT_SERVICES.filter((service) => !managedKeys.has(service.sourceKey)).map((service) => ({
      title: service.title,
      description: service.description,
      tags: service.tags,
      href: serviceHref(service.sourceKey),
    })),
  ]

  const faqs = managedFaqs.length > 0
    ? managedFaqs.map((faq) => ({ id: faq.id, question: faq.question, answer: faq.answer }))
    : DEFAULT_FAQS

  return (
    <>
      <Hero />
      <StackStrip items={TECH_STACK} />
      <ServicesSection services={services} />
      <HowWeWork />
      <WhyDruporia />
      <TeamSection members={team} />

      <section
        id="faq"
        className="container-page grid scroll-mt-20 gap-10 pb-20 pt-6 desk:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] desk:gap-16 desk:pb-[104px]"
      >
        <SectionHeading eyebrow="FAQ" title="Good questions" size="sm" />
        <FaqAccordion items={faqs} />
      </section>

      <CtaBand />
    </>
  )
}
