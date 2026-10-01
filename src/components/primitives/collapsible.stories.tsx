import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChevronRight, ChevronsUpDown } from 'lucide-react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Button } from './button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible'
import { Input } from './input'
import { Label } from './label'

const meta = {
  title: 'Primitives/Collapsible',
  component: Collapsible,
  subcomponents: { CollapsibleTrigger, CollapsibleContent },
  parameters: {
    docs: {
      description: {
        component:
          'Unstyled show/hide region with one trigger: advanced form options, "show more" lists, nav groups. Style the trigger yourself (usually a ghost `Button` via `asChild`) and rotate a chevron with `group-data-[state=open]:`. For several exclusive sections use an accordion; for floating content use `Popover`.',
      },
    },
  },
  args: {
    onOpenChange: fn(),
  },
  argTypes: {
    open: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: false },
    asChild: { control: false },
  },
  render: (args) => (
    <Collapsible {...args} className="group w-80 rounded-lg border bg-card shadow-card">
      <div className="flex flex-col gap-1.5 p-4">
        <Label htmlFor="project-name">Project name</Label>
        <Input id="project-name" size="sm" defaultValue="Website redesign" />
      </div>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-start rounded-none border-t px-4">
          <ChevronRight className="transition-transform duration-150 group-data-[state=open]:rotate-90" />
          Advanced options
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-3 border-t p-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="project-slug">URL slug</Label>
          <Input id="project-slug" size="sm" mono defaultValue="website-redesign" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="project-key">Issue prefix</Label>
          <Input id="project-key" size="sm" mono defaultValue="WEB" />
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Open: Story = {
  args: { defaultOpen: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

const members = [
  { name: 'Maya Chen', role: 'Owner' },
  { name: 'Liam Novak', role: 'Admin' },
  { name: 'Sara Ortiz', role: 'Member' },
  { name: 'Tom Becker', role: 'Member' },
  { name: 'Aiko Tanaka', role: 'Member' },
  { name: 'Omar Haddad', role: 'Billing' },
]

function MemberRow({ name, role }: { name: string; role: string }) {
  return (
    <li className="flex items-center justify-between px-4 py-2 text-[13px]">
      <span className="text-foreground">{name}</span>
      <span className="text-foreground-lighter">{role}</span>
    </li>
  )
}

function ShowMoreExample({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  const [open, setOpen] = React.useState(false)
  const visible = members.slice(0, 3)
  const hidden = members.slice(3)
  return (
    <Collapsible
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        onOpenChange?.(next)
      }}
      className="w-80 rounded-lg border bg-card shadow-card"
    >
      <div className="flex h-10 items-center border-b px-4 mono-label">Team members</div>
      <ul className="divide-y">
        {visible.map((m) => (
          <MemberRow key={m.name} {...m} />
        ))}
      </ul>
      <CollapsibleContent asChild>
        <ul className="divide-y border-t">
          {hidden.map((m) => (
            <MemberRow key={m.name} {...m} />
          ))}
        </ul>
      </CollapsibleContent>
      <div className="border-t p-1.5">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="tiny" className="w-full" iconRight={<ChevronsUpDown />}>
            {open ? 'Show less' : `Show ${hidden.length} more`}
          </Button>
        </CollapsibleTrigger>
      </div>
    </Collapsible>
  )
}

/** Controlled "show more" list: `open` + `onOpenChange` drive the trigger label. */
export const ShowMore: Story = {
  render: (args) => <ShowMoreExample onOpenChange={args.onOpenChange} />,
}

/**
 * Animated open/close: `animate-collapsible-down` / `-up` (from tw-animate-css) run on the content height.
 * Keep `overflow-hidden` on `CollapsibleContent` and the padding on an inner element.
 */
export const Animated: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <Collapsible {...args} className="group w-80 rounded-lg border bg-card shadow-card">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between rounded-none px-4">
          Billing address
          <ChevronRight className="transition-transform duration-150 group-data-[state=open]:rotate-90" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div className="flex flex-col gap-0.5 border-t px-4 py-3 text-[13px] text-foreground-light">
          <span className="text-foreground">Northwind Traders</span>
          <span>221 Market Street, Suite 400</span>
          <span>San Francisco, CA 94105</span>
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Billing address' })
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(canvas.getByText('Northwind Traders')).toBeInTheDocument()

    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    // The content unmounts once the close animation has finished.
    await waitFor(() => expect(canvas.queryByText('Northwind Traders')).not.toBeInTheDocument())
  },
}

export const Interaction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Advanced options' })
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(canvas.queryByLabelText('URL slug')).not.toBeInTheDocument()

    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(canvas.getByLabelText('URL slug')).toHaveValue('website-redesign')
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true)

    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
  },
}

export const ShowMoreInteraction: Story = {
  render: (args) => <ShowMoreExample onOpenChange={args.onOpenChange} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByText('Omar Haddad')).not.toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Show 3 more' }))
    await expect(canvas.getByText('Omar Haddad')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Show less' })).toHaveAttribute('aria-expanded', 'true')
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true)
  },
}
