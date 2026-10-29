// ============================================================
// app/layout.tsx — Root Layout
// Wraps entire app with ClerkProvider for authentication.
// ============================================================

import type { Metadata, Viewport } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'react-hot-toast'
import { Geist } from 'next/font/google'
import { colors } from '@/lib/design-tokens'
import '@/app/globals.css'

const geist = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-geist',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://druporia.vercel.app'),
  title: {
    default: 'Druporia — Custom engineering for digital commerce',
    template: '%s | Druporia',
  },
  description:
    'Druporia designs and builds custom plugins, Shopify apps, AI automation and full-stack platforms for B2B and B2C brands — scoped up front, built in the open, supported after launch.',
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
    title: 'Druporia — Custom engineering for digital commerce',
    description:
      'Custom plugins, Shopify apps, AI automation and full-stack development for commerce brands. Book a free discovery call.',
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
    title: 'Druporia — Custom engineering for digital commerce',
    description:
      'Custom plugins, Shopify apps, AI automation and full-stack development for commerce brands.',
    images: ['/icon.svg'],
  },
}

export const viewport: Viewport = {
  themeColor: colors.canvas,
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
          colorPrimary: colors.ink.DEFAULT,
          colorBackground: colors.canvas,
          colorInputBackground: colors.canvas,
          colorInputText: colors.ink.DEFAULT,
          colorText: colors.ink.DEFAULT,
          colorTextSecondary: colors.body,
          fontFamily: 'var(--font-geist), system-ui, sans-serif',
          borderRadius: '12px',
        },
        elements: {
          formButtonPrimary: 'bg-ink hover:bg-ink-hover text-white text-sm font-semibold rounded-full',
          card: 'border border-line-card shadow-hero rounded-card-lg',
          headerTitle: 'text-ink font-semibold',
          headerSubtitle: 'text-body',
          formFieldInput: 'border-line-chip text-sm',
          footerActionLink: 'text-orange-text font-medium hover:text-orange-deep',
        },
      }}
    >
      <html lang="en" className={geist.variable} suppressHydrationWarning>
        <body className="min-h-screen bg-canvas font-sans text-ink">
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: colors.canvas,
                color: colors.ink.DEFAULT,
                border: `1px solid ${colors.line.card}`,
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 16px 40px rgba(15, 20, 32, 0.12)',
                padding: '12px 16px',
              },
              success: {
                iconTheme: { primary: colors.status, secondary: colors.canvas },
              },
              error: {
                iconTheme: { primary: colors.orange.deep, secondary: colors.canvas },
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  )
}
