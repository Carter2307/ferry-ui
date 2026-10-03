import { Callout } from 'libui-kit'
import { ShieldCheck } from 'lucide-react'

export default function CalloutIcon() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Callout tone="success" icon={<ShieldCheck />} title="Single sign-on is on">
        Members sign in through your identity provider.
      </Callout>
      <Callout tone="info" icon={false}>
        Invoices use the currency of the project.
      </Callout>
    </div>
  )
}
