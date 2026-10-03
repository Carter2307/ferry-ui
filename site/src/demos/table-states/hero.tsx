import * as React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableErrorRow,
  TableHead,
  TableHeader,
  TableMessageRow,
  TableRow,
  TableSkeletonRows,
  ToggleGroup,
  ToggleGroupItem,
} from '@roger.b/libui'

const INVOICES = [
  { number: 'INV-2041', amount: '$1,250.00' },
  { number: 'INV-2042', amount: '$3,480.00' },
]
const ERROR = new Error('The request failed with status 502.')

export default function TableStatesHero() {
  const [state, setState] = React.useState('loading') // In an app, the request that loads the rows gives the state.
  return (
    <div className="flex flex-col gap-3">
      <ToggleGroup
        type="single"
        variant="outline"
        aria-label="State of the table"
        value={state}
        onValueChange={(next) => next && setState(next)}
      >
        <ToggleGroupItem value="loading">Loading</ToggleGroupItem>
        <ToggleGroupItem value="error">Error</ToggleGroupItem>
        <ToggleGroupItem value="empty">Empty</ToggleGroupItem>
        <ToggleGroupItem value="data">Data</ToggleGroupItem>
      </ToggleGroup>
      <Table aria-label="Invoices">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Invoice</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody aria-busy={state === 'loading'}>
          {state === 'loading' && <TableSkeletonRows columns={2} rows={2} />}
          {state === 'error' && <TableErrorRow colSpan={2} error={ERROR} onRetry={() => setState('loading')} />}
          {state === 'empty' && <TableMessageRow colSpan={2}>No invoices yet.</TableMessageRow>}
          {state === 'data' &&
            INVOICES.map((invoice) => (
              <TableRow key={invoice.number}>
                <TableCell className="font-mono text-[13px]">{invoice.number}</TableCell>
                <TableCell className="text-right tabular">{invoice.amount}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}
