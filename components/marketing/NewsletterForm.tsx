'use client'

// ============================================================
// components/marketing/NewsletterForm.tsx
// Footer newsletter capture.
//
// Posts to the SAME /api/contact endpoint the contact form uses,
// so submissions land in the existing inbox with a subject that
// identifies them. There is no mailing-list provider wired up,
// and inventing a fake success state for a form that goes nowhere
// would be worse than routing it somewhere real.
//
// That endpoint is rate limited (5/IP per 10 min) and Zod
// validated, so this inherits both. Its 429 and validation
// messages are surfaced verbatim rather than swallowed.
// ============================================================

import { useState } from 'react'
import { ArrowRight, Check, Loader2 } from 'lucide-react'

type State = 'idle' | 'sending' | 'done' | 'error'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('sending')
    setMessage('')

    const body = new FormData()
    body.set('name', 'Newsletter subscriber')
    body.set('email', email)
    body.set('subject', 'Newsletter signup')
    body.set(
      'message',
      `Newsletter signup request from the site footer. Email: ${email}`
    )

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body,
        headers: { Accept: 'application/json' },
      })
      const result = await res.json().catch(() => null)

      if (!res.ok) {
        setState('error')
        setMessage(result?.message ?? 'Could not sign you up. Try again shortly.')
        return
      }

      setState('done')
      setEmail('')
      setMessage('You are on the list. We only send when there is something worth reading.')
    } catch {
      setState('error')
      setMessage('Could not sign you up. Try again shortly.')
    }
  }

  if (state === 'done') {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-white/15 bg-white/[0.04] p-4">
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-white" />
        <p className="text-sm text-white/70">{message}</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>

      <div className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-1.5 transition-colors duration-300 focus-within:border-white/30">
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          autoComplete="email"
          aria-describedby={message ? 'newsletter-msg' : undefined}
          className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-0"
        />

        <button
          type="submit"
          disabled={state === 'sending'}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 font-mono text-[12px] text-ink-950 transition-transform duration-300 hover:scale-[1.03] disabled:opacity-60"
        >
          {state === 'sending' ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Sending
            </>
          ) : (
            <>
              Subscribe
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>

      {message && (
        <p
          id="newsletter-msg"
          role="status"
          className={`mt-2.5 text-xs ${
            state === 'error' ? 'text-red-400' : 'text-white/50'
          }`}
        >
          {message}
        </p>
      )}
    </form>
  )
}
