import type { Meta, StoryObj } from '@storybook/react-vite'
import { Building2, CreditCard, FolderKanban, Globe, HardDrive, KeyRound, Tag, Users } from 'lucide-react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { LinkProvider, type LinkComponent } from '../../lib/link'
import { Button } from '../primitives/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../primitives/card'
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from '../primitives/popover'

import { CopyButton } from './copy'
import { DescriptionItem, DescriptionList } from './description-list'
import { StatusBadge, StatusDot } from './status'

/** Open-by-default stories render in their own iframe so the panel stays next to its trigger. */
const openInDocs = { docs: { story: { inline: false, iframeHeight: 300 } } }

/** Stand-in for a client-side router's `navigate()`. */
const navigate = fn()

/** Minimal router adapter: forwards every prop to an `<a>` and navigates client-side on click. */
const RouterLink: LinkComponent = ({ href, onClick, ...props }) => (
  <a
    href={href}
    {...props}
    onClick={(event) => {
      onClick?.(event)
      event.preventDefault()
      navigate(href)
    }}
  />
)

const meta = {
  title: 'Patterns/Description List',
  component: DescriptionList,
  subcomponents: { DescriptionItem },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Read-only label/value facts about one record, as a semantic `<dl>` of `DescriptionItem`s. Use `grid` for the facts block of a detail page, `strip` for a row of stats flush at the bottom of a card, `rows` for an icon list in a side panel (rows can be links) and `inline` for a compact list in a popover or menu. Use `FormRow` for editable settings, `MetricCard` for a single headline number and `Table` for many records.',
      },
    },
  },
  args: {
    variant: 'grid',
    columns: 4,
    divided: true,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['grid', 'strip', 'rows', 'inline'] },
    columns: { control: 'inline-radio', options: [1, 2, 3, 4] },
    divided: { control: 'boolean' },
    children: { control: false },
  },
} satisfies Meta<typeof DescriptionList>

export default meta
type Story = StoryObj<typeof meta>

/** Facts of one order, reused by several stories. */
function OrderItems() {
  return (
    <>
      <DescriptionItem label="Order" mono>
        ORD-58213
      </DescriptionItem>
      <DescriptionItem label="Status">
        <StatusBadge tone="success" label="Fulfilled" />
      </DescriptionItem>
      <DescriptionItem label="Customer">Northwind Traders</DescriptionItem>
      <DescriptionItem label="Payment">Visa ending 4242</DescriptionItem>
      <DescriptionItem label="Placed">
        <time dateTime="2026-03-04T10:24:00Z">Mar 4, 2026, 10:24</time>
      </DescriptionItem>
      <DescriptionItem label="Shipped">
        <time dateTime="2026-03-05T16:02:00Z">Mar 5, 2026, 16:02</time>
      </DescriptionItem>
      <DescriptionItem label="Total" mono>
        <span className="tabular">$1,284.00</span>
      </DescriptionItem>
      <DescriptionItem label="Tracking" mono>
        1Z 999 AA1 0123 4567 84
      </DescriptionItem>
    </>
  )
}

export const Default: Story = {
  render: (args) => (
    <DescriptionList {...args}>
      <OrderItems />
    </DescriptionList>
  ),
}

export const GridWithWideValue: Story = {
  name: 'Grid with wide values',
  parameters: {
    docs: {
      description: {
        story:
          'Use `span` for long values. By default a value is cut to one line (keep the full text in a `title`); add `wrap` to let it run onto several lines.',
      },
    },
  },
  render: (args) => (
    <div className="max-w-3xl">
      <DescriptionList {...args}>
        <DescriptionItem label="Endpoint" mono span={2}>
          <span title="https://hooks.example.com/v2/workspaces/acme-corporation/integrations/billing-events/receiver?format=json&retry=exponential">
            https://hooks.example.com/v2/workspaces/acme-corporation/integrations/billing-events/receiver?format=json&retry=exponential
          </span>
        </DescriptionItem>
        <DescriptionItem label="Events">invoice.paid, invoice.failed</DescriptionItem>
        <DescriptionItem label="Last delivery">2 minutes ago</DescriptionItem>
        <DescriptionItem label="Description" span="full" wrap>
          Forwards paid and failed invoice events to the finance data warehouse for nightly reconciliation, and
          retries failed deliveries with exponential backoff for up to 24 hours before alerting the billing
          channel.
        </DescriptionItem>
      </DescriptionList>
    </div>
  ),
}

export const Columns: Story = {
  render: (args) => (
    <div className="flex max-w-3xl flex-col gap-6">
      <DescriptionList {...args} columns={2}>
        <DescriptionItem label="Owner">Maya Chen</DescriptionItem>
        <DescriptionItem label="Visibility">Private</DescriptionItem>
      </DescriptionList>
      <DescriptionList {...args} columns={3}>
        <DescriptionItem label="Plan">Business</DescriptionItem>
        <DescriptionItem label="Seats">18 of 25</DescriptionItem>
        <DescriptionItem label="Renews">Apr 1, 2026</DescriptionItem>
      </DescriptionList>
      <DescriptionList {...args} columns={1} className="max-w-xs">
        <DescriptionItem label="Workspace ID" mono>
          ws_7Hq2LmN9
        </DescriptionItem>
      </DescriptionList>
    </div>
  ),
}

export const StripInCard: Story = {
  name: 'Strip in a card',
  args: { variant: 'strip', columns: 3 },
  render: (args) => (
    <Card className="w-96">
      <CardHeader>
        <div className="flex flex-col gap-0.5">
          <CardTitle>Design team</CardTitle>
          <CardDescription>Shared workspace for product design</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="text-[13px] text-foreground-light">
        Figma files, brand assets and the component library live here.
      </CardContent>
      <DescriptionList {...args}>
        <DescriptionItem label="Members">12</DescriptionItem>
        <DescriptionItem label="Updated">3 hours ago</DescriptionItem>
        <DescriptionItem label="Team ID" mono valueClassName="flex min-w-0 items-center gap-1">
          <span className="truncate">tm_42</span>
          <CopyButton value="tm_42" what="team ID" variant="ghost" className="size-5 [&_svg]:size-3" />
        </DescriptionItem>
      </DescriptionList>
    </Card>
  ),
}

export const Rows: Story = {
  name: 'Rows with icons, hints and links',
  args: { variant: 'rows' },
  render: (args) => (
    <aside
      aria-labelledby="workspace-panel-title"
      className="flex w-80 flex-col overflow-hidden rounded-lg border bg-surface-100 shadow-card"
    >
      <div className="flex flex-col gap-0.5 px-4 py-4">
        <h2 id="workspace-panel-title" className="text-sm font-medium text-foreground">
          Acme workspace
        </h2>
        <p className="truncate text-[13px] text-foreground-light">acme.example.com · Business plan</p>
      </div>
      <DescriptionList {...args}>
        <DescriptionItem icon={<Tag />} label="API version" hint="latest" mono>
          2026-03-01
        </DescriptionItem>
        <DescriptionItem icon={<Globe />} label="Timezone">
          Europe/Paris (UTC+1)
        </DescriptionItem>
        <DescriptionItem icon={<Users />} label="Members" hint="2 pending" href="#members">
          18
        </DescriptionItem>
        <DescriptionItem icon={<FolderKanban />} label="Projects" href="#projects">
          7
        </DescriptionItem>
        <DescriptionItem icon={<KeyRound />} label="API keys" href="#api-keys">
          4
        </DescriptionItem>
        <DescriptionItem icon={<HardDrive />} label="Storage">
          12.4 GB <span className="text-foreground-lighter">/ 50 GB</span>
        </DescriptionItem>
        <DescriptionItem icon={<CreditCard />} label="Balance" valueClassName="text-warning">
          $120.00 due
        </DescriptionItem>
      </DescriptionList>
    </aside>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const members = canvas.getByRole('link', { name: 'Members' })
    await expect(members.tagName).toBe('A')
    await expect(members).toHaveAttribute('href', '#members')
    // The link text is the label; the value is its accessible description.
    await expect(members).toHaveAccessibleDescription(/\b18$/)
    // Non-linked rows are not focusable: the first Tab lands on the first linked row.
    await userEvent.tab()
    await expect(members).toHaveFocus()
    await userEvent.tab()
    await expect(canvas.getByRole('link', { name: 'Projects' })).toHaveFocus()
  },
}

export const RowsFirstInContainer: Story = {
  name: 'Rows without top divider',
  args: { variant: 'rows', divided: false },
  render: (args) => (
    <div className="w-80 overflow-hidden rounded-lg border bg-surface-100 shadow-card">
      <DescriptionList {...args}>
        <DescriptionItem icon={<Building2 />} label="Company">
          Acme Corporation
        </DescriptionItem>
        <DescriptionItem icon={<Users />} label="Seats">
          18 <span className="text-foreground-lighter">/ 25</span>
        </DescriptionItem>
        <DescriptionItem icon={<Globe />} label="Domain" mono>
          acme.example.com
        </DescriptionItem>
      </DescriptionList>
    </div>
  ),
}

export const RowsWithRouterLinks: Story = {
  name: 'Rows with router links',
  args: { variant: 'rows', divided: false },
  parameters: {
    docs: {
      description: {
        story:
          'Linked rows render through the `LinkProvider` link (or an item\'s `linkComponent`), so a client-side router handles the navigation. Here the adapter logs the target instead of navigating.',
      },
    },
  },
  render: (args) => (
    <LinkProvider component={RouterLink}>
      <div className="w-80 overflow-hidden rounded-lg border bg-surface-100 shadow-card">
        <DescriptionList {...args}>
          <DescriptionItem icon={<CreditCard />} label="Billing" href="/settings/billing">
            Business
          </DescriptionItem>
          <DescriptionItem icon={<Users />} label="Members" href="/settings/members">
            18
          </DescriptionItem>
          <DescriptionItem icon={<KeyRound />} label="API keys" href="/settings/api-keys">
            4
          </DescriptionItem>
        </DescriptionList>
      </div>
    </LinkProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    navigate.mockClear()
    await userEvent.click(canvas.getByRole('link', { name: 'Billing' }))
    await expect(navigate).toHaveBeenCalledWith('/settings/billing')
  },
}

export const InlineInPopover: Story = {
  name: 'Inline in a popover',
  args: { variant: 'inline' },
  parameters: { layout: 'centered', ...openInDocs },
  render: (args) => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button icon={<Building2 />}>Acme workspace</Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72" aria-label="Workspace details">
        <PopoverHeader className="mb-3">
          <PopoverTitle>Acme workspace</PopoverTitle>
        </PopoverHeader>
        <DescriptionList {...args}>
          <DescriptionItem label="Plan" mono>
            business-2026
          </DescriptionItem>
          <DescriptionItem label="Currency" mono>
            EUR
          </DescriptionItem>
          <DescriptionItem label="Domain" mono>
            acme.example.com
          </DescriptionItem>
          <DescriptionItem label="Sync" valueClassName="flex items-center justify-end gap-1.5">
            <StatusDot tone="success" pulse />
            Live
          </DescriptionItem>
        </DescriptionList>
      </PopoverContent>
    </Popover>
  ),
  play: async () => {
    const body = within(document.body)
    const panel = await body.findByRole('dialog', { name: 'Workspace details' })
    await expect(within(panel).getByText('Currency')).toBeInTheDocument()
    await expect(within(panel).getByText('acme.example.com')).toBeInTheDocument()
  },
}

export const Loading: Story = {
  render: (args) => (
    <div className="flex max-w-3xl flex-col gap-6">
      <DescriptionList {...args} variant="grid">
        <DescriptionItem label="Order" loading />
        <DescriptionItem label="Status" loading />
        <DescriptionItem label="Customer" loading />
        <DescriptionItem label="Total" loading />
      </DescriptionList>
      <div className="flex flex-wrap items-start gap-6">
        <div className="w-80 overflow-hidden rounded-lg border bg-surface-100 shadow-card">
          <DescriptionList variant="rows" divided={false}>
            <DescriptionItem icon={<Users />} label="Members" loading />
            <DescriptionItem icon={<FolderKanban />} label="Projects" loading />
            <DescriptionItem icon={<KeyRound />} label="API keys" loading />
          </DescriptionList>
        </div>
        <Card className="w-80">
          <CardContent className="text-[13px] text-foreground-light">Monthly usage</CardContent>
          <DescriptionList variant="strip" columns={3}>
            <DescriptionItem label="Requests" loading />
            <DescriptionItem label="Errors" loading />
            <DescriptionItem label="Latency" loading />
          </DescriptionList>
        </Card>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const busy = canvasElement.querySelectorAll('[data-slot="description-item"][aria-busy="true"]')
    await expect(busy.length).toBe(10)
    // Skeleton labels stay available to assistive technology.
    await expect(within(canvasElement).getByText('Customer')).toBeInTheDocument()
  },
}

export const EmptyValues: Story = {
  render: (args) => (
    <div className="max-w-3xl">
      <DescriptionList {...args}>
        <DescriptionItem label="Assignee" />
        <DescriptionItem label="Due date">{null}</DescriptionItem>
        <DescriptionItem label="Notes">{''}</DescriptionItem>
        <DescriptionItem label="Open tasks">{0}</DescriptionItem>
      </DescriptionList>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByText('—')).toHaveLength(3)
    await expect(canvas.getByText('0')).toBeInTheDocument()
  },
}

export const InvoiceDetails: Story = {
  name: 'Invoice details',
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="flex max-w-4xl flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="text-lg font-medium text-foreground md:text-xl">
            Invoice <span className="font-mono text-[0.92em]">INV-2041</span>
          </h2>
          <StatusBadge tone="success" label="Paid" />
          <CopyButton value="INV-2041" what="invoice number" />
        </div>
        <p className="text-sm text-foreground-light">Business plan · March 2026 · 25 seats</p>
      </div>

      <DescriptionList {...args}>
        <DescriptionItem label="Customer">Northwind Traders</DescriptionItem>
        <DescriptionItem label="Amount" mono>
          <span className="tabular">$2,475.00</span>
        </DescriptionItem>
        <DescriptionItem label="Issued">
          <time dateTime="2026-03-01">Mar 1, 2026</time>
        </DescriptionItem>
        <DescriptionItem label="Paid">
          <time dateTime="2026-03-03">Mar 3, 2026</time>
        </DescriptionItem>
        <DescriptionItem label="Billing email" span={2}>
          <span title="accounts-payable@northwind.example.com">accounts-payable@northwind.example.com</span>
        </DescriptionItem>
        <DescriptionItem label="Payment method">Visa ending 4242</DescriptionItem>
        <DescriptionItem label="PO number" />
      </DescriptionList>

      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <DescriptionList variant="rows" divided={false}>
            <DescriptionItem icon={<CreditCard />} label="Charged" hint="incl. VAT">
              $2,475.00
            </DescriptionItem>
            <DescriptionItem icon={<Building2 />} label="Customer profile" href="#customer">
              Northwind Traders
            </DescriptionItem>
            <DescriptionItem icon={<Tag />} label="Transaction" mono>
              txn_3Pq8ZrLm
            </DescriptionItem>
          </DescriptionList>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Usage this period</CardTitle>
          </CardHeader>
          <CardContent className="text-[13px] text-foreground-light">
            Seat usage stayed within the plan limit for the whole period.
          </CardContent>
          <DescriptionList variant="strip" columns={3}>
            <DescriptionItem label="Seats">25</DescriptionItem>
            <DescriptionItem label="Active">23</DescriptionItem>
            <DescriptionItem label="Overage">$0.00</DescriptionItem>
          </DescriptionList>
        </Card>
      </div>
    </div>
  ),
}
