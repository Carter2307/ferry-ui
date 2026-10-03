import * as React from 'react'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  ListToolbar,
  SearchInput,
  ToggleGroup,
  ToggleGroupItem,
} from 'libui-kit'
import { ArrowUpDown, LayoutGrid, List } from 'lucide-react'

export default function ListToolbarSortView() {
  const [sort, setSort] = React.useState('updated')
  const [view, setView] = React.useState('list')

  return (
    <ListToolbar
      actions={
        <ToggleGroup
          type="single"
          variant="outline"
          aria-label="View"
          value={view}
          onValueChange={(next) => next && setView(next)}
        >
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <LayoutGrid />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <List />
          </ToggleGroupItem>
        </ToggleGroup>
      }
    >
      <SearchInput placeholder="Search projects" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button icon={<ArrowUpDown />}>{sort === 'name' ? 'Name' : 'Last update'}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
            <DropdownMenuRadioItem value="updated">Last update</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ListToolbar>
  )
}
