import { Button, Callout, Checkbox, ConfirmDialog, Label, toast } from 'libui-kit'

export default function ConfirmDialogChildren() {
  return (
    <ConfirmDialog
      trigger={<Button variant="destructive">Remove member</Button>}
      title="Remove Sam Lee from the team?"
      description="Sam loses access to all the projects of the team. You can invite Sam again later."
      confirmLabel="Remove member"
      onConfirm={() => {
        toast.success('Member removed')
      }}
    >
      <Callout tone="warning" size="sm" title="Sam owns 2 projects">
        <ul className="list-disc pl-4">
          <li>Billing portal</li>
          <li>Mobile app</li>
        </ul>
      </Callout>
      <Label className="text-[13px] font-normal">
        <Checkbox defaultChecked />
        Move these projects to my account
      </Label>
    </ConfirmDialog>
  )
}
