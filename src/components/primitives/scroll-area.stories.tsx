import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { ScrollArea, ScrollBar } from './scroll-area'
import { Separator } from './separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'

const versions = Array.from({ length: 40 }, (_, i) => `v2.${40 - i}.0`)

const meta = {
  title: 'Primitives/Scroll Area',
  component: ScrollArea,
  subcomponents: { ScrollBar },
  parameters: {
    docs: {
      description: {
        component:
          'Scroll container with a thin themed scrollbar that overlays the content. Always give it a bounded height or width (`h-72`, `max-h-80`, `flex-1 min-h-0`). It renders a vertical scrollbar; add `<ScrollBar orientation="horizontal" />` as the last child for horizontal scrolling. Use `type="always"` to keep the scrollbar visible. When the content has nothing focusable, pass `viewportProps={{ tabIndex: 0, role: "region", "aria-label": "…" }}` so keyboard users can scroll it.',
      },
    },
  },
  args: {
    className: 'h-72 w-56 rounded-md border',
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['hover', 'scroll', 'auto', 'always'] },
    scrollHideDelay: { control: 'number' },
    dir: { control: 'inline-radio', options: ['ltr', 'rtl'] },
    children: { control: false },
    asChild: { control: false },
    viewportProps: { control: false },
  },
  render: (args) => (
    <ScrollArea {...args}>
      <div className="p-4">
        <div className="mb-3 mono-label">Releases</div>
        {versions.map((version) => (
          <div key={version}>
            <div className="py-1.5 font-mono text-[13px] text-foreground-light">{version}</div>
            <Separator />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('v2.40.0')).toBeInTheDocument()
    await expect(canvasElement.querySelector('[data-slot="scroll-area-viewport"]')).toContainElement(
      canvas.getByText('v2.1.0'),
    )
  },
}

/** `type="always"` keeps the scrollbar visible instead of showing it on hover. */
export const AlwaysVisible: Story = {
  args: { type: 'always' },
}

/**
 * Static content (nothing inside can take focus): `viewportProps` turns the viewport into a named,
 * focusable region, so Tab reaches it and the arrow keys scroll it in every browser.
 */
export const KeyboardScrollable: Story = {
  args: { viewportProps: { tabIndex: 0, role: 'region', 'aria-label': 'Releases' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const viewport = canvas.getByRole('region', { name: 'Releases' })
    await expect(viewport).toHaveAttribute('data-slot', 'scroll-area-viewport')
    await expect(viewport).toHaveAttribute('tabindex', '0')
    viewport.focus()
    await expect(viewport).toHaveFocus()
  },
}

const projects = [
  { name: 'Marketing site', tasks: 14 },
  { name: 'Billing portal', tasks: 8 },
  { name: 'Mobile app', tasks: 23 },
  { name: 'Design system', tasks: 5 },
  { name: 'Help center', tasks: 11 },
  { name: 'Data warehouse', tasks: 17 },
  { name: 'Partner API', tasks: 9 },
]

/** Horizontal scrolling: add `<ScrollBar orientation="horizontal" />` inside the area. */
export const Horizontal: Story = {
  args: { className: 'w-96 rounded-md border whitespace-nowrap', type: 'always' },
  render: (args) => (
    <ScrollArea {...args}>
      <div className="flex w-max gap-3 p-4">
        {projects.map((p) => (
          <div key={p.name} className="w-40 shrink-0 rounded-lg border bg-card p-3 shadow-card">
            <div className="truncate text-sm font-medium text-foreground">{p.name}</div>
            <div className="mt-1 text-xs text-foreground-lighter">
              <span className="tabular">{p.tasks}</span> open tasks
            </div>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
}

const orders = Array.from({ length: 24 }, (_, i) => ({
  id: `ORD-${(1080 + i).toString()}`,
  customer: ['Northwind Traders', 'Globex Corporation', 'Initech', 'Umbrella Health', 'Stark Retail'][i % 5],
  email: ['ops@northwind.test', 'billing@globex.test', 'finance@initech.test', 'ap@umbrella.test', 'orders@stark.test'][
    i % 5
  ],
  items: ((i * 7) % 11) + 1,
  total: `$${(((i * 137) % 900) + 49).toFixed(2)}`,
  date: `Sep ${((i % 28) + 1).toString()}, 2025`,
}))

/** Both directions: a wide table inside a fixed-size box, with both scrollbars. */
export const BothDirections: Story = {
  parameters: { layout: 'padded' },
  args: { className: 'h-80 w-full max-w-lg rounded-lg border', type: 'always' },
  render: (args) => (
    <ScrollArea {...args}>
      <Table
        aria-label="Orders"
        className="min-w-[720px]"
        containerClassName="overflow-visible rounded-none border-0 shadow-none"
      >
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Items</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((o) => (
            <TableRow key={o.id}>
              <TableCell className="font-mono text-xs">{o.id}</TableCell>
              <TableCell>{o.customer}</TableCell>
              <TableCell className="text-foreground-light">{o.email}</TableCell>
              <TableCell className="tabular text-right">{o.items}</TableCell>
              <TableCell className="tabular text-right">{o.total}</TableCell>
              <TableCell className="text-foreground-light">{o.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
}

/** Content shorter than the area: nothing scrolls and no scrollbar is shown. */
export const ShortContent: Story = {
  args: { className: 'h-48 w-56 rounded-md border', type: 'auto' },
  render: (args) => (
    <ScrollArea {...args}>
      <div className="p-4 text-[13px] text-foreground-light">Only three releases so far: v1.2.0, v1.1.0, v1.0.0.</div>
    </ScrollArea>
  ),
}

const notifications = [
  { who: 'Maya Chen', what: 'commented on “Pricing page copy”', when: '2m' },
  { who: 'Liam Novak', what: 'invited you to Billing portal', when: '14m' },
  { who: 'Sara Ortiz', what: 'marked INV-2041 as paid', when: '1h' },
  { who: 'Tom Becker', what: 'assigned you “Update onboarding emails”', when: '3h' },
  { who: 'Aiko Tanaka', what: 'rotated the production API key', when: '5h' },
  { who: 'Omar Haddad', what: 'changed the plan to Pro (12 seats)', when: 'Yesterday' },
  { who: 'Maya Chen', what: 'closed 6 issues in Mobile app', when: 'Yesterday' },
  { who: 'Liam Novak', what: 'exported the September orders report', when: '2d' },
  { who: 'Sara Ortiz', what: 'added a payment method', when: '3d' },
]

/** A notifications panel: fixed header, scrollable body that fills the remaining height. */
export const NotificationsPanel: Story = {
  render: () => (
    <div className="flex h-96 w-80 flex-col overflow-hidden rounded-lg border bg-card shadow-card">
      <div className="flex h-11 shrink-0 items-center justify-between border-b px-4">
        <span className="text-sm font-medium text-foreground">Notifications</span>
        <span className="tabular text-xs text-foreground-lighter">{notifications.length} unread</span>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <ul className="divide-y">
          {notifications.map((n, i) => (
            <li key={i} className="flex flex-col gap-0.5 px-4 py-2.5">
              <span className="text-[13px] text-foreground-light">
                <span className="font-medium text-foreground">{n.who}</span> {n.what}
              </span>
              <span className="text-xs text-foreground-lighter">{n.when}</span>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  ),
}
