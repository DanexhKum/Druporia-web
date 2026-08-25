'use client'

// ============================================================
// components/contact/ContactForm.tsx
// Contact form with floating labels and a magnetic submit.
//
// FLOATING LABELS ARE REAL <label> ELEMENTS, not placeholders.
// Placeholder-as-label vanishes the moment someone types, which
// strands anyone who looks away mid-field, and assistive tech
// treats it as a hint rather than a name. These are bound with
// htmlFor and driven by :placeholder-shown, so the resting state
// is pure CSS with no JS tracking of input contents.
//
// Posts to /api/contact, which is rate limited (5/IP per 10 min)
// and Zod validated. Its 429 and validation messages are shown
// verbatim rather than collapsed into a generic failure.
// ============================================================

import { useState } from 'react'
import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { MagneticButton } from '@/components/motion/MagneticButton'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

const SUBJECTS = [
  'Project inquiry',
  'Product support',
  'Partnership / automation',
  'Other',
]

const FIELD =
  'peer w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 pb-2.5 pt-6 text-sm text-white placeholder:text-transparent transition-colors duration-300 focus:border-white/30 focus:outline-none focus:ring-0'

const LABEL =
  'pointer-events-none absolute left-4 top-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-[13px] peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-white/30 peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.14em] peer-focus:text-white/60'

export function ContactForm() {
  const [status, setStatus] = useState<SubmitState>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')

    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      })
      const result = await response.json().catch(() => null)

      if (!response.ok) {
        setStatus('error')
        setMessage(
          result?.message ??
            'Message could not be sent right now. Please email dhanesh.kum15@gmail.com directly.'
        )
        return
      }

      form.reset()
      setStatus('success')
      setMessage(
        'Thanks — your message is in. We reply within 24 hours, usually sooner.'
      )
    } catch {
      setStatus('error')
      setMessage(
        'Message could not be sent right now. Please email dhanesh.kum15@gmail.com directly.'
      )
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-ink-900 p-6 sm:p-8">
      {message && (
        <div
          role="status"
          className={`mb-6 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
            status === 'success'
              ? 'border-white/20 bg-white/[0.05] text-white/80'
              : 'border-red-500/30 bg-red-500/[0.07] text-red-300'
          }`}
        >
          {status === 'success' ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <p>{message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Full name"
              autoComplete="name"
              className={FIELD}
            />
            <label htmlFor="name" className={LABEL}>
              Full name
            </label>
          </div>

          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Email address"
              autoComplete="email"
              className={FIELD}
            />
            <label htmlFor="email" className={LABEL}>
              Email address
            </label>
          </div>
        </div>

        <div className="relative">
          <select
            id="subject"
            name="subject"
            defaultValue={SUBJECTS[0]}
            className="w-full appearance-none rounded-xl border border-white/10 bg-white/[0.03] px-4 pb-2.5 pt-6 text-sm text-white transition-colors duration-300 focus:border-white/30 focus:outline-none focus:ring-0"
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s} className="bg-ink-900">
                {s}
              </option>
            ))}
          </select>
          <label
            htmlFor="subject"
            className="pointer-events-none absolute left-4 top-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40"
          >
            Subject
          </label>
        </div>

        <div className="relative">
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            placeholder="Tell us about the workflow"
            className={`${FIELD} resize-y`}
          />
          <label htmlFor="message" className={LABEL}>
            Tell us about the workflow
          </label>
        </div>

        <div className="flex flex-col items-start gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] text-white/30">
            No obligation · Fixed-price scoping
          </p>

          <MagneticButton
            type="submit"
            variant="primary"
            disabled={status === 'submitting'}
            className="w-full justify-center sm:w-auto"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending
              </>
            ) : (
              <>
                Send message
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </MagneticButton>
        </div>
      </form>
    </div>
  )
}
