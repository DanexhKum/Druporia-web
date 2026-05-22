'use client'

import { Loader2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { cn } from '@/lib/utils'

interface SubmitButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  children: React.ReactNode
  pendingText?: string
  className?: string
  variant?: 'primary' | 'ghost' | 'danger'
}

export function SubmitButton({
  children,
  pendingText = 'Saving...',
  className,
  variant = 'primary',
  disabled,
  ...buttonProps
}: SubmitButtonProps) {
  const { pending } = useFormStatus()
  const variantClass =
    variant === 'ghost'
      ? 'btn-ghost'
      : variant === 'danger'
      ? 'btn-ghost text-red-600'
      : 'btn-primary'

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={cn(variantClass, pending && 'cursor-wait opacity-80', className)}
      {...buttonProps}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {pendingText}
        </>
      ) : (
        children
      )}
    </button>
  )
}
