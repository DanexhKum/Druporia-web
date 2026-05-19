// ============================================================
// app/(marketing)/page.tsx — Home / Landing Page
// Rebranded for Druporia Enterprise Solutions
// ============================================================

import Link from 'next/link'
import { ArrowRight, Box, Code2, Bot, Layers, CheckCircle2, ChevronRight, Workflow } from 'lucide-react'

// ── Tech stack badges ──────────────────────────────────────────
const TECH_STACK = [
  'Next.js', 'n8n', 'Node.js', 'PostgreSQL', 
  'React', 'WooCommerce', 'Shopify', 'Magento',
  'TensorFlow', 'OpenAI', 'Python', 'AWS'
]

// ── Enterprise Services ───────────────────────────────
const SERVICES = [
  {
    icon: Box,
    title: 'Custom Plugin Development',
    description:
      'Extend and optimize platforms such as WooCommerce, Shopify, Magento, and BetterCommerce with scalable, custom-built plugins.',
    tags: ['WooCommerce', 'Shopify', 'Magento'],
  },
  {
    icon: Layers,
    title: 'Shopify App & Integration',
    description:
      'Create custom Shopify apps that enhance functionality, boost store performance, and integrate seamlessly with third-party APIs.',
    tags: ['Shopify Apps', 'API Integration', 'GraphQL'],
  },
  {
    icon: Bot,
    title: 'AI-Driven Solutions & Chatbots',
    description:
      'Leverage artificial intelligence for smarter product recommendations, personalized experiences, and intelligent customer support bots.',
    tags: ['AI/ML', 'Chatbots', 'Personalization'],
  },
  {
    icon: Code2,
    title: 'Full-Stack Web Development',
    description:
      'Build modern, high-performing websites and applications designed for growth using cutting-edge technologies like Next.js and React.',
    tags: ['Next.js', 'React', 'Node.js'],
  },
  {
    icon: Workflow,
    title: 'Business Automation (n8n)',
    description:
      'Streamline your business operations and synchronize data across all your tools with custom, robust n8n automation workflows.',
    tags: ['n8n', 'Automation', 'Workflows'],
  },
]

export default function HomePage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section className="container-page py-24 sm:py-32 relative overflow-hidden">
        {/* Subtle background glow for enterprise feel */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-blue-500/10 rounded-full blur-3xl opacity-50 -z-10" />

        <div className="max-w-4xl text-center mx-auto">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-semibold text-blue-800 tracking-wide uppercase">
              Enterprise Technology Solutions
            </span>
          </div>

          <h1 className="text-5xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            Empowering Digital Commerce with <span className="text-blue-600">Innovative Technology</span>
          </h1>

          <p className="mt-8 max-w-2xl mx-auto text-lg leading-relaxed text-slate-600">
            At <strong>Druporia</strong>, we help businesses unlock growth in the digital commerce era with innovative, scalable, and future-ready solutions tailored to their needs.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="btn-primary gap-2 text-base px-8 py-4 w-full sm:w-auto shadow-lg shadow-blue-500/20">
              Schedule a Consultation
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/marketplace" className="btn-secondary gap-2 text-base px-8 py-4 w-full sm:w-auto bg-white">
              Browse Digital Products
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Tech Stack Marquee ───────────────────────────────────── */}
      <section className="border-y border-slate-200 bg-white shadow-sm relative z-10">
        <div className="container-page py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-400 whitespace-nowrap">
            Powered By
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-3 w-full">
            {TECH_STACK.map((tech) => (
              <span key={tech} className="px-3 py-1 text-sm font-medium text-slate-600 bg-slate-100 rounded-md border border-slate-200">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── About Us Section ───────────────────────────────────── */}
      <section className="bg-slate-900 text-white relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="container-page relative z-10 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why partner with Druporia?
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-300">
              We provide end-to-end eCommerce and technology services for both B2B and B2C companies, enabling brands like yours to strengthen their online presence, streamline operations, and deliver exceptional customer experiences.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-300">
              With Druporia as your technology partner, you gain access to a team dedicated to innovation, quality, and measurable results. We don’t just deliver solutions — we empower your business to stay ahead of the competition and thrive in the digital economy.
            </p>
          </div>
          <div className="space-y-6 lg:pl-12">
            {['Scalable Architecture', 'Enterprise Security', 'AI-Driven Innovation', 'Measurable ROI'].map((benefit) => (
              <div key={benefit} className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm">
                <CheckCircle2 className="h-6 w-6 text-blue-400 shrink-0" />
                <span className="text-lg font-medium text-slate-200">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services Grid ────────────────────────────────── */}
      <section id="services" className="bg-slate-50 py-20 sm:py-28">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-3">
              Our Expertise
            </p>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Tailored technology services for modern commerce
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => {
              const Icon = service.icon
              return (
                <div
                  key={service.title}
                  className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
                >
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 mb-6 min-h-[80px]">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {service.tags.map((tag) => (
                      <span key={tag} className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Contact CTA ──────────────────────────────────────── */}
      <section id="contact" className="border-t border-slate-200 bg-white">
        <div className="container-page py-20 sm:py-28 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Ready to transform your business?
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Let's discuss how Druporia can engineer the perfect solution to accelerate your digital growth.
          </p>
          <div className="mt-10">
            <Link
              href="/contact"
              className="btn-primary inline-flex text-lg px-10 py-5 shadow-lg shadow-blue-500/20"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
