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
