import { prisma } from '@/lib/prisma'
import { SubmitButton } from '@/components/admin/SubmitButton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ReviewApprovalStatus, ReviewSource } from '@prisma/client'
import { createReview, deleteReview, updateReview } from './actions'
import { MessageSquareQuote, Trash2, Star, Pencil } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Reviews' }

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: [{ sortOrder: 'asc' }, { reviewDate: 'desc' }],
  })

  return (
    <div className="max-w-4xl">
      <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
        <MessageSquareQuote className="h-5 w-5" />
        Client reviews
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Displayed on homepage. Mark source as Fiverr for the verified badge.
      </p>

      <form action={createReview} className="card mt-8 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">Add review</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="clientName">Client name</label>
            <input id="clientName" name="clientName" required />
          </div>
          <div>
            <label className="form-label" htmlFor="clientCountry">Country</label>
            <input id="clientCountry" name="clientCountry" placeholder="United States" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="rating">Rating (1–5)</label>
            <input id="rating" name="rating" type="number" min={1} max={5} defaultValue={5} />
          </div>
          <div>
            <label className="form-label" htmlFor="source">Source</label>
            <select id="source" name="source" defaultValue={ReviewSource.FIVERR}>
              <option value={ReviewSource.FIVERR}>Fiverr</option>
              <option value={ReviewSource.DIRECT}>Direct client</option>
              <option value={ReviewSource.MARKETPLACE}>Marketplace</option>
            </select>
          </div>
        </div>
        <div>
          <label className="form-label" htmlFor="projectTitle">Project title</label>
          <input id="projectTitle" name="projectTitle" placeholder="WooCommerce cart plugin" />
        </div>
        <div>
          <label className="form-label" htmlFor="comment">Review text</label>
          <textarea id="comment" name="comment" rows={4} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="avatarUrl">Avatar URL (optional)</label>
            <input id="avatarUrl" name="avatarUrl" type="url" />
          </div>
          <div>
            <label className="form-label" htmlFor="sortOrder">Sort order</label>
            <input id="sortOrder" name="sortOrder" type="number" defaultValue={0} min={0} />
          </div>
        </div>
        <div>
          <label className="form-label" htmlFor="approvalStatus">Approval status</label>
          <select id="approvalStatus" name="approvalStatus" defaultValue={ReviewApprovalStatus.APPROVED}>
            <option value={ReviewApprovalStatus.PENDING}>Pending review</option>
            <option value={ReviewApprovalStatus.APPROVED}>Approved - show on site</option>
            <option value={ReviewApprovalStatus.REJECTED}>Rejected - hidden</option>
          </select>
        </div>
        <SubmitButton pendingText="Adding review...">Add review</SubmitButton>
      </form>

      <ul className="mt-10 space-y-3">
        {reviews.length === 0 ? (
          <li className="card">
            <EmptyState
              icon={MessageSquareQuote}
              title="No reviews added yet"
              description="Add client testimonials and approve them to display social proof on the homepage."
            />
          </li>
        ) : (
          reviews.map((r) => (
            <li key={r.id} className="card overflow-hidden">
              <div className="flex justify-between gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-slate-900">{r.clientName}</p>
                    <span className="flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </span>
                    <span className="badge text-[10px]">{r.source}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        r.approvalStatus === ReviewApprovalStatus.APPROVED
                          ? 'bg-green-50 text-green-700'
                          : r.approvalStatus === ReviewApprovalStatus.REJECTED
                          ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {r.approvalStatus.toLowerCase()}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">{r.comment}</p>
                </div>
                <form action={deleteReview}>
                  <input type="hidden" name="id" value={r.id} />
                  <SubmitButton variant="danger" pendingText="..." className="p-2">
                    <Trash2 className="h-4 w-4" />
                  </SubmitButton>
                </form>
              </div>
              <details className="border-t border-slate-100">
                <summary className="flex cursor-pointer list-none items-center gap-2 bg-slate-50/70 px-4 py-3 text-xs font-semibold text-slate-600 hover:text-slate-900">
                  <Pencil className="h-3.5 w-3.5" />
                  Edit review
                </summary>
                <form action={updateReview} className="grid gap-4 bg-slate-50/70 p-4 sm:grid-cols-2">
                  <input type="hidden" name="id" value={r.id} />
                  <div>
                    <label className="form-label" htmlFor={`client-${r.id}`}>Client name</label>
                    <input id={`client-${r.id}`} name="clientName" defaultValue={r.clientName} required />
                  </div>
                  <div>
                    <label className="form-label" htmlFor={`country-${r.id}`}>Country</label>
                    <input id={`country-${r.id}`} name="clientCountry" defaultValue={r.clientCountry ?? ''} />
                  </div>
                  <div>
                    <label className="form-label" htmlFor={`rating-${r.id}`}>Rating</label>
                    <input id={`rating-${r.id}`} name="rating" type="number" min={1} max={5} defaultValue={r.rating} />
                  </div>
                  <div>
                    <label className="form-label" htmlFor={`source-${r.id}`}>Source</label>
                    <select id={`source-${r.id}`} name="source" defaultValue={r.source}>
                      <option value={ReviewSource.FIVERR}>Fiverr</option>
                      <option value={ReviewSource.DIRECT}>Direct client</option>
                      <option value={ReviewSource.MARKETPLACE}>Marketplace</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="form-label" htmlFor={`project-${r.id}`}>Project title</label>
                    <input id={`project-${r.id}`} name="projectTitle" defaultValue={r.projectTitle ?? ''} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="form-label" htmlFor={`comment-${r.id}`}>Review text</label>
                    <textarea id={`comment-${r.id}`} name="comment" rows={4} defaultValue={r.comment} required />
                  </div>
                  <div>
                    <label className="form-label" htmlFor={`avatar-${r.id}`}>Avatar URL</label>
                    <input id={`avatar-${r.id}`} name="avatarUrl" type="url" defaultValue={r.avatarUrl ?? ''} />
                  </div>
                  <div>
                    <label className="form-label" htmlFor={`sort-${r.id}`}>Sort order</label>
                    <input id={`sort-${r.id}`} name="sortOrder" type="number" min={0} defaultValue={r.sortOrder} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="form-label" htmlFor={`approval-${r.id}`}>Approval status</label>
                    <select id={`approval-${r.id}`} name="approvalStatus" defaultValue={r.approvalStatus}>
                      <option value={ReviewApprovalStatus.PENDING}>Pending review</option>
                      <option value={ReviewApprovalStatus.APPROVED}>Approved - show on site</option>
                      <option value={ReviewApprovalStatus.REJECTED}>Rejected - hidden</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:col-span-2">
                    <p className="text-xs text-slate-500">
                      Only approved reviews are shown on the homepage.
                    </p>
                    <SubmitButton pendingText="Saving...">Save changes</SubmitButton>
                  </div>
                </form>
              </details>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
