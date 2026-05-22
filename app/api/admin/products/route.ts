import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  await requireAdmin()

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      category: true,
      status: true,
      thumbnailUrl: true,
      createdAt: true,
    },
  })

  return NextResponse.json({
    products: products.map((product) => ({
      ...product,
      price: Number(product.price),
    })),
  })
}
