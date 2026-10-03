import * as React from 'react'
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'ferry-ui'
import { Settings2 } from 'lucide-react'

const DEFAULT_COLUMNS = { email: true, role: true, status: false }

export default function DropdownMenuCheckboxItems() {
  const [columns, setColumns] = React.useState(DEFAULT_COLUMNS)

  function toggle(key: keyof typeof DEFAULT_COLUMNS) {
    return (checked: boolean) => setColumns((current) => ({ ...current, [key]: checked }))
  }

  // `preventDefault` keeps the menu open, so the user can change more than one column.
  const keepOpen = (event: Event) => event.preventDefault()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button icon={<Settings2 />}>View</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel inset>Columns</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked disabled>
          Name
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={columns.email} onCheckedChange={toggle('email')} onSelect={keepOpen}>
          Email
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={columns.role} onCheckedChange={toggle('role')} onSelect={keepOpen}>
          Role
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={columns.status} onCheckedChange={toggle('status')} onSelect={keepOpen}>
          Status
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        {/* `inset` aligns the text of a plain item with the checkbox items. */}
        <DropdownMenuItem inset onSelect={() => setColumns(DEFAULT_COLUMNS)}>
          Reset columns
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
