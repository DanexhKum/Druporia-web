import Link from 'next/link'
import { Github, Linkedin, Mail, MapPin } from 'lucide-react'
import { Logo } from '@/components/branding/Logo'
import { NewsletterForm } from '@/components/marketing/NewsletterForm'

// ============================================================
// components/layout/Footer.tsx
// Multi-column enterprise footer.
//
// Every href resolves to a route that exists — verified against
// app/: /marketplace, /insights, /contact, /privacy, /terms,
// /refund, and the /#team /#services /#reviews anchors, which
// have matching ids on the homepage. Marketplace category links
// use the `category` search param the page actually reads.
//
// The status badge is STATIC and says so in its tooltip. Wiring
// it to a real health check would mean polling an endpoint that
// does not exist yet; a badge that always claims "operational"
// without checking is a lie the moment anything breaks, so it is
// labelled as a stated posture rather than a live probe. Swap in
// a real check via /api/health when there is one.
// ============================================================

const PRODUCT_LINKS = [
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'WooCommerce plugins', href: '/marketplace?category=WOO_PLUGIN' },
  { label: 'Chrome extensions', href: '/marketplace?category=CHROME_EXTENSION' },
  { label: 'Web apps', href: '/marketplace?category=APP' },
]

const COMPANY_LINKS = [
  { label: 'Services', href: '/#services' },
  { label: 'How we build', href: '/#how-we-build' },
  { label: 'Team', href: '/#team' },
  { label: 'Client reviews', href: '/#reviews' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' },
]

const LEGAL_LINKS = [
  { label: 'Privacy policy', href: '/privacy' },
  { label: 'Terms of service', href: '/terms' },
  { label: 'Refund policy', href: '/refund' },
]

const SOCIALS = [
  {
    label: 'Druporia on GitHub',
    href: 'https://github.com/DanexhKum',
    icon: Github,
  },
  {
    label: 'Druporia on LinkedIn',
    href: 'https://www.linkedin.com/company/druporia',
    icon: Linkedin,
  },
  {
    label: 'Email Druporia',
    href: 'mailto:dhanesh.kum15@gmail.com',
    icon: Mail,
  },
]

function LinkColumn({
  heading,
  links,
}: {
  heading: string
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white">
        {heading}
      </p>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-zinc-400 transition-colors duration-300 hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink-950">
      {/* Blueprint verticals, fading down */}
      <div aria-hidden className="blueprint-field" />

      <div className="container-page relative py-12 sm:py-20 lg:py-28">
        {/* ── Top: identity + newsletter ─────────────────── */}
        <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-12 lg:gap-8 [&>*]:min-w-0">
          <div className="lg:col-span-5">
            <Logo href="/" imageClassName="h-9 w-auto brightness-0 invert" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-zinc-400">
              Druporia builds commerce plugins, browser extensions, automation,
              and full-stack products for teams that run their operations on
              software.
            </p>

            <div className="mt-7 space-y-2.5 text-sm text-zinc-400">
              <p className="flex items-start gap-2.5 break-words">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <a
                  href="mailto:dhanesh.kum15@gmail.com"
                  className="transition-colors hover:text-white"
                >
                  dhanesh.kum15@gmail.com
                </a>
              </p>
              <p className="flex items-start gap-2.5 break-words">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                Remote-first · Worldwide
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white">
              Newsletter
            </p>
            <p className="mt-4 text-sm text-zinc-400">
              Occasional notes on commerce engineering. No cadence promises,
              no filler.
            </p>
            <div className="mt-5">
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* ── Middle: link columns ───────────────────────── */}
        <div className="grid gap-10 py-14 sm:grid-cols-3 lg:gap-8 [&>*]:min-w-0">
          <LinkColumn heading="Products" links={PRODUCT_LINKS} />
          <LinkColumn heading="Company" links={COMPANY_LINKS} />
          <LinkColumn heading="Legal" links={LEGAL_LINKS} />
        </div>

        {/* ── Bottom: status, socials, copyright ─────────── */}
        <div className="flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5"
              title="Stated service posture — not a live health probe"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span className="font-mono text-[11px] text-zinc-300">
                All systems operational
              </span>
            </span>

            <p className="font-mono text-[11px] text-white/30">
              © {new Date().getFullYear()} Druporia Technologies
            </p>
          </div>

          <div className="flex items-center gap-2">
            {SOCIALS.map((social) => {
              const Icon = social.icon
              const external = social.href.startsWith('http')
              return (
                <a
                  key={social.href}
                  href={social.href}
                  aria-label={social.label}
                  {...(external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
