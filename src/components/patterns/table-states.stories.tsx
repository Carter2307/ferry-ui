import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { X } from 'lucide-react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Badge, type BadgeProps } from '../primitives/badge'
import { Button } from '../primitives/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../primitives/table'
import { ToggleGroup, ToggleGroupItem } from '../primitives/toggle-group'

import {
  TableErrorRow,
  TableMessageRow,
  TableSkeletonRows,
  type TableErrorRowProps,
  type TableMessageRowProps,
  type TableSkeletonRowsProps,
} from './table-states'

/**
 * TableSkeletonRows props, plus the TableMessageRow / TableErrorRow props (so their stories have working
 * controls; `columns` doubles as `colSpan`) and a story-only callback.
 */
type TableStatesStoryArgs = TableSkeletonRowsProps &
  Partial<Pick<TableErrorRowProps, 'error' | 'onRetry' | 'retrying' | 'retryLabel'>> &
  Partial<Pick<TableMessageRowProps, 'tone'>> & {
    /** Story-only: text of the `TableMessageRow`. */
    message?: string
    /** Story-only: wired to the action buttons of the interactive stories. */
    onAction?: () => void
  }

const hidden = { table: { disable: true } } as const
const shown = { table: { disable: false } } as const

const columnLabels = ['Invoice', 'Customer', 'Status', 'Issued', 'Method']

/** Real table + header around the state rows, as in an app. */
function InvoiceTable({ columns = 4, busy, children }: { columns?: number; busy?: boolean; children: React.ReactNode }) {
  return (
    <Table aria-label="Invoices">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {Array.from({ length: columns }, (_, i) => (
            <TableHead key={i} className={i === columns - 1 ? 'text-right' : undefined}>
              {i === columns - 1 ? 'Amount' : (columnLabels[i] ?? `Column ${i + 1}`)}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody aria-busy={busy || undefined}>{children}</TableBody>
    </Table>
  )
}

const meta = {
  title: 'Patterns/Table States',
  component: TableSkeletonRows,
  subcomponents: { TableMessageRow, TableErrorRow },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'State rows for the `Table` primitive, rendered inside `<TableBody>` so the header stays visible: `TableSkeletonRows` while the first load runs (set `aria-busy` on the body), `TableMessageRow` when there are no rows (or none match the filters), `TableErrorRow` when the load failed (message + optional Retry). Pass the table\'s column count as `columns` / `colSpan`.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl">
        <Story />
      </div>
    ),
  ],
  args: {
    columns: 4,
    rows: 4,
    onRetry: fn(),
    onAction: fn(),
  },
  argTypes: {
    columns: { control: { type: 'range', min: 1, max: 6, step: 1 } },
    rows: { control: { type: 'range', min: 1, max: 10, step: 1 } },
    className: { control: false },
    onAction: { control: false },
    // Row-specific: shown in the TableMessageRow / TableErrorRow stories below.
    message: hidden,
    tone: hidden,
    error: hidden,
    onRetry: hidden,
    retrying: hidden,
    retryLabel: hidden,
  },
  render: ({ columns, rows, className }) => (
    <InvoiceTable columns={columns} busy>
      <TableSkeletonRows columns={columns} rows={rows} className={className} />
    </InvoiceTable>
  ),
} satisfies Meta<TableStatesStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

/** `TableSkeletonRows`: first load. Wide bar in the first column, narrow in the last. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('row')).toHaveLength(5)
    await expect(canvasElement.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(16)
  },
}

/** More columns and rows (match the expected page size, capped to a handful). */
export const LoadingWide: Story = {
  args: { columns: 6, rows: 8 },
}

/** `TableMessageRow`: no rows yet. Its controls (`message`, `tone`, `columns` as `colSpan`) drive this story. */
export const Empty: Story = {
  args: { message: 'No invoices yet. They appear here once you bill a customer.', tone: 'neutral' },
  argTypes: {
    rows: hidden,
    message: { control: 'text', ...shown },
    tone: { control: 'inline-radio', options: ['neutral', 'destructive'], ...shown },
  },
  render: ({ columns, message, tone, className }) => (
    <InvoiceTable columns={columns}>
      <TableMessageRow colSpan={columns} tone={tone} className={className}>
        {message}
      </TableMessageRow>
    </InvoiceTable>
  ),
  play: async ({ canvasElement }) => {
    const cell = within(canvasElement).getByText('No invoices yet. They appear here once you bill a customer.')
    await expect(cell).toHaveAttribute('colspan', '4')
  },
}

/** `tone="destructive"` for a short failure message you word yourself (prefer `TableErrorRow` for thrown errors). */
export const MessageDestructive: Story = {
  ...Empty,
  args: { message: 'Invoices are unavailable while billing is under maintenance.', tone: 'destructive' },
  play: undefined,
}

/** No row matches the filters: say so and offer a way out. */
export const NoMatches: Story = {
  render: ({ onAction }) => (
    <InvoiceTable>
      <TableMessageRow colSpan={4}>
        <div className="flex flex-col items-center gap-2">
          <span>No invoices match “northwind”.</span>
          <Button size="tiny" icon={<X />} onClick={onAction}>
            Clear filters
          </Button>
        </div>
      </TableMessageRow>
    </InvoiceTable>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Clear filters' }))
    await expect(args.onAction).toHaveBeenCalledOnce()
  },
}

/** Controls for the TableErrorRow stories. */
const errorRowStory = {
  argTypes: {
    rows: hidden,
    error: { control: 'text', ...shown },
    onRetry: { control: false, ...shown },
    retrying: { control: 'boolean', ...shown },
    retryLabel: { control: 'text', ...shown },
  },
  render: ({ columns, error, onRetry, retrying, retryLabel, className }: TableStatesStoryArgs) => (
    <InvoiceTable columns={columns}>
      <TableErrorRow
        colSpan={columns}
        error={error}
        onRetry={onRetry}
        retrying={retrying}
        retryLabel={retryLabel}
        className={className}
      />
    </InvoiceTable>
  ),
} satisfies Story

/** `TableErrorRow`: the load failed. The message comes from the error and is announced as an alert. */
export const ErrorRow: Story = {
  ...errorRowStory,
  args: { error: new Error('Could not reach the billing service (timeout after 30 s).'), onRetry: undefined },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toHaveTextContent('Could not reach the billing service')
    await expect(within(canvasElement).queryByRole('button')).not.toBeInTheDocument()
  },
}

/** With `onRetry`, a small Retry button sits under the message. Its controls drive this story. */
export const ErrorWithRetry: Story = {
  ...errorRowStory,
  args: { error: 'Could not reach the billing service.', retrying: false, retryLabel: 'Retry' },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Retry' }))
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}

/** `retrying` spins and disables Retry while the new attempt runs. */
export const ErrorRetrying: Story = {
  ...errorRowStory,
  args: { ...ErrorWithRetry.args, retrying: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Retry' })).toBeDisabled()
  },
}

/** Long messages wrap inside the full-width cell instead of widening the table. */
export const LongMessage: Story = {
  render: () => (
    <InvoiceTable>
      <TableMessageRow colSpan={4}>
        No invoices were issued between January 1 and March 31, 2026 for customers on the Enterprise plan in the
        Europe region with a pending or overdue status. Widen the date range or remove some filters to see more
        results.
      </TableMessageRow>
    </InvoiceTable>
  ),
}

/**
 * Extra props reach the `<tr>`: `id`, `data-*`, `aria-*` (and `ref`) on `TableMessageRow` and
 * `TableErrorRow`, `data-*` / `aria-*` on every row of `TableSkeletonRows`. `className` stays on the
 * full-width cell (here `h-32` for a taller empty area).
 */
export const RowAttributes: Story = {
  argTypes: { rows: hidden },
  render: ({ columns }) => (
    <InvoiceTable columns={columns}>
      <TableMessageRow colSpan={columns} id="invoices-empty" data-testid="invoices-empty-row" className="h-32">
        No invoices yet.
      </TableMessageRow>
    </InvoiceTable>
  ),
  play: async ({ canvasElement }) => {
    const row = within(canvasElement).getByTestId('invoices-empty-row')
    await expect(row.tagName).toBe('TR')
    await expect(row).toHaveAttribute('id', 'invoices-empty')
    await expect(row).toHaveAttribute('data-slot', 'table-message-row')
    await expect(within(row).getByRole('cell')).toHaveClass('h-32')
  },
}

/* ---------------------------------------------------------------------------------------------- */
/* Composition                                                                                     */
/* ---------------------------------------------------------------------------------------------- */

type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue'
const statusVariant: Record<InvoiceStatus, BadgeProps['variant']> = {
  Paid: 'success',
  Pending: 'warning',
  Overdue: 'destructive',
}

const invoices: { id: string; customer: string; status: InvoiceStatus; amount: string }[] = [
  { id: 'INV-2041', customer: 'Northwind Traders', status: 'Paid', amount: '$1,250.00' },
  { id: 'INV-2042', customer: 'Acme Corporation', status: 'Pending', amount: '$3,480.00' },
  { id: 'INV-2043', customer: 'Globex', status: 'Overdue', amount: '$920.50' },
]

type LoadState = 'loading' | 'error' | 'empty' | 'data'

function InvoicesWithStates({ onRetry }: { onRetry?: () => void }) {
  const [state, setState] = React.useState<LoadState>('loading')
  return (
    <div className="flex flex-col gap-3">
      <ToggleGroup
        type="single"
        variant="outline"
        size="tiny"
        aria-label="Table state"
        value={state}
        onValueChange={(value) => value && setState(value as LoadState)}
        className="self-start"
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
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody aria-busy={state === 'loading' || undefined}>
          {state === 'loading' ? (
            <TableSkeletonRows columns={4} rows={3} />
          ) : state === 'error' ? (
            <TableErrorRow colSpan={4} error={new Error('Request failed with status 502.')} onRetry={onRetry} />
          ) : state === 'empty' ? (
            <TableMessageRow colSpan={4}>No invoices yet.</TableMessageRow>
          ) : (
            invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-mono text-[13px]">{invoice.id}</TableCell>
                <TableCell>{invoice.customer}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[invoice.status]}>{invoice.status}</Badge>
                </TableCell>
                <TableCell className="tabular text-right">{invoice.amount}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

/** One table body switching between the four states of a data fetch. */
export const AllStates: Story = {
  render: ({ onRetry }) => <InvoicesWithStates onRetry={onRetry} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('radio', { name: 'Error' }))
    await expect(canvas.getByRole('alert')).toHaveTextContent('Request failed with status 502.')
    await userEvent.click(canvas.getByRole('button', { name: 'Retry' }))
    await expect(args.onRetry).toHaveBeenCalledOnce()
    await userEvent.click(canvas.getByRole('radio', { name: 'Empty' }))
    await expect(canvas.getByText('No invoices yet.')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('radio', { name: 'Data' }))
    await expect(canvas.getByText('Northwind Traders')).toBeInTheDocument()
  },
}
