import Link from 'next/link'
import { Logo } from '@/components/branding/Logo'
import { CONTACT_EMAIL, FOOTER_COLUMNS } from '@/lib/site-content'

export function Footer() {
  return (
    <footer className="container-page grid grid-cols-1 gap-10 pb-9 pt-16 text-[15px] tab:grid-cols-2 desk:grid-cols-[minmax(0,5fr)_repeat(3,minmax(0,2fr))]">
      <div className="tab:col-span-2 desk:col-span-1">
        <Logo href="/" size="sm" />
        <p className="my-4 max-w-[38ch] leading-[1.6] text-body">
          Custom plugins, apps, automation and full-stack development for brands
          scaling in global commerce.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-medium text-orange-text transition-colors hover:text-orange-deep"
        >
          {CONTACT_EMAIL}
        </a>
        <p className="mt-1.5 text-muted-soft">Remote-first · Worldwide</p>
      </div>

      {FOOTER_COLUMNS.map((column) => (
        <nav key={column.title} aria-label={column.title} className="flex flex-col gap-2.5">
          <h2 className="mb-1 text-sm font-semibold text-ink">{column.title}</h2>
          {column.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="w-fit text-nav transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ))}

      <div className="col-span-full flex flex-col justify-between gap-2 border-t border-line pt-7 text-[13px] text-muted-soft tab:flex-row">
        <span>© {new Date().getFullYear()} Druporia Technologies</span>
        <span>druporia.vercel.app</span>
      </div>
    </footer>
  )
}
