import * as React from 'react'
import { Kbd, Textarea, toast, useModKey } from '@roger.b/libui'

export default function KbdHandler() {
  const mod = useModKey()
  const [message, setMessage] = React.useState('The invoice is ready.')

  // Kbd only shows the keys. This handler does the work.
  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      toast.success('Message sent')
      setMessage('')
    }
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Textarea
        aria-label="Message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={onKeyDown}
      />
      <p className="text-[13px] text-foreground-lighter">
        <Kbd>{mod}</Kbd> <Kbd>↵</Kbd> sends the message
      </p>
    </div>
  )
}
