import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  HelpCircle,
  Headphones,
  ShieldCheck,
  Sparkles,
  Tag,
  Zap,
} from 'lucide-react'
import { getProductBySlug, getRelatedProducts } from '@/lib/site-data'
import { requireAdmin } from '@/lib/auth'
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/utils'
import { ProductCard } from '@/components/marketplace/ProductCard'
import { ProductPurchase } from '@/components/marketplace/ProductPurchase'
import { AnimateIn } from '@/components/marketing/AnimateIn'
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
      'WooCommerce-ready implementation',
      'Clean admin workflow',
      'Performance-focused codebase',
      'Built for real commerce stores',
    ]
  }

  if (category === 'CHROME_EXTENSION') {
    return [
      'Fast browser-native experience',
      'Clean extension architecture',
      'Simple installation flow',
      'Built for daily productivity',
    ]
  }

  return [
    'Modern responsive interface',
    'Scalable full-stack architecture',
    'Production-ready user experience',
    'Built with maintainable code',
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

const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'Secure checkout ready', description: 'Designed for protected payment and delivery flows.' },
  { icon: Zap, label: 'Instant delivery', description: 'Digital files are prepared for fast post-purchase access.' },
  { icon: Headphones, label: 'Support included', description: 'Contact support for setup, usage, and early purchase help.' },
]

const FAQS = [
  {
    question: 'Can I request customization?',
    answer: 'Yes. Contact the Druporia team with your exact workflow, platform, and timeline.',
  },
  {
    question: 'How do downloads work?',
    answer: 'Free products can be downloaded directly. Paid checkout and protected delivery are planned for the next release.',
  },
  {
    question: 'Is support included?',
    answer: 'Basic product support is included. Custom development or setup work can be quoted separately.',
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
  const image = product.thumbnailUrl || '/icon.svg'

  return {
    title: product.title,
    description,
    alternates: {
      canonical: `/marketplace/${product.slug}`,
    },
    openGraph: {
      title: `${product.title} — Druporia Marketplace`,
      description,
      url: `/marketplace/${product.slug}`,
      type: 'website',
      images: [
        {
          url: image,
          width: product.thumbnailUrl ? 1200 : 64,
          height: product.thumbnailUrl ? 630 : 64,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} — Druporia Marketplace`,
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

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.32),transparent_34rem),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.18),transparent_28rem)]" />
        <div className="container-page relative z-10 py-10">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to marketplace
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <AnimateIn>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200">
                  {CATEGORY_ICONS[product.category]} {CATEGORY_LABELS[product.category]}
                </span>
                {isPreview && (
                  <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-100">
                    Admin preview: {product.status.toLowerCase()}
                  </span>
                )}
              </div>
              <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">
                {product.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
                {product.description.replace(/[#*_`>-]/g, '').slice(0, 180)}
                {product.description.length > 180 ? '...' : ''}
              </p>
              {(product.version || product.fileSize) && (
                <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-300">
                  {product.version && (
                    <span className="flex items-center gap-1">
                      <Tag className="h-4 w-4" /> v{product.version}
                    </span>
                  )}
                  {product.fileSize && (
                    <span className="flex items-center gap-1">
                      <Download className="h-4 w-4" /> {product.fileSize}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> Instant access flow
                  </span>
                </div>
              )}
            </AnimateIn>

            {product.thumbnailUrl && (
              <AnimateIn delay={0.12}>
                <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-2 shadow-2xl shadow-blue-950/40 backdrop-blur">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.thumbnailUrl}
                    alt={product.title}
                    className="h-[320px] w-full rounded-[1.5rem] object-cover md:h-[420px]"
                  />
                </div>
              </AnimateIn>
            )}
          </div>
        </div>
      </div>

      <div className="container-page py-12">
        <AnimateIn className="mb-8 grid gap-4 md:grid-cols-3">
          {TRUST_BADGES.map((badge) => {
            const Icon = badge.icon
            return (
              <div key={badge.label} className="card p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">{badge.label}</h2>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{badge.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </AnimateIn>

        <div className="grid gap-10 lg:grid-cols-3">
          <AnimateIn className="lg:col-span-2 space-y-8">
            <div className="card p-8 prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-blue-600">
              <ReactMarkdown>{product.description}</ReactMarkdown>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <section className="card p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-slate-900">Key features</h2>
                </div>
                <ul className="space-y-3">
                  {features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="card p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-slate-900">Requirements</h2>
                </div>
                <ul className="space-y-3">
                  {requirements.map((requirement) => (
                    <li key={requirement} className="flex gap-3 text-sm text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      {requirement}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {galleryUrls.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-slate-900">Screenshots</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {galleryUrls.map((url) => (
                    <div key={url} className="motion-thumb overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`${product.title} screenshot`}
                        className="h-56 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.documentation && (
              <div className="card p-8 prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-blue-600">
                <h2>Documentation</h2>
                <ReactMarkdown>{product.documentation}</ReactMarkdown>
              </div>
            )}

            {product.changelog && (
              <div className="card p-8 prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-blue-600">
                <h2>Version history</h2>
                <ReactMarkdown>{product.changelog}</ReactMarkdown>
              </div>
            )}

            {!product.changelog && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-slate-900">Version history</h2>
                <p className="mt-3 text-sm text-slate-600">
                  Current release: <span className="font-semibold">v{product.version ?? '1.0.0'}</span>. Detailed changelog can be added from the admin product editor.
                </p>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              <section className="card p-6">
                <div className="mb-4 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-slate-900">FAQs</h2>
                </div>
                <div className="space-y-4">
                  {FAQS.map((faq) => (
                    <div key={faq.question}>
                      <h3 className="text-sm font-semibold text-slate-900">{faq.question}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="card p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-slate-900">Support</h2>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                  Need installation help, customization, or a business-specific version? Contact Druporia and include your platform, current workflow, and deadline.
                </p>
                <Link href="/contact" className="btn-secondary mt-5 inline-flex">
                  Contact support
                </Link>
              </section>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.15} className="lg:col-span-1">
            <div className="sticky top-24">
              <ProductPurchase price={price} productId={product.id} />
            </div>
          </AnimateIn>
        </div>

        {relatedProducts.length > 0 && (
          <AnimateIn className="mt-16">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                  More from Druporia
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Related products
                </h2>
              </div>
              <Link href="/marketplace" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
                View all
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  {...relatedProduct}
                  price={Number(relatedProduct.price)}
                />
              ))}
            </div>
          </AnimateIn>
        )}
      </div>
    </div>
  )
}
