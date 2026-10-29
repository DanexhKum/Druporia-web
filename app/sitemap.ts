import type { MetadataRoute } from 'next'
import { ProductStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getInsightPosts } from '@/lib/insights'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://druporia.vercel.app'

// Regenerate hourly so product URLs appear even if the database
// was unreachable when the site was built.
export const revalidate = 3600

async function getPublishedProductSlugs() {
  try {
    return await prisma.product.findMany({
      where: { status: ProductStatus.PUBLISHED },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    })
  } catch (error) {
    console.error('[sitemap] product query failed, omitting product URLs', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const products = await getPublishedProductSlugs()
  const insights = getInsightPosts()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/marketplace`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/insights`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/refund`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/marketplace/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))
  const insightRoutes: MetadataRoute.Sitemap = insights.map((post) => ({
    url: `${SITE_URL}/insights/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.65,
  }))

  return [...staticRoutes, ...productRoutes, ...insightRoutes]
}
