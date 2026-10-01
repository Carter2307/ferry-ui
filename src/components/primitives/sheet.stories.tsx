import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CreditCard, FolderKanban, LayoutDashboard, Menu, Settings, Users } from 'lucide-react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Badge } from './badge'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet'
import { Textarea } from './textarea'

/** Story args: the `Sheet` root props plus the options of `SheetContent`. */
type SheetStoryArgs = React.ComponentProps<typeof Sheet> &
  Pick<React.ComponentProps<typeof SheetContent>, 'side' | 'showCloseButton' | 'closeLabel'>

type SheetSide = NonNullable<SheetStoryArgs['side']>

const sides: SheetSide[] = ['top', 'right', 'bottom', 'left']

/** Open-by-default stories render in their own iframe so the modal does not cover the docs page. */
const openInDocs = { docs: { story: { inline: false, iframeHeight: 560 } } }

function MemberForm() {
  return (
    <SheetBody>
      <div className="flex flex-col gap-2">
        <Label htmlFor="member-name">Full name</Label>
        <Input id="member-name" defaultValue="Ada Park" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="member-email">Email</Label>
        <Input id="member-email" type="email" defaultValue="ada@example.com" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="member-note">Note</Label>
        <Textarea id="member-note" placeholder="Visible to workspace admins only" />
      </div>
    </SheetBody>
  )
}

const meta = {
  title: 'Primitives/Sheet',
  component: Sheet,
  subcomponents: { SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetBody, SheetFooter, SheetClose },
  parameters: {
    docs: {
      description: {
        component:
          'Modal panel that slides in from a screen edge while keeping the page in view. Use `right` for detail and edit panels, `left` for navigation drawers, `bottom` for mobile action sheets. Compose `SheetHeader`, `SheetBody` (fills the height and scrolls) and `SheetFooter`; widen side panels with `className` (e.g. `sm:max-w-md`). For short blocking questions use `Dialog` or `AlertDialog`.',
      },
    },
  },
  args: {
    side: 'right',
    showCloseButton: true,
    closeLabel: 'Close',
    modal: true,
    onOpenChange: fn(),
  },
  argTypes: {
    side: {
      control: 'inline-radio',
      options: sides,
      description: 'SheetContent: edge the panel slides in from.',
      table: { category: 'SheetContent', defaultValue: { summary: 'right' } },
    },
    showCloseButton: {
      control: 'boolean',
      description: 'SheetContent: renders the top-right close (X) button.',
      table: { category: 'SheetContent', defaultValue: { summary: 'true' } },
    },
    closeLabel: {
      control: 'text',
      description: 'SheetContent: accessible name of the built-in close (X) button, for translation.',
      table: { category: 'SheetContent', defaultValue: { summary: 'Close' } },
    },
    open: { control: false, description: 'Controlled open state (use with `onOpenChange`).' },
    defaultOpen: { control: 'boolean', description: 'Initial open state when uncontrolled.' },
    modal: { control: 'boolean', description: 'Blocks interaction with the page and traps focus. Keep `true`.' },
    onOpenChange: { control: false, description: 'Called with the next open state (trigger, Escape, outside click, close buttons).' },
    children: { control: false },
  },
  render: ({ side, showCloseButton, closeLabel, ...args }) => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <Button>Edit member</Button>
      </SheetTrigger>
      <SheetContent side={side} showCloseButton={showCloseButton} closeLabel={closeLabel}>
        <SheetHeader>
          <SheetTitle>Edit member</SheetTitle>
          <SheetDescription>Changes apply to every project of the workspace.</SheetDescription>
        </SheetHeader>
        <MemberForm />
        <SheetFooter className="flex-row justify-end">
          <SheetClose asChild>
            <Button>Cancel</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="primary">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
} satisfies Meta<SheetStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** One trigger per `side`. */
export const Sides: Story = {
  render: ({ side: _side, showCloseButton, closeLabel, ...args }) => (
    <div className="flex flex-wrap items-center gap-2">
      {sides.map((side) => (
        <Sheet key={side} {...args}>
          <SheetTrigger asChild>
            <Button className="capitalize">{side}</Button>
          </SheetTrigger>
          <SheetContent side={side} showCloseButton={showCloseButton} closeLabel={closeLabel}>
            <SheetHeader>
              <SheetTitle className="capitalize">{side} sheet</SheetTitle>
              <SheetDescription>Slides in from the {side} edge.</SheetDescription>
            </SheetHeader>
            <SheetBody className="text-[13px] text-foreground-light">Sheet content.</SheetBody>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
}

/** `side="right"` (default): detail and edit panels. */
export const Right: Story = {
  args: { defaultOpen: true, side: 'right' },
  parameters: openInDocs,
}

/** `side="left"`: navigation drawers. */
export const Left: Story = {
  args: { defaultOpen: true, side: 'left' },
  parameters: openInDocs,
}

/** `side="top"`: full-width panel with auto height. */
export const Top: Story = {
  args: { defaultOpen: true, side: 'top' },
  parameters: openInDocs,
}

/** `side="bottom"`: mobile action sheets, auto height. */
export const Bottom: Story = {
  args: { defaultOpen: true, side: 'bottom' },
  parameters: openInDocs,
  render: ({ side, showCloseButton, closeLabel, ...args }) => (
    <Sheet {...args}>
      <SheetContent side={side} showCloseButton={showCloseButton} closeLabel={closeLabel}>
        <SheetHeader>
          <SheetTitle>Share “Q3 roadmap”</SheetTitle>
          <SheetDescription>Anyone with the link can view this document.</SheetDescription>
        </SheetHeader>
        <SheetBody className="gap-2 sm:flex-row">
          <Input aria-label="Share link" mono readOnly defaultValue="https://example.com/d/q3-roadmap" />
          <Button variant="primary" size="md">
            Copy link
          </Button>
        </SheetBody>
      </SheetContent>
    </Sheet>
  ),
}

/** `showCloseButton={false}`: the footer must then offer a way out. */
export const WithoutCloseButton: Story = {
  args: { defaultOpen: true, showCloseButton: false },
  parameters: openInDocs,
}

const activity = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  who: ['Ada Park', 'Liam Chen', 'Sofia Rossi'][i % 3],
  what: ['updated the billing address', 'invited a new member', 'renamed a project', 'exported invoices'][i % 4],
  when: `${i + 2} min ago`,
}))

/** Long content: `SheetBody` scrolls while header and footer stay in place (`gap-0 p-0` for an edge-to-edge list). */
export const LongContent: Story = {
  args: { defaultOpen: true },
  parameters: openInDocs,
  render: ({ side, showCloseButton, closeLabel, ...args }) => (
    <Sheet {...args}>
      <SheetContent side={side} showCloseButton={showCloseButton} closeLabel={closeLabel}>
        <SheetHeader>
          <SheetTitle>Activity</SheetTitle>
          <SheetDescription>Latest changes in this workspace.</SheetDescription>
        </SheetHeader>
        <SheetBody className="gap-0 p-0">
          <ul>
            {activity.map((item) => (
              <li key={item.id} className="flex flex-col gap-0.5 border-b px-4 py-2.5">
                <span className="text-[13px] text-foreground">
                  <span className="font-medium">{item.who}</span> {item.what}
                </span>
                <span className="text-xs text-foreground-lighter">{item.when}</span>
              </li>
            ))}
          </ul>
        </SheetBody>
        <SheetFooter>
          <Button>Load older activity</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, active: true },
  { label: 'Projects', icon: FolderKanban },
  { label: 'Team', icon: Users },
  { label: 'Billing', icon: CreditCard },
  { label: 'Settings', icon: Settings },
]

/** Mobile navigation drawer (`side="left"`, 280px): each link is wrapped in `SheetClose` so the drawer closes on navigation. */
export const NavigationDrawer: Story = {
  args: { side: 'left' },
  render: ({ side, showCloseButton, closeLabel, ...args }) => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open navigation" icon={<Menu />} />
      </SheetTrigger>
      <SheetContent side={side} showCloseButton={showCloseButton} closeLabel={closeLabel} className="w-[280px] max-w-[85vw]" aria-describedby={undefined}>
        <SheetHeader>
          <SheetTitle>Acme Inc.</SheetTitle>
        </SheetHeader>
        <SheetBody className="px-3">
          <nav aria-label="Main" className="flex flex-col gap-0.5">
            {navItems.map(({ label, icon: Icon, active }) => (
              <SheetClose key={label} asChild>
                <a
                  href={`#${label.toLowerCase()}`}
                  aria-current={active ? 'page' : undefined}
                  className="flex h-10 items-center gap-3 rounded-md px-3 text-sm text-foreground-light transition-colors outline-none hover:bg-surface-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:bg-selection aria-[current=page]:font-medium aria-[current=page]:text-foreground"
                >
                  <Icon className="size-[18px]" strokeWidth={1.6} aria-hidden="true" />
                  {label}
                </a>
              </SheetClose>
            ))}
          </nav>
        </SheetBody>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Open navigation' }))
    const drawer = await body.findByRole('dialog', { name: 'Acme Inc.' })
    await expect(within(drawer).getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page')
    await userEvent.click(within(drawer).getByRole('link', { name: 'Team' }))
    await waitFor(() => expect(drawer).toHaveAttribute('data-state', 'closed'))
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
  },
}

/** Wider detail panel (`className="sm:max-w-md"`) with a summary, line items and footer actions. */
export const OrderDetails: Story = {
  args: { defaultOpen: true },
  parameters: openInDocs,
  render: ({ side, showCloseButton, closeLabel, ...args }) => (
    <Sheet {...args}>
      <SheetContent side={side} showCloseButton={showCloseButton} closeLabel={closeLabel} className="sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <SheetTitle>Order #10482</SheetTitle>
            <Badge variant="warning">Pending</Badge>
          </div>
          <SheetDescription>Placed by Northwind Traders on March 3, 2026.</SheetDescription>
        </SheetHeader>
        <SheetBody className="gap-5">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
            {[
              ['Customer', 'Northwind Traders'],
              ['Payment', 'Visa ending 4242'],
              ['Shipping', 'Express, 2 days'],
              ['Total', '$1,284.00'],
            ].map(([term, value]) => (
              <div key={term} className="flex flex-col gap-0.5">
                <dt className="text-xs text-foreground-lighter">{term}</dt>
                <dd className="text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-col rounded-md border">
            {[
              ['Ergonomic chair', 2, '$780.00'],
              ['Standing desk', 1, '$460.00'],
              ['Cable tray', 4, '$44.00'],
            ].map(([item, qty, amount]) => (
              <div key={item} className="flex items-center justify-between border-b px-3 py-2 text-[13px] last:border-b-0">
                <span className="text-foreground">
                  {item} <span className="text-foreground-lighter">× {qty}</span>
                </span>
                <span className="tabular text-foreground">{amount}</span>
              </div>
            ))}
          </div>
        </SheetBody>
        <SheetFooter className="flex-row justify-end">
          <Button variant="destructive">Refund</Button>
          <Button variant="primary">Mark as shipped</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

function ControlledSheet({ side, showCloseButton, closeLabel, onOpenChange, ...args }: SheetStoryArgs) {
  const [open, setOpen] = React.useState(false)
  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    onOpenChange?.(next)
  }
  return (
    <div className="flex items-center gap-3">
      <Button onClick={() => handleOpenChange(true)}>Open filters</Button>
      <span className="text-[13px] text-foreground-light">
        open: <span className="font-mono text-foreground">{String(open)}</span>
      </span>
      <Sheet {...args} open={open} onOpenChange={handleOpenChange}>
        <SheetContent side={side} showCloseButton={showCloseButton} closeLabel={closeLabel}>
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>The parent owns `open` and updates it in `onOpenChange`.</SheetDescription>
          </SheetHeader>
          <SheetBody className="text-[13px] text-foreground-light">Filter controls go here.</SheetBody>
          <SheetFooter>
            <Button variant="primary" onClick={() => handleOpenChange(false)}>
              Apply filters
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

/** Controlled with `open` + `onOpenChange`, opened by a button that is not a `SheetTrigger`. */
export const Controlled: Story = {
  render: (args) => <ControlledSheet {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Open filters' }))
    const sheet = await body.findByRole('dialog', { name: 'Filters' })
    await userEvent.click(within(sheet).getByRole('button', { name: 'Apply filters' }))
    await waitFor(() => expect(sheet).toHaveAttribute('data-state', 'closed'))
    await expect(canvas.getByText('false')).toBeInTheDocument()
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
  },
}

/**
 * Opens from the trigger, then closes with the built-in close (X) button, named by `closeLabel`
 * (reworded here).
 */
export const CloseWithButton: Story = {
  args: { closeLabel: 'Close panel' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Edit member' }))
    const sheet = await body.findByRole('dialog', { name: 'Edit member' })
    await expect(sheet).toHaveAttribute('data-state', 'open')
    await expect(within(sheet).getByLabelText('Full name')).toHaveValue('Ada Park')
    await userEvent.click(within(sheet).getByRole('button', { name: 'Close panel' }))
    await waitFor(() => expect(sheet).toHaveAttribute('data-state', 'closed'))
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
  },
}

/** Opens from the trigger, then closes with the Escape key. */
export const CloseWithEscape: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Edit member' }))
    const sheet = await body.findByRole('dialog', { name: 'Edit member' })
    await expect(sheet).toHaveAttribute('data-state', 'open')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(sheet).toHaveAttribute('data-state', 'closed'))
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
  },
}
