import { CopyButton, InfoTile, StatusBadge } from '@roger.b/libui'
import { Activity, Fingerprint } from 'lucide-react'

const WORKSPACE_ID = 'ws_8f3a21c9e04b'

export default function InfoTileValueElement() {
  return (
    <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      <InfoTile
        icon={<Activity />}
        label="Status"
        value={<StatusBadge tone="info" label="Syncing" pulse />}
        hint="Started 2 minutes ago"
      />
      <InfoTile
        icon={<Fingerprint />}
        label="Workspace ID"
        value={
          <span className="flex min-w-0 items-center gap-2">
            <span className="truncate font-mono text-sm">{WORKSPACE_ID}</span>
            <CopyButton value={WORKSPACE_ID} what="workspace ID" variant="ghost" />
          </span>
        }
      />
    </div>
  )
}
