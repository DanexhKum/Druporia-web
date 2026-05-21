import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ProductCategory } from '@prisma/client'
import { ArrowLeft, Save } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { CATEGORY_LABELS } from '@/lib/utils'
import { updateProduct } from './actions'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Edit Product' }

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })

  if (!product) notFound()

  return (
    <div className="max-w-4xl">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to overview
      </Link>

      <div className="mb-8">
        <h1 className="text-xl font-semibold text-slate-900">Edit product</h1>
        <p className="mt-1 text-sm text-slate-500">
          Update storefront copy, pricing, category, and publish status.
        </p>
      </div>

      <form action={updateProduct} className="card space-y-5 p-6">
        <input type="hidden" name="id" value={product.id} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="title">Title</label>
            <input id="title" name="title" defaultValue={product.title} required />
          </div>
          <div>
            <label className="form-label" htmlFor="slug">Slug</label>
            <input id="slug" name="slug" defaultValue={product.slug} required />
          </div>
        </div>

        <div>
          <label className="form-label" htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows={10}
            defaultValue={product.description}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="form-label" htmlFor="price">Price</label>
            <input
              id="price"
              name="price"
              type="number"
              min={0}
              step="0.01"
              defaultValue={Number(product.price)}
              required
            />
          </div>
          <div>
            <label className="form-label" htmlFor="category">Category</label>
            <select id="category" name="category" defaultValue={product.category}>
              {Object.values(ProductCategory).map((category) => (
                <option key={category} value={category}>
                  {CATEGORY_LABELS[category]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label" htmlFor="version">Version</label>
            <input
              id="version"
              name="version"
              defaultValue={product.version ?? '1.0.0'}
              required
            />
          </div>
        </div>

        <div>
          <label className="form-label" htmlFor="thumbnailUrl">Thumbnail image URL</label>
          <input
            id="thumbnailUrl"
            name="thumbnailUrl"
            type="url"
            defaultValue={product.thumbnailUrl ?? ''}
            placeholder="https://example.com/product-thumbnail.png"
          />
          <p className="mt-1 text-xs text-slate-400">
            Used on marketplace cards and product detail pages.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Stored package
          </p>
          <p className="mt-2 break-all text-sm text-slate-700">{product.downloadUrl}</p>
          <p className="mt-1 text-xs text-slate-500">
            Package replacement will be added later. This editor updates metadata.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="isPublished"
              defaultChecked={product.isPublished}
              className="rounded"
            />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="isFeatured"
              defaultChecked={product.isFeatured}
              className="rounded"
            />
            Featured
          </label>
        </div>

        <button type="submit" className="btn-primary gap-2">
          <Save className="h-4 w-4" />
          Save product
        </button>
      </form>
    </div>
  )
}
