'use client'

import Link from 'next/link'
import toast from 'react-hot-toast'
import { formatPrice } from '@/lib/utils'
import { buttonClasses } from '@/components/ui/Button'

interface ProductPurchaseProps {
  price: number
  productId: string
}

export function ProductPurchase({ price, productId }: ProductPurchaseProps) {
  const isFree = price === 0

  function handleBuySoon() {
    toast('Online checkout isn’t open yet. Contact us and we’ll arrange access.', {
      duration: 5000,
    })
  }

  return (
    <div id="purchase" className="scroll-mt-28 rounded-card-lg border border-line-card bg-canvas p-6 shadow-hero tab:p-7">
      <p className="text-sm font-semibold text-ink">{isFree ? 'Free to use' : 'Licence'}</p>
      <p className="mt-2 text-[34px] font-semibold tracking-[-0.03em]">
        {isFree ? 'Free' : formatPrice(price)}
        {!isFree && <span className="ml-1.5 text-sm font-medium tracking-normal text-muted">USD</span>}
      </p>
      <p className="mt-3 text-[15px] leading-[1.6] text-body">
        Need it adapted to your store or workflow? We can scope the changes as a
        fixed-price project.
      </p>
      <div className="mt-6 flex flex-col gap-2.5">
        {isFree ? (
          <Link href={`/api/download/${productId}`} className={buttonClasses('primary', 'md', 'w-full')}>
            Free download
          </Link>
        ) : (
          <button type="button" onClick={handleBuySoon} className={buttonClasses('primary', 'md', 'w-full')}>
            Get access
          </button>
        )}
        <Link href="/contact" className={buttonClasses('outline', 'md', 'w-full')}>
          Ask about customisation
        </Link>
      </div>
    </div>
  )
}
