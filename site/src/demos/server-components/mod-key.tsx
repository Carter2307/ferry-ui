import { Button, Kbd, useModKey } from 'libui-kit'
import { Search } from 'lucide-react'

export default function ModKeyHint() {
  // "Ctrl" on the server and while React hydrates the page, then the key of the platform.
  const mod = useModKey()

  return (
    <Button icon={<Search />}>
      Search <Kbd>{mod} K</Kbd>
    </Button>
  )
}
