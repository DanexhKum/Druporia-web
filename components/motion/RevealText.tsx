'use client'

// ============================================================
// components/motion/RevealText.tsx
// Staggered word-by-word reveal — each word rises from below a
// mask with opacity 0.
//
// Splits on WORDS, not letters. Letter-splitting shreds the text
// for screen readers and breaks text selection; the visual
// difference at this scale is negligible.
//
// Accessibility uses aria-label on the wrapper rather than an
// sr-only duplicate: a duplicate puts the sentence in the DOM
// twice, so selecting or copying the headline yields it twice.
// aria-label announces once and leaves a single copy of the text.
//
// Fails visible: without JS, or with reduced motion, the words
// render in place at full opacity rather than staying hidden.
// ============================================================

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface RevealTextProps {
  text: string
  className?: string
  /** Delay before the first word, in seconds. */
  delay?: number
  /** Gap between consecutive words, in seconds. */
  stagger?: number
  as?: 'h1' | 'h2' | 'p' | 'span'
}

export function RevealText({
  text,
  className,
  delay = 0,
  stagger = 0.055,
  as: Tag = 'span',
}: RevealTextProps) {
  const reduceMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const words = text.split(' ')
  const animate = mounted && !reduceMotion

  return (
    <Tag className={cn('relative', className)} aria-label={text}>
      <span aria-hidden className="inline">
        {words.map((word, i) => (
          // Mask: overflow-hidden clips the word while it rises.
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden align-bottom"
          >
            <motion.span
              className="inline-block"
              initial={animate ? { y: '110%', opacity: 0 } : false}
              animate={{ y: '0%', opacity: 1 }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: delay + i * stagger,
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 && ' '}
          </span>
        ))}
      </span>
    </Tag>
  )
}
