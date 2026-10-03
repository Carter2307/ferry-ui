import { Button, Kbd, toast, useModKey } from '@roger.b/libui'
import { Search } from 'lucide-react'

export default function KbdModKey() {
  // "⌘" on an Apple platform, "Ctrl" on the others.
  const mod = useModKey()

  return (
    <Button icon={<Search />} onClick={() => toast.info('Search opened')}>
      Search <Kbd>{mod} K</Kbd>
    </Button>
  )
}
