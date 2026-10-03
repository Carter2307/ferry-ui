import * as React from 'react'
import { ToggleGroup, ToggleGroupItem } from 'libui'
import { Bold, Italic, Underline } from 'lucide-react'

export default function ToggleGroupMultiple() {
  const [formats, setFormats] = React.useState(['bold'])

  return (
    <div className="flex flex-col items-center gap-3">
      <ToggleGroup type="multiple" variant="outline" aria-label="Text format" value={formats} onValueChange={setFormats}>
        <ToggleGroupItem value="bold" aria-label="Bold">
          <Bold />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <Italic />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <Underline />
        </ToggleGroupItem>
      </ToggleGroup>
      <p className="font-mono text-xs text-foreground-lighter">value: {JSON.stringify(formats)}</p>
    </div>
  )
}
