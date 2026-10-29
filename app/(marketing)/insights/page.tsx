import Link from 'next/link'
import type { Metadata } from 'next'
import { getInsightPosts } from '@/lib/insights'
import { ArrowChip, Tag } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/Section'
import { CtaBand } from '@/components/marketing/HomeSections'

export const metadata: Metadata = {
  title: 'Insights',
  description:
    'Read Druporia insights about WooCommerce, Shopify, business automation, AI workflows, and data analytics for modern commerce.',
  alternates: { canonical: '/insights' },
  openGraph: {
    title: 'Druporia Insights',
    description:
      'Practical articles about commerce technology, automation, AI, and analytics.',
    url: '/insights',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Druporia Insights' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Druporia Insights',
    description:
      'Practical articles about commerce technology, automation, AI, and analytics.',
    images: ['/og.png'],
  },
}

export default function InsightsPage() {
  const posts = getInsightPosts()

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Ideas for commerce, automation, AI and analytics."
        description="Practical notes for teams building better stores, integrations, workflows and reporting. Written by the engineers who do the work."
      />

      <section className="container-page pb-20 desk:pb-section">
        <ul className="grid gap-4 tab:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/insights/${post.slug}`}
                className="card-surface flex h-full flex-col gap-3.5 p-7 transition-colors duration-150 hover:bg-orange-tint tab:p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-orange-text">
                    {post.category} · {post.readingTime}
                  </span>
                  <ArrowChip />
                </div>
                <h2 className="mt-3 text-h3 font-semibold">{post.title}</h2>
                <p className="text-[15.5px] leading-[1.6] text-body">{post.excerpt}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-1.5">
                  {post.keywords.slice(0, 3).map((keyword) => (
                    <Tag key={keyword}>{keyword}</Tag>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand />
    </>
  )
}
