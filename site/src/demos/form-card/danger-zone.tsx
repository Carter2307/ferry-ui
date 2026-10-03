import { ActionRow, Button, ConfirmDialog, FormCard, toast } from 'ferry-ui'

export default function FormCardDangerZone() {
  return (
    <FormCard
      asDiv
      tone="destructive"
      className="mx-auto w-full max-w-2xl"
      title="Danger zone"
      description="Actions that freeze or remove this project."
    >
      <ActionRow
        title="Archive project"
        description="The project becomes read-only. You can restore it later."
        action={<Button onClick={() => toast.success('Project archived')}>Archive project</Button>}
      />
      <ActionRow
        title="Delete project"
        description="This deletes the project, its invoices and its API keys. You cannot undo this."
        action={
          <ConfirmDialog
            trigger={<Button variant="destructive">Delete project</Button>}
            title="Delete project “Billing portal”?"
            description="The invoices and the API keys of this project go with it. You cannot undo this."
            confirmLabel="Delete project"
            onConfirm={() => {
              toast.success('Project deleted')
            }}
          />
        }
      />
    </FormCard>
  )
}
