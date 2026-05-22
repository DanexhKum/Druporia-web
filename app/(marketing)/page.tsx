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

const TECH_STACK = [
  'Next.js', 'n8n', 'Node.js', 'PostgreSQL',
  'React', 'WooCommerce', 'Shopify', 'Magento',
  'OpenAI', 'Python', 'AWS',
]

const SERVICES = [
  {
    icon: Box,
    title: 'Custom Plugin Development',
    description:
      'Extend WooCommerce, Shopify, and Magento with scalable, production-ready plugins.',
    tags: ['WooCommerce', 'Shopify'],
  },
  {
    icon: Layers,
    title: 'Shopify Apps & Integrations',
    description:
      'Custom Shopify apps and API integrations that improve performance and UX.',
    tags: ['Shopify', 'GraphQL'],
  },
  {
    icon: Bot,
    title: 'AI Solutions & Chatbots',
    description:
      'Intelligent recommendations, support bots, and workflow automation powered by AI.',
    tags: ['AI/ML', 'Chatbots'],
  },
  {
    icon: Code2,
    title: 'Full-Stack Development',
    description:
      'Modern web apps with Next.js, React, and robust PostgreSQL backends.',
    tags: ['Next.js', 'React'],
  },
  {
    icon: Workflow,
    title: 'Business Automation (n8n)',
    description:
      'Connect your stack with custom n8n workflows and reliable data pipelines.',
    tags: ['n8n', 'Automation'],
  },
  {
    icon: BarChart3,
    title: 'Data Analytics & Reporting',
    description:
      'Turn sales, customer, and marketing data into clear dashboards and actionable insights.',
    tags: ['Data Analyst', 'Dashboards'],
  },
]

export default function HomePage() {
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
            {SERVICES.map((service, i) => {
              const Icon = service.icon
              return (
                <AnimateIn key={service.title} delay={i * 0.06}>
                  <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 group h-full">
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
