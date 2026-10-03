import { Button } from '@roger.b/libui'
import { ArrowRight, Plus, Trash2 } from 'lucide-react'

export default function ButtonIcons() {
  return (
    <>
      <Button icon={<Plus />}>New project</Button>
      <Button iconRight={<ArrowRight />}>Continue</Button>
      <Button variant="ghost" size="icon" icon={<Trash2 />} aria-label="Delete the project" />
    </>
  )
}
