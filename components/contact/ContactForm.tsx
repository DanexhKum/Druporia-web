'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle2, Send } from 'lucide-react'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

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
        headers: {
          Accept: 'application/json',
        },
      })

      const result = await response.json().catch(() => null)

      if (!response.ok) {
        // The API returns a specific reason for validation failures
        // and rate limiting — show it rather than a generic error.
        setStatus('error')
        setMessage(
          result?.message ??
            'Message could not be sent right now. Please email us directly at dhanesh.kum15@gmail.com.'
        )
        return
      }

      form.reset()
      setStatus('success')
      setMessage(
        'Thank you for contacting us. Our team has received your message and will get back to you within 24 hours.'
      )
    } catch {
      setStatus('error')
      setMessage(
        'Message could not be sent right now. Please email us directly at dhanesh.kum15@gmail.com.'
      )
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-ink-900 p-8 shadow-sm sm:p-10">
      {message && (
        <div
          className={`mb-6 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
            status === 'success'
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
          role="status"
        >
          {status === 'success' ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <p>{message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="form-label text-white/80">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full rounded-lg border border-white/15 bg-ink-950 px-4 py-3 text-sm transition-colors focus:border-teal-400/60 focus:bg-ink-900 focus:ring-teal-400/40"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label htmlFor="email" className="form-label text-white/80">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full rounded-lg border border-white/15 bg-ink-950 px-4 py-3 text-sm transition-colors focus:border-teal-400/60 focus:bg-ink-900 focus:ring-teal-400/40"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="form-label text-white/80">
            Subject / Inquiry Type
          </label>
          <select
            id="subject"
            name="subject"
            className="mt-1 block w-full rounded-lg border border-white/15 bg-ink-950 px-4 py-3 text-sm transition-colors focus:border-teal-400/60 focus:bg-ink-900 focus:ring-teal-400/40"
          >
            <option value="Project Inquiry">Project Inquiry</option>
            <option value="Product Support">Product Support</option>
            <option value="Partnership">Partnership / Automation (n8n)</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="form-label text-white/80">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            className="mt-1 block w-full resize-y rounded-lg border border-white/15 bg-ink-950 px-4 py-3 text-sm transition-colors focus:border-teal-400/60 focus:bg-ink-900 focus:ring-teal-400/40"
            placeholder="How can we help you?"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn-dark-primary w-full justify-center gap-2 py-4 text-base font-semibold shadow-lg shadow-navy-500/20"
        >
          {status === 'submitting' ? 'Sending...' : 'Send Message'}
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  )
}
