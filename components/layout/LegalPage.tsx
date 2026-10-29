import type { ReactNode } from 'react'
import { PageHeader } from '@/components/ui/Section'

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string
  updated?: string
  children: ReactNode
}) {
  return (
    <>
      <PageHeader eyebrow="Legal" title={title} description={updated ? `Last updated ${updated}` : undefined} />
      <div className="container-page pb-20 desk:pb-section">
        <div className="prose max-w-[68ch] border-t border-line pt-10">{children}</div>
      </div>
    </>
  )
}
