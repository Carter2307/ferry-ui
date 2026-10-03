import { Callout } from 'libui-kit'

export default function CalloutTones() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Callout tone="info" title="Two-factor authentication is off">
        Members can sign in with a password only.
      </Callout>
      <Callout tone="warning" title="Your trial ends in 3 days">
        Add a payment method to keep access to your projects.
      </Callout>
      <Callout tone="destructive" title="The last payment failed">
        The bank declined the card. Update the payment method.
      </Callout>
      <Callout tone="success" title="Your domain is verified">
        Emails from your domain now have a signature.
      </Callout>
      <Callout tone="neutral" title="Invoices go out each month">
        The billing email gets them on the first day of the month.
      </Callout>
    </div>
  )
}
