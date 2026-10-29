import Link from 'next/link'
import { ArrowChip, Tag } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { GradientRing } from '@/components/ui/GradientRing'
import { SectionHeading } from '@/components/ui/Section'
import { CONTACT_EMAIL, PILLARS, PROCESS_STEPS } from '@/lib/site-content'

// ── Services ────────────────────────────────────────────────────
export interface ServiceCardData {
  title: string
  description: string
  tags: string[]
  href: string
}

export function ServicesSection({ services }: { services: ServiceCardData[] }) {
  return (
    <section id="services" className="container-page section-y scroll-mt-20">
      <SectionHeading
        eyebrow="Services"
        title="What we build for you"
        description="From a single plugin to a full platform, every engagement is scoped as fixed-price work with a clear outcome."
        layout="split"
        className="mb-12 desk:mb-14"
      />
      <ul className="grid gap-4 tab:grid-cols-2 desk:grid-cols-3">
        {services.map((service) => (
          <li key={service.title}>
            <Link
              href={service.href}
              className="card-surface flex h-full min-h-[250px] flex-col gap-3.5 p-7 transition-colors duration-150 hover:bg-orange-tint tab:p-8"
            >
              <div className="flex justify-end">
                <ArrowChip />
              </div>
              <h3 className="mt-[18px] text-h3 font-semibold">{service.title}</h3>
              <p className="text-[15.5px] leading-[1.6] text-body">{service.description}</p>
              {service.tags.length > 0 && (
                <div className="mt-auto flex flex-wrap gap-2 pt-1.5">
                  {service.tags.slice(0, 2).map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

// ── How we work (the only navy section) ─────────────────────────
export function HowWeWork() {
  return (
    <section
      id="how-we-work"
      className="band relative scroll-mt-20 overflow-hidden rounded-section bg-navy px-6 pb-28 pt-16 text-navy-fg tab:px-10 tab:pb-36 tab:pt-20 desk:px-gutter desk:py-24"
    >
      {/* Bottom-right, below/right of the step cards at every breakpoint. */}
      <GradientRing className="-bottom-[150px] -right-[100px] h-[220px] w-[220px] [--ring-width:38px] tab:-bottom-[200px] tab:-right-[130px] tab:h-[300px] tab:w-[300px] tab:[--ring-width:50px] desk:-bottom-[330px] desk:-right-[240px] desk:h-[460px] desk:w-[460px] desk:[--ring-width:76px]" />

      <div className="relative">
        <SectionHeading
          eyebrow="How we work"
          tone="amber"
          title="From first call to launch, no surprises."
          titleClassName="max-w-[18ch] text-[clamp(2.125rem,1.35rem+2.6vw,3.25rem)]"
        />
        <ol className="mt-12 grid gap-4 tab:grid-cols-2 desk:mt-14 desk:max-w-[min(1000px,calc(100%-120px))] desk:grid-cols-4">
          {PROCESS_STEPS.map((step, i) => (
            <li
              key={step.title}
              className="flex flex-col gap-2.5 rounded-card border border-white/[0.08] bg-navy-card p-[26px]"
            >
              <span
                aria-hidden="true"
                className="grid h-[34px] w-[34px] place-items-center rounded-full bg-brand text-sm font-semibold text-white"
              >
                {i + 1}
              </span>
              <h3 className="mt-2.5 text-h3-sm font-semibold">
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p className="text-[15px] leading-[1.55] text-navy-body">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

// ── Why Druporia ────────────────────────────────────────────────
export function WhyDruporia() {
  return (
    <section className="container-page grid gap-12 pb-20 pt-20 desk:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] desk:gap-16 desk:pb-24 desk:pt-section">
      <SectionHeading eyebrow="Why Druporia" title="Built like it’s our own business." size="sm" />
      <div className="grid gap-x-12 gap-y-10 tab:grid-cols-2">
        {PILLARS.map((pillar) => (
          <div key={pillar.title} className="flex flex-col gap-2.5 border-t-2 border-ink pt-[22px]">
            <h3 className="text-[21px] font-semibold tracking-[-0.02em]">{pillar.title}</h3>
            <p className="text-[15.5px] leading-[1.6] text-body">{pillar.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── CTA band ────────────────────────────────────────────────────
export function CtaBand({
  title = 'Have a project in mind?',
  description = 'Tell us what you’re building. We’ll reply within one business day with next steps.',
}: {
  title?: string
  description?: string
}) {
  return (
    <section className="band mb-6">
      <div className="relative flex flex-col gap-10 overflow-hidden rounded-section bg-brand px-6 py-14 tab:px-10 tab:py-16 desk:flex-row desk:items-center desk:justify-between desk:gap-12 desk:px-gutter desk:py-[88px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[120px] -top-[170px] h-[240px] w-[240px] rounded-full border-[44px] border-white/[0.18] tab:-right-20 tab:-top-[180px] tab:h-[420px] tab:w-[420px] tab:border-[70px]"
        />
        <div className="relative text-cta-ink">
          <h2 className="text-h2-lg font-semibold">{title}</h2>
          <p className="mt-[18px] text-lg text-cta-body">{description}</p>
        </div>
        <div className="relative flex flex-none flex-col gap-3 tab:flex-row">
          <Button href="/contact" variant="dark" size="lg">
            Book a free call
          </Button>
          <Button href={`mailto:${CONTACT_EMAIL}`} variant="white" size="lg">
            Email us
          </Button>
        </div>
      </div>
    </section>
  )
}
