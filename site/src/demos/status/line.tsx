import { StatusLine } from '@roger.b/libui'
import { Pause } from 'lucide-react'

export default function StatusLines() {
  return (
    <div className="flex flex-col gap-3">
      <StatusLine tone="success">Workspace is active</StatusLine>
      <StatusLine tone="warning">Usage is above 90% of the plan</StatusLine>
      <StatusLine tone="destructive">Payment failed</StatusLine>
      <StatusLine tone="info" spin>
        Import of contacts in progress
      </StatusLine>
      <StatusLine tone="neutral" icon={<Pause />}>
        Subscription is on hold
      </StatusLine>
    </div>
  )
}
