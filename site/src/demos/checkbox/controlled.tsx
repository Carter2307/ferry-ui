import * as React from 'react'
import { Checkbox, Label, Textarea } from 'libui'

export default function CheckboxControlled() {
  const [withNote, setWithNote] = React.useState(false)

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Label>
        <Checkbox checked={withNote} onCheckedChange={(checked) => setWithNote(checked === true)} />
        Add a note to the invoice
      </Label>
      {withNote && <Textarea aria-label="Note" placeholder="Thank you for your order." />}
    </div>
  )
}
