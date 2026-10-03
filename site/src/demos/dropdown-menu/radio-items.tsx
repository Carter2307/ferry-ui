import * as React from 'react'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from 'libui-kit'
import { ArrowUpDown } from 'lucide-react'

const LABELS: Record<string, string> = {
  newest: 'Newest first',
  oldest: 'Oldest first',
  name: 'Name (A to Z)',
}

export default function DropdownMenuRadioItems() {
  const [sort, setSort] = React.useState('newest')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button icon={<ArrowUpDown />}>Sort: {LABELS[sort]}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel inset>Sort by</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
          <DropdownMenuRadioItem value="newest">Newest first</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="oldest">Oldest first</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="name">Name (A to Z)</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="amount" disabled>
            Amount
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
