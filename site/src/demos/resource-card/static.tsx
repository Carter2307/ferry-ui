import { Badge, ResourceCard, ResourceGrid, StatusLine } from 'libui-kit'
import { Archive, FolderKanban } from 'lucide-react'

export default function ResourceCardStatic() {
  return (
    <ResourceGrid aria-label="Archived projects">
      <ResourceCard
        name="Billing portal"
        icon={<FolderKanban />}
        subtitle="Owner: Maya Chen"
        badges={
          <Badge font="mono" shape="square">
            pro
          </Badge>
        }
        footer={<StatusLine tone="neutral">Archived on Mar 4, 2026</StatusLine>}
      />
      <ResourceCard name="Internal wiki" icon={<Archive />} subtitle="Owner: Jonas Weber" />
    </ResourceGrid>
  )
}
