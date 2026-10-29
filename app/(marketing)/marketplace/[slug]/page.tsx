import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { getProductBySlug, getRelatedProducts } from '@/lib/site-data'
import { requireAdmin } from '@/lib/auth'
import { CATEGORY_LABELS } from '@/lib/utils'
import { ProductCard } from '@/components/marketplace/ProductCard'
import { ProductPurchase } from '@/components/marketplace/ProductPurchase'
import { Tag } from '@/components/ui/Card'
import { Eyebrow, SectionHeading } from '@/components/ui/Section'
import { CtaBand } from '@/components/marketing/HomeSections'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ preview?: string }>
}

function getGalleryUrls(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []
}

function getCategoryFeatures(category: string) {
  if (category === 'WOO_PLUGIN') {
    return [
      'Works inside WooCommerce admin',
      'Settings with safe defaults',
      'Performance-minded queries',
      'Readable code you can extend',
    ]
  }

  if (category === 'CHROME_EXTENSION') {
    return [
      'Lightweight, browser-native UI',
      'Clear extension structure',
      'Simple installation',
      'Easy to adapt to your workflow',
    ]
  }

  return [
    'Responsive interface',
    'Full-stack Next.js foundation',
    'Readable, maintainable code',
    'Easy to adapt to your brand',
  ]
}

function getCategoryRequirements(category: string) {
  if (category === 'WOO_PLUGIN') {
    return ['WordPress + WooCommerce store', 'PHP hosting with plugin upload access', 'Admin access for installation']
  }

  if (category === 'CHROME_EXTENSION') {
    return ['Google Chrome or Chromium-based browser', 'Developer mode for manual installs if needed', 'Basic browser permissions approval']
  }

  return ['Modern browser', 'Stable internet connection', 'Deployment/runtime setup based on product type']
}

const HIGHLIGHTS = [
  { label: 'Adaptable', description: 'Use it as-is or as the starting point for a custom build.' },
  { label: 'Setup help', description: 'Ask us about installation and configuration for your stack.' },
  { label: 'Scoped changes', description: 'Customisation is quoted as fixed-price work, up front.' },
]

const FAQS = [
  {
    question: 'Can I request customization?',
    answer: 'Yes. Contact the Druporia team with your exact workflow, platform, and timeline.',
  },
  {
    question: 'How do downloads work?',
    answer: 'Free products can be downloaded directly after signing in. For paid products, contact us and we’ll arrange access.',
  },
  {
    question: 'Is support included?',
    answer: 'We answer setup questions. Custom development or configuration work is scoped and quoted separately.',
  },
]

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product not found' }
  const description = product.description
    .replace(/[#*_`>-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160)
  const image = product.thumbnailUrl || '/og.png'

  return {
    title: product.title,
    description,
    alternates: {
      canonical: `/marketplace/${product.slug}`,
    },
    openGraph: {
      title: `${product.title} | Druporia Products`,
      description,
      url: `/marketplace/${product.slug}`,
      type: 'website',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} | Druporia Products`,
      description,
      images: [image],
    },
  }
}

export default async function ProductDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const isPreview = resolvedSearchParams.preview === '1'

  if (isPreview) {
    await requireAdmin()
  }

  const product = await getProductBySlug(slug, {
    includeUnpublished: isPreview,
  })
  if (!product) notFound()

  const price = Number(product.price)
  const galleryUrls = getGalleryUrls(product.galleryUrls)
  const relatedProducts = await getRelatedProducts(product)
  const features = getCategoryFeatures(product.category)
  const requirements = getCategoryRequirements(product.category)

  const plainDescription = product.description.replace(/[#*_`>-]/g, '').replace(/\s+/g, ' ').trim()

  return (
    <>
      <header className="container-page grid items-center gap-12 pb-14 pt-12 desk:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] desk:gap-14 desk:pb-20 desk:pt-16">
        <div>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-[15px] font-medium text-nav transition-colors hover:text-ink"
          >
            <span aria-hidden="true">←</span> All products
          </Link>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Eyebrow>{CATEGORY_LABELS[product.category]}</Eyebrow>
            {isPreview && (
              <span className="badge border-orange bg-orange-tint text-orange-deep">
                Admin preview: {product.status.toLowerCase()}
              </span>
            )}
          </div>
          <h1 className="mt-[18px] max-w-[20ch] text-[clamp(2.25rem,1.5rem+2.8vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
            {product.title}
          </h1>
          <p className="mt-6 max-w-[56ch] text-lead text-body">
            {plainDescription.slice(0, 180)}
            {plainDescription.length > 180 ? '…' : ''}
          </p>
          {(product.version || product.fileSize) && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.version && <Tag className="bg-surface">v{product.version}</Tag>}
              {product.fileSize && <Tag className="bg-surface">{product.fileSize}</Tag>}
            </div>
          )}
        </div>

        {product.thumbnailUrl && (
          <div className="overflow-hidden rounded-card-lg bg-surface-photo shadow-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.thumbnailUrl}
              alt={product.title}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        )}
      </header>

      <div className="container-page grid gap-12 pb-20 desk:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] desk:gap-14 desk:pb-section">
        <div className="flex min-w-0 flex-col gap-12">
          <ul className="grid gap-4 tab:grid-cols-3">
            {HIGHLIGHTS.map((item) => (
              <li key={item.label} className="flex flex-col gap-2 border-t-2 border-ink pt-5">
                <h2 className="text-[17px] font-semibold">{item.label}</h2>
                <p className="text-[15px] leading-[1.55] text-body">{item.description}</p>
              </li>
            ))}
          </ul>

          <article className="prose max-w-none">
            <ReactMarkdown>{product.description}</ReactMarkdown>
          </article>

          <div className="grid gap-4 tab:grid-cols-2">
            <section className="card-surface p-7">
              <h2 className="text-h3-sm font-semibold">Key features</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-[15px] text-body">
                    <span className="mt-[9px] h-1.5 w-1.5 flex-none rounded-full bg-orange" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
            <section className="card-surface p-7">
              <h2 className="text-h3-sm font-semibold">Requirements</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {requirements.map((requirement) => (
                  <li key={requirement} className="flex gap-3 text-[15px] text-body">
                    <span className="mt-[9px] h-1.5 w-1.5 flex-none rounded-full bg-muted-soft" aria-hidden="true" />
                    {requirement}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {galleryUrls.length > 0 && (
            <section>
              <h2 className="text-h3 font-semibold">Screenshots</h2>
              <div className="mt-5 grid gap-4 tab:grid-cols-2">
                {galleryUrls.map((url) => (
                  <div key={url} className="overflow-hidden rounded-card bg-surface-photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`${product.title} screenshot`}
                      className="aspect-[16/10] w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {product.documentation && (
            <section className="prose max-w-none border-t border-line pt-10">
              <h2>Documentation</h2>
              <ReactMarkdown>{product.documentation}</ReactMarkdown>
            </section>
          )}

          <section className="prose max-w-none border-t border-line pt-10">
            <h2>Version history</h2>
            {product.changelog ? (
              <ReactMarkdown>{product.changelog}</ReactMarkdown>
            ) : (
              <p>
                Current release: <strong>v{product.version ?? '1.0.0'}</strong>.
              </p>
            )}
          </section>

          <section className="border-t border-line pt-10">
            <h2 className="text-h3 font-semibold">Questions</h2>
            <dl className="mt-6 flex flex-col gap-2.5">
              {FAQS.map((faq) => (
                <div key={faq.question} className="rounded-faq bg-surface px-6 py-5">
                  <dt className="text-[17px] font-semibold">{faq.question}</dt>
                  <dd className="mt-2 text-[15px] leading-[1.6] text-body">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <aside>
          <div className="desk:sticky desk:top-28">
            <ProductPurchase price={price} productId={product.id} />
          </div>
        </aside>
      </div>

      {relatedProducts.length > 0 && (
        <section className="container-page pb-20 desk:pb-section">
          <SectionHeading eyebrow="More products" title="Related" size="sm" className="mb-10" />
          <ul className="grid gap-4 tab:grid-cols-2 desk:grid-cols-3">
            {relatedProducts.map((relatedProduct) => (
              <li key={relatedProduct.id}>
                <ProductCard {...relatedProduct} price={Number(relatedProduct.price)} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <CtaBand
        title="Want this adapted to your store?"
        description="Tell us your platform, workflow and timeline. We’ll scope the changes as fixed-price work."
      />
    </>
  )
}
