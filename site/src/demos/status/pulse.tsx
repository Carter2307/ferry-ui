import * as React from 'react'
import { Button, StatusBadge } from 'libui'

export default function StatusPulse() {
  const [running, setRunning] = React.useState(true)

  return (
    <>
      {running ? (
        <StatusBadge tone="info" label="Running" pulse />
      ) : (
        <StatusBadge tone="neutral" label="Stopped" />
      )}
      <Button size="tiny" onClick={() => setRunning((value) => !value)}>
        {running ? 'Stop the import' : 'Start the import'}
      </Button>
    </>
  )
}
