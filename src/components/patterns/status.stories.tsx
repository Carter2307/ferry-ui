import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { CreditCard, Link2, Lock, Pause, ShieldAlert } from 'lucide-react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'

import { cn } from '../../lib/utils'
import { Hint } from '../primitives/tooltip'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../primitives/table'

import { STATUS_TONES, StatusBadge, StatusDot, StatusLine, statusBadgeVariants, type StatusTone } from './status'

const meta = {
  title: 'Patterns/Status',
  component: StatusBadge,
  subcomponents: { StatusDot, StatusLine },
  parameters: {
    docs: {
      description: {
        component:
          'Three tone-driven status indicators sharing one `StatusTone` scale (`success`, `warning`, `destructive`, `info`, `neutral`): `StatusBadge` (uppercase pill with a dot) for tables and headers, `StatusDot` for the smallest cue next to a name, and `StatusLine` (circled icon + sentence) for card footers. Map your domain statuses to a tone once; use `pulse` / `spin` only while something is actually in progress. For static tags or counts use `Badge`.',
      },
    },
  },
  args: {
    tone: 'success',
    label: 'Active',
    pulse: false,
    size: 'md',
  },
  argTypes: {
    tone: { control: 'select', options: [...STATUS_TONES] },
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    label: { control: 'text' },
    dot: { control: 'boolean' },
    icon: { control: false },
  },
} satisfies Meta<typeof StatusBadge>

export default meta
type Story = StoryObj<typeof meta>

const TONE_LABELS: Record<StatusTone, string> = {
  success: 'Active',
  warning: 'Past due',
  destructive: 'Failed',
  info: 'Syncing',
  neutral: 'Paused',
}

export const Default: Story = {}

/** One badge per tone. */
export const Tones: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {STATUS_TONES.map((tone) => (
        <StatusBadge key={tone} {...args} tone={tone} label={TONE_LABELS[tone]} />
      ))}
    </div>
  ),
}

/** `pulse` animates the dot for live or in-progress states. */
export const Pulse: Story = {
  args: { tone: 'info', label: 'Processing', pulse: true },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <StatusBadge {...args} size="md" />
      <StatusBadge {...args} size="sm" />
    </div>
  ),
}

/** An `icon` replaces the dot by default; force both with `dot`. */
export const WithIcon: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <StatusBadge {...args} tone="destructive" icon={<ShieldAlert />} label="Blocked" />
      <StatusBadge {...args} tone="neutral" icon={<Lock />} label="Private" />
      <StatusBadge {...args} tone="warning" icon={<CreditCard />} label="Card expiring" dot />
    </div>
  ),
}

export const WithoutDot: Story = {
  args: { tone: 'neutral', label: 'Draft', dot: false },
}

/** Labels never wrap: keep them to 1–3 words and put details in a tooltip. */
export const LongLabel: Story = {
  args: { tone: 'destructive', label: 'Payment failed · retry 3 of 3', title: 'The card was declined three times.' },
}

/** Wrap in a focusable element with a `Hint` when the state needs an explanation. */
export const WithTooltip: Story = {
  render: (args) => (
    <Hint label="Invoice INV-2041 was due on Sep 12.">
      <button type="button" className="w-fit cursor-help rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <StatusBadge {...args} tone="warning" label="Overdue" />
      </button>
    </Hint>
  ),
  play: async ({ canvasElement }) => {
    // Keyboard focus opens the tooltip (portaled into document.body).
    within(canvasElement).getByRole('button', { name: 'Overdue' }).focus()
    await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent('Invoice INV-2041 was due on Sep 12.'))
  },
}

/** `StatusDot` driven by the `tone`, `pulse` and `label` controls (the label is the text next to it). */
export const Dot: Story = {
  args: { tone: 'success', pulse: true, label: 'Live updates on' },
  render: (args) => (
    <span className="inline-flex items-center gap-2 text-[13px] text-foreground-light">
      <StatusDot tone={args.tone} pulse={args.pulse} />
      {args.label}
    </span>
  ),
}

/** `StatusDot`: 6px dot, optionally pulsing. Give it a `label` when it is the only cue. */
export const Dots: Story = {
  render: () => (
    <div className="flex flex-col gap-3 text-[13px] text-foreground-light">
      <div className="flex flex-wrap items-center gap-4">
        {STATUS_TONES.map((tone) => (
          <span key={tone} className="inline-flex items-center gap-2">
            <StatusDot tone={tone} />
            {TONE_LABELS[tone]}
          </span>
        ))}
      </div>
      <span className="inline-flex items-center gap-2">
        <StatusDot tone="success" pulse />
        Live updates on
      </span>
      <span className="inline-flex items-center gap-2">
        <StatusDot tone="destructive" label="Offline" /> <span className="font-mono text-[12.5px]">orders-webhook</span>
      </span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('img', { name: 'Offline' })).toBeInTheDocument()
  },
}

/** `StatusLine` driven by the `tone` and `label` controls; the `pulse` control toggles its `spin` prop here. */
export const Line: Story = {
  args: { tone: 'info', pulse: false, label: 'Billing details under review' },
  render: (args) => (
    <div className="max-w-xs">
      <StatusLine tone={args.tone} spin={args.pulse}>
        {args.label}
      </StatusLine>
    </div>
  ),
}

/** `StatusLine`: circled icon + sentence, one per tone, plus in-progress (`spin`) and custom icons. */
export const Lines: Story = {
  render: () => (
    <div className="flex max-w-xs flex-col gap-3">
      <StatusLine tone="success">Workspace is active</StatusLine>
      <StatusLine tone="warning">Usage above 90% of plan</StatusLine>
      <StatusLine tone="destructive">Payment failed</StatusLine>
      <StatusLine tone="info">Billing details under review</StatusLine>
      <StatusLine tone="neutral">Not connected yet</StatusLine>
      <StatusLine tone="info" spin>
        Syncing contacts…
      </StatusLine>
      <StatusLine tone="neutral" icon={<Pause />}>
        Subscription is paused
      </StatusLine>
      <StatusLine icon={<Link2 />} iconClassName="border-primary/40 text-primary">
        3 linked integrations
      </StatusLine>
      <StatusLine tone="warning">
        A very long status sentence that does not fit in the available width gets truncated
      </StatusLine>
    </div>
  ),
}

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'refunded' | 'failed'

const ORDER_STATUS: Record<OrderStatus, { tone: StatusTone; pulse?: boolean; label: string }> = {
  pending: { tone: 'neutral', pulse: true, label: 'Pending' },
  processing: { tone: 'info', pulse: true, label: 'Processing' },
  shipped: { tone: 'info', label: 'Shipped' },
  delivered: { tone: 'success', label: 'Delivered' },
  refunded: { tone: 'warning', label: 'Refunded' },
  failed: { tone: 'destructive', label: 'Payment failed' },
}

const ORDERS: { id: string; customer: string; total: string; status: OrderStatus }[] = [
  { id: 'ORD-1042', customer: 'Northwind Traders', total: '$1,240.00', status: 'delivered' },
  { id: 'ORD-1043', customer: 'Globex Corporation', total: '$89.90', status: 'processing' },
  { id: 'ORD-1044', customer: 'Initech', total: '$412.50', status: 'shipped' },
  { id: 'ORD-1045', customer: 'Umbrella Group', total: '$2,030.00', status: 'failed' },
  { id: 'ORD-1046', customer: 'Stark Industries', total: '$64.00', status: 'refunded' },
  { id: 'ORD-1047', customer: 'Wayne Enterprises', total: '$318.75', status: 'pending' },
]

/** Realistic use: a domain status map (`ORDER_STATUS`) drives the badge in a table. */
export const OrdersTable: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ORDERS.map((order) => {
          const status = ORDER_STATUS[order.status]
          return (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-[12.5px]">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>
                <StatusBadge tone={status.tone} pulse={status.pulse} label={status.label} />
              </TableCell>
              <TableCell className="text-right tabular">{order.total}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Payment failed').closest('[data-slot="status-badge"]')).toHaveAttribute(
      'data-tone',
      'destructive',
    )
  },
}

/** Realistic use: a small title bar with a live indicator and a compact badge. */
export const InHeader: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-surface-100 px-4 py-3">
      <div className="flex items-center gap-2">
        <h2 className="text-[15px] font-medium text-foreground">Q3 invoice run</h2>
        <StatusBadge tone="info" pulse size="sm" label="Running" />
      </div>
      <span className="inline-flex items-center gap-2 text-[13px] text-foreground-lighter">
        <StatusDot tone="success" pulse />
        Live
      </span>
    </div>
  ),
}

const INVOICE_FILTERS: { tone: StatusTone; label: string }[] = [
  { tone: 'success', label: 'Paid' },
  { tone: 'warning', label: 'Overdue' },
  { tone: 'destructive', label: 'Failed' },
  { tone: 'neutral', label: 'Draft' },
]

function InvoiceStatusFilter() {
  const [active, setActive] = useState<StatusTone | null>(null)
  return (
    <div role="group" aria-label="Filter invoices by status" className="flex flex-wrap items-center gap-2">
      {INVOICE_FILTERS.map(({ tone, label }) => {
        const pressed = active === tone
        return (
          <button
            key={tone}
            type="button"
            aria-pressed={pressed}
            onClick={() => setActive(pressed ? null : tone)}
            className={cn(
              statusBadgeVariants({ tone: pressed ? tone : 'neutral' }),
              'cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring',
            )}
          >
            <StatusDot tone={tone} />
            {label}
          </button>
        )
      })}
    </div>
  )
}

/**
 * `statusBadgeVariants` gives another element the badge look. Here: toggle buttons that filter a
 * list by status (grey until pressed, then tinted with their tone).
 */
export const VariantsOnOtherElements: Story = {
  render: () => <InvoiceStatusFilter />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const overdue = canvas.getByRole('button', { name: 'Overdue' })
    await expect(overdue).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(overdue)
    await expect(overdue).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(canvas.getByRole('button', { name: 'Paid' }))
    await expect(overdue).toHaveAttribute('aria-pressed', 'false')
    await expect(canvas.getByRole('button', { name: 'Paid' })).toHaveAttribute('aria-pressed', 'true')
  },
}
