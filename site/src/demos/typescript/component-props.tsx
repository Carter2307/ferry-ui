import type { ComponentProps } from 'react'
import { Checkbox, Label } from '@roger.b/libui'

// Checkbox exports no prop type: read the props from the component.
type OptionProps = ComponentProps<typeof Checkbox> & {
  label: string
}

function Option({ label, ...props }: OptionProps) {
  return (
    <Label>
      <Checkbox {...props} />
      {label}
    </Label>
  )
}

export default function ComponentPropsType() {
  return (
    <div className="flex flex-col gap-3">
      <Option label="Send me the weekly digest" defaultChecked />
      <Option label="Send me each invoice" />
    </div>
  )
}
