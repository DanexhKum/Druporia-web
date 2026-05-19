// ============================================================
// app/(marketing)/marketplace/page.tsx
// Product Marketplace — server component, fetches from DB.
// ============================================================

import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/marketplace/ProductCard'
import { ProductFilters } from '@/components/marketplace/ProductFilters'
import type { Metadata } from 'next'
import type { ProductCategory } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Marketplace',
  description:
    'Browse premium web apps, WooCommerce plugins, and Chrome extensions.',
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

// ── Filter params ──────────────────────────────────────────────
interface PageProps {
  searchParams: Promise<{
    category?: ProductCategory | 'all'
    q?: string
  }>
}

// ── Fetch products ─────────────────────────────────────────────
async function getProducts(
  category?: ProductCategory | 'all',
  query?: string
) {
  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
      ...(category && category !== 'all' ? { category } : {}),
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
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
}: {
  category?: ProductCategory | 'all'
  query?: string
}) {
  const products = await getProducts(category, query)

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-4xl mb-4 opacity-30">📦</div>
        <h3 className="text-sm font-semibold text-slate-700">
          No products found
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          {query
            ? `No results for "${query}". Try a different search term.`
            : 'No products in this category yet.'}
        </p>
      </div>
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

  // Count by category for filter badges
  const [totalCount, appCount, wooCount, extCount] = await Promise.all([
    prisma.product.count({ where: { isPublished: true } }),
    prisma.product.count({ where: { isPublished: true, category: 'APP' } }),
    prisma.product.count({ where: { isPublished: true, category: 'WOO_PLUGIN' } }),
    prisma.product.count({ where: { isPublished: true, category: 'CHROME_EXTENSION' } }),
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
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
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
                    <span className="font-medium text-slate-900">
                      {category && category !== 'all'
                        ? categoryCounts[category as keyof typeof categoryCounts]
                        : totalCount}
                    </span>{' '}
                    product
                    {totalCount !== 1 ? 's' : ''}
                  </>
                ) : (
                  'No products yet'
                )}
              </p>
            </div>

            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid category={category} query={query} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
