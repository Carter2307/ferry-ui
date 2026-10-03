import { ErrorState } from '@roger.b/libui'

export default function ErrorStateDescription() {
  return (
    <ErrorState
      title="You do not have access to billing"
      error={new Error('403 billing_admin_required')}
      description="Only a billing admin can see the invoices. Ask the owner of the workspace for this role."
    />
  )
}
