import { Checkbox, Label } from 'libui'

export default function CheckboxDescription() {
  return (
    <div className="flex max-w-sm items-start gap-2.5">
      <Checkbox id="weekly-report" aria-describedby="weekly-report-hint" className="mt-0.5" />
      <div className="flex flex-col gap-0.5">
        <Label htmlFor="weekly-report">Email me a weekly report</Label>
        <p id="weekly-report-hint" className="text-[13px] text-foreground-light">
          Each Monday, the report goes to all the admins of the workspace.
        </p>
      </div>
    </div>
  )
}
