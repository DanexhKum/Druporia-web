'use client'

import Link from 'next/link'
import toast from 'react-hot-toast'
import { ShoppingCart, Download, Mail } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface ProductPurchaseProps {
  price: number
  productId: string
}

export function ProductPurchase({ price, productId }: ProductPurchaseProps) {
  const isFree = price === 0

  function handleBuySoon() {
    toast('Secure checkout launches soon. Contact us to purchase early access.', {
      duration: 5000,
      icon: '🛒',
    })
  }

  return (
    <div id="purchase" className="card-dark p-6 space-y-4 scroll-mt-24">
      <div className="flex items-baseline gap-2">
        {isFree ? (
          <span className="text-2xl font-bold text-green-700">Free</span>
        ) : (
          <>
            <span className="text-3xl font-bold text-white">
              {formatPrice(price)}
            </span>
            <span className="text-sm text-white/55">USD</span>
          </>
        )}
      </div>
      <p className="text-sm text-white/55">
        Instant delivery after purchase. Stripe checkout coming in the next release.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        {!isFree && (
          <button
            type="button"
            onClick={handleBuySoon}
            className="btn-dark-primary flex-1 gap-2 justify-center"
          >
            <ShoppingCart className="h-4 w-4" />
            Buy Now
          </button>
        )}
        {isFree ? (
          <Link
            href={`/api/download/${productId}`}
            className="btn-dark-primary flex-1 gap-2 justify-center"
          >
            <Download className="h-4 w-4" />
            Free download
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleBuySoon}
            className="btn-dark-ghost flex-1 gap-2 justify-center"
          >
            <Download className="h-4 w-4" />
            Preview download
          </button>
        )}
        <Link href="/contact" className="btn-dark-ghost flex-1 gap-2 justify-center">
          <Mail className="h-4 w-4" />
          Contact sales
        </Link>
      </div>
    </div>
  )
}
