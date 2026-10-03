import * as React from 'react'
import { Button, Callout, getErrorMessage } from '@roger.b/libui'

// A request that fails, for the example.
function saveInvoice(): Promise<void> {
  return Promise.reject(new Error('The invoice INV-2041 is already paid.'))
}

export default function GetErrorMessageHero() {
  const [message, setMessage] = React.useState<string>()

  const save = async () => {
    setMessage(undefined)
    try {
      await saveInvoice()
    } catch (err) {
      // `err` is `unknown`: the helper gives a message that the user can read.
      setMessage(getErrorMessage(err))
    }
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-start gap-3">
      <Button onClick={() => void save()}>Save invoice</Button>
      {message && (
        <Callout tone="destructive" size="sm" className="w-full">
          {message}
        </Callout>
      )}
    </div>
  )
}
