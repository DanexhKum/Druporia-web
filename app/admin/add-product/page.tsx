// ============================================================
// app/admin/add-product/page.tsx
// Admin Product Creator — No-code dynamic CMS form.
//
// Security: requireAdmin() is called in the parent layout AND
// again in the server action. Defense-in-depth.
//
// UX: Uses React useActionState for progressive enhancement.
// Form state persists on validation errors.
// ============================================================

'use client'

import { useActionState, useCallback, useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  Upload,
  X,
  RefreshCw,
  CheckCircle2,
  FileArchive,
  Info,
  Loader2,
  ExternalLink,
} from 'lucide-react'
import { createProduct } from './actions'
import { generateSlug, CATEGORY_LABELS } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { ProductCategory } from '@prisma/client'
import type { ActionState } from '@/lib/validations'

// ── Initial state ──────────────────────────────────────────────
const INITIAL_STATE: ActionState<{ id: string; slug: string }> = {
  status: 'idle',
}

// ── Category options for select ────────────────────────────────
const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: 'APP', label: CATEGORY_LABELS['APP'] },
  { value: 'WOO_PLUGIN', label: CATEGORY_LABELS['WOO_PLUGIN'] },
  { value: 'CHROME_EXTENSION', label: CATEGORY_LABELS['CHROME_EXTENSION'] },
]

// ── Helper: Field error message ────────────────────────────────
function FieldError({
  errors,
  field,
  state,
}: {
  errors?: Record<string, string[]>
  field: string
  state: ActionState
}) {
  if (state.status !== 'error') return null
  const msgs = errors?.[field]
  if (!msgs?.length) return null
  return (
    <p className="form-error">
      <Info className="h-3.5 w-3.5 shrink-0" />
      {msgs[0]}
    </p>
  )
}

// ── File drop zone ─────────────────────────────────────────────
function FileDropZone({
  file,
  onFile,
  onClear,
  error,
}: {
  file: File | null
  onFile: (f: File) => void
  onClear: () => void
  error?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) onFile(dropped)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const chosen = e.target.files?.[0]
    if (chosen) onFile(chosen)
  }

  const sizeLabel = file
    ? file.size < 1024 * 1024
      ? `${(file.size / 1024).toFixed(0)} KB`
      : `${(file.size / 1024 / 1024).toFixed(1)} MB`
    : null

  return (
    <div>
      <label className="form-label">
        Product .zip Bundle{' '}
        <span className="text-red-500" aria-hidden>*</span>
      </label>

      {file ? (
        /* File selected state */
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <FileArchive className="h-8 w-8 shrink-0 text-slate-400" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">
              {file.name}
            </p>
            <p className="text-xs text-slate-500">{sizeLabel}</p>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-red-500 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        /* Drop zone */
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors duration-150',
            isDragging
              ? 'border-slate-400 bg-slate-50'
              : error
              ? 'border-red-300 bg-red-50/30'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
          )}
          role="button"
          tabIndex={0}
          aria-label="Upload .zip file"
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        >
          <Upload
            className={cn(
              'h-7 w-7',
              isDragging ? 'text-slate-600' : 'text-slate-300'
            )}
          />
          <div>
            <p className="text-sm font-medium text-slate-700">
              Drop .zip file here or{' '}
              <span className="text-slate-900 underline underline-offset-2">
                click to browse
              </span>
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              Only .zip archives accepted. Max 100 MB.
            </p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        name="zipFile"
        accept=".zip,application/zip,application/x-zip-compressed"
        onChange={handleChange}
        className="sr-only"
        aria-hidden="true"
      />

      {error && (
        <p className="form-error mt-1.5">
          <Info className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  )
}

// ── Main Page Component ────────────────────────────────────────
export default function AddProductPage() {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [zipFile, setZipFile] = useState<File | null>(null)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  const [state, formAction, isPending] = useActionState(
    createProduct,
    INITIAL_STATE
  )

  // ── Auto-generate slug from title ──────────────────────────
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!slugManuallyEdited) {
        const slugInput = formRef.current?.querySelector<HTMLInputElement>(
          'input[name="slug"]'
        )
        if (slugInput) {
          slugInput.value = generateSlug(e.target.value)
        }
      }
    },
    [slugManuallyEdited]
  )

  // ── Handle success / error feedback ────────────────────────
  useEffect(() => {
    if (state.status === 'success') {
      toast.success(state.message, { duration: 5000 })
      formRef.current?.reset()
      setZipFile(null)
      setSlugManuallyEdited(false)
      // Navigate to the new product
      router.push(`/marketplace/${state.data.slug}`)
    } else if (state.status === 'error' && state.fieldErrors === undefined) {
      toast.error(state.message)
    }
  }, [state, router])

  // ── Inject zipFile into FormData before submission ──────────
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      // If no file selected, show validation inline (action will also check)
      if (!zipFile) {
        e.preventDefault()
        toast.error('Please upload a .zip file before submitting.')
        return
      }
    },
    [zipFile]
  )

  const fieldErrors =
    state.status === 'error' ? state.fieldErrors : undefined

  return (
    <div className="max-w-3xl">
      {/* ── Page header ────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-slate-900">
          Add New Product
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Fill in the details below to publish a new product to the marketplace.
          The page updates instantly — no code push required.
        </p>
      </div>

      {/* ── Global error alert ────────────────────────────── */}
      {state.status === 'error' && (
        <div className="mb-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <div>
            <p className="text-sm font-medium text-red-700">{state.message}</p>
            {fieldErrors && (
              <p className="mt-0.5 text-xs text-red-600">
                Please fix the highlighted fields below.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Form ─────────────────────────────────────────── */}
      <form
        ref={formRef}
        action={formAction}
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* ── Section 1: Identity ──────────────────────────── */}
        <section className="card p-6 space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Product Identity
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Title and URL slug for this product.
            </p>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="form-label">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="e.g. WooCommerce Smart Cart Optimizer"
              maxLength={100}
              onChange={handleTitleChange}
              className={cn(
                fieldErrors?.title ? 'border-red-300 focus:ring-red-500' : ''
              )}
            />
            <FieldError errors={fieldErrors} field="title" state={state} />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="form-label">
              URL Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex rounded border border-slate-200 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-900 overflow-hidden">
              <span className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-xs text-slate-400 select-none whitespace-nowrap">
                /marketplace/
              </span>
              <input
                id="slug"
                name="slug"
                type="text"
                required
                placeholder="woocommerce-smart-cart-optimizer"
                maxLength={80}
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                onChange={() => setSlugManuallyEdited(true)}
                className="flex-1 rounded-none border-0 focus:ring-0 text-sm"
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Lowercase letters, numbers, and hyphens only. Auto-generated from title.
            </p>
            <FieldError errors={fieldErrors} field="slug" state={state} />
          </div>

          {/* Version */}
          <div>
            <label htmlFor="version" className="form-label">
              Version
              <span className="ml-1.5 text-xs text-slate-400 font-normal">
                (optional)
              </span>
            </label>
            <input
              id="version"
              name="version"
              type="text"
              placeholder="1.0.0"
              defaultValue="1.0.0"
              pattern="\d+\.\d+\.\d+"
              className="max-w-xs"
            />
            <FieldError errors={fieldErrors} field="version" state={state} />
          </div>
        </section>

        {/* ── Section 2: Categorisation & Pricing ─────────── */}
        <section className="card p-6 space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Category &amp; Pricing
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Category */}
            <div>
              <label htmlFor="category" className="form-label">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                required
                defaultValue=""
                className={cn(
                  fieldErrors?.category
                    ? 'border-red-300 focus:ring-red-500'
                    : ''
                )}
              >
                <option value="" disabled>
                  Select a category…
                </option>
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <FieldError
                errors={fieldErrors}
                field="category"
                state={state}
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="form-label">
                Price (USD) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 select-none">
                  $
                </span>
                <input
                  id="price"
                  name="price"
                  type="text"
                  inputMode="decimal"
                  required
                  placeholder="29.00"
                  pattern="\d+(\.\d{1,2})?"
                  className={cn(
                    'pl-7',
                    fieldErrors?.price
                      ? 'border-red-300 focus:ring-red-500'
                      : ''
                  )}
                />
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Enter 0 for free products.
              </p>
              <FieldError errors={fieldErrors} field="price" state={state} />
            </div>
          </div>
        </section>

        {/* ── Section 3: Description ───────────────────────── */}
        <section className="card p-6 space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Product Description
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Markdown is supported. Use headings, lists, and code blocks.
            </p>
          </div>

          <div>
            <label htmlFor="description" className="form-label">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={12}
              placeholder={`## Overview\nDescribe what this product does and why customers need it.\n\n## Features\n- Feature one\n- Feature two\n\n## Requirements\nList any prerequisites or compatibility requirements.`}
              className={cn(
                'font-mono text-xs leading-relaxed resize-y',
                fieldErrors?.description
                  ? 'border-red-300 focus:ring-red-500'
                  : ''
              )}
            />
            <p className="mt-1.5 text-xs text-slate-400">
              Minimum 20 characters. Supports Markdown formatting.
            </p>
            <FieldError
              errors={fieldErrors}
              field="description"
              state={state}
            />
          </div>
        </section>

        {/* ── Section 4: File Upload ───────────────────────── */}
        <section className="card p-6 space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Product File
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Uploaded to a private storage bucket. Buyers receive a 15-minute
              signed download URL after verified purchase.
            </p>
          </div>

          <FileDropZone
            file={zipFile}
            onFile={setZipFile}
            onClear={() => {
              setZipFile(null)
              const input = formRef.current?.querySelector<HTMLInputElement>(
                'input[name="zipFile"]'
              )
              if (input) input.value = ''
            }}
            error={
              state.status === 'error'
                ? fieldErrors?.zipFile?.[0]
                : undefined
            }
          />

          {/* Security notice */}
          <div className="flex gap-2.5 rounded-md border border-slate-200 bg-slate-50/50 p-3">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
            <p className="text-xs text-slate-500 leading-relaxed">
              Files are stored in a <strong>private bucket</strong> with no
              public URL. The storage path is never exposed via the API.
              Signed download URLs expire after 15 minutes and are only
              generated after purchase verification.
            </p>
          </div>
        </section>

        {/* ── Section 5: Publishing Options ───────────────── */}
        <section className="card p-6 space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Publishing Options
            </h2>
          </div>

          <div className="space-y-3">
            {/* Publish immediately */}
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="isPublished"
                value="true"
                defaultChecked
                className="mt-0.5 h-4 w-4 cursor-pointer rounded border-slate-300 text-slate-900 focus:ring-slate-900 focus:ring-offset-0"
              />
              <div>
                <span className="text-sm font-medium text-slate-800">
                  Publish immediately
                </span>
                <p className="text-xs text-slate-400">
                  Product will appear on the marketplace right away. Uncheck to
                  save as draft.
                </p>
              </div>
            </label>

            {/* Featured product */}
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="isFeatured"
                value="true"
                className="mt-0.5 h-4 w-4 cursor-pointer rounded border-slate-300 text-slate-900 focus:ring-slate-900 focus:ring-offset-0"
              />
              <div>
                <span className="text-sm font-medium text-slate-800">
                  Mark as featured
                </span>
                <p className="text-xs text-slate-400">
                  Featured products are pinned to the top of the marketplace
                  grid.
                </p>
              </div>
            </label>
          </div>
        </section>

        {/* ── Submit ───────────────────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-slate-200 bg-slate-50/50 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
            <span>
              Submitting will instantly revalidate the{' '}
              <span className="font-mono text-slate-700">/marketplace</span>{' '}
              page cache.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/marketplace"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost gap-1.5 text-xs"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Preview Marketplace
            </a>

            <button
              type="submit"
              disabled={isPending || !zipFile}
              className={cn(
                'btn-primary gap-2 min-w-[140px]',
                isPending && 'cursor-wait',
                !zipFile && !isPending && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publishing…
                </>
              ) : state.status === 'success' ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Published!
                </>
              ) : (
                'Publish Product'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
