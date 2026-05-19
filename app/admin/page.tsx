// ============================================================
// app/admin/page.tsx — Admin Overview Dashboard
// ============================================================

import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate, CATEGORY_LABELS } from '@/lib/utils'
import { PackagePlus, Package, Users, ShoppingBag } from 'lucide-react'

async function getAdminStats() {
  const [totalProducts, totalUsers, totalOrders, recentProducts] =
    await Promise.all([
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.count(),
      prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          price: true,
          category: true,
          isPublished: true,
          createdAt: true,
        },
      }),
    ])

  return { totalProducts, totalUsers, totalOrders, recentProducts }
}

export default async function AdminPage() {
  const { totalProducts, totalUsers, totalOrders, recentProducts } =
    await getAdminStats()

  const stats = [
    { label: 'Total Products', value: totalProducts, icon: Package },
    { label: 'Registered Users', value: totalUsers, icon: Users },
    { label: 'Total Orders', value: totalOrders, icon: ShoppingBag },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-slate-900">Admin Overview</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your marketplace products, users, and orders.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                  <Icon className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-slate-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick action */}
      <div className="mb-8">
        <Link href="/admin/add-product" className="btn-primary gap-2">
          <PackagePlus className="h-4 w-4" />
          Add New Product
        </Link>
      </div>

      {/* Recent products */}
      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Recent Products
          </h2>
        </div>
        {recentProducts.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-slate-400">
            No products yet.{' '}
            <Link href="/admin/add-product" className="text-slate-900 underline">
              Add your first product.
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">
                  Title
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">
                  Category
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">
                  Price
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3 font-medium text-slate-900">
                    {product.title}
                  </td>
                  <td className="px-5 py-3 text-slate-500">
                    {CATEGORY_LABELS[product.category]}
                  </td>
                  <td className="px-5 py-3 text-slate-900">
                    {formatPrice(Number(product.price))}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        product.isPublished
                          ? 'bg-green-50 text-green-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {product.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">
                    {formatDate(product.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
