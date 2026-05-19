// ============================================================
// app/(marketing)/page.tsx — Home / Portfolio Page
// Design: Minimalist white, Linear-inspired layout.
// ============================================================

import Link from 'next/link'
import { ArrowRight, Code2, Package, Puzzle, Globe, Zap, Shield } from 'lucide-react'

// ── Tech stack badges ──────────────────────────────────────────
const TECH_STACK = [
  'Next.js', 'TypeScript', 'React', 'Node.js',
  'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Clerk',
  'Supabase', 'AWS', 'Docker', 'WooCommerce',
]

// ── Freelance service offerings ───────────────────────────────
const SERVICES = [
  {
    icon: Globe,
    title: 'Full-Stack Web Apps',
    description:
      'End-to-end web applications built with Next.js, TypeScript, and PostgreSQL. Production-ready, scalable, and secure.',
    tags: ['Next.js', 'TypeScript', 'PostgreSQL'],
  },
  {
    icon: Package,
    title: 'WooCommerce Plugins',
    description:
      'Custom WordPress & WooCommerce plugins that extend store functionality, integrate payment gateways, and automate workflows.',
    tags: ['PHP', 'WordPress', 'WooCommerce'],
  },
  {
    icon: Puzzle,
    title: 'Chrome Extensions',
    description:
      'Productivity-focused Chrome extensions with clean UI, background workers, and seamless browser API integration.',
    tags: ['JavaScript', 'Chrome API', 'React'],
  },
  {
    icon: Code2,
    title: 'API Development',
    description:
      'RESTful and GraphQL APIs with authentication, rate limiting, and comprehensive documentation. Built to scale.',
    tags: ['REST', 'GraphQL', 'Node.js'],
  },
  {
    icon: Zap,
    title: 'Performance Audits',
    description:
      'Identify and resolve Core Web Vitals issues, reduce bundle sizes, and optimize database queries for measurable speed gains.',
    tags: ['Web Vitals', 'Lighthouse', 'SQL'],
  },
  {
    icon: Shield,
    title: 'Security Reviews',
    description:
      'Comprehensive security audits covering OWASP Top 10, authentication flows, data exposure, and dependency vulnerabilities.',
    tags: ['OWASP', 'Auth', 'Pen Testing'],
  },
]

// ── Stats ──────────────────────────────────────────────────────
const STATS = [
  { value: '50+', label: 'Projects delivered' },
  { value: '30+', label: 'Happy clients' },
  { value: '5 yrs', label: 'Industry experience' },
  { value: '99%', label: 'Client satisfaction' },
]

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="container-page py-20 sm:py-28">
        <div className="max-w-3xl">
          {/* Available badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-green-700">
              Available for freelance work
            </span>
          </div>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Full-Stack Developer.
            <br />
            <span className="text-slate-400">Products. Plugins. Extensions.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
            I build reliable web applications, WooCommerce plugins, and Chrome
            extensions for businesses that need clean code and on-time delivery.
            Browse my digital product marketplace or hire me directly.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/marketplace" className="btn-primary gap-2">
              Browse Marketplace
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/#contact" className="btn-secondary">
              Hire Me
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-slate-50/50">
        <div className="container-page py-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-semibold text-slate-900">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ───────────────────────────────────── */}
      <section className="container-page py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5">
          Tech Stack
        </p>
        <div className="flex flex-wrap gap-2">
          {TECH_STACK.map((tech) => (
            <span key={tech} className="badge">
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* ── Services Grid ────────────────────────────────── */}
      <section id="services" className="border-t border-slate-100 bg-white">
        <div className="container-page py-16 sm:py-20">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              Services
            </p>
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              What I build
            </h2>
            <p className="mt-2 text-sm text-slate-500 max-w-lg">
              End-to-end development across the full spectrum of modern web technology.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => {
              const Icon = service.icon
              return (
                <div
                  key={service.title}
                  className="card-hover p-6 group cursor-default"
                >
                  <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition-colors group-hover:border-slate-300 group-hover:bg-slate-100">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {service.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                    {service.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {service.tags.map((tag) => (
                      <span key={tag} className="badge text-xs">
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

      {/* ── Marketplace CTA ──────────────────────────────── */}
      <section className="border-t border-slate-100 bg-slate-50/50">
        <div className="container-page py-16 sm:py-20">
          <div className="rounded-lg border border-slate-200 bg-white p-8 sm:p-12">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
                Marketplace
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                Ready-to-use digital products
              </h2>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Browse premium apps, WooCommerce plugins, and Chrome extensions.
                Secure checkout, instant download, and lifetime updates.
              </p>
              <Link href="/marketplace" className="btn-primary mt-6 gap-2">
                View all products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────── */}
      <section id="contact" className="border-t border-slate-100 bg-white">
        <div className="container-page py-16 sm:py-20">
          <div className="max-w-lg">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              Contact
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Let&apos;s work together
            </h2>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed">
              Available for project-based contracts and ongoing retainer
              arrangements. Response within 24 hours.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:hello@yourdomain.com"
                className="btn-primary gap-2"
              >
                Send an email
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                LinkedIn Profile
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
