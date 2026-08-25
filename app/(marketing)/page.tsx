// ============================================================
// app/(marketing)/page.tsx — Home / Landing Page
// ============================================================

import { CheckCircle2 } from 'lucide-react'
import { HeroSection } from '@/components/marketing/HeroSection'
import { FeaturedProducts } from '@/components/marketing/FeaturedProducts'
import { TeamSection } from '@/components/marketing/TeamSection'
import { FiverrReviews } from '@/components/marketing/FiverrReviews'
import { AnimateIn } from '@/components/marketing/AnimateIn'
import { TrustBar, type TrustStat } from '@/components/marketing/TrustBar'
import { ProcessSection } from '@/components/marketing/ProcessSection'
import { FaqAccordion } from '@/components/marketing/FaqAccordion'
import { BentoGrid, type BentoItem } from '@/components/marketing/BentoGrid'
import { LogoMarquee } from '@/components/motion/LogoMarquee'
import { TabbedShowcase } from '@/components/marketing/TabbedShowcase'
import { ParticleCTA } from '@/components/marketing/ParticleCTA'
import { TawkWidget } from '@/components/chat/TawkWidget'
import {
  getHomepageServices,
  getPublishedFaqs,
  getTrustStats,
} from '@/lib/site-data'
import { DEFAULT_SERVICES } from '@/lib/default-services'

const TECH_STACK = [
  'Next.js', 'n8n', 'Node.js', 'PostgreSQL',
  'React', 'WooCommerce', 'Shopify', 'Magento',
  'OpenAI', 'Python', 'AWS',
]

function getTags(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []
}

export default async function HomePage() {
  const [managedServices, faqs, trust] = await Promise.all([
    getHomepageServices(),
    getPublishedFaqs(),
    getTrustStats(),
  ])

  // Only surface figures that are actually non-zero — an empty
  // catalogue must never render "0 products shipped".
  const allTrustStats: TrustStat[] = [
    {
      iconKey: 'products',
      value: trust.productCount,
      suffix: '+',
      label: 'Products shipped',
    },
    {
      iconKey: 'rating',
      value: trust.averageRating,
      decimals: 1,
      label: 'Average client rating',
    },
    {
      iconKey: 'reviews',
      value: trust.reviewCount,
      suffix: '+',
      label: 'Client reviews',
    },
    {
      iconKey: 'tech',
      value: TECH_STACK.length,
      suffix: '+',
      label: 'Technologies supported',
    },
  ]
  const trustStats = allTrustStats.filter((stat) => stat.value > 0)
  const managedKeys = new Set(
    managedServices
      .map((service) => service.sourceKey)
      .filter((sourceKey): sourceKey is string => Boolean(sourceKey))
  )
  const services: BentoItem[] = [
    ...managedServices.map((service) => ({
      iconKey: service.iconKey,
      title: service.title,
      description: service.description,
      tags: getTags(service.tags),
    })),
    ...DEFAULT_SERVICES.filter(
      (service) => !managedKeys.has(service.sourceKey)
    ).map((service) => ({
      iconKey: service.iconKey,
      title: service.title,
      description: service.description,
      tags: service.tags,
    })),
  ]

  return (
    <div className="min-h-screen bg-ink-950">
      <TawkWidget />
      <HeroSection />

      <LogoMarquee label="Built on the platforms your business runs on" />

      <TrustBar stats={trustStats} />

      <FeaturedProducts />

      <section className="dark-shell py-16 sm:py-24">
        <div aria-hidden className="glow-top" />
        <div className="container-page relative z-10 grid gap-12 lg:grid-cols-2 items-center">
          <AnimateIn>
            <p className="chip mb-5">Why Druporia</p>
            <h2 className="heading-dark">Why partner with Druporia?</h2>
            <p className="body-dark mt-6 text-lg">
              End-to-end eCommerce technology for B2B and B2C — from plugins to
              automation, with measurable outcomes.
            </p>
          </AnimateIn>
          <div className="space-y-4 lg:pl-8">
            {['Scalable Architecture', 'Enterprise Security', 'AI-Driven Innovation', 'Measurable ROI'].map(
              (benefit, i) => (
                <AnimateIn key={benefit} delay={i * 0.08}>
                  <div className="sweep-host flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm transition-colors duration-500 hover:border-teal-400/30 hover:bg-white/[0.06]">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-300" />
                    <span className="font-medium text-white/80">{benefit}</span>
                  </div>
                </AnimateIn>
              )
            )}
          </div>
        </div>
      </section>

      <section id="services" className="dark-shell py-16 sm:py-24">
        <div className="container-page">
          <AnimateIn className="text-center max-w-2xl mx-auto mb-16">
            <p className="chip">01 · Our expertise</p>
            <h2 className="heading-dark mt-5">
              Technology services for modern commerce
            </h2>
          </AnimateIn>

          <BentoGrid items={services} />
        </div>
      </section>

      <TabbedShowcase />

      <ProcessSection />

      <div id="reviews">
        <FiverrReviews />
      </div>

      <TeamSection />

      {faqs.length > 0 && (
        <section className="dark-shell py-16 sm:py-24">
          <div className="container-page">
            <AnimateIn className="mx-auto mb-12 max-w-2xl text-center">
              <p className="chip">FAQ</p>
              <h2 className="heading-dark mt-5">Frequently asked questions</h2>
            </AnimateIn>

            <AnimateIn>
              <FaqAccordion items={faqs} />
            </AnimateIn>
          </div>
        </section>
      )}

      <ParticleCTA />

    </div>
  )
}
