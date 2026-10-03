import { Toggle } from 'libui-kit'
import { Star } from 'lucide-react'

export default function ToggleVariants() {
  return (
    <>
      <Toggle>
        <Star /> Default
      </Toggle>
      <Toggle defaultPressed>
        <Star /> Default, pressed
      </Toggle>
      <Toggle variant="outline">
        <Star /> Outline
      </Toggle>
      <Toggle variant="outline" defaultPressed>
        <Star /> Outline, pressed
      </Toggle>
    </>
  )
}
