import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  href?: string
  className?: string
  imageClassName?: string
  showText?: boolean
}

export function Logo({
  href = '/',
  className,
  imageClassName = 'h-9 w-auto',
  showText = false,
}: LogoProps) {
  const content = (
    <>
      <Image
        src="/druporia-logo-transparent.png"
        alt="Druporia"
        width={160}
        height={48}
        className={cn(imageClassName)}
        priority
      />
      {showText && (
        <span className="sr-only">Druporia</span>
      )}
    </>
  )

  if (!href) {
    return <div className={cn('flex items-center', className)}>{content}</div>
  }

  return (
    <Link href={href} className={cn('flex items-center focus-ring rounded', className)}>
      {content}
    </Link>
  )
}
