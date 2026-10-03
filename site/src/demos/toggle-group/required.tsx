import * as React from 'react'
import { ToggleGroup, ToggleGroupItem } from 'ferry-ui'
import { LayoutGrid, List } from 'lucide-react'

const PROJECTS = ['Customer portal', 'Marketing site', 'Mobile app', 'Billing portal']

export default function ToggleGroupRequired() {
  const [view, setView] = React.useState('grid')

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <ToggleGroup
        type="single"
        variant="outline"
        aria-label="View"
        value={view}
        // A click on the pressed item sends "". Ignore it to keep one item pressed.
        onValueChange={(next) => next && setView(next)}
      >
        <ToggleGroupItem value="grid" aria-label="Grid view">
          <LayoutGrid />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" aria-label="List view">
          <List />
        </ToggleGroupItem>
      </ToggleGroup>
      <ul className={view === 'grid' ? 'grid grid-cols-2 gap-2' : 'flex flex-col gap-2'}>
        {PROJECTS.map((project) => (
          <li key={project} className="rounded-md border bg-surface-100 px-3 py-2 text-[13px] text-foreground">
            {project}
          </li>
        ))}
      </ul>
    </div>
  )
}
