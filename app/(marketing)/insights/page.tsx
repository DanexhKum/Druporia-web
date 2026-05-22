import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, BookOpen } from 'lucide-react'
import { getInsightPosts } from '@/lib/insights'
import { AnimateIn, StaggerGrid, StaggerItem } from '@/components/marketing/AnimateIn'

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
    images: [{ url: '/icon.svg', width: 64, height: 64, alt: 'Druporia Insights' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Druporia Insights',
    description:
      'Practical articles about commerce technology, automation, AI, and analytics.',
    images: ['/icon.svg'],
  },
}

export default function InsightsPage() {
  const posts = getInsightPosts()

  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.32),transparent_34rem)]" />
        <div className="container-page relative z-10 py-20">
          <AnimateIn className="max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-blue-300">
              Druporia Insights
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Ideas for commerce, automation, AI, and analytics.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-300">
              Practical articles for businesses building better digital products,
              integrations, workflows, and reporting systems.
            </p>
          </AnimateIn>
        </div>
      </section>

      <section className="container-page py-16 sm:py-24">
        <StaggerGrid className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <StaggerItem key={post.slug}>
              <article className="motion-card card h-full p-7">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <span className="badge">{post.category}</span>
                  <span className="text-xs font-medium text-slate-400">
                    {post.readingTime}
                  </span>
                </div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">{post.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {post.excerpt}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {post.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/insights/${post.slug}`}
                  className="btn-secondary mt-7 inline-flex gap-2"
                >
                  Read insight
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>
    </div>
  )
}
