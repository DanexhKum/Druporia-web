// ============================================================
// components/contact/TrustBadges.tsx
// Micro-stat badges below the contact form.
//
// ⚠ THESE ARE SERVICE CLAIMS, NOT MEASURED VALUES.
//
// "Response time < 2h" and "24/7 Enterprise SLA" were specified
// directly and are rendered as asked. Nothing in this codebase
// measures either one: there is no response-time telemetry and
// no uptime probe, so they are commitments the business is
// making, not figures the site can verify.
//
// Two consequences worth keeping in view:
//   1. ContactForm's success message currently says "within 24
//      hours". Both strings are on the same page, so one of them
//      needs to change or visitors will see the site contradict
//      itself.
//   2. A published SLA is something a client can hold you to.
//      Keep these in sync with what you actually offer.
//
// If either claim changes, edit it HERE — this is the only place
// the wording lives.
// ============================================================

import { Clock, Headphones, ShieldCheck } from 'lucide-react'

const BADGES = [
  {
    icon: Clock,
    stat: 'Response time < 2h',
    sub: 'during working hours',
  },
  {
    icon: Headphones,
    stat: '24/7 Enterprise SLA',
    sub: 'on enterprise agreements',
  },
  {
    icon: ShieldCheck,
    stat: 'Fixed-price scoping',
    sub: 'before any code is written',
  },
]

export function TrustBadges() {
  return (
    <ul className="mt-5 grid gap-3 sm:grid-cols-3">
      {BADGES.map((badge) => {
        const Icon = badge.icon
        return (
          <li
            key={badge.stat}
            className="group rounded-lg border border-white/10 bg-white/[0.03] p-4 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.06]"
          >
            <Icon
              className="h-4 w-4 text-zinc-400 transition-colors duration-300 group-hover:text-white"
              aria-hidden
            />
            <p className="mt-3 text-sm font-semibold text-white">
              {badge.stat}
            </p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
              {badge.sub}
            </p>
          </li>
        )
      })}
    </ul>
  )
}
