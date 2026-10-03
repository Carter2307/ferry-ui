import { Callout } from '@roger.b/libui'

export default function CalloutSizes() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Callout tone="warning" title="This invoice is overdue">
        The customer gets a reminder every 7 days.
      </Callout>
      <Callout tone="warning" size="sm" title="This invoice is overdue">
        The customer gets a reminder every 7 days.
      </Callout>
      <Callout tone="warning" size="sm">
        This invoice is overdue.
      </Callout>
    </div>
  )
}
