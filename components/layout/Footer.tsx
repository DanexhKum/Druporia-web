import Link from 'next/link'
import { Logo } from '@/components/branding/Logo'
import { Mail, MapPin } from 'lucide-react'

const PRODUCT_LINKS = [
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'WooCommerce Plugins', href: '/marketplace?category=WOO_PLUGIN' },
  { label: 'Chrome Extensions', href: '/marketplace?category=CHROME_EXTENSION' },
  { label: 'Web Apps', href: '/marketplace?category=APP' },
]

const COMPANY_LINKS = [
  { label: 'About', href: '/#team' },
  { label: 'Services', href: '/#services' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' },
  { label: 'Client Reviews', href: '/#reviews' },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Refund Policy', href: '/refund' },
]

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo href="/" imageClassName="h-15 w-auto sm:h-15" />
            <p className="mt-5 text-sm leading-relaxed text-slate-400 max-w-sm">
              Druporia builds enterprise-grade digital products, WooCommerce plugins,
              and automation for brands scaling in global commerce.
            </p>
            <div className="mt-6 space-y-2 text-sm text-slate-500">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400 shrink-0" />
                dhanesh.kumar15@gmail.com
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-400 shrink-0" />
                Remote-first · Worldwide
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white mb-4">
                Products
              </p>
              <ul className="space-y-2.5">
                {PRODUCT_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white mb-4">
                Company
              </p>
              <ul className="space-y-2.5">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white mb-4">
                Legal
              </p>
              <ul className="space-y-2.5">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Druporia Technologies. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Built with Next.js · Secured by Clerk · Hosted on Vercel
          </p>
        </div>
      </div>
    </footer>
  )
}
