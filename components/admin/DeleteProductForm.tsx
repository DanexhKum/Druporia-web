'use client'

import { Trash2 } from 'lucide-react'
import { SubmitButton } from '@/components/admin/SubmitButton'

interface DeleteProductFormProps {
  id: string
  title: string
  /** The deleteProduct server action, passed in from the page. */
  action: (formData: FormData) => void | Promise<void>
}

export function DeleteProductForm({
  id,
  title,
  action,
}: DeleteProductFormProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Delete "${title}"?\n\n` +
            'The product and its uploaded files are removed permanently. ' +
            'This cannot be undone.'
        )
        if (!confirmed) event.preventDefault()
      }}
      className="mt-8 flex flex-col gap-3 rounded border border-red-200 bg-red-50/50 p-5"
    >
      <div>
        <h2 className="text-sm font-semibold text-red-900">Danger zone</h2>
        <p className="mt-1 text-xs text-red-700">
          Deleting removes the product, its thumbnail, and its uploaded
          archive. Products that have already been purchased cannot be
          deleted — archive them instead, so buyers keep their downloads.
        </p>
      </div>
      <input type="hidden" name="id" value={id} />
      <SubmitButton
        variant="danger"
        pendingText="Deleting..."
        className="w-fit gap-2"
      >
        <Trash2 className="h-4 w-4" />
        Delete product
      </SubmitButton>
    </form>
  )
}
