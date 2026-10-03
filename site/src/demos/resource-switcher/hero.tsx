import * as React from 'react'
import { ResourceSwitcher, type ResourceSwitcherItem } from '@roger.b/libui'
import { FolderKanban } from 'lucide-react'

const PROJECTS: ResourceSwitcherItem[] = [
  { id: 'billing-portal', label: 'Billing portal', icon: <FolderKanban /> },
  { id: 'customer-app', label: 'Customer app', icon: <FolderKanban /> },
  { id: 'status-page', label: 'Status page', icon: <FolderKanban /> },
  { id: 'data-export', label: 'Data export', icon: <FolderKanban /> },
]

export default function ResourceSwitcherHero() {
  const [project, setProject] = React.useState('billing-portal')

  return (
    <ResourceSwitcher
      label="switch project"
      searchPlaceholder="Find a project…"
      items={PROJECTS}
      value={project}
      onValueChange={setProject}
    />
  )
}
