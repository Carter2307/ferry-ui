import * as React from 'react'

import { cn } from "../../lib/utils"

/**
 * Pulsing placeholder block shown while content loads (it stays still when the user prefers
 * reduced motion). It has no intrinsic size: give it the dimensions of the content it stands in
 * for (`h-4 w-32`, `size-8 rounded-full`…) so the layout does not shift when data arrives.
 * Hidden from assistive technology — mark the loading region itself with `aria-busy` if needed.
 * Do NOT use it for indefinite background work or button spinners (use a spinner / `loading`
 * prop instead).
 */
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        'animate-pulse rounded-md bg-foreground/[0.06] motion-reduce:animate-none dark:bg-foreground/[0.08]',
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
