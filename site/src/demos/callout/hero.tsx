import { Button, Callout, toast } from 'ferry-ui'

export default function CalloutHero() {
  return (
    <Callout
      tone="warning"
      title="Your trial ends in 3 days"
      actionsPlacement="end"
      actions={
        <Button size="tiny" onClick={() => toast.success('Payment method added')}>
          Add payment method
        </Button>
      }
      className="w-full max-w-xl"
    >
      Add a payment method to keep access to your projects.
    </Callout>
  )
}
