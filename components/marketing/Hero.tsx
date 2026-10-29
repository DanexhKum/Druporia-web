import { Button } from '@/components/ui/Button'
import { GradientRing } from '@/components/ui/GradientRing'
import { ServicePicker } from '@/components/marketing/ServicePicker'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Sits above the picker card's top edge at every breakpoint. */}
      <GradientRing
        className="-right-[90px] [--ring-width:38px] -top-[150px] h-[220px] w-[220px] tab:-right-[110px] tab:-top-[200px] tab:h-[300px] tab:w-[300px] tab:[--ring-width:50px] desk:-right-[130px] desk:-top-[250px] desk:h-[400px] desk:w-[400px] desk:[--ring-width:64px]"
      />

      <div className="container-page relative grid items-center gap-12 pb-20 pt-[72px] desk:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] desk:gap-14 desk:pb-24 desk:pt-[88px]">
        <div>
          <p className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-line-card bg-canvas px-3.5 py-2 text-sm font-medium text-nav">
            <span className="h-2 w-2 rounded-full bg-status" aria-hidden="true" />
            Now taking new projects
          </p>
          <h1 className="text-h1 font-semibold">
            Your engineering team for{' '}
            <span className="text-gradient">digital commerce.</span>
          </h1>
          <p className="mt-7 max-w-[52ch] text-lead text-body">
            We design and build custom plugins, Shopify apps, AI automation and
            full-stack platforms for B2B and B2C brands — scoped up front, built in
            the open, supported after launch.
          </p>
          <div className="mt-10 flex flex-col gap-3 tab:flex-row">
            <Button href="/contact" size="lg">
              Book a free discovery call
            </Button>
            <Button href="/#services" variant="outline" size="lg">
              See our services
            </Button>
          </div>
        </div>

        <ServicePicker />
      </div>
    </section>
  )
}

export function StackStrip({ items }: { items: string[] }) {
  return (
    <div className="border-y border-line">
      <div className="container-page flex flex-col gap-3 py-6 tab:flex-row tab:items-center tab:gap-8">
        <h2 className="flex-none text-sm font-semibold text-ink">Our stack</h2>
        <ul className="flex flex-wrap gap-x-[30px] gap-y-2">
          {items.map((item) => (
            <li key={item} className="text-[15px] font-semibold text-muted">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
