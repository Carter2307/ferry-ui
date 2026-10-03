import { Button, useCopy } from '@roger.b/libui'
import { Check, Link2 } from 'lucide-react'

export default function UseCopyHero() {
  const [copied, copy] = useCopy()
  return (
    <Button icon={copied ? <Check /> : <Link2 />} onClick={() => void copy('https://example.com/invite/8f3a2c91')}>
      {copied ? 'Link copied' : 'Copy invite link'}
    </Button>
  )
}
