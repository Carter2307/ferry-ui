import type { ComponentProps } from 'react'
import { cn } from 'ferry-ui'
import { siGithub } from 'simple-icons'

/**
 * The libui mark: a control (the solid square) on a surface (the outlined one), which is the
 * library in one picture. It takes the `brand` color.
 */
export function LogoMark({ className, ...props }: ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={cn('text-brand', className)} {...props}>
      <rect x="1.75" y="1.75" width="16.5" height="16.5" rx="4.25" stroke="currentColor" strokeWidth="1.5" />
      <rect x="5.5" y="9.5" width="9" height="5" rx="1.5" fill="currentColor" />
      <rect x="5.5" y="5.5" width="5" height="2" rx="1" fill="currentColor" opacity="0.55" />
    </svg>
  )
}

/** Mark and name, for the navigation bar and the footer of the landing page. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-[17px] font-medium tracking-tight text-foreground', className)}>
      <LogoMark className="size-[22px]" />
      libui
    </span>
  )
}

/** A brand glyph from simple-icons (lucide has no brand icons). */
export function BrandIcon({ path, className, ...props }: ComponentProps<'svg'> & { path: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className} {...props}>
      <path d={path} />
    </svg>
  )
}

export function GithubIcon(props: ComponentProps<'svg'>) {
  return <BrandIcon path={siGithub.path} {...props} />
}
