import { Label, Switch } from '@roger.b/libui'

export default function SwitchDisabled() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="single-sign-on" disabled />
        <Label htmlFor="single-sign-on">Require single sign-on</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="audit-log" disabled defaultChecked />
        <Label htmlFor="audit-log">Keep an audit log</Label>
      </div>
    </div>
  )
}
