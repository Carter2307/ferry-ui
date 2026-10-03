import { ResourceSwitcher, type ResourceSwitcherItem } from 'libui-kit'
import { FolderKanban } from 'lucide-react'

const PROJECTS: ResourceSwitcherItem[] = [
  { id: 'billing-portal', label: 'Billing portal', icon: <FolderKanban /> },
  { id: 'customer-app', label: 'Customer app', icon: <FolderKanban /> },
]

const NO_PROJECTS: ResourceSwitcherItem[] = []

export default function ResourceSwitcherStates() {
  return (
    <>
      {/* The items are not there yet: the trigger shows a skeleton. */}
      <ResourceSwitcher label="switch project" items={NO_PROJECTS} value="billing-portal" loading />
      {/* No current item: the trigger shows the placeholder. */}
      <ResourceSwitcher label="switch project" items={PROJECTS} placeholder="Select a project…" />
      <ResourceSwitcher label="switch project" items={PROJECTS} defaultValue="customer-app" disabled />
    </>
  )
}
