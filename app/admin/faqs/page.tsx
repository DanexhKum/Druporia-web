import { prisma } from '@/lib/prisma'
import { createFAQ, deleteFAQ, updateFAQ } from './actions'
import { SubmitButton } from '@/components/admin/SubmitButton'
import { EmptyState } from '@/components/ui/EmptyState'
import { CircleHelp, Pencil, Trash2 } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'FAQs' }

export default async function AdminFAQsPage() {
  const faqs = await prisma.faq.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })

  return (
    <div className="max-w-4xl">
      <h1 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
        <CircleHelp className="h-5 w-5" />
        FAQs
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Manage common questions shown on the homepage.
      </p>

      <form action={createFAQ} className="card mt-8 space-y-4 p-6">
        <h2 className="text-sm font-semibold text-slate-900">Add FAQ</h2>
        <div>
          <label className="form-label" htmlFor="question">Question</label>
          <input id="question" name="question" required minLength={2} />
        </div>
        <div>
          <label className="form-label" htmlFor="answer">Answer</label>
          <textarea id="answer" name="answer" rows={4} required minLength={2} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="category">Category</label>
            <input id="category" name="category" placeholder="Marketplace" />
          </div>
          <div>
            <label className="form-label" htmlFor="sortOrder">Sort order</label>
            <input id="sortOrder" name="sortOrder" type="number" min={0} defaultValue={0} />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="isPublished" defaultChecked className="rounded" />
          Published on homepage
        </label>
        <SubmitButton pendingText="Adding FAQ...">Add FAQ</SubmitButton>
      </form>

      <ul className="mt-10 space-y-3">
        {faqs.length === 0 ? (
          <li className="card">
            <EmptyState
              icon={CircleHelp}
              title="No FAQs yet"
              description="Add common questions so visitors understand your products, services, and support process."
            />
          </li>
        ) : (
          faqs.map((faq) => (
            <li key={faq.id} className="card overflow-hidden">
              <div className="flex justify-between gap-4 p-4">
                <div>
                  <p className="font-medium text-slate-900">{faq.question}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">{faq.answer}</p>
                  <div className="mt-2 flex gap-1.5">
                    {!faq.isPublished && <span className="badge text-[10px]">Draft</span>}
                    {faq.category && <span className="badge text-[10px]">{faq.category}</span>}
                  </div>
                </div>
                <form action={deleteFAQ}>
                  <input type="hidden" name="id" value={faq.id} />
                  <SubmitButton variant="danger" pendingText="..." className="p-2">
                    <Trash2 className="h-4 w-4" />
                  </SubmitButton>
                </form>
              </div>
              <details className="border-t border-slate-100">
                <summary className="flex cursor-pointer list-none items-center gap-2 bg-slate-50/70 px-4 py-3 text-xs font-semibold text-slate-600 hover:text-slate-900">
                  <Pencil className="h-3.5 w-3.5" />
                  Edit FAQ
                </summary>
                <form action={updateFAQ} className="grid gap-4 bg-slate-50/70 p-4">
                  <input type="hidden" name="id" value={faq.id} />
                  <div>
                    <label className="form-label" htmlFor={`question-${faq.id}`}>Question</label>
                    <input id={`question-${faq.id}`} name="question" defaultValue={faq.question} required minLength={2} />
                  </div>
                  <div>
                    <label className="form-label" htmlFor={`answer-${faq.id}`}>Answer</label>
                    <textarea id={`answer-${faq.id}`} name="answer" rows={4} defaultValue={faq.answer} required minLength={2} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="form-label" htmlFor={`category-${faq.id}`}>Category</label>
                      <input id={`category-${faq.id}`} name="category" defaultValue={faq.category ?? ''} />
                    </div>
                    <div>
                      <label className="form-label" htmlFor={`sort-${faq.id}`}>Sort order</label>
                      <input id={`sort-${faq.id}`} name="sortOrder" type="number" min={0} defaultValue={faq.sortOrder} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input type="checkbox" name="isPublished" defaultChecked={faq.isPublished} className="rounded" />
                      Published on homepage
                    </label>
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
