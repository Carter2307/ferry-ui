import * as React from 'react'
import { FilterMenu, StatusDot, type FilterOption } from 'ferry-ui'

const STATUS_OPTIONS: FilterOption[] = [
  { value: 'paid', label: 'Paid', count: 18, icon: <StatusDot tone="success" /> },
  { value: 'open', label: 'Open', count: 6, icon: <StatusDot tone="info" /> },
  { value: 'overdue', label: 'Overdue', count: 2, icon: <StatusDot tone="destructive" /> },
  { value: 'void', label: 'Void', count: 0, icon: <StatusDot tone="neutral" />, disabled: true },
]

export default function FilterMenuDemo() {
  const [statuses, setStatuses] = React.useState<string[]>(['overdue'])

  return (
    <>
      <FilterMenu label="Status" options={STATUS_OPTIONS} value={statuses} onValueChange={setStatuses} />
      <span className="text-[13px] text-foreground-light" aria-live="polite">
        {statuses.length === 0 ? 'No filter' : `Selected: ${statuses.join(', ')}`}
      </span>
    </>
  )
}
