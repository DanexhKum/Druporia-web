import { prisma } from '@/lib/prisma'
import { ProductStatus } from '@prisma/client'

export async function getFeaturedProducts(limit = 3) {
  return prisma.product.findMany({
    where: { status: ProductStatus.PUBLISHED, isFeatured: true },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    take: limit,
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
}

export async function getPublishedTeam() {
  return prisma.teamMember.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  })
}

export async function getPublishedReviews(limit = 6) {
  return prisma.review.findMany({
    where: { isPublished: true, approvalStatus: 'APPROVED' },
    orderBy: [{ sortOrder: 'asc' }, { reviewDate: 'desc' }],
    take: limit,
  })
}

export async function getHomepageServices() {
  return prisma.serviceItem.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  })
}

export async function getPublishedFaqs(limit = 6) {
  return prisma.faq.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    take: limit,
  })
}

// ── Trust-bar statistics ──────────────────────────────────────
// Every figure here is counted from the database. Nothing is
// hard-coded or estimated — a stat that would render as zero is
// dropped by the component rather than shown, so an empty
// catalogue never advertises "0 products".
export async function getTrustStats() {
  const [productCount, reviewAggregate, teamCount] = await Promise.all([
    prisma.product.count({ where: { status: ProductStatus.PUBLISHED } }),
    prisma.review.aggregate({
      where: { isPublished: true, approvalStatus: 'APPROVED' },
      _count: { _all: true },
      _avg: { rating: true },
    }),
    prisma.teamMember.count({ where: { isPublished: true } }),
  ])

  return {
    productCount,
    reviewCount: reviewAggregate._count._all,
    averageRating: reviewAggregate._avg.rating ?? 0,
    teamCount,
  }
}

// Lightweight catalogue for the ⌘K palette. Deliberately a
// separate query from the filtered listing: search should reach
// every published product, not just the visible page.
export async function getSearchableProducts() {
  const rows = await prisma.product.findMany({
    where: { status: ProductStatus.PUBLISHED },
    orderBy: [{ isFeatured: 'desc' }, { title: 'asc' }],
    select: { id: true, title: true, slug: true, category: true, price: true },
  })
  return rows.map((r) => ({ ...r, price: Number(r.price) }))
}

export async function getProductBySlug(
  slug: string,
  options: { includeUnpublished?: boolean } = {}
) {
  return prisma.product.findFirst({
    where: {
      slug,
      ...(options.includeUnpublished
        ? {}
        : { status: ProductStatus.PUBLISHED }),
    },
  })
}

export async function getRelatedProducts(product: {
  id: string
  category: string
}, limit = 3) {
  return prisma.product.findMany({
    where: {
      status: ProductStatus.PUBLISHED,
      category: product.category as never,
      NOT: { id: product.id },
    },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    take: limit,
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
}
