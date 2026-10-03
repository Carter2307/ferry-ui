import { Button, Callout, toast } from 'libui-kit'
import { RefreshCw } from 'lucide-react'

export default function CalloutActions() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Callout
        tone="warning"
        title="A member changed this document"
        actions={
          <>
            <Button size="tiny" onClick={() => toast.success('Document loaded again')}>
              Discard my edits
            </Button>
            <Button size="tiny" variant="ghost" onClick={() => toast.info('Two versions to compare')}>
              Compare versions
            </Button>
          </>
        }
      >
        If you save now, your version replaces their version.
      </Callout>
      <Callout
        tone="destructive"
        title="The export failed"
        actionsPlacement="end"
        actions={
          <Button size="tiny" icon={<RefreshCw />} onClick={() => toast.success('Export started')}>
            Retry
          </Button>
        }
      >
        The billing service did not answer in time.
      </Callout>
    </div>
  )
}
