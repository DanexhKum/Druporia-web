import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'dark' | 'outline' | 'ghost' | 'white'
type Size = 'sm' | 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  primary: 'btn-primary',
  dark: 'btn-dark',
  outline: 'btn-secondary',
  ghost: 'btn-ghost',
  white: 'btn-white',
}

const SIZES: Record<Size, string> = {
  sm: 'px-[18px] py-3 text-[14.5px]',
  md: 'px-5 py-[11px] text-[15px]',
  lg: 'px-7 py-4 text-base',
}

interface BaseProps {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

type LinkButtonProps = BaseProps & { href: string } & Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'className'>
type NativeButtonProps = BaseProps & { href?: undefined } & Omit<ComponentPropsWithoutRef<'button'>, 'className'>

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(VARIANTS[variant], SIZES[size], className)
}

export function Button(props: LinkButtonProps | NativeButtonProps) {
  const { variant = 'primary', size = 'md', className, children } = props
  const classes = buttonClasses(variant, size, className)

  if (props.href !== undefined) {
    const { variant: _v, size: _s, className: _c, children: _ch, href, ...rest } = props
    const isExternal = /^(mailto:|tel:|https?:)/.test(href)
    if (isExternal) {
      return (
        <a href={href} className={classes} {...rest}>
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  const { variant: _v, size: _s, className: _c, children: _ch, type = 'button', ...rest } = props
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  )
}
