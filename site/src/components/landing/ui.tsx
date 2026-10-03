import type { ReactNode } from 'react'
import { cn } from 'libui-kit'

import { Divider } from './backdrop'
import { Reveal } from './reveal'

/** A section of the landing page: a full-width hairline on top (with its beam), the content in the page column. */
export function Section({
  id,
  labelledBy,
  className,
  children,
}: {
  id?: string
  labelledBy: string
  className?: string
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={labelledBy}>
      <Divider />
      <div className={cn('container-page py-20 lg:py-28', className)}>{children}</div>
    </section>
  )
}

/** A section heading in two lines: the claim at full strength, then a quieter line. */
export function Heading({ id, strong, quiet, className }: { id: string; strong: ReactNode; quiet: ReactNode; className?: string }) {
  return (
    <h2 id={id} className={cn('heading-section', className)}>
      <Reveal as="span" className="block text-foreground">
        {strong}
      </Reveal>
      <Reveal as="span" delay={0.07} className="block text-foreground-lighter">
        {quiet}
      </Reveal>
    </h2>
  )
}
