import { ActionRow, Button, FormCard, FormRow, Switch, toast } from '@roger.b/libui'
import { Download, LogOut } from 'lucide-react'

export default function FormCardActionRows() {
  return (
    <FormCard asDiv className="mx-auto w-full max-w-2xl" title="Security" description="The sessions and the data of your account.">
      <FormRow
        label="Two-factor authentication"
        description="The app asks for a code when you sign in."
        htmlFor="security-two-factor"
      >
        <Switch defaultChecked />
      </FormRow>
      <ActionRow
        title="Sign out everywhere"
        description="This stops each session but this one."
        action={
          <Button icon={<LogOut />} onClick={() => toast.success('Other sessions signed out')}>
            Sign out other sessions
          </Button>
        }
      />
      <ActionRow
        title="Export your data"
        description="You get a file with your projects and your invoices."
        action={
          <Button icon={<Download />} onClick={() => toast.success('Export requested')}>
            Request export
          </Button>
        }
      />
    </FormCard>
  )
}
