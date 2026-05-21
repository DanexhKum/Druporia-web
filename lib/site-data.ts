import { prisma } from '@/lib/prisma'

export async function getFeaturedProducts(limit = 3) {
  return prisma.product.findMany({
    where: { isPublished: true, isFeatured: true },
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
    where: { isPublished: true },
    orderBy: [{ sortOrder: 'asc' }, { reviewDate: 'desc' }],
    take: limit,
  })
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isPublished: true },
  })
}
