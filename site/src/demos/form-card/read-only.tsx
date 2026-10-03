import { CopyField, FormCard, FormRow, SecretField, StatusBadge } from 'libui-kit'

export default function FormCardReadOnly() {
  return (
    <FormCard
      asDiv
      className="mx-auto w-full max-w-2xl"
      title="API access"
      description="Use these values to call the API from your server."
      headerActions={<StatusBadge tone="success" label="Active" size="sm" />}
    >
      <FormRow label="Project ID" htmlFor="api-project-id">
        <CopyField value="prj_7Hq2kLx9Vd3mN4" what="project ID" />
      </FormRow>
      <FormRow label="Secret key" description="Keep this key on the server." htmlFor="api-secret-key">
        <SecretField value="sk_demo_4f9a2c7e1b8d3f6a" what="secret key" />
      </FormRow>
      <FormRow label="Plan">
        <span className="text-sm text-foreground">Pro</span>
      </FormRow>
    </FormCard>
  )
}
