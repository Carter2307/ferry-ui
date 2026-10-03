import { Badge, TopBar, TopBarLogo, TopBarSegment, TopBarSeparator } from 'libui-kit'
import { Building2, FolderKanban } from 'lucide-react'

export default function TopBarSegmentStates() {
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
      <TopBarSegment icon={<Building2 />} loading aria-label="Workspace" />
      <TopBarSeparator />
      <TopBarSegment
        icon={<Building2 />}
        badge={
          <Badge font="mono" case="normal">
            Pro
          </Badge>
        }
      >
        Acme
      </TopBarSegment>
      <TopBarSeparator />
      <TopBarSegment icon={<FolderKanban />}>Revenue reports for the finance team of Acme Europe</TopBarSegment>
      <TopBarSeparator />
      <TopBarSegment icon={<FolderKanban />} disabled>
        Archived project
      </TopBarSegment>
    </TopBar>
  )
}
