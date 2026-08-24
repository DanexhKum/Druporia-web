import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import type { Metadata } from 'next'
import { ArrowLeft, ArrowRight, CalendarDays, Clock } from 'lucide-react'
import { getInsightPost, getInsightPosts } from '@/lib/insights'
import { AnimateIn } from '@/components/marketing/AnimateIn'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getInsightPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getInsightPost(slug)
  if (!post) return { title: 'Insight not found' }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: { canonical: `/insights/${post.slug}` },
    openGraph: {
      title: `${post.title} — Druporia Insights`,
      description: post.excerpt,
      url: `/insights/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      tags: post.keywords,
      images: [{ url: '/icon.svg', width: 64, height: 64, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} — Druporia Insights`,
      description: post.excerpt,
      images: ['/icon.svg'],
    },
  }
}

export default async function InsightDetailPage({ params }: PageProps) {
  const { slug } = await params
  const post = getInsightPost(slug)
  if (!post) notFound()

  const relatedPosts = getInsightPosts()
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3)

  return (
    <div className="bg-ink-950">
      <section className="bg-ink-990 text-white">
        <div className="container-page py-10">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to insights
          </Link>
          <AnimateIn className="mt-10 max-w-4xl">
            <span className="chip border-teal-400/30/30 bg-white/10/10 text-white/70">
              {post.category}
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/60">
              {post.excerpt}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/45">
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readingTime}
              </span>
            </div>
          </AnimateIn>
        </div>
      </section>

      <main className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <AnimateIn>
            <article className="card-dark-hover sweep-host-dark p-8 prose prose-invert max-w-none prose-headings:font-semibold prose-a:text-white/80">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </article>

            <section className="mt-8 rounded-3xl border border-white/[0.07] bg-white/[0.03] p-8">
              <p className="text-sm font-bold uppercase tracking-widest text-white">
                Build with Druporia
              </p>
              <h2 className="mt-3 text-2xl font-bold text-white">
                Need this implemented for your business?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">
                Druporia can help you build plugins, Shopify apps, automation
                workflows, AI tools, and analytics dashboards tailored to your
                commerce operations.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="btn-dark-primary gap-2">
                  Start a project
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/marketplace" className="btn-dark-ghost">
                  Browse marketplace
                </Link>
              </div>
            </section>
          </AnimateIn>

          <aside className="space-y-5">
            <div className="card-dark-hover sweep-host-dark p-5">
              <h2 className="text-sm font-semibold text-white">
                Topics
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.keywords.map((keyword) => (
                  <span key={keyword} className="chip">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="card-dark-hover sweep-host-dark p-5">
              <h2 className="text-sm font-semibold text-white">
                More insights
              </h2>
              <div className="mt-4 space-y-4">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/insights/${relatedPost.slug}`}
                    className="block rounded-xl border border-white/[0.07] p-3 text-sm transition hover:border-white/10 hover:bg-ink-950"
                  >
                    <span className="font-semibold text-white">
                      {relatedPost.title}
                    </span>
                    <span className="mt-1 block text-xs text-white/55">
                      {relatedPost.category} · {relatedPost.readingTime}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
