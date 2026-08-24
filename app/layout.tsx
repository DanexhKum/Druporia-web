// ============================================================
// app/layout.tsx — Root Layout
// Wraps entire app with ClerkProvider for authentication.
// ============================================================

import type { Metadata, Viewport } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'react-hot-toast'
import '@/app/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://druporia.vercel.app'),
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
    'data analytics',
    'AI automation',
    'Shopify apps',
  ],
  authors: [{ name: 'Druporia' }],
  creator: 'Druporia',
  publisher: 'Druporia',
  alternates: {
    canonical: '/',
  },
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
    url: '/',
    images: [
      {
        url: '/icon.svg',
        width: 64,
        height: 64,
        alt: 'Druporia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Druporia — Enterprise Technology Solutions',
    description:
      'End-to-end eCommerce technology, AI automation, custom plugins, and full-stack development.',
    images: ['/icon.svg'],
  },
}

export const viewport: Viewport = {
  themeColor: '#050a0f',
  colorScheme: 'dark',
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
        // Dark, to match the marketing surfaces the modal opens over.
        variables: {
          colorPrimary: '#22d3ee',
          colorBackground: '#070d14',
          colorInputBackground: '#0d1722',
          colorInputText: '#ffffff',
          colorText: '#ffffff',
          colorTextSecondary: 'rgba(255,255,255,0.55)',
          fontFamily: '"Plus Jakarta Sans", -apple-system, sans-serif',
          borderRadius: '12px',
        },
        elements: {
          formButtonPrimary:
            'bg-white hover:bg-white/90 text-ink-950 text-sm font-semibold',
          card: 'border border-white/10 bg-ink-900 shadow-card-dark',
          headerTitle: 'text-white font-bold',
          headerSubtitle: 'text-white/55',
          formFieldLabel: 'text-white/70',
          formFieldInput:
            'bg-ink-800 border-white/10 text-white focus:ring-teal-400/50 text-sm',
          footerActionLink: 'text-teal-300 hover:text-teal-200 font-semibold',
          socialButtonsBlockButton:
            'border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]',
          dividerLine: 'bg-white/10',
          dividerText: 'text-white/40',
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
          {/* Plus Jakarta Sans 300–800: 300/400 body, 600 labels,
              700/800 headlines. See tailwind.config.ts. */}
          <link
            href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="min-h-screen bg-ink-950 text-white">
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#172c47',
                border: '1px solid #e4ecf4',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 10px 30px -12px rgba(30,58,95,0.35)',
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
