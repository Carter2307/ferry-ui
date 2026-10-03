import { Checkbox, Label } from 'libui-kit'

export default function CheckboxStates() {
  return (
    <div className="flex flex-col gap-3">
      <Label>
        <Checkbox />
        Unchecked
      </Label>
      <Label>
        <Checkbox defaultChecked />
        Checked
      </Label>
      <Label>
        <Checkbox defaultChecked="indeterminate" />
        Indeterminate
      </Label>
      <Label>
        <Checkbox disabled />
        Disabled
      </Label>
      <Label>
        <Checkbox disabled defaultChecked />
        Disabled and checked
      </Label>
    </div>
  )
}
