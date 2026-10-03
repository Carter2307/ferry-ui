import { Toggle } from 'libui'
import { Pin } from 'lucide-react'

export default function ToggleDisabled() {
  return (
    <>
      <Toggle variant="outline" disabled>
        <Pin /> Pinned first
      </Toggle>
      <Toggle variant="outline" disabled defaultPressed>
        <Pin /> Pinned first
      </Toggle>
    </>
  )
}
