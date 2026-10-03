import * as React from 'react'
import { StatusDot, cn, statusBadgeVariants, type StatusTone } from 'libui'

const FILTERS: { tone: StatusTone; label: string }[] = [
  { tone: 'success', label: 'Paid' },
  { tone: 'warning', label: 'Overdue' },
  { tone: 'destructive', label: 'Failed' },
]

export default function StatusVariants() {
  const [active, setActive] = React.useState<StatusTone | null>('success')

  return (
    <div role="group" aria-label="Filter invoices by status" className="flex flex-wrap items-center gap-2">
      {FILTERS.map(({ tone, label }) => {
        const pressed = active === tone
        return (
          <button
            key={tone}
            type="button"
            aria-pressed={pressed}
            onClick={() => setActive(pressed ? null : tone)}
            className={cn(
              statusBadgeVariants({ tone: pressed ? tone : 'neutral' }),
              'cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring',
            )}
          >
            <StatusDot tone={tone} />
            {label}
          </button>
        )
      })}
    </div>
  )
}
