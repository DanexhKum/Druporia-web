'use client'

import { useState } from 'react'
import { buttonClasses } from '@/components/ui/Button'
import { CONTACT_EMAIL, SERVICE_OPTIONS, type ServiceOptionValue } from '@/lib/site-content'
import { cn } from '@/lib/utils'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

const fieldClass =
  'mt-1 block w-full rounded-2xl border border-line-chip bg-canvas px-4 py-3 text-[15px] transition-colors focus:border-orange focus:ring-2 focus:ring-orange/20'

export function ContactForm({ initialServices = [] }: { initialServices?: ServiceOptionValue[] }) {
  const [status, setStatus] = useState<SubmitState>('idle')
  const [message, setMessage] = useState('')
  const [services, setServices] = useState<ServiceOptionValue[]>(initialServices)

  function toggle(value: ServiceOptionValue) {
    setServices((current) =>
      current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    )
  }

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
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Form submission failed')
      }

      form.reset()
      setServices([])
      setStatus('success')
      setMessage(
        'Thanks — we’ve got your message and will reply within one business day with next steps.'
      )
    } catch {
      setStatus('error')
      setMessage(
        `Your message couldn’t be sent right now. Please email us directly at ${CONTACT_EMAIL}.`
      )
    }
  }

  return (
    <div className="rounded-card-lg border border-line-card bg-canvas p-6 shadow-hero tab:p-10">
      {message && (
        <div
          className={cn(
            'mb-6 rounded-2xl px-4 py-3 text-sm',
            status === 'success' ? 'bg-success-tint text-success' : 'bg-danger-tint text-danger'
          )}
          role="status"
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <fieldset>
          <legend className="form-label">What do you need help with?</legend>
          <div className="mt-1 flex flex-wrap gap-2">
            {SERVICE_OPTIONS.map((option) => {
              const on = services.includes(option.value)
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(option.value)}
                  className={cn(
                    'rounded-full border px-3.5 py-[9px] text-sm font-medium transition-colors',
                    on
                      ? 'border-orange bg-orange-tint text-orange-deep'
                      : 'border-line-chip bg-canvas text-nav hover:bg-surface'
                  )}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
          {services.map((value) => (
            <input
              key={value}
              type="hidden"
              name="services"
              value={SERVICE_OPTIONS.find((o) => o.value === value)?.label ?? value}
            />
          ))}
        </fieldset>

        <div className="grid gap-6 tab:grid-cols-2">
          <div>
            <label htmlFor="name" className="form-label">
              Full name
            </label>
            <input type="text" id="name" name="name" required autoComplete="name" className={fieldClass} placeholder="Jane Doe" />
          </div>
          <div>
            <label htmlFor="email" className="form-label">
              Work email
            </label>
            <input type="email" id="email" name="email" required autoComplete="email" className={fieldClass} placeholder="jane@company.com" />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="form-label">
            Inquiry type
          </label>
          <select id="subject" name="subject" className={fieldClass}>
            <option value="Project Inquiry">New project</option>
            <option value="Existing project">Extend an existing store or app</option>
            <option value="Product Support">Help with one of our products</option>
            <option value="Other">Something else</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="form-label">
            Tell us about the project
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            className={cn(fieldClass, 'resize-y')}
            placeholder="Your store or stack, what you want to build, and any timeline."
          />
        </div>

        <div className="flex flex-col gap-4 tab:flex-row tab:items-center tab:justify-between">
          <p className="text-[13.5px] text-muted-note">Free 30-min call · no commitment</p>
          <button
            type="submit"
            disabled={status === 'submitting'}
            className={buttonClasses('primary', 'lg')}
          >
            {status === 'submitting' ? 'Sending…' : 'Send and book a call'}
          </button>
        </div>
      </form>
    </div>
  )
}
