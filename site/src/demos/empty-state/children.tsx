import { Button, CodeBlock, EmptyState, toast } from 'ferry-ui'
import { KeyRound, Plus } from 'lucide-react'

export default function EmptyStateChildren() {
  return (
    <EmptyState
      icon={<KeyRound />}
      title="No API keys yet"
      description="Your server uses an API key to call the API."
      actions={
        <Button variant="primary" icon={<Plus />} onClick={() => toast.success('API key created')}>
          New API key
        </Button>
      }
    >
      <div className="mt-2 flex w-full max-w-sm flex-col gap-2 text-left">
        <p className="text-[13px] text-foreground-lighter">Or use the command line:</p>
        <CodeBlock prompt code="acme keys create" what="command" />
      </div>
    </EmptyState>
  )
}
