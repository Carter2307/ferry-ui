import * as React from 'react'
import { ErrorState } from 'libui-kit'

export default function ErrorStateRetry() {
  const [retrying, setRetrying] = React.useState(false)

  function retry() {
    setRetrying(true)
    window.setTimeout(() => setRetrying(false), 1500)
  }

  return (
    <ErrorState
      title="Could not load invoices"
      error={new Error('The request timed out after 30 seconds.')}
      onRetry={retry}
      retrying={retrying}
    />
  )
}
