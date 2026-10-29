import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Section'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="container-page flex flex-1 flex-col justify-center py-24 desk:py-32">
        <Eyebrow>Page not found</Eyebrow>
        <h1 className="mt-[18px] max-w-[18ch] text-h2 font-semibold">
          We couldn’t find the page you were looking for.
        </h1>
        <p className="mt-6 max-w-[52ch] text-lead text-body">
          It may have moved, or the link may be out of date. Try the homepage, or tell us what you
          were looking for and we’ll point you in the right direction.
        </p>
        <div className="mt-10 flex flex-col gap-3 tab:flex-row">
          <Button href="/" size="lg">
            Back to the homepage
          </Button>
          <Button href="/contact" variant="outline" size="lg">
            Contact us
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
