import { Toggle } from 'libui'
import { Archive, Pin } from 'lucide-react'

export default function ToggleHero() {
  return (
    <>
      <Toggle variant="outline" defaultPressed>
        <Pin /> Pinned first
      </Toggle>
      <Toggle variant="outline">
        <Archive /> Archived
      </Toggle>
    </>
  )
}
