import * as React from 'react'
import { Checkbox, Label, cn } from '@roger.b/libui'

export default function CnHero() {
  const [selected, setSelected] = React.useState(true)
  return (
    <>
      <div
        className={cn(
          'rounded-lg border bg-surface-100 px-4 py-3 text-sm text-foreground-light',
          // A conditional class. When the condition is false, cn() ignores the value.
          selected && 'border-primary-bright bg-primary-soft text-foreground',
        )}
      >
        Customer portal
      </div>
      <Label>
        <Checkbox checked={selected} onCheckedChange={(checked) => setSelected(checked === true)} />
        Selected
      </Label>
    </>
  )
}
