import * as React from 'react'
import { Button, FilterMenu, ListToolbar, SearchInput, type FilterOption } from 'libui-kit'
import { Plus } from 'lucide-react'

const PROJECTS = [
  { name: 'Billing portal', status: 'active' },
  { name: 'Customer portal', status: 'active' },
  { name: 'Marketing site', status: 'paused' },
  { name: 'Internal wiki', status: 'archived' },
]

const STATUS_OPTIONS: FilterOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'archived', label: 'Archived' },
]

export default function ListToolbarHero() {
  const [query, setQuery] = React.useState('')
  const [statuses, setStatuses] = React.useState<string[]>([])

  const rows = PROJECTS.filter(
    (project) =>
      project.name.toLowerCase().includes(query.trim().toLowerCase()) &&
      (statuses.length === 0 || statuses.includes(project.status)),
  )

  return (
    <div className="flex flex-col gap-4">
      <ListToolbar
        actions={
          <Button variant="primary" icon={<Plus />}>
            New project
          </Button>
        }
      >
        <SearchInput placeholder="Search projects" value={query} onValueChange={setQuery} />
        <FilterMenu label="Status" options={STATUS_OPTIONS} value={statuses} onValueChange={setStatuses} />
      </ListToolbar>
      <div className="divide-y rounded-lg border bg-surface-100 text-sm">
        {rows.map((project) => (
          <div key={project.name} className="flex items-center justify-between gap-4 px-4 py-2.5">
            <span className="text-foreground">{project.name}</span>
            <span className="text-[13px] text-foreground-light capitalize">{project.status}</span>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="px-4 py-6 text-center text-foreground-light">No projects match your filters.</p>
        )}
      </div>
    </div>
  )
}
