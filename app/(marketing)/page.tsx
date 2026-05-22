// ============================================================
// app/(marketing)/page.tsx — Home / Landing Page
// ============================================================

import Link from 'next/link'
import { ArrowRight, Box, Code2, Bot, Layers, CheckCircle2, Workflow, BarChart3 } from 'lucide-react'
import { HeroSection } from '@/components/marketing/HeroSection'
import { FeaturedProducts } from '@/components/marketing/FeaturedProducts'
import { TeamSection } from '@/components/marketing/TeamSection'
import { FiverrReviews } from '@/components/marketing/FiverrReviews'
import { AnimateIn } from '@/components/marketing/AnimateIn'
import { TawkWidget } from '@/components/chat/TawkWidget'
import { getHomepageServices, getPublishedFaqs } from '@/lib/site-data'
import { DEFAULT_SERVICES } from '@/lib/default-services'

const TECH_STACK = [
  'Next.js', 'n8n', 'Node.js', 'PostgreSQL',
  'React', 'WooCommerce', 'Shopify', 'Magento',
  'OpenAI', 'Python', 'AWS',
]

const ICONS = {
  Box,
  Layers,
  Bot,
  Code2,
  Workflow,
  BarChart3,
}

function getTags(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []
}

export default async function HomePage() {
  const [managedServices, faqs] = await Promise.all([
    getHomepageServices(),
    getPublishedFaqs(),
  ])
  const managedKeys = new Set(
    managedServices
      .map((service) => service.sourceKey)
      .filter((sourceKey): sourceKey is string => Boolean(sourceKey))
  )
  const services = [
    ...managedServices.map((service) => ({
      icon: ICONS[service.iconKey as keyof typeof ICONS] ?? Code2,
      title: service.title,
      description: service.description,
      tags: getTags(service.tags),
    })),
    ...DEFAULT_SERVICES.filter((service) => !managedKeys.has(service.sourceKey)).map((service) => ({
      icon: ICONS[service.iconKey as keyof typeof ICONS] ?? Code2,
      title: service.title,
      description: service.description,
      tags: service.tags,
    })),
  ]

  return (
    <div className="bg-slate-50 min-h-screen">
      <TawkWidget />
      <HeroSection />

      <section className="border-y border-slate-200 bg-white shadow-sm relative z-10">
        <div className="container-page py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-400 whitespace-nowrap">
            Powered by
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-3 w-full">
            {TECH_STACK.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-sm font-medium text-slate-600 bg-slate-100 rounded-md border border-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      <FeaturedProducts />

      <section className="bg-slate-900 text-white relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.22),transparent_34rem)] opacity-80" />
        <div className="container-page relative z-10 grid gap-12 lg:grid-cols-2 items-center">
          <AnimateIn>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why partner with Druporia?
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-300">
              End-to-end eCommerce technology for B2B and B2C — from plugins to
              automation, with measurable outcomes.
            </p>
          </AnimateIn>
          <div className="space-y-4 lg:pl-8">
            {['Scalable Architecture', 'Enterprise Security', 'AI-Driven Innovation', 'Measurable ROI'].map(
              (benefit, i) => (
                <AnimateIn key={benefit} delay={i * 0.08}>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm">
                    <CheckCircle2 className="h-6 w-6 text-blue-400 shrink-0" />
                    <span className="text-lg font-medium text-slate-200">{benefit}</span>
                  </div>
                </AnimateIn>
              )
            )}
          </div>
        </div>
      </section>

      <section id="services" className="bg-slate-50 py-20 sm:py-28">
        <div className="container-page">
          <AnimateIn className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-3">
              Our expertise
            </p>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Technology services for modern commerce
            </h2>
          </AnimateIn>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => {
              const Icon = service.icon
              return (
                <AnimateIn key={service.title} delay={i * 0.06}>
                  <div className="motion-card bg-white rounded-2xl p-8 border border-slate-200 shadow-sm group h-full">
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-600 mb-6">{service.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </AnimateIn>
              )
            })}
          </div>
        </div>
      </section>

      <div id="reviews">
        <FiverrReviews />
      </div>

      <TeamSection />

      {faqs.length > 0 && (
        <section className="bg-slate-50 py-20 sm:py-28">
          <div className="container-page">
            <AnimateIn className="mx-auto mb-12 max-w-2xl text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-600">
                FAQ
              </p>
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                Frequently asked questions
              </h2>
            </AnimateIn>

            <div className="mx-auto grid max-w-4xl gap-4">
              {faqs.map((faq, i) => (
                <AnimateIn key={faq.id} delay={i * 0.05}>
                  <details className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
                      {faq.question}
                      <span className="text-xl text-slate-400 transition group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-4 text-sm leading-relaxed text-slate-600">
                      {faq.answer}
                    </p>
                    {faq.category && (
                      <span className="mt-4 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                        {faq.category}
                      </span>
                    )}
                  </details>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-slate-200 bg-white">
        <div className="container-page py-20 sm:py-28 text-center max-w-3xl mx-auto">
          <AnimateIn>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Ready to transform your business?
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Let&apos;s engineer the right solution — products, plugins, or a full
              platform build.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="btn-primary inline-flex gap-2 text-lg px-10 py-5 shadow-lg shadow-blue-500/20"
              >
                Contact our team
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/marketplace" className="btn-secondary inline-flex text-lg px-10 py-5">
                Browse marketplace
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  )
}
