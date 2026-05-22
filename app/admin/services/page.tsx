import { prisma } from '@/lib/prisma'
import { createServiceItem, deleteServiceItem, updateServiceItem } from './actions'
import { DEFAULT_SERVICES } from '@/lib/default-services'
import { SubmitButton } from '@/components/admin/SubmitButton'
import { EmptyState } from '@/components/ui/EmptyState'
import { Pencil, Trash2, Wrench } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Services' }

const ICON_OPTIONS = ['Box', 'Layers', 'Bot', 'Code2', 'Workflow', 'BarChart3']

async function ensureDefaultServices() {
  const existing = await prisma.serviceItem.findMany({
    where: {
      sourceKey: { in: DEFAULT_SERVICES.map((service) => service.sourceKey) },
    },
    select: { sourceKey: true },
  })
  const existingKeys = new Set(existing.map((service) => service.sourceKey))
  const missingServices = DEFAULT_SERVICES.filter(
    (service) => !existingKeys.has(service.sourceKey)
  )

  if (missingServices.length === 0) return

  await prisma.serviceItem.createMany({
    data: missingServices.map((service) => ({
          sourceKey: service.sourceKey,
          title: service.title,
          description: service.description,
          iconKey: service.iconKey,
          tags: service.tags,
          sortOrder: service.sortOrder,
          isPublished: true,
    })),
  })
}

function getTags(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []
}

export default async function AdminServicesPage() {
  await ensureDefaultServices()

  const services = await prisma.serviceItem.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })

  return (
    <div className="max-w-4xl">
      <h1 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
        <Wrench className="h-5 w-5" />
        Homepage services
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Manage the service cards shown in the homepage expertise section.
      </p>

      <form action={createServiceItem} className="card mt-8 space-y-4 p-6">
        <h2 className="text-sm font-semibold text-slate-900">Add service</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="title">Title</label>
            <input id="title" name="title" required />
          </div>
          <div>
            <label className="form-label" htmlFor="iconKey">Icon</label>
            <select id="iconKey" name="iconKey" defaultValue="Code2">
              {ICON_OPTIONS.map((icon) => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="form-label" htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={3} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="tags">Tags</label>
            <textarea id="tags" name="tags" rows={3} placeholder="WooCommerce&#10;Shopify" />
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
        <SubmitButton pendingText="Adding service...">Add service</SubmitButton>
      </form>

      <ul className="mt-10 space-y-3">
        {services.length === 0 ? (
          <li className="card">
            <EmptyState
              icon={Wrench}
              title="No managed services yet"
              description="Default services will still show on the homepage. Add or edit services here to customize them."
            />
          </li>
        ) : (
          services.map((service) => {
            const tags = getTags(service.tags)
            return (
              <li key={service.id} className="card overflow-hidden">
                <div className="flex justify-between gap-4 p-4">
                  <div>
                    <p className="font-medium text-slate-900">{service.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">{service.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {!service.isPublished && <span className="badge text-[10px]">Draft</span>}
                      <span className="badge text-[10px]">{service.iconKey}</span>
                      {tags.map((tag) => <span key={tag} className="badge text-[10px]">{tag}</span>)}
                    </div>
                  </div>
                  <form action={deleteServiceItem}>
                    <input type="hidden" name="id" value={service.id} />
                    <SubmitButton variant="danger" pendingText="..." className="p-2">
                      <Trash2 className="h-4 w-4" />
                    </SubmitButton>
                  </form>
                </div>
                <details className="border-t border-slate-100">
                  <summary className="flex cursor-pointer list-none items-center gap-2 bg-slate-50/70 px-4 py-3 text-xs font-semibold text-slate-600 hover:text-slate-900">
                    <Pencil className="h-3.5 w-3.5" />
                    Edit service
                  </summary>
                  <form action={updateServiceItem} className="grid gap-4 bg-slate-50/70 p-4 sm:grid-cols-2">
                    <input type="hidden" name="id" value={service.id} />
                    <div>
                      <label className="form-label" htmlFor={`title-${service.id}`}>Title</label>
                      <input id={`title-${service.id}`} name="title" defaultValue={service.title} required />
                    </div>
                    <div>
                      <label className="form-label" htmlFor={`icon-${service.id}`}>Icon</label>
                      <select id={`icon-${service.id}`} name="iconKey" defaultValue={service.iconKey}>
                        {ICON_OPTIONS.map((icon) => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="form-label" htmlFor={`description-${service.id}`}>Description</label>
                      <textarea id={`description-${service.id}`} name="description" rows={3} defaultValue={service.description} required />
                    </div>
                    <div>
                      <label className="form-label" htmlFor={`tags-${service.id}`}>Tags</label>
                      <textarea id={`tags-${service.id}`} name="tags" rows={3} defaultValue={tags.join('\n')} />
                    </div>
                    <div>
                      <label className="form-label" htmlFor={`sort-${service.id}`}>Sort order</label>
                      <input id={`sort-${service.id}`} name="sortOrder" type="number" min={0} defaultValue={service.sortOrder} />
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:col-span-2">
                      <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input type="checkbox" name="isPublished" defaultChecked={service.isPublished} className="rounded" />
                        Published on homepage
                      </label>
                      <SubmitButton pendingText="Saving...">Save changes</SubmitButton>
                    </div>
                  </form>
                </details>
              </li>
            )
          })
        )}
      </ul>
    </div>
  )
}
