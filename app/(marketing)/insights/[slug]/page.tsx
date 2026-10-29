import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import type { Metadata } from 'next'
import { getInsightPost, getInsightPosts } from '@/lib/insights'
import { Tag } from '@/components/ui/Card'
import { Eyebrow } from '@/components/ui/Section'
import { CtaBand } from '@/components/marketing/HomeSections'

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

  const published = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <>
      <header className="container-page pb-12 pt-12 desk:pb-16 desk:pt-16">
        <Link
          href="/insights"
          className="inline-flex items-center gap-2 text-[15px] font-medium text-nav transition-colors hover:text-ink"
        >
          <span aria-hidden="true">←</span> All insights
        </Link>
        <Eyebrow className="mt-10">{post.category}</Eyebrow>
        <h1 className="mt-[18px] max-w-[22ch] text-[clamp(2.25rem,1.5rem+2.8vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
          {post.title}
        </h1>
        <p className="mt-6 max-w-[60ch] text-lead text-body">{post.excerpt}</p>
        <p className="mt-6 text-sm text-muted">
          <time dateTime={post.publishedAt}>{published}</time> · {post.readingTime}
        </p>
      </header>

      <div className="container-page grid gap-12 pb-20 desk:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] desk:gap-16 desk:pb-section">
        <article className="prose max-w-[68ch] border-t border-line pt-10 prose-headings:mt-10">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>

        <aside className="flex flex-col gap-4 desk:pt-10">
          <div className="card-surface p-6">
            <h2 className="text-[15px] font-semibold">Topics</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.keywords.map((keyword) => (
                <Tag key={keyword}>{keyword}</Tag>
              ))}
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <div className="card-surface p-6">
              <h2 className="text-[15px] font-semibold">More insights</h2>
              <ul className="mt-3 flex flex-col">
                {relatedPosts.map((relatedPost) => (
                  <li key={relatedPost.slug} className="border-t border-line-strong/60 first:border-t-0">
                    <Link
                      href={`/insights/${relatedPost.slug}`}
                      className="block py-3.5 transition-colors hover:text-orange-text"
                    >
                      <span className="font-semibold leading-snug">{relatedPost.title}</span>
                      <span className="mt-1 block text-[13px] text-muted">
                        {relatedPost.category} · {relatedPost.readingTime}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <CtaBand
        title="Need this built for your business?"
        description="We build plugins, Shopify apps, automation workflows, AI tools and analytics dashboards — scoped as fixed-price work."
      />
    </>
  )
}
