import * as React from 'react'
import { Button, Input, Popover, PopoverAnchor, PopoverContent, PopoverTitle, PopoverTrigger } from 'ferry-ui'
import { CalendarDays } from 'lucide-react'

const DATES = [
  { label: 'End of the month', value: '2026-03-31' },
  { label: 'End of the quarter', value: '2026-06-30' },
  { label: 'End of the year', value: '2026-12-31' },
]

export default function PopoverWithAnchor() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState('2026-03-31')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* The panel aligns to the field and the button together, not to the button only. */}
      <PopoverAnchor asChild>
        <div className="flex w-64 items-center gap-2">
          <Input aria-label="Due date" size="sm" mono value={date} onChange={(event) => setDate(event.target.value)} />
          <PopoverTrigger asChild>
            <Button size="icon" icon={<CalendarDays />} aria-label="Pick a due date" />
          </PopoverTrigger>
        </div>
      </PopoverAnchor>
      <PopoverContent align="start" aria-label="Due date" className="flex w-64 flex-col gap-2">
        <PopoverTitle>Due date</PopoverTitle>
        <div className="flex flex-col gap-1">
          {DATES.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              className="justify-between"
              onClick={() => {
                setDate(option.value)
                setOpen(false)
              }}
            >
              {option.label}
              <span className="font-mono text-xs text-foreground-lighter">{option.value}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
