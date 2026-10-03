import * as React from 'react'
import { Checkbox, FilterButton, Label, Popover, PopoverContent, PopoverTrigger } from 'libui-kit'

const OWNERS = ['Maya Chen', 'Jonas Weber', 'Priya Patel']

export default function FilterButtonDemo() {
  const [selected, setSelected] = React.useState<string[]>(['Maya Chen'])

  function toggle(owner: string, checked: boolean) {
    setSelected(OWNERS.filter((name) => (name === owner ? checked : selected.includes(name))))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FilterButton label="Owner" selected={selected} />
      </PopoverTrigger>
      <PopoverContent align="start" className="flex w-56 flex-col gap-3" aria-label="Filter by owner">
        {OWNERS.map((owner) => (
          <Label key={owner}>
            <Checkbox
              checked={selected.includes(owner)}
              onCheckedChange={(checked) => toggle(owner, checked === true)}
            />
            {owner}
          </Label>
        ))}
      </PopoverContent>
    </Popover>
  )
}
