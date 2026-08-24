'use client'

// ============================================================
// app/global-error.tsx
// Last resort: catches failures in the root layout itself (e.g.
// ClerkProvider failing to initialise), where app/error.tsx
// cannot render because the layout never mounted.
//
// It replaces the whole document, so it must supply <html> and
// <body> and cannot rely on globals.css having loaded — styles
// are inline for that reason.
// ============================================================

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          color: '#0f172a',
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          padding: '2rem',
        }}
      >
        <div style={{ maxWidth: '28rem', textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              margin: '0 0 0.5rem',
            }}
          >
            Druporia is temporarily unavailable
          </h1>
          <p
            style={{
              fontSize: '0.875rem',
              color: '#64748b',
              margin: '0 0 1.5rem',
              lineHeight: 1.6,
            }}
          >
            The application failed to start. This is usually transient —
            reloading often resolves it.
          </p>

          {error.digest && (
            <p
              style={{
                fontFamily: 'ui-monospace, monospace',
                fontSize: '0.75rem',
                color: '#94a3b8',
                margin: '0 0 1.5rem',
              }}
            >
              Reference: {error.digest}
            </p>
          )}

          <button
            type="button"
            onClick={reset}
            style={{
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.625rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  )
}
