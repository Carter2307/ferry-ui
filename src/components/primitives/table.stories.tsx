import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChevronRight, EllipsisVertical, KeyRound, Plus, RotateCw } from 'lucide-react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { cn } from '../../lib/utils'
import { rowLinkProps } from '../patterns/table-utils'
import { Avatar, AvatarFallback } from './avatar'
import { Badge, type BadgeProps } from './badge'
import { Button } from './button'
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from './card'
import { Checkbox } from './checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { Skeleton } from './skeleton'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './table'

/** Table props plus story-only callbacks (stripped before reaching <Table>). */
type TableStoryArgs = React.ComponentProps<typeof Table> & {
  onRowOpen?: (id: string) => void
  onRowAction?: (action: string, id: string) => void
  onRetry?: () => void
}

type Tone = NonNullable<BadgeProps['variant']>

// ---------------------------------------------------------------------------
// Example data (generic SaaS)
// ---------------------------------------------------------------------------

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue' | 'Draft'
const invoiceTone: Record<InvoiceStatus, Tone> = {
  Paid: 'success',
  Pending: 'warning',
  Overdue: 'destructive',
  Draft: 'default',
}

const invoices: { id: string; customer: string; status: InvoiceStatus; method: string; issued: string; amount: number }[] = [
  { id: 'INV-2041', customer: 'Northwind Traders', status: 'Paid', method: 'Card', issued: 'Sep 12, 2026', amount: 1250 },
  { id: 'INV-2042', customer: 'Acme Corporation', status: 'Pending', method: 'Bank transfer', issued: 'Sep 14, 2026', amount: 3480 },
  { id: 'INV-2043', customer: 'Globex', status: 'Overdue', method: 'Card', issued: 'Aug 28, 2026', amount: 920.5 },
  { id: 'INV-2044', customer: 'Initech', status: 'Paid', method: 'PayPal', issued: 'Sep 18, 2026', amount: 415 },
  { id: 'INV-2045', customer: 'Umbrella Labs', status: 'Draft', method: '—', issued: 'Sep 21, 2026', amount: 2100 },
]

type MemberStatus = 'Active' | 'Invited' | 'Suspended'
const memberTone: Record<MemberStatus, Tone> = { Active: 'success', Invited: 'info', Suspended: 'destructive' }

const members: { id: string; name: string; email: string; role: string; status: MemberStatus; lastActive: string }[] = [
  { id: 'u1', name: 'Maya Chen', email: 'maya@northwind.io', role: 'Owner', status: 'Active', lastActive: '2 min ago' },
  { id: 'u2', name: 'Jonas Weber', email: 'jonas@northwind.io', role: 'Admin', status: 'Active', lastActive: '1 hour ago' },
  { id: 'u3', name: 'Priya Patel', email: 'priya@northwind.io', role: 'Member', status: 'Invited', lastActive: 'Never' },
  { id: 'u4', name: 'Lucas Martin', email: 'lucas@northwind.io', role: 'Viewer', status: 'Suspended', lastActive: '3 weeks ago' },
]

type ProjectStatus = 'Active' | 'Paused' | 'Archived'
const projectTone: Record<ProjectStatus, Tone> = { Active: 'success', Paused: 'warning', Archived: 'default' }

const projects: { id: string; name: string; description: string; owner: string; status: ProjectStatus; updated: string }[] = [
  {
    id: 'atlas',
    name: 'Atlas',
    description: 'Customer onboarding flow redesign with guided setup, sample data and progress tracking',
    owner: 'Maya Chen',
    status: 'Active',
    updated: '5 min ago',
  },
  {
    id: 'beacon',
    name: 'Beacon',
    description: 'Usage-based billing and invoicing',
    owner: 'Jonas Weber',
    status: 'Paused',
    updated: 'Yesterday',
  },
  {
    id: 'compass',
    name: 'Compass',
    description: 'Internal analytics dashboards for the sales and support teams',
    owner: 'Priya Patel',
    status: 'Archived',
    updated: 'Aug 2, 2026',
  },
]

const apiKeys = [
  { id: 'k1', name: 'Production backend', prefix: 'key_4f2a', scope: 'Read / write', created: 'Jan 8, 2026', lastUsed: 'Just now' },
  { id: 'k2', name: 'Analytics export', prefix: 'key_9c1e', scope: 'Read only', created: 'Mar 22, 2026', lastUsed: '3 hours ago' },
  { id: 'k3', name: 'Staging', prefix: 'key_07bd', scope: 'Read / write', created: 'May 3, 2026', lastUsed: '2 days ago' },
  { id: 'k4', name: 'CRM sync', prefix: 'key_e55a', scope: 'Webhooks', created: 'Jul 19, 2026', lastUsed: 'Never' },
]

const orders = [
  {
    id: 'ORD-10482',
    placed: '2026-09-29 14:02',
    customer: 'Harper Collins',
    email: 'harper.collins@example.com',
    items: 'Ergonomic desk chair, Standing desk frame (oak top), Cable management kit, Monitor arm',
    channel: 'Web',
    country: 'US',
    qty: 4,
    total: 1289.96,
    status: 'Shipped' as const,
  },
  {
    id: 'ORD-10483',
    placed: '2026-09-29 14:17',
    customer: 'Oliver Dubois',
    email: 'o.dubois@example.fr',
    items: 'Wireless keyboard',
    channel: 'Mobile',
    country: 'FR',
    qty: 1,
    total: 89,
    status: 'Processing' as const,
  },
  {
    id: 'ORD-10484',
    placed: '2026-09-29 15:40',
    customer: 'Sofia Rossi',
    email: 'sofia.rossi.purchasing-department@example.it',
    items: 'Noise-cancelling headphones, USB-C dock with dual display support, Laptop sleeve 14"',
    channel: 'Marketplace',
    country: 'IT',
    qty: 3,
    total: 612.4,
    status: 'Shipped' as const,
  },
  {
    id: 'ORD-10485',
    placed: '2026-09-29 16:05',
    customer: 'Kenji Tanaka',
    email: 'kenji@example.jp',
    items: 'Mechanical keyboard (brown switches), Wrist rest',
    channel: 'Web',
    country: 'JP',
    qty: 2,
    total: 214.5,
    status: 'Refunded' as const,
  },
  {
    id: 'ORD-10486',
    placed: '2026-09-29 16:31',
    customer: 'Amara Okafor',
    email: 'amara.okafor@example.ng',
    items: '27" 4K monitor, HDMI 2.1 cable',
    channel: 'Web',
    country: 'NG',
    qty: 2,
    total: 459,
    status: 'Processing' as const,
  },
]
const orderTone: Record<(typeof orders)[number]['status'], Tone> = {
  Shipped: 'success',
  Processing: 'info',
  Refunded: 'default',
}

const auditActions = ['member.invited', 'invoice.paid', 'api_key.created', 'project.renamed', 'role.updated', 'webhook.failed']
const auditActors = ['Maya Chen', 'Jonas Weber', 'Priya Patel', 'System']
const auditLog = Array.from({ length: 40 }, (_, i) => ({
  id: `evt_${String(1000 + i)}`,
  time: `16:${String(59 - i).padStart(2, '0')}:${String((i * 17) % 60).padStart(2, '0')}`,
  actor: auditActors[i % auditActors.length] ?? 'System',
  action: auditActions[i % auditActions.length] ?? 'project.renamed',
  target: ['Atlas', 'INV-2043', 'Production backend', 'Beacon', 'Compass'][i % 5] ?? 'Atlas',
}))

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

// ---------------------------------------------------------------------------
// Shared pieces
// ---------------------------------------------------------------------------

function InvoiceHeader() {
  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent">
        <TableHead className="w-[120px]">Invoice</TableHead>
        <TableHead>Customer</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="hidden sm:table-cell">Method</TableHead>
        <TableHead className="hidden sm:table-cell">Issued</TableHead>
        <TableHead className="text-right">Amount</TableHead>
      </TableRow>
    </TableHeader>
  )
}

function InvoiceRows() {
  return invoices.map((invoice) => (
    <TableRow key={invoice.id}>
      <TableCell className="font-mono text-[12.5px]">{invoice.id}</TableCell>
      <TableCell>{invoice.customer}</TableCell>
      <TableCell>
        <Badge variant={invoiceTone[invoice.status]}>{invoice.status}</Badge>
      </TableCell>
      <TableCell className="hidden text-foreground-light sm:table-cell">{invoice.method}</TableCell>
      <TableCell className="hidden text-foreground-light sm:table-cell">{invoice.issued}</TableCell>
      <TableCell className="text-right font-mono text-[13px] tabular">{usd.format(invoice.amount)}</TableCell>
    </TableRow>
  ))
}

/**
 * Waits (up to 1s, never failing) for a closing overlay to finish its exit
 * animation, so the a11y check that runs after `play` does not see the page
 * still hidden behind a modal menu. Hidden browser tabs pause CSS animations
 * and never fire `animationend`, so a still-closing overlay is then ended by hand.
 */
async function settleExitAnimation(selector: string) {
  for (let i = 0; i < 20 && document.querySelector(selector); i++) {
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  const closing = document.querySelector<HTMLElement>(`${selector}[data-state=closed]`)
  if (closing && typeof AnimationEvent === 'function') {
    const { animationName } = getComputedStyle(closing)
    closing.dispatchEvent(new AnimationEvent('animationend', { animationName }))
  }
}

/** Strips the story-only callbacks so they never reach the DOM. */
function tableProps({ onRowOpen: _open, onRowAction: _action, onRetry: _retry, ...props }: TableStoryArgs) {
  return props
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: 'Primitives/Table',
  component: Table,
  subcomponents: { TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Bordered data table with monospace uppercase headers and 44px rows, for records compared by column. Compose `TableHeader` / `TableBody` / `TableFooter` with `TableRow`, `TableHead` and `TableCell`; loading, empty and error states are single full-width rows inside the body. For whole-row navigation spread `rowLinkProps()` (from `patterns/table-utils`) on the row and keep a real link in the first cell. Use `containerClassName` to cap the height or drop the frame inside a card, and `containerProps` to make a scrolling table without links keyboard-focusable. Ready-made loading, empty and error rows live in `patterns/table-states`.',
      },
    },
  },
  args: {
    'aria-label': 'Invoices',
  },
  argTypes: {
    'aria-label': { control: 'text', description: 'Accessible name of the table (or use a `TableCaption`).' },
    containerClassName: { control: 'text' },
    containerProps: { control: 'object' },
    className: { control: 'text' },
    children: { control: false },
    onRowOpen: { table: { disable: true } },
    onRowAction: { table: { disable: true } },
    onRetry: { table: { disable: true } },
  },
  render: (args) => (
    <Table {...tableProps(args)}>
      <InvoiceHeader />
      <TableBody>
        <InvoiceRows />
      </TableBody>
    </Table>
  ),
} satisfies Meta<TableStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const table = canvas.getByRole('table', { name: 'Invoices' })
    await expect(within(table).getAllByRole('row')).toHaveLength(invoices.length + 1)
    await expect(within(table).getAllByRole('columnheader')[0]).toHaveTextContent('Invoice')
  },
}

/** `TableFooter` for totals and `TableCaption` for a note about the data (it also names the table). */
export const WithFooterAndCaption: Story = {
  args: { 'aria-label': undefined },
  render: (args) => (
    <Table {...tableProps(args)}>
      <TableCaption>Invoices issued in September 2026. Amounts in USD, taxes included.</TableCaption>
      <InvoiceHeader />
      <TableBody>
        <InvoiceRows />
      </TableBody>
      <TableFooter>
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="hidden sm:table-cell" colSpan={2} />
          <TableCell className="text-right font-mono text-[13px] tabular">
            {usd.format(invoices.reduce((sum, invoice) => sum + invoice.amount, 0))}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}

/**
 * Identity cell (avatar + name + secondary line), status badges, a mono role
 * tag and an icon-only actions column. The row stays highlighted while its
 * menu is open.
 */
export const WithStatusAndActions: Story = {
  args: { 'aria-label': 'Team members' },
  render: (args) => (
    <Table {...tableProps(args)}>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Member</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden md:table-cell">Last active</TableHead>
          <TableHead className="w-[1%]">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell>
              <div className="flex min-w-0 items-center gap-3">
                <Avatar size="sm">
                  <AvatarFallback>{initials(member.name)}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-medium">{member.name}</span>
                  <span className="truncate text-[12.5px] text-foreground-lighter">{member.email}</span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge font="mono" shape="square">
                {member.role}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={memberTone[member.status]}>{member.status}</Badge>
            </TableCell>
            <TableCell className="hidden text-foreground-light md:table-cell">{member.lastActive}</TableCell>
            <TableCell className="pr-3 text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-tiny"
                    icon={<EllipsisVertical />}
                    aria-label={`Actions for ${member.name}`}
                    className="text-foreground-lighter"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>Change role</DropdownMenuItem>
                  <DropdownMenuItem disabled={member.status !== 'Invited'}>Resend invite</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">Remove member</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = canvas.getByRole('button', { name: 'Actions for Maya Chen' })

    trigger.focus()
    await userEvent.keyboard('{Enter}')
    const remove = await body.findByRole('menuitem', { name: 'Remove member' })
    await expect(remove).toHaveAttribute('data-variant', 'destructive')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')

    await userEvent.keyboard('{Escape}')
    // The menu animates out, so assert the trigger state rather than the menu's removal.
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
    await settleExitAnimation('[role=menu]')
  },
}

/**
 * Whole-row navigation with `rowLinkProps()`: clicking anywhere on the row
 * opens it, while the name link, the actions button and the (portaled) menu
 * items keep their own behavior. The description column absorbs the free
 * width (`w-full max-w-0`) and truncates.
 */
export const ClickableRows: Story = {
  args: { 'aria-label': 'Projects', onRowOpen: fn(), onRowAction: fn() },
  render: (args) => (
    <Table {...tableProps(args)}>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Project</TableHead>
          <TableHead className="hidden sm:table-cell">Owner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden md:table-cell">Updated</TableHead>
          <TableHead className="w-[1%]">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id} {...rowLinkProps(() => args.onRowOpen?.(project.id))}>
            <TableCell className="w-full max-w-0">
              <div className="flex min-w-0 flex-col gap-0.5">
                <a
                  href={`#/projects/${project.id}`}
                  // Stands in for a router link: the app handles the navigation.
                  onClick={(event) => event.preventDefault()}
                  className="w-fit font-medium text-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {project.name}
                </a>
                <span className="truncate text-[12.5px] text-foreground-lighter" title={project.description}>
                  {project.description}
                </span>
              </div>
            </TableCell>
            <TableCell className="hidden text-foreground-light sm:table-cell">{project.owner}</TableCell>
            <TableCell>
              <Badge variant={projectTone[project.status]}>{project.status}</Badge>
            </TableCell>
            <TableCell className="hidden text-foreground-light md:table-cell">{project.updated}</TableCell>
            <TableCell className="pr-3 text-right">
              <div className="flex items-center justify-end gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-tiny"
                      icon={<EllipsisVertical />}
                      aria-label={`Actions for ${project.name}`}
                      className="text-foreground-lighter"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onSelect={() => args.onRowAction?.('rename', project.id)}>Rename</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => args.onRowAction?.('archive', project.id)}>Archive</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onSelect={() => args.onRowAction?.('delete', project.id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <ChevronRight className="size-4 text-foreground-muted" aria-hidden="true" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    // A click on plain row content opens the row (the description is visible at every width).
    await userEvent.click(canvas.getByText(projects[0]?.description ?? ''))
    await expect(args.onRowOpen).toHaveBeenCalledOnce()
    await expect(args.onRowOpen).toHaveBeenCalledWith('atlas')

    // The name link keeps its own behavior: the row does not open a second time.
    await userEvent.click(canvas.getByRole('link', { name: 'Beacon' }))
    await expect(args.onRowOpen).toHaveBeenCalledTimes(1)

    // Choosing a menu item runs the action without opening the row.
    const trigger = canvas.getByRole('button', { name: 'Actions for Atlas' })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    const archive = await body.findByRole('menuitem', { name: 'Archive' })
    archive.focus()
    await userEvent.keyboard('{Enter}')
    await expect(args.onRowAction).toHaveBeenCalledWith('archive', 'atlas')
    await expect(args.onRowOpen).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
    await settleExitAnimation('[role=menu]')
  },
}

function SelectableKeysTable(props: React.ComponentProps<typeof Table>) {
  const [selected, setSelected] = React.useState<string[]>(['k2'])
  const allSelected = selected.length === apiKeys.length
  const toggle = (id: string, checked: boolean) =>
    setSelected((current) => (checked ? [...current, id] : current.filter((key) => key !== id)))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-[30px] items-center justify-between gap-3">
        <span className="text-[13px] text-foreground-light" aria-live="polite">
          {selected.length ? `${selected.length} of ${apiKeys.length} selected` : `${apiKeys.length} keys`}
        </span>
        {selected.length > 0 && (
          <Button variant="destructive" size="sm">
            Revoke {selected.length === 1 ? 'key' : `${selected.length} keys`}
          </Button>
        )}
      </div>
      <Table {...props}>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10">
              <Checkbox
                aria-label="Select all keys"
                checked={allSelected}
                onCheckedChange={(checked) => setSelected(checked === true ? apiKeys.map((key) => key.id) : [])}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Key</TableHead>
            <TableHead className="hidden sm:table-cell">Scope</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="hidden md:table-cell">Last used</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiKeys.map((key) => {
            const isSelected = selected.includes(key.id)
            return (
              <TableRow key={key.id} data-state={isSelected ? 'selected' : undefined}>
                <TableCell>
                  <Checkbox
                    aria-label={`Select ${key.name}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => toggle(key.id, checked === true)}
                  />
                </TableCell>
                <TableCell className="font-medium">{key.name}</TableCell>
                <TableCell className="font-mono text-[12.5px] text-foreground-light">{key.prefix}••••••••</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="outline" case="normal" shape="square">
                    {key.scope}
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-foreground-light md:table-cell">{key.created}</TableCell>
                <TableCell className="hidden text-foreground-light md:table-cell">{key.lastUsed}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

/** Checkbox column + `data-state="selected"` on the row for the selection highlight. */
export const SelectableRows: Story = {
  args: { 'aria-label': 'API keys' },
  render: (args) => <SelectableKeysTable {...tableProps(args)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const rowOf = (name: string) => canvas.getByRole('checkbox', { name: `Select ${name}` }).closest('tr')

    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select Staging' }))
    await expect(rowOf('Staging')).toHaveAttribute('data-state', 'selected')
    await expect(canvas.getByText('2 of 4 selected')).toBeInTheDocument()

    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select all keys' }))
    for (const key of apiKeys) await expect(rowOf(key.name)).toHaveAttribute('data-state', 'selected')

    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select all keys' }))
    await expect(rowOf('Staging')).not.toHaveAttribute('data-state')
    await expect(canvas.getByText('4 keys')).toBeInTheDocument()
  },
}

/** Empty body: one full-width row explaining the state, with the action that fills it. */
export const Empty: Story = {
  args: { 'aria-label': 'API keys' },
  render: (args) => (
    <Table {...tableProps(args)}>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Name</TableHead>
          <TableHead>Key</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Last used</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={4} className="h-40 whitespace-normal">
            <div className="flex flex-col items-center gap-2 text-center">
              <KeyRound className="size-5 text-foreground-lighter" aria-hidden="true" />
              <p className="font-medium">No API keys yet</p>
              <p className="max-w-sm text-[13px] text-foreground-light">
                Create a key to call the API from your backend, scripts or integrations.
              </p>
              <Button variant="primary" size="sm" icon={<Plus />} className="mt-1">
                Create key
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

/** Skeleton rows while the first page loads; the table is marked `aria-busy`. */
export const Loading: Story = {
  args: { 'aria-busy': true },
  render: (args) => (
    <Table {...tableProps(args)}>
      <InvoiceHeader />
      <TableBody>
        {Array.from({ length: 4 }, (_, row) => (
          <TableRow key={row} className="hover:bg-transparent" aria-hidden="true">
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-14 rounded-full" />
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="ml-auto h-4 w-16" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

/** Error row: the message in the destructive tone plus a retry action. */
export const ErrorState: Story = {
  args: { onRetry: fn() },
  render: (args) => (
    <Table {...tableProps(args)}>
      <InvoiceHeader />
      <TableBody>
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={6} className="h-32 whitespace-normal">
            <div role="alert" className="flex flex-col items-center gap-3 text-center">
              <p className="text-[13px] text-destructive">Couldn't load invoices: the request timed out.</p>
              <Button size="tiny" icon={<RotateCw />} onClick={args.onRetry}>
                Retry
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toHaveTextContent('request timed out')
    await userEvent.click(canvas.getByRole('button', { name: 'Retry' }))
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}

const dense = 'h-8 py-1 text-[13px]'
/** Links inside a scrolling table also make the scroll region reachable by keyboard. */
const idLink =
  'rounded-sm text-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring'

/**
 * Many columns in a narrow container: compact 32px rows, long values
 * truncated with the full text in `title`, and horizontal scrolling once the
 * columns no longer fit.
 */
export const DenseData: Story = {
  args: { 'aria-label': 'Recent orders' },
  render: (args) => (
    <div className="max-w-3xl">
      <Table {...tableProps(args)}>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-8">Order</TableHead>
            <TableHead className="h-8">Placed</TableHead>
            <TableHead className="h-8">Customer</TableHead>
            <TableHead className="h-8">Email</TableHead>
            <TableHead className="h-8">Items</TableHead>
            <TableHead className="h-8">Channel</TableHead>
            <TableHead className="h-8">Country</TableHead>
            <TableHead className="h-8 text-right">Qty</TableHead>
            <TableHead className="h-8 text-right">Total</TableHead>
            <TableHead className="h-8">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className={`${dense} font-mono text-[12.5px]`}>
                <a href={`#/orders/${order.id}`} className={idLink}>
                  {order.id}
                </a>
              </TableCell>
              <TableCell className={`${dense} font-mono text-[12.5px] text-foreground-light tabular`}>
                {order.placed}
              </TableCell>
              <TableCell className={dense}>{order.customer}</TableCell>
              <TableCell className={`${dense} max-w-[180px]`}>
                <span className="block truncate text-foreground-light" title={order.email}>
                  {order.email}
                </span>
              </TableCell>
              <TableCell className={`${dense} max-w-[240px]`}>
                <span className="block truncate" title={order.items}>
                  {order.items}
                </span>
              </TableCell>
              <TableCell className={`${dense} text-foreground-light`}>{order.channel}</TableCell>
              <TableCell className={dense}>
                <Badge font="mono" shape="square">
                  {order.country}
                </Badge>
              </TableCell>
              <TableCell className={`${dense} text-right font-mono tabular`}>{order.qty}</TableCell>
              <TableCell className={`${dense} text-right font-mono tabular`}>{usd.format(order.total)}</TableCell>
              <TableCell className={dense}>
                <Badge variant={orderTone[order.status]}>{order.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
}

/**
 * Long list in a fixed-height container with a sticky header: cap the
 * container (`containerClassName="max-h-80"`), make the header
 * `sticky top-0 z-10` on an opaque surface, and draw its bottom line with an
 * inset shadow (collapsed table borders do not travel with a sticky header).
 * `containerProps` turns the scroller into a named, focusable region so it can
 * be scrolled with the keyboard.
 */
export const StickyHeader: Story = {
  args: {
    'aria-label': 'Audit log',
    containerClassName: 'max-h-80',
    containerProps: { tabIndex: 0, role: 'region', 'aria-label': 'Audit log, scrollable' },
  },
  render: (args) => (
    <Table {...tableProps(args)}>
      <TableHeader className="sticky top-0 z-10 bg-surface-100 [&_th]:shadow-[inset_0_-1px_0_var(--border)]">
        <TableRow className="bg-surface-200 hover:bg-surface-200">
          <TableHead className="w-[120px]">Time</TableHead>
          <TableHead>Actor</TableHead>
          <TableHead>Event</TableHead>
          <TableHead>Target</TableHead>
          <TableHead className="hidden text-right sm:table-cell">ID</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {auditLog.map((event) => (
          <TableRow key={event.id}>
            <TableCell className="font-mono text-[12.5px] text-foreground-light tabular">{event.time}</TableCell>
            <TableCell>{event.actor}</TableCell>
            <TableCell className="font-mono text-[12.5px]">{event.action}</TableCell>
            <TableCell className="text-foreground-light">{event.target}</TableCell>
            <TableCell className="hidden text-right font-mono text-[12.5px] sm:table-cell">
              <a href={`#/audit/${event.id}`} className={cn(idLink, 'text-foreground-lighter')}>
                {event.id}
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvas.getByRole('region', { name: 'Audit log, scrollable' })
    await expect(region).toHaveAttribute('data-slot', 'table-container')
    await expect(region).toHaveClass('max-h-80', 'overflow-x-auto')
    await expect(within(region).getByRole('table', { name: 'Audit log' })).toBeInTheDocument()

    region.focus()
    await expect(region).toHaveFocus()
  },
}

/**
 * Edge to edge in a `Card`: drop the table's own frame with
 * `containerClassName="rounded-none border-0 shadow-none"` so the card border
 * is the only one. Inside a padded card section, `shadow-none` alone is enough.
 */
export const InsideCard: Story = {
  args: { 'aria-label': 'Recent invoices', containerClassName: 'rounded-none border-0 shadow-none' },
  render: (args) => (
    <Card className="max-w-3xl">
      <CardHeader>
        <div>
          <CardTitle>Recent invoices</CardTitle>
          <CardDescription>The last five invoices issued to your customers.</CardDescription>
        </div>
        <CardAction>
          <Button size="tiny">View all</Button>
        </CardAction>
      </CardHeader>
      <Table {...tableProps(args)}>
        <InvoiceHeader />
        <TableBody>
          <InvoiceRows />
        </TableBody>
      </Table>
    </Card>
  ),
}
