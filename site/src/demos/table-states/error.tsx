import * as React from 'react'
import { Table, TableBody, TableErrorRow, TableHead, TableHeader, TableRow } from 'libui-kit'

const ERROR = new Error('Could not reach the orders service.')

export default function TableStatesError() {
  const [retrying, setRetrying] = React.useState(false)

  // In an app, `onRetry` starts the request again.
  function retry() {
    setRetrying(true)
    window.setTimeout(() => setRetrying(false), 1500)
  }

  return (
    <Table aria-label="Orders">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Order</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableErrorRow colSpan={3} error={ERROR} onRetry={retry} retrying={retrying} />
      </TableBody>
    </Table>
  )
}
