import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CalendarDays, ListFilter, Share2 } from 'lucide-react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Button } from './button'
import { Checkbox } from './checkbox'
import { Input } from './input'
import { Label } from './label'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from './popover'
import { Separator } from './separator'

/** Story args: the `Popover` root props plus the positioning options of `PopoverContent`. */
type PopoverStoryArgs = React.ComponentProps<typeof Popover> &
  Pick<React.ComponentProps<typeof PopoverContent>, 'side' | 'align' | 'sideOffset'>

type PopoverSide = NonNullable<PopoverStoryArgs['side']>
type PopoverAlign = NonNullable<PopoverStoryArgs['align']>

const sides: PopoverSide[] = ['top', 'right', 'bottom', 'left']
const aligns: PopoverAlign[] = ['start', 'center', 'end']

/** Open-by-default stories render in their own iframe so the panel stays next to its trigger. */
const openInDocs = { docs: { story: { inline: false, iframeHeight: 360 } } }

function SharePopover({ side, align, sideOffset, ...args }: PopoverStoryArgs) {
  return (
    <Popover {...args}>
      <PopoverTrigger asChild>
        <Button icon={<Share2 />}>Share</Button>
      </PopoverTrigger>
      <PopoverContent side={side} align={align} sideOffset={sideOffset} className="flex flex-col gap-3">
        <PopoverHeader>
          <PopoverTitle>Share this dashboard</PopoverTitle>
          <PopoverDescription>Anyone with the link can view it.</PopoverDescription>
        </PopoverHeader>
        <div className="flex gap-2">
          <Input aria-label="Share link" size="sm" mono readOnly defaultValue="https://example.com/s/8f2k" />
          <Button variant="primary">Copy</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

const meta = {
  title: 'Primitives/Popover',
  component: Popover,
  subcomponents: { PopoverTrigger, PopoverContent, PopoverAnchor, PopoverHeader, PopoverTitle, PopoverDescription },
  parameters: {
    docs: {
      description: {
        component:
          'Non-modal floating panel anchored to a trigger, for small interactive content: quick edits, filters, share settings, pickers. Open a heading with `PopoverHeader` (`PopoverTitle` + `PopoverDescription`); adjust placement with `side` / `align`. Use `DropdownMenu` for lists of commands, `Tooltip` for read-only hints and `Dialog` for anything large.',
      },
    },
  },
  args: {
    side: 'bottom',
    align: 'center',
    sideOffset: 6,
    modal: false,
    onOpenChange: fn(),
  },
  argTypes: {
    side: {
      control: 'inline-radio',
      options: sides,
      description: 'PopoverContent: preferred side of the trigger; flips when there is no room.',
      table: { category: 'PopoverContent', defaultValue: { summary: 'bottom' } },
    },
    align: {
      control: 'inline-radio',
      options: aligns,
      description: 'PopoverContent: alignment against the trigger along the chosen side.',
      table: { category: 'PopoverContent', defaultValue: { summary: 'center' } },
    },
    sideOffset: {
      control: { type: 'number', min: 0, max: 24 },
      description: 'PopoverContent: gap in px between trigger and panel.',
      table: { category: 'PopoverContent', defaultValue: { summary: '6' } },
    },
    open: { control: false, description: 'Controlled open state (use with `onOpenChange`).' },
    defaultOpen: { control: 'boolean', description: 'Initial open state when uncontrolled.' },
    modal: {
      control: 'boolean',
      description:
        'When `true`, traps focus, blocks the page and hides it from screen readers while open. Default `false`: keep it for most popovers.',
    },
    onOpenChange: { control: false, description: 'Called with the next open state (trigger, Escape, outside click).' },
    children: { control: false },
  },
  render: (args) => <SharePopover {...args} />,
} satisfies Meta<PopoverStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Opened on load, for visual review. */
export const Open: Story = {
  args: { defaultOpen: true },
  parameters: openInDocs,
}

/** Every `side`. Open each trigger to see where the panel lands. */
export const Sides: Story = {
  render: ({ side: _side, align, sideOffset, ...args }) => (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {sides.map((side) => (
        <Popover key={side} {...args}>
          <PopoverTrigger asChild>
            <Button className="capitalize">{side}</Button>
          </PopoverTrigger>
          <PopoverContent side={side} align={align} sideOffset={sideOffset} className="w-48 text-[13px]">
            Opens on the <span className="font-medium">{side}</span> side.
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
}

/** Every `align` on the bottom side, opened on load. */
export const Alignments: Story = {
  args: { defaultOpen: true },
  parameters: { ...openInDocs, layout: 'padded' },
  render: ({ align: _align, side, sideOffset, ...args }) => (
    <div className="flex flex-col items-center gap-20 pt-2 pb-16">
      {aligns.map((align) => (
        <Popover key={align} {...args}>
          <PopoverTrigger asChild>
            <Button className="w-40">align=&quot;{align}&quot;</Button>
          </PopoverTrigger>
          <PopoverContent
            side={side}
            align={align}
            sideOffset={sideOffset}
            onOpenAutoFocus={(event) => event.preventDefault()}
            className="w-56 p-2.5 text-[13px]"
          >
            Aligned to the {align} edge.
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
}

/** Custom width and no padding (`className="w-56 p-0"`) for list-like content with its own sections. */
export const FilterList: Story = {
  args: { align: 'start' },
  render: ({ side, align, sideOffset, ...args }) => (
    <Popover {...args}>
      <PopoverTrigger asChild>
        <Button variant="dashed" icon={<ListFilter />}>
          Status
        </Button>
      </PopoverTrigger>
      <PopoverContent side={side} align={align} sideOffset={sideOffset} className="w-56 p-0" aria-label="Filter by status">
        <div className="flex flex-col gap-0.5 p-1.5">
          {['Paid', 'Pending', 'Overdue', 'Refunded'].map((status) => (
            <Label
              key={status}
              className="h-8 cursor-pointer rounded-md px-2 text-[13px] font-normal hover:bg-surface-200"
            >
              <Checkbox defaultChecked={status !== 'Refunded'} />
              {status}
            </Label>
          ))}
        </div>
        <Separator />
        <div className="flex justify-end gap-2 p-2">
          <Button size="tiny" variant="ghost">
            Reset
          </Button>
          <Button size="tiny" variant="primary">
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

/** `PopoverAnchor` positions the panel against the whole field while the trigger is the icon inside it. */
export const WithAnchor: Story = {
  args: { align: 'start' },
  render: ({ side, align, sideOffset, ...args }) => (
    <Popover {...args}>
      <PopoverAnchor asChild>
        <div className="flex w-64 items-center gap-1 rounded-md border border-border-strong bg-surface-100 pr-1 dark:bg-surface-200">
          <input
            aria-label="Due date"
            defaultValue="2026-03-31"
            className="h-[30px] min-w-0 flex-1 bg-transparent px-2.5 font-mono text-[13px] text-foreground outline-none"
          />
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon-tiny" aria-label="Pick a date" icon={<CalendarDays />} />
          </PopoverTrigger>
        </div>
      </PopoverAnchor>
      <PopoverContent side={side} align={align} sideOffset={sideOffset} className="w-64">
        <PopoverHeader>
          <PopoverTitle>Due date</PopoverTitle>
          <PopoverDescription>A date picker would render here, aligned with the field.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
}

function QuickEditPopover({ side, align, sideOffset, onOpenChange, ...args }: PopoverStoryArgs) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState('Marketing site')
  const [draft, setDraft] = React.useState(name)
  const handleOpenChange = (next: boolean) => {
    if (next) setDraft(name)
    setOpen(next)
    onOpenChange?.(next)
  }
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-foreground">{name}</span>
      <Popover {...args} open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button size="tiny" variant="ghost">
            Rename
          </Button>
        </PopoverTrigger>
        <PopoverContent side={side} align={align} sideOffset={sideOffset} aria-label="Rename project">
          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              setName(draft.trim() || name)
              handleOpenChange(false)
            }}
          >
            <PopoverHeader>
              <PopoverTitle>Rename project</PopoverTitle>
              <PopoverDescription>The URL of the project does not change.</PopoverDescription>
            </PopoverHeader>
            <Input aria-label="Project name" size="sm" value={draft} onChange={(event) => setDraft(event.target.value)} />
            <div className="flex justify-end gap-2">
              <Button type="button" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save
              </Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  )
}

/** Controlled quick-edit form: `open` + `onOpenChange`, closed programmatically on submit. */
export const QuickEdit: Story = {
  args: { align: 'start' },
  render: (args) => <QuickEditPopover {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Rename' }))
    const panel = await body.findByRole('dialog', { name: 'Rename project' })
    const input = within(panel).getByRole('textbox', { name: 'Project name' })
    await userEvent.clear(input)
    await userEvent.type(input, 'Customer portal')
    await userEvent.click(within(panel).getByRole('button', { name: 'Save' }))
    await waitFor(() => expect(panel).toHaveAttribute('data-state', 'closed'))
    await expect(canvas.getByText('Customer portal')).toBeInTheDocument()
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
  },
}

/** Opens from the trigger, then closes with the Escape key. */
export const CloseWithEscape: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Share' }))
    const panel = await body.findByRole('dialog')
    await expect(panel).toHaveAttribute('data-state', 'open')
    await expect(within(panel).getByText('Share this dashboard')).toBeInTheDocument()
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(panel).toHaveAttribute('data-state', 'closed'))
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
  },
}

/** Clicking the trigger again toggles the popover closed. */
export const ToggleWithTrigger: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole('button', { name: 'Share' })
    await userEvent.click(trigger)
    const panel = await body.findByRole('dialog')
    await expect(panel).toHaveAttribute('data-state', 'open')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(trigger)
    await waitFor(() => expect(panel).toHaveAttribute('data-state', 'closed'))
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  },
}

/** Non-modal by default: a pointer press outside the panel closes it and the page stays interactive. */
export const CloseOnOutsideClick: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <SharePopover {...args} />
      <span className="text-[13px] text-foreground-light">Click here to dismiss</span>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Share' }))
    const panel = await body.findByRole('dialog')
    await expect(panel).toHaveAttribute('data-state', 'open')
    await userEvent.click(canvas.getByText('Click here to dismiss'))
    await waitFor(() => expect(panel).toHaveAttribute('data-state', 'closed'))
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
  },
}
