import { Button, useCopy } from 'libui-kit'
import { Check, Copy } from 'lucide-react'

export default function UseCopyTimeout() {
  // `copied` stays true for 4 seconds, not for 1.5 seconds.
  const [copied, copy] = useCopy({ timeout: 4000 })
  return (
    <div className="flex items-center gap-3">
      <code className="font-mono text-[13px] text-foreground">ord_2041_7c9e</code>
      <Button size="tiny" icon={copied ? <Check /> : <Copy />} onClick={() => void copy('ord_2041_7c9e')}>
        {copied ? 'Copied' : 'Copy order ID'}
      </Button>
    </div>
  )
}
