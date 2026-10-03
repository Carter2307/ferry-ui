import * as React from 'react'
import { ResourceSwitcher, toast, type ResourceSwitcherAction, type ResourceSwitcherItem } from 'libui'
import { FolderKanban, LayoutGrid, Plus } from 'lucide-react'

const PROJECTS: ResourceSwitcherItem[] = [
  { id: 'billing-portal', label: 'Billing portal', icon: <FolderKanban /> },
  { id: 'customer-app', label: 'Customer app', icon: <FolderKanban /> },
  { id: 'status-page', label: 'Status page', icon: <FolderKanban /> },
]

// A real app opens a page or a dialog from `onSelect`.
const ACTIONS: ResourceSwitcherAction[] = [
  { id: 'all', label: 'All projects', icon: <LayoutGrid />, onSelect: () => toast('The list of projects opens here') },
  { id: 'new', label: 'New project…', icon: <Plus />, onSelect: () => toast('The dialog for a new project opens here') },
]

export default function ResourceSwitcherActions() {
  const [project, setProject] = React.useState('billing-portal')

  return (
    <ResourceSwitcher
      label="switch project"
      heading="Projects"
      items={PROJECTS}
      value={project}
      onValueChange={setProject}
      actions={ACTIONS}
    />
  )
}
