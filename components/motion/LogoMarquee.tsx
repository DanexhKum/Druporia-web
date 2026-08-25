'use client'

// ============================================================
// components/motion/LogoMarquee.tsx
// Continuously scrolling wordmark strip.
//
// Runs on a CSS animation translating -50%, with the list
// rendered TWICE. Because the second copy is identical and the
// track moves exactly half its width, the wrap is seamless —
// this is why the duplicate exists, and why the keyframe must
// stay at -50% if the markup changes.
//
// The duplicate is aria-hidden so screen readers hear the list
// once. Paused on hover, and frozen entirely for reduced motion.
//
// These are the platforms Druporia builds ON — not client logos.
// A "trusted by" wall of brands we don't work with would be a
// false claim, so the label says exactly what the list is.
// ============================================================

import { cn } from '@/lib/utils'

const PLATFORMS = [
  'WooCommerce',
  'Shopify',
  'Next.js',
  'PostgreSQL',
  'n8n',
  'OpenAI',
  'Magento',
  'React',
  'AWS',
  'Python',
]

export function LogoMarquee({ label }: { label?: string }) {
  return (
    <section className="relative overflow-hidden border-y border-white/[0.06] bg-ink-950 py-10">
      {label && (
        <p className="mono-label mb-7 text-center text-white/40">{label}</p>
      )}

      {/* Edge fades so items dissolve rather than clipping */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-950 to-transparent sm:w-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-950 to-transparent sm:w-40"
      />

      <div className="group flex w-max animate-marquee items-center gap-14 pr-14 hover:[animation-play-state:paused] motion-reduce:animate-none sm:gap-20 sm:pr-20">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex items-center gap-14 sm:gap-20"
          >
            {PLATFORMS.map((name) => (
              <span
                key={`${copy}-${name}`}
                className={cn(
                  'whitespace-nowrap font-display text-lg font-medium tracking-tight',
                  'text-white/35 transition-colors duration-300 hover:text-cyan-300 sm:text-xl'
                )}
              >
                {name}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
