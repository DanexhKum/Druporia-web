import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ProductCategory, ProductStatus } from '@prisma/client'
import { ArrowLeft, Save } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { CATEGORY_LABELS } from '@/lib/utils'
import { updateProduct } from './actions'
import { SubmitButton } from '@/components/admin/SubmitButton'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Edit Product' }

interface PageProps {
  params: Promise<{ id: string }>
}

function getGalleryUrls(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })

  if (!product) notFound()
  const galleryUrls = getGalleryUrls(product.galleryUrls)

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
            Used on marketplace cards and product detail pages. Upload below overrides this URL.
          </p>
        </div>

        <div>
          <label className="form-label" htmlFor="thumbnailFile">Upload thumbnail image</label>
          <input
            id="thumbnailFile"
            name="thumbnailFile"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
          />
          <p className="mt-1 text-xs text-slate-400">
            Optional. JPG, PNG, WebP, or GIF. Best size: 1200x800. Max 5 MB.
          </p>
          {product.thumbnailUrl && (
            <div className="mt-3 space-y-3">
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.thumbnailUrl}
                  alt={`${product.title} current thumbnail`}
                  className="h-56 w-full object-cover"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-red-700">
                <input type="checkbox" name="removeThumbnail" className="rounded" />
                Delete current thumbnail
              </label>
            </div>
          )}
        </div>

        <div>
          <label className="form-label" htmlFor="galleryImageUrls">Gallery image URLs</label>
          <textarea
            id="galleryImageUrls"
            name="galleryImageUrls"
            rows={4}
            defaultValue={galleryUrls.join('\n')}
            placeholder="https://example.com/screenshot.png"
            className="font-mono text-xs"
          />
          <p className="mt-1 text-xs text-slate-400">
            One URL per line. Uploads below will be appended.
          </p>
        </div>

        <div>
          <label className="form-label" htmlFor="galleryFiles">Upload gallery screenshots</label>
          <input
            id="galleryFiles"
            name="galleryFiles"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
          />
          <p className="mt-1 text-xs text-slate-400">
            Optional. JPG, PNG, WebP, or GIF. Max 5 MB per image.
          </p>
          {galleryUrls.length > 0 && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {galleryUrls.map((url) => (
                <div key={url} className="overflow-hidden rounded-2xl border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-40 w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="form-label" htmlFor="documentation">Documentation</label>
          <textarea
            id="documentation"
            name="documentation"
            rows={8}
            defaultValue={product.documentation ?? ''}
            className="font-mono text-xs"
          />
          <p className="mt-1 text-xs text-slate-400">
            Markdown supported. Shows on the product detail page.
          </p>
        </div>

        <div>
          <label className="form-label" htmlFor="changelog">Changelog</label>
          <textarea
            id="changelog"
            name="changelog"
            rows={6}
            defaultValue={product.changelog ?? ''}
            className="font-mono text-xs"
          />
          <p className="mt-1 text-xs text-slate-400">
            Markdown supported. Use it for release notes.
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
          <div>
            <label className="form-label" htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={product.status ?? ProductStatus.DRAFT}>
              <option value={ProductStatus.DRAFT}>Draft</option>
              <option value={ProductStatus.PUBLISHED}>Published</option>
              <option value={ProductStatus.ARCHIVED}>Archived</option>
            </select>
          </div>
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

        <Link
          href={`/marketplace/${product.slug}?preview=1`}
          target="_blank"
          className="btn-secondary w-fit"
        >
          Preview product page
        </Link>

        <SubmitButton pendingText="Saving product..." className="gap-2">
          <Save className="h-4 w-4" />
          Save product
        </SubmitButton>
      </form>
    </div>
  )
}
