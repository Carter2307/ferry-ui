import { MonoLabel } from 'ferry-ui'

const TEXT = 'Invitations from other workspaces'

export default function MonoLabelTruncate() {
  return (
    <MonoLabel as="div" title={TEXT} className="w-40 truncate">
      {TEXT}
    </MonoLabel>
  )
}
