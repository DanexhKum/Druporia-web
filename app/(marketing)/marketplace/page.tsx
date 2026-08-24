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

export const metadata: Metadata = {
  title: 'Marketplace — Premium Digital Products',
  description:
    'Browse premium web apps, WooCommerce plugins, Chrome extensions, and digital products built by Druporia for modern commerce.',
  alternates: {
    canonical: '/marketplace',
  },
  openGraph: {
    title: 'Druporia Marketplace — Premium Digital Products',
    description:
      'Browse production-ready plugins, extensions, apps, and tools for modern commerce.',
    url: '/marketplace',
    type: 'website',
    images: [
      {
        url: '/icon.svg',
        width: 64,
        height: 64,
        alt: 'Druporia Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Druporia Marketplace — Premium Digital Products',
    description:
      'Production-ready plugins, extensions, apps, and tools for modern commerce.',
    images: ['/icon.svg'],
  },
}

// NOTE: no `export const revalidate` here — this page awaits
// searchParams, which forces dynamic rendering and makes any ISR
// directive dead code. Caching the filtered listing means caching
// per query/category/price/sort combination; do it with unstable_cache
// around getProducts() keyed on those params, not with a page-level
// revalidate that silently does nothing.

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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg border border-slate-200 bg-white"
        >
          <div className="h-40 rounded-t-lg bg-slate-100" />
          <div className="p-5 space-y-3">
            <div className="h-3 w-20 rounded bg-slate-100" />
            <div className="h-4 w-3/4 rounded bg-slate-100" />
            <div className="h-3 w-full rounded bg-slate-100" />
            <div className="h-3 w-5/6 rounded bg-slate-100" />
          </div>
          <div className="border-t border-slate-100 px-5 py-4">
            <div className="h-7 w-full rounded bg-slate-100" />
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
  const products = await getProducts(category, query, price, sort)

  if (products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title={query ? 'No matching products found' : 'No products available yet'}
        description={
          query
            ? `No results for "${query}". Try another keyword, price range, or category.`
            : 'Products will appear here as soon as they are published from the admin panel.'
        }
        actionHref="/contact"
        actionLabel="Request a custom product"
      />
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
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
  ])

  const categoryCounts = {
    all: totalCount,
    APP: appCount,
    WOO_PLUGIN: wooCount,
    CHROME_EXTENSION: extCount,
  }

  return (
    <div className="bg-white">
      {/* ── Page header ──────────────────────────────────── */}
      <div className="bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.22),transparent_34rem)] opacity-80"></div>
        <div className="container-page py-16 relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
            Druporia Marketplace
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Premium Digital Products
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-300">
            Browse our catalog of high-quality plugins, extensions, and digital assets designed to scale your business. Secure checkout and instant delivery.
          </p>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      <div className="container-page py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* ── Sidebar filters ─────────────────────────── */}
          <aside className="w-full lg:w-52 lg:shrink-0">
            <ProductFilters
              activeCategory={category ?? 'all'}
              counts={categoryCounts}
              query={query}
              price={price}
              sort={sort}
            />
          </aside>

          {/* ── Product grid ──────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Result count header */}
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                {totalCount > 0 ? (
                  <>
                    Showing{' '}
                    <span className="font-medium text-slate-900">{filteredCount}</span>{' '}
                    product
                    {filteredCount !== 1 ? 's' : ''}
                  </>
                ) : (
                  'No products yet'
                )}
              </p>
            </div>

            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid category={category} query={query} price={price} sort={sort} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
