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
  themeColor: '#1e3a5f',
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
          colorPrimary: '#1e3a5f',
          colorBackground: '#ffffff',
          colorInputBackground: '#ffffff',
          colorInputText: '#172c47',
          fontFamily: '"Plus Jakarta Sans", -apple-system, sans-serif',
          borderRadius: '6px',
        },
        elements: {
          formButtonPrimary:
            'bg-navy-800 hover:bg-navy-900 text-white text-sm font-semibold',
          card: 'border border-navy-100 shadow-card',
          headerTitle: 'text-navy-900 font-bold',
          headerSubtitle: 'text-navy-500',
          formFieldInput: 'border-navy-200 focus:ring-navy-800 text-sm',
          footerActionLink: 'text-navy-800 font-semibold',
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
        <body className="min-h-screen bg-white text-navy-900">
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
