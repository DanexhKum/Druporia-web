// ============================================================
// app/(app)/dashboard/page.tsx — User Dashboard
// Shows purchased products, download history, profile info.
// ============================================================

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate, CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/utils'
import { Download, Package, Clock, User, ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
}

async function getDashboardData(clerkId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      orders: {
        where: { status: 'COMPLETED' },
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  category: true,
                  version: true,
                },
              },
            },
          },
        },
      },
      downloads: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          product: {
            select: { title: true, slug: true, category: true },
          },
        },
      },
    },
  })

  return user
}

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) return redirect('/sign-in')

  const user = await getDashboardData(userId)

  if (!user) {
    // User exists in Clerk but not DB — first sign-in edge case
    return (
      <div className="container-page py-16 text-center">
        <p className="text-sm text-slate-500">
          Setting up your account…{' '}
          <Link href="/" className="underline text-slate-900">
            Go home
          </Link>
        </p>
      </div>
    )
  }

  const totalPurchased = user.orders.reduce(
    (sum, o) => sum + o.items.length,
    0
  )

  return (
    <div className="container-page py-10">
      {/* ── Header ───────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-slate-900">
          Welcome back{user.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your purchases, downloads, and profile settings.
        </p>
      </div>

      {/* ── Stats row ────────────────────────────────────── */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: Package,
            label: 'Purchased Products',
            value: totalPurchased,
          },
          {
            icon: Download,
            label: 'Downloads',
            value: user.downloads.length,
          },
          {
            icon: Clock,
            label: 'Orders',
            value: user.orders.length,
          },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                  <Icon className="h-4 w-4 text-slate-500" />
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Left: Purchases & Downloads ──────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Purchased products */}
          <div className="card overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Purchased Products
              </h2>
            </div>
            {totalPurchased === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-sm text-slate-400">No purchases yet.</p>
                <Link
                  href="/marketplace"
                  className="mt-3 inline-block text-sm font-medium text-slate-900 underline underline-offset-2"
                >
                  Browse the marketplace →
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {user.orders.flatMap((order) =>
                  order.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/50 transition-colors"
                    >
                      <span className="text-xl">
                        {CATEGORY_ICONS[item.product.category]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/marketplace/${item.product.slug}`}
                          className="block text-sm font-medium text-slate-900 hover:underline truncate"
                        >
                          {item.product.title}
                        </Link>
                        <p className="text-xs text-slate-400">
                          {CATEGORY_LABELS[item.product.category]}
                          {item.product.version && (
                            <> · v{item.product.version}</>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-700">
                          {formatPrice(Number(item.priceAtPurchase))}
                        </span>
                        {/* Download button — generates signed URL */}
                        <Link
                          href={`/api/download/${item.product.id}`}
                          className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </Link>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          {/* Recent downloads */}
          <div className="card overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Download History
              </h2>
            </div>
            {user.downloads.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-slate-400">
                No downloads yet.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">
                      Product
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">
                      Date
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {user.downloads.map((dl) => (
                    <tr key={dl.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3 font-medium text-slate-900">
                        {dl.product.title}
                      </td>
                      <td className="px-5 py-3 text-slate-500">
                        {formatDate(dl.createdAt)}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            dl.success
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-red-600'
                          }`}
                        >
                          {dl.success ? 'Success' : 'Failed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ── Right: Profile card ───────────────────────── */}
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-4">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                  className="h-10 w-10 rounded-full border border-slate-200"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {user.name ?? 'User'}
                </p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Role</span>
                <span
                  className={`font-medium ${
                    user.role === 'ADMIN'
                      ? 'text-purple-700'
                      : 'text-slate-700'
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Member since</span>
                <span className="text-slate-700">
                  {formatDate(user.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Subscription</span>
                <span
                  className={`font-medium ${
                    user.hasActiveSubscription
                      ? 'text-green-700'
                      : 'text-slate-400'
                  }`}
                >
                  {user.hasActiveSubscription ? 'Active' : 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* Admin panel shortcut */}
          {user.role === 'ADMIN' && (
            <div className="card border-purple-100 bg-purple-50/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-800">
                  Admin Access
                </span>
              </div>
              <p className="text-xs text-purple-600 mb-3">
                You have administrator privileges.
              </p>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded border border-purple-200 bg-white px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-50 transition-colors"
              >
                Go to Admin Panel →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
