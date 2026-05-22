// ============================================================
// app/layout.tsx — Root Layout
// Wraps entire app with ClerkProvider for authentication.
// ============================================================

import type { Metadata, Viewport } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'react-hot-toast'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Druporia — Enterprise Technology Solutions',
    template: '%s | Druporia',
  },
  description:
    'Druporia provides end-to-end eCommerce and technology services for B2B and B2C companies. Custom plugins, AI solutions, and full-stack development.',
  keywords: [
    'freelance developer',
    'web development',
    'WooCommerce plugins',
    'Chrome extensions',
    'business automation',
  ],
  authors: [{ name: 'Druporia' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Druporia — Enterprise Technology Solutions',
    description:
      'Innovative, scalable, and future-ready technology solutions tailored to your business needs.',
    siteName: 'Druporia',
  },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#0f172a',
          colorBackground: '#ffffff',
          colorInputBackground: '#ffffff',
          colorInputText: '#0f172a',
          fontFamily: 'Inter, -apple-system, sans-serif',
          borderRadius: '6px',
        },
        elements: {
          formButtonPrimary:
            'bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium',
          card: 'border border-slate-200 shadow-card',
          headerTitle: 'text-slate-900 font-semibold',
          headerSubtitle: 'text-slate-500',
          formFieldInput:
            'border-slate-200 focus:ring-slate-900 text-sm',
          footerActionLink: 'text-slate-900 font-medium',
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="min-h-screen bg-white text-slate-900">
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#0f172a',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)',
                padding: '12px 16px',
              },
              success: {
                iconTheme: { primary: '#16a34a', secondary: '#ffffff' },
              },
              error: {
                iconTheme: { primary: '#dc2626', secondary: '#ffffff' },
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  )
}
