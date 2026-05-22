// ============================================================
// app/admin/page.tsx — Admin Overview Dashboard
// ============================================================

import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate, CATEGORY_LABELS } from '@/lib/utils'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  BarChart3,
  DollarSign,
  PackagePlus,
  Package,
  Pencil,
  ShoppingBag,
  TrendingUp,
  Users,
  Trophy,
} from 'lucide-react'
import { OrderStatus, ProductStatus } from '@prisma/client'

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function getMonthLabel(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short' })
}

function getLastSixMonths() {
  const now = new Date()
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
    return {
      key: getMonthKey(date),
      label: getMonthLabel(date),
      revenue: 0,
      orders: 0,
    }
  })
}

async function getAdminStats() {
  const sixMonths = getLastSixMonths()
  const firstMonth = new Date()
  firstMonth.setMonth(firstMonth.getMonth() - 5)
  firstMonth.setDate(1)
  firstMonth.setHours(0, 0, 0, 0)

  const [
    totalProducts,
    totalUsers,
    totalOrders,
    completedOrders,
    revenueAggregate,
    monthlyOrders,
    topProductGroups,
    recentProducts,
  ] = await Promise.all([
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: OrderStatus.COMPLETED } }),
      prisma.order.aggregate({
        where: { status: OrderStatus.COMPLETED },
        _sum: { totalAmount: true },
      }),
      prisma.order.findMany({
        where: {
          status: OrderStatus.COMPLETED,
          createdAt: { gte: firstMonth },
        },
        select: {
          createdAt: true,
          totalAmount: true,
        },
      }),
      prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
          order: { status: OrderStatus.COMPLETED },
        },
        _count: { productId: true },
        _sum: { priceAtPurchase: true },
        orderBy: { _count: { productId: 'desc' } },
        take: 5,
      }),
      prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          price: true,
          category: true,
          status: true,
          isPublished: true,
          createdAt: true,
        },
      }),
  ])

  const monthlySales = sixMonths.map((month) => ({ ...month }))
  const monthlySalesByKey = new Map(monthlySales.map((month) => [month.key, month]))

  for (const order of monthlyOrders) {
    const month = monthlySalesByKey.get(getMonthKey(order.createdAt))
    if (!month) continue
    month.orders += 1
    month.revenue += Number(order.totalAmount)
  }

  const productIds = topProductGroups.map((group) => group.productId)
  const topProducts = productIds.length
    ? await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
        },
      })
    : []

  const productById = new Map(topProducts.map((product) => [product.id, product]))
  const topSellingProducts = topProductGroups.map((group) => ({
    product: productById.get(group.productId),
    sales: group._count.productId,
    revenue: Number(group._sum.priceAtPurchase ?? 0),
  }))

  const totalRevenue = Number(revenueAggregate._sum.totalAmount ?? 0)

  return {
    totalProducts,
    totalUsers,
    totalOrders,
    completedOrders,
    totalRevenue,
    monthlySales,
    topSellingProducts,
    recentProducts,
  }
}

export default async function AdminPage() {
  const {
    totalProducts,
    totalUsers,
    totalOrders,
    completedOrders,
    totalRevenue,
    monthlySales,
    topSellingProducts,
    recentProducts,
  } = await getAdminStats()

  const maxMonthlyRevenue = Math.max(...monthlySales.map((month) => month.revenue), 1)

  const stats = [
    { label: 'Total Products', value: totalProducts, icon: Package },
    { label: 'Total Orders', value: totalOrders, icon: ShoppingBag },
    { label: 'Completed Orders', value: completedOrders, icon: TrendingUp },
    { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: DollarSign },
    { label: 'Registered Users', value: totalUsers, icon: Users },
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
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5 mb-8">
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

      <div className="mb-8 grid gap-6 xl:grid-cols-3">
        <div className="card p-6 xl:col-span-2">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Monthly Sales
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Completed order revenue for the last 6 months.
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>

          <div className="flex h-64 items-end gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-5">
            {monthlySales.map((month) => {
              const height = Math.max((month.revenue / maxMonthlyRevenue) * 100, month.revenue > 0 ? 10 : 2)
              return (
                <div key={month.key} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                  <div className="flex h-44 w-full items-end">
                    <div
                      className="w-full rounded-t-xl bg-slate-900 transition-all"
                      style={{ height: `${height}%` }}
                      title={`${month.label}: ${formatPrice(month.revenue)} (${month.orders} orders)`}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-700">{month.label}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">{formatPrice(month.revenue)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Top-Selling Products
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Ranked by completed order items.
            </p>
          </div>

          {topSellingProducts.length === 0 ? (
            <EmptyState
              icon={Trophy}
              title="No top-selling products yet"
              description="Completed orders will appear here once customers start purchasing marketplace products."
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {topSellingProducts.map((item, index) => (
                <div key={item.product?.id ?? index} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {item.product?.title ?? 'Deleted product'}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.product ? CATEGORY_LABELS[item.product.category] : 'Unavailable'}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>{item.sales} sale{item.sales === 1 ? '' : 's'}</span>
                    <span className="font-semibold text-slate-900">
                      {formatPrice(item.revenue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
          <EmptyState
            icon={Package}
            title="No products added yet"
            description="Create your first marketplace product to start building the Druporia catalog."
            actionHref="/admin/add-product"
            actionLabel="Add first product"
          />
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
                <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500">
                  Actions
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
                        product.status === ProductStatus.PUBLISHED
                          ? 'bg-green-50 text-green-700'
                          : product.status === ProductStatus.ARCHIVED
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {product.status.toLowerCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">
                    {formatDate(product.createdAt)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Link>
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
