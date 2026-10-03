import { Hint, Toggle } from 'libui'
import { Bold, Italic, Underline } from 'lucide-react'

export default function ToggleIconOnly() {
  return (
    <div role="group" aria-label="Text format" className="flex items-center gap-0.5">
      <Hint label="Bold">
        <Toggle aria-label="Bold" defaultPressed>
          <Bold />
        </Toggle>
      </Hint>
      <Hint label="Italic">
        <Toggle aria-label="Italic">
          <Italic />
        </Toggle>
      </Hint>
      <Hint label="Underline">
        <Toggle aria-label="Underline">
          <Underline />
        </Toggle>
      </Hint>
    </div>
  )
}
