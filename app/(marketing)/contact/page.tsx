// ============================================================
// app/(marketing)/contact/page.tsx
// Modern Contact Page with Formspree Integration
// ============================================================

import type { Metadata } from 'next'
import { Mail, MessageSquare, Building, Send } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Druporia for enterprise technology solutions.',
}

export default function ContactPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="container-page py-20 relative z-10 text-center max-w-3xl mx-auto">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-4">
            Contact Druporia
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Let's build something great together.
          </h1>
          <p className="mt-6 text-lg text-slate-300">
            Have a project in mind or a question about our products? Fill out the form below and our team will get back to you within 24 hours.
          </p>
        </div>
      </div>

      {/* ── Main Content ────────────────────────────────────── */}
      <div className="container-page py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-8 max-w-6xl mx-auto">
          
          {/* Contact Info Sidebar */}
          <div className="space-y-8 lg:col-span-1">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Reach Out Directly</h3>
              <p className="mt-2 text-sm text-slate-500">
                We're always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Email Us</p>
                  <p className="text-sm text-slate-500">contact@druporia.com</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Support</p>
                  <p className="text-sm text-slate-500">support@druporia.com</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">HQ</p>
                  <p className="text-sm text-slate-500">Global Remote Team</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formspree Form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm">
              <form action="https://formspree.io/f/xojypayy" method="POST" className="space-y-6">
                
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="form-label text-slate-700">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required 
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors" 
                      placeholder="John Doe" 
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="form-label text-slate-700">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required 
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors" 
                      placeholder="john@example.com" 
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="form-label text-slate-700">Subject / Inquiry Type</label>
                  <select 
                    id="subject" 
                    name="subject" 
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors"
                  >
                    <option value="Project Inquiry">Project Inquiry</option>
                    <option value="Product Support">Product Support</option>
                    <option value="Partnership">Partnership / Automation (n8n)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="form-label text-slate-700">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={6} 
                    required 
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors resize-y" 
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn-primary w-full py-4 text-base font-semibold shadow-lg shadow-blue-500/20 gap-2 justify-center"
                >
                  Send Message
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
