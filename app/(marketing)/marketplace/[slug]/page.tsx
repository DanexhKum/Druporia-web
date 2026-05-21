import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { ArrowLeft, Tag, Download } from 'lucide-react'
import { getProductBySlug } from '@/lib/site-data'
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/utils'
import { ProductPurchase } from '@/components/marketplace/ProductPurchase'
import { AnimateIn } from '@/components/marketing/AnimateIn'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product not found' }
  return {
    title: product.title,
    description: product.description.slice(0, 160),
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const price = Number(product.price)

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-slate-900 text-white">
        <div className="container-page py-10">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to marketplace
          </Link>
          <AnimateIn className="mt-6 max-w-3xl">
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200">
              {CATEGORY_ICONS[product.category]} {CATEGORY_LABELS[product.category]}
            </span>
            <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{product.title}</h1>
            {(product.version || product.fileSize) && (
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400">
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
              </div>
            )}
          </AnimateIn>
        </div>
      </div>

      <div className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-3">
          <AnimateIn className="lg:col-span-2 space-y-8">
            {product.thumbnailUrl && (
              <div className="card overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.thumbnailUrl}
                  alt={product.title}
                  className="w-full max-h-[420px] object-cover"
                />
              </div>
            )}
            <div className="card p-8 prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-blue-600">
              <ReactMarkdown>{product.description}</ReactMarkdown>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.15} className="lg:col-span-1">
            <div className="sticky top-24">
              <ProductPurchase price={price} productId={product.id} />
            </div>
          </AnimateIn>
        </div>
      </div>
    </div>
  )
}
