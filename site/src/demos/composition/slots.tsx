import { Badge, ResourceCard, StatusLine } from 'libui'
import { FolderKanban } from 'lucide-react'

export default function Slots() {
  return (
    <ResourceCard
      as="div"
      className="w-full max-w-xs"
      name="Billing portal"
      icon={<FolderKanban />}
      subtitle="Owner: Maya Chen"
      badges={
        <Badge font="mono" shape="square">
          Pro
        </Badge>
      }
      footer={<StatusLine tone="success">The project is active</StatusLine>}
    />
  )
}
