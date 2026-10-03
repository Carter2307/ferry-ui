import * as React from 'react'
import { ResourceSwitcher, type ResourceSwitcherItem } from 'ferry-ui'
import { Building2 } from 'lucide-react'

const WORKSPACES: ResourceSwitcherItem[] = [
  { id: 'acme', label: 'Acme', icon: <Building2 /> },
  { id: 'acme-labs', label: 'Acme Labs', icon: <Building2 /> },
  { id: 'acme-europe', label: 'Acme Europe', icon: <Building2 /> },
]

export default function ResourceSwitcherCustomTrigger() {
  const [workspace, setWorkspace] = React.useState('acme-labs')
  const current = WORKSPACES.find((item) => item.id === workspace)

  return (
    <ResourceSwitcher
      label="switch workspace"
      items={WORKSPACES}
      value={workspace}
      onValueChange={setWorkspace}
      icon={
        <span className="flex size-5 items-center justify-center rounded-sm bg-primary-soft text-[10px] font-medium text-primary">
          {current?.label.charAt(0)}
        </span>
      }
    >
      {`Workspace: ${current?.label}`}
    </ResourceSwitcher>
  )
}
