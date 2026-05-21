'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="container-page py-24 sm:py-32 relative overflow-hidden">
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-gradient-to-br from-blue-500/20 via-blue-600/10 to-transparent rounded-full blur-3xl -z-10"
        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-4xl text-center mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5"
        >
          <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-xs font-semibold text-blue-800 tracking-wide uppercase">
            Enterprise Technology Solutions
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl lg:text-7xl"
        >
          Empowering Digital Commerce with{' '}
          <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Innovative Technology
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 max-w-2xl mx-auto text-lg leading-relaxed text-slate-600"
        >
          At <strong>Druporia</strong>, we help businesses unlock growth with plugins,
          apps, automation, and full-stack development — built for serious commerce
          teams.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/contact"
            className="btn-primary gap-2 text-base px-8 py-4 w-full sm:w-auto shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow"
          >
            Schedule a Consultation
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/marketplace"
            className="btn-secondary gap-2 text-base px-8 py-4 w-full sm:w-auto bg-white"
          >
            Browse Digital Products
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
