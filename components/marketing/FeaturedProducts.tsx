import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getFeaturedProducts } from '@/lib/site-data'
import { ProductCard } from '@/components/marketplace/ProductCard'
import { AnimateIn, StaggerGrid, StaggerItem } from '@/components/marketing/AnimateIn'

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(3)

  if (products.length === 0) return null

  return (
    <section className="py-20 sm:py-28 bg-white border-t border-navy-200">
      <div className="container-page">
        <AnimateIn className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-navy-700 mb-3">
              Marketplace
            </p>
            <h2 className="text-3xl font-bold text-navy-900 sm:text-4xl">
              Featured digital products
            </h2>
            <p className="mt-3 text-navy-600 max-w-lg">
              Plugins, extensions, and tools — built for production stores.
            </p>
          </div>
          <Link
            href="/marketplace"
            className="btn-secondary shrink-0 gap-2 self-start sm:self-auto"
          >
            View all products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </AnimateIn>

        <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard
                {...product}
                price={Number(product.price)}
              />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  )
}
