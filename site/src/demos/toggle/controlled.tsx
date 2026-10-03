import * as React from 'react'
import { Badge, Toggle } from 'ferry-ui'
import { Archive } from 'lucide-react'

const PROJECTS = [
  { name: 'Customer portal', archived: false },
  { name: 'Marketing site', archived: false },
  { name: 'Old intranet', archived: true },
]

export default function ToggleControlled() {
  const [showArchived, setShowArchived] = React.useState(false)
  const projects = PROJECTS.filter((project) => showArchived || !project.archived)

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Toggle variant="outline" className="w-fit" pressed={showArchived} onPressedChange={setShowArchived}>
        <Archive /> Archived
      </Toggle>
      <ul aria-label="Projects" className="divide-y rounded-lg border bg-surface-100 text-[13px] text-foreground">
        {projects.map((project) => (
          <li key={project.name} className="flex items-center justify-between px-4 py-2.5">
            {project.name}
            {project.archived && <Badge>Archived</Badge>}
          </li>
        ))}
      </ul>
    </div>
  )
}
