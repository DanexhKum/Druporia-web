import { prisma } from '@/lib/prisma'
import { createTeamMember, deleteTeamMember, updateTeamMember } from './actions'
import { Users, Trash2, Pencil } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Team' }

export default async function AdminTeamPage() {
  const members = await prisma.teamMember.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })

  return (
    <div className="max-w-4xl">
      <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
        <Users className="h-5 w-5" />
        Team members
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Shown on the homepage team section. Add developers and specialists.
      </p>

      <form action={createTeamMember} className="card mt-8 p-6 space-y-4" encType="multipart/form-data">
        <h2 className="text-sm font-semibold text-slate-900">Add member</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="name">Name</label>
            <input id="name" name="name" required className="w-full" />
          </div>
          <div>
            <label className="form-label" htmlFor="role">Role</label>
            <input id="role" name="role" placeholder="Lead Developer" required />
          </div>
        </div>
        <div>
          <label className="form-label" htmlFor="bio">Bio</label>
          <textarea id="bio" name="bio" rows={3} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="avatarUrl">Avatar URL</label>
            <input id="avatarUrl" name="avatarUrl" type="url" placeholder="https://..." />
            <p className="mt-1 text-xs text-slate-400">
              Paste URL or upload an image below. Upload will be used first.
            </p>
          </div>
          <div>
            <label className="form-label" htmlFor="sortOrder">Sort order</label>
            <input id="sortOrder" name="sortOrder" type="number" defaultValue={0} min={0} />
          </div>
        </div>
        <div>
          <label className="form-label" htmlFor="avatarFile">Upload avatar image</label>
          <input
            id="avatarFile"
            name="avatarFile"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
          />
          <p className="mt-1 text-xs text-slate-400">
            Optional. JPG, PNG, WebP, or GIF. Max 5 MB.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="linkedInUrl">LinkedIn</label>
            <input id="linkedInUrl" name="linkedInUrl" type="url" />
          </div>
          <div>
            <label className="form-label" htmlFor="githubUrl">GitHub</label>
            <input id="githubUrl" name="githubUrl" type="url" />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="isPublished" defaultChecked className="rounded" />
          Published on site
        </label>
        <button type="submit" className="btn-primary">
          Add team member
        </button>
      </form>

      <ul className="mt-10 space-y-3">
        {members.length === 0 ? (
          <li className="text-sm text-slate-400">No team members yet.</li>
        ) : (
          members.map((m) => (
            <li key={m.id} className="card overflow-hidden">
              <div className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-medium text-slate-900">{m.name}</p>
                  <p className="text-xs text-slate-500">{m.role}</p>
                  {!m.isPublished && (
                    <span className="text-xs text-amber-600">Draft</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <form action={deleteTeamMember}>
                    <input type="hidden" name="id" value={m.id} />
                    <button
                      type="submit"
                      className="btn-ghost text-red-600 p-2"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
              <details className="border-t border-slate-100">
                <summary className="flex cursor-pointer list-none items-center gap-2 bg-slate-50/70 px-4 py-3 text-xs font-semibold text-slate-600 hover:text-slate-900">
                  <Pencil className="h-3.5 w-3.5" />
                  Edit {m.name}
                </summary>
                <form action={updateTeamMember} className="grid gap-4 bg-slate-50/70 p-4 sm:grid-cols-2" encType="multipart/form-data">
                  <input type="hidden" name="id" value={m.id} />
                  <div>
                    <label className="form-label" htmlFor={`name-${m.id}`}>Name</label>
                    <input id={`name-${m.id}`} name="name" defaultValue={m.name} required />
                  </div>
                  <div>
                    <label className="form-label" htmlFor={`role-${m.id}`}>Role</label>
                    <input id={`role-${m.id}`} name="role" defaultValue={m.role} required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="form-label" htmlFor={`bio-${m.id}`}>Bio</label>
                    <textarea id={`bio-${m.id}`} name="bio" rows={3} defaultValue={m.bio} required />
                  </div>
                  <div>
                    <label className="form-label" htmlFor={`avatar-${m.id}`}>Avatar URL</label>
                    <input id={`avatar-${m.id}`} name="avatarUrl" type="url" defaultValue={m.avatarUrl ?? ''} />
                    <p className="mt-1 text-xs text-slate-400">
                      Upload below overrides this URL.
                    </p>
                  </div>
                  <div>
                    <label className="form-label" htmlFor={`sort-${m.id}`}>Sort order</label>
                    <input id={`sort-${m.id}`} name="sortOrder" type="number" min={0} defaultValue={m.sortOrder} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="form-label" htmlFor={`avatar-file-${m.id}`}>Upload avatar image</label>
                    <input
                      id={`avatar-file-${m.id}`}
                      name="avatarFile"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      Optional. JPG, PNG, WebP, or GIF. Max 5 MB.
                    </p>
                    {m.avatarUrl && (
                      <div className="mt-3 flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={m.avatarUrl}
                          alt={`${m.name} current avatar`}
                          className="h-16 w-16 rounded-2xl object-cover"
                        />
                        <span className="break-all text-xs text-slate-500">
                          Current avatar
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="form-label" htmlFor={`linkedin-${m.id}`}>LinkedIn</label>
                    <input id={`linkedin-${m.id}`} name="linkedInUrl" type="url" defaultValue={m.linkedInUrl ?? ''} />
                  </div>
                  <div>
                    <label className="form-label" htmlFor={`github-${m.id}`}>GitHub</label>
                    <input id={`github-${m.id}`} name="githubUrl" type="url" defaultValue={m.githubUrl ?? ''} />
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:col-span-2">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input type="checkbox" name="isPublished" defaultChecked={m.isPublished} className="rounded" />
                      Published on site
                    </label>
                    <button type="submit" className="btn-primary">Save changes</button>
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
