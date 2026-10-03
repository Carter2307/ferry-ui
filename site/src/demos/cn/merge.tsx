import type { ComponentProps } from 'react'
import { cn } from 'libui-kit'

// The base classes come first and `className` comes last: the class of the caller wins.
function Panel({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('rounded-lg border bg-surface-100 p-3 text-sm text-foreground', className)} {...props} />
}

export default function CnMerge() {
  return (
    <>
      <Panel>The base padding</Panel>
      <Panel className="p-6">More padding</Panel>
    </>
  )
}
