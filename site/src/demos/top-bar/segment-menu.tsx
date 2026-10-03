import * as React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  TopBar,
  TopBarLogo,
  TopBarSegment,
  TopBarSeparator,
} from '@roger.b/libui'
import { Building2 } from 'lucide-react'

const WORKSPACES = [
  { id: 'acme', name: 'Acme' },
  { id: 'acme-labs', name: 'Acme Labs' },
  { id: 'acme-europe', name: 'Acme Europe' },
]

export default function TopBarSegmentMenu() {
  const [workspace, setWorkspace] = React.useState('acme')
  const current = WORKSPACES.find((entry) => entry.id === workspace)

  return (
    <TopBar
      logo={
        <TopBarLogo label="Acme home">
          <svg viewBox="0 0 20 20" fill="currentColor" className="text-brand">
            <circle cx="10" cy="10" r="8" />
          </svg>
        </TopBarLogo>
      }
    >
      <TopBarSeparator />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <TopBarSegment icon={<Building2 />}>{current?.name}</TopBarSegment>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52">
          <DropdownMenuLabel>Workspace</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={workspace} onValueChange={setWorkspace}>
            {WORKSPACES.map((entry) => (
              <DropdownMenuRadioItem key={entry.id} value={entry.id}>
                {entry.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <TopBarSeparator />
      <TopBarSegment chevron={false}>Settings</TopBarSegment>
    </TopBar>
  )
}
