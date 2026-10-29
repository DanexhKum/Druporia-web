// ============================================================
// app/(marketing)/marketplace/page.tsx
// Product Marketplace — server component, fetches from DB.
// ============================================================

import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/marketplace/ProductCard'
import { ProductFilters } from '@/components/marketplace/ProductFilters'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Metadata } from 'next'
import { ProductStatus, type ProductCategory } from '@prisma/client'
import { PackageSearch } from 'lucide-react'
import { PageHeader } from '@/components/ui/Section'
import { CtaBand } from '@/components/marketing/HomeSections'

export const metadata: Metadata = {
  title: 'Products',
  description:
    'WooCommerce plugins, Chrome extensions and app starters from Druporia — use one as a starting point, or have us adapt it to your store.',
  alternates: {
    canonical: '/marketplace',
  },
  openGraph: {
    title: 'Druporia Products',
    description:
      'Plugins, extensions and app starters from Druporia, ready to adapt to your store.',
    url: '/marketplace',
    type: 'website',
    images: [
      {
        url: '/icon.svg',
        width: 64,
        height: 64,
        alt: 'Druporia Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Druporia Products',
    description:
      'Plugins, extensions and app starters from Druporia, ready to adapt to your store.',
    images: ['/icon.svg'],
  },
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

// ── Filter params ──────────────────────────────────────────────
interface PageProps {
  searchParams: Promise<{
    category?: ProductCategory | 'all'
    q?: string
    price?: string
    sort?: string
  }>
}

type PriceFilter = 'all' | 'free' | 'paid' | 'under-50' | 'under-100'
type SortOption = 'featured' | 'newest' | 'price-low' | 'price-high'

function getPriceWhere(price?: string) {
  if (price === 'free') return { price: 0 }
  if (price === 'paid') return { price: { gt: 0 } }
  if (price === 'under-50') return { price: { lte: 50 } }
  if (price === 'under-100') return { price: { lte: 100 } }
  return {}
}

function getOrderBy(sort?: string) {
  if (sort === 'newest') return [{ createdAt: 'desc' as const }]
  if (sort === 'price-low') return [{ price: 'asc' as const }]
  if (sort === 'price-high') return [{ price: 'desc' as const }]
  return [{ isFeatured: 'desc' as const }, { createdAt: 'desc' as const }]
}

// ── Fetch products ─────────────────────────────────────────────
async function getProducts(
  category?: ProductCategory | 'all',
  query?: string,
  price?: PriceFilter,
  sort?: SortOption
) {
  const products = await prisma.product.findMany({
    where: {
      status: ProductStatus.PUBLISHED,
      ...(category && category !== 'all' ? { category } : {}),
      ...getPriceWhere(price),
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: getOrderBy(sort),
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      price: true,
      category: true,
      thumbnailUrl: true,
      version: true,
      fileSize: true,
      isFeatured: true,
      createdAt: true,
    },
  })
  return products
}

// ── Skeleton loader ─────────────────────────────────────────────
function ProductGridSkeleton() {
  return (
    <div className="grid gap-4 tab:grid-cols-2 desk:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card-surface animate-pulse p-2">
          <div className="aspect-[16/10] rounded-[16px] bg-surface-photo" />
          <div className="space-y-3 p-4">
            <div className="h-3 w-24 rounded-full bg-surface-photo" />
            <div className="h-5 w-3/4 rounded-full bg-surface-photo" />
            <div className="h-3 w-full rounded-full bg-surface-photo" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Products grid (async) ──────────────────────────────────────
async function ProductGrid({
  category,
  query,
  price,
  sort,
}: {
  category?: ProductCategory | 'all'
  query?: string
  price?: PriceFilter
  sort?: SortOption
}) {
  let products: Awaited<ReturnType<typeof getProducts>>
  try {
    products = await getProducts(category, query, price, sort)
  } catch (error) {
    console.error('[marketplace] product query failed', error)
    return (
      <EmptyState
        icon={PackageSearch}
        title="Products are unavailable right now"
        description="Please check back shortly. Need something specific? We build custom plugins and apps as scoped projects."
        actionHref="/contact"
        actionLabel="Book a free discovery call"
      />
    )
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title={query ? 'Nothing matches that search' : 'Nothing listed here yet'}
        description={
          query
            ? `No results for "${query}". Try another keyword, price range or category.`
            : 'Need something specific? We build custom plugins and apps as scoped projects.'
        }
        actionHref="/contact"
        actionLabel="Book a free discovery call"
      />
    )
  }

  return (
    <div className="grid gap-4 tab:grid-cols-2 desk:grid-cols-3 animate-fade-in">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          price={Number(product.price)}
        />
      ))}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────
export default async function MarketplacePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const category = resolvedParams.category
  const query = resolvedParams.q
  const price = (resolvedParams.price ?? 'all') as PriceFilter
  const sort = (resolvedParams.sort ?? 'featured') as SortOption

  // Count by category for filter badges
  const countWhere = {
    status: ProductStatus.PUBLISHED,
    ...getPriceWhere(price),
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: 'insensitive' as const } },
            { description: { contains: query, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }
  const [totalCount, appCount, wooCount, extCount, filteredCount] = await Promise.all([
    prisma.product.count({ where: countWhere }),
    prisma.product.count({ where: { ...countWhere, category: 'APP' } }),
    prisma.product.count({ where: { ...countWhere, category: 'WOO_PLUGIN' } }),
    prisma.product.count({ where: { ...countWhere, category: 'CHROME_EXTENSION' } }),
    prisma.product.count({
      where: {
        ...countWhere,
        ...(category && category !== 'all' ? { category } : {}),
      },
    }),
  ]).catch((error) => {
    // Filter counts are cosmetic; ProductGrid shows the outage message.
    console.error('[marketplace] count query failed', error)
    return [0, 0, 0, 0, 0]
  })

  const categoryCounts = {
    all: totalCount,
    APP: appCount,
    WOO_PLUGIN: wooCount,
    CHROME_EXTENSION: extCount,
  }

  return (
    <>
      <PageHeader
        eyebrow="Products"
        title="Building blocks from our work"
        description="Plugins, extensions and app starters we’ve built along the way. Use one as a starting point, or have us adapt it to your store as part of a scoped project."
      />

      <section className="container-page pb-20 desk:pb-section">
        <div className="border-t border-line pt-8">
          <ProductFilters
            activeCategory={category ?? 'all'}
            counts={categoryCounts}
            query={query}
            price={price}
            sort={sort}
          />
        </div>

        <p className="mb-5 mt-8 text-sm text-muted" aria-live="polite">
          {totalCount > 0 ? (
            <>
              Showing <span className="font-medium text-ink">{filteredCount}</span>{' '}
              product{filteredCount !== 1 ? 's' : ''}
            </>
          ) : (
            'No products listed yet'
          )}
        </p>

        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid category={category} query={query} price={price} sort={sort} />
        </Suspense>
      </section>

      <CtaBand
        title="Need something built to fit?"
        description="Tell us about your store or workflow. We’ll scope a custom build as fixed-price work."
      />
    </>
  )
}
