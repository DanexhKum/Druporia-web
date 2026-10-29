// ============================================================
// components/marketplace/ProductCard.tsx
// Surface card linking to a product's detail page.
// ============================================================

import Link from 'next/link'
import { formatPrice, CATEGORY_LABELS, truncate } from '@/lib/utils'
import { ArrowChip, Tag } from '@/components/ui/Card'
import type { ProductCategory } from '@prisma/client'

export interface ProductCardProps {
  id: string
  title: string
  slug: string
  description: string
  price: number | string
  category: ProductCategory
  thumbnailUrl?: string | null
  version?: string | null
  fileSize?: string | null
  isFeatured?: boolean
  createdAt?: Date | string
}

export function ProductCard({
  title,
  slug,
  description,
  price,
  category,
  thumbnailUrl,
  version,
}: ProductCardProps) {
  const priceNum = typeof price === 'string' ? parseFloat(price) : price
  const isFree = priceNum === 0

  return (
    <Link
      href={`/marketplace/${slug}`}
      className="card-surface group flex h-full flex-col overflow-hidden transition-colors duration-150 hover:bg-orange-tint"
    >
      <div className="relative m-2 mb-0 aspect-[16/10] overflow-hidden rounded-[16px] bg-surface-photo">
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-sm font-medium text-muted-soft">
            {CATEGORY_LABELS[category]}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-4">
          <span className="text-sm font-medium text-orange-text">{CATEGORY_LABELS[category]}</span>
          <ArrowChip className="-mt-1" />
        </div>
        <h3 className="text-h3-sm font-semibold">{title}</h3>
        <p className="text-[15px] leading-[1.6] text-body">
          {truncate(description.replace(/[#*_`>]/g, ''), 120)}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          <Tag>{isFree ? 'Free' : formatPrice(priceNum)}</Tag>
          {version && <Tag>v{version}</Tag>}
        </div>
      </div>
    </Link>
  )
}
