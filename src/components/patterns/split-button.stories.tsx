import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Ban,
  CalendarClock,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Link2,
  Mail,
  RefreshCw,
  Save,
  Send,
  Users,
} from 'lucide-react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Badge } from '../primitives/badge'
import { Button } from '../primitives/button'
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '../primitives/dropdown-menu'
import { Input } from '../primitives/input'
import { Textarea } from '../primitives/textarea'

import { Field } from './field'
import { PageHeader } from './page'
import { SplitButton, type SplitButtonProps, type SplitButtonSize, type SplitButtonVariant } from './split-button'

type SplitButtonStoryArgs = SplitButtonProps & {
  /** Story-only: called with the id of the selected menu item (wired into each story's example menu). */
  onItemSelect?: (id: string) => void
}

type OnItemSelect = SplitButtonStoryArgs['onItemSelect']

/** Alternatives of "Export CSV": other formats, then a recurring export. */
const exportItems = (onItemSelect?: OnItemSelect) => (
  <>
    <DropdownMenuLabel>Export as</DropdownMenuLabel>
    <DropdownMenuItem onSelect={() => onItemSelect?.('csv')}>
      <FileText /> CSV
    </DropdownMenuItem>
    <DropdownMenuItem onSelect={() => onItemSelect?.('xlsx')}>
      <FileSpreadsheet /> Excel (.xlsx)
    </DropdownMenuItem>
    <DropdownMenuItem onSelect={() => onItemSelect?.('pdf')}>
      <Download /> PDF
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onSelect={() => onItemSelect?.('schedule')}>
      <CalendarClock /> Schedule a recurring export…
    </DropdownMenuItem>
  </>
)

/** Alternatives of "Publish": schedule it, narrow the audience or keep it as a draft. */
const publishItems = (onItemSelect?: OnItemSelect) => (
  <>
    <DropdownMenuItem onSelect={() => onItemSelect?.('schedule')}>
      <CalendarClock /> Schedule for later…
    </DropdownMenuItem>
    <DropdownMenuItem onSelect={() => onItemSelect?.('members')}>
      <Users /> Publish to members only
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onSelect={() => onItemSelect?.('draft')}>
      <Save /> Save as draft
    </DropdownMenuItem>
  </>
)

/** Alternatives of "Revoke key": revoke with a replacement, or the destructive bulk revoke. */
const revokeItems = (onItemSelect?: OnItemSelect) => (
  <>
    <DropdownMenuItem onSelect={() => onItemSelect?.('rotate')}>
      <RefreshCw /> Revoke and create a replacement
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive" onSelect={() => onItemSelect?.('revoke-all')}>
      <Ban /> Revoke all API keys…
    </DropdownMenuItem>
  </>
)

const meta = {
  title: 'Patterns/Split Button',
  component: SplitButton,
  parameters: {
    docs: {
      description: {
        component:
          'A main action joined to a chevron that opens a menu of related alternatives ("Export CSV" + other formats, "Publish" + Schedule / Save as draft). Use it when one action is clearly the default and a few variants of it are occasionally needed; name the chevron with `menuLabel` ("More publish options"). Both halves share `variant` and `size`; `loading` and `disabled` also lock the menu unless `menuDisabled={false}`. Do NOT use it for equally important actions (separate buttons), for a button that only opens a menu (a Button with a trailing ChevronDown as DropdownMenuTrigger), or for unrelated actions (a "more" icon menu).',
      },
    },
  },
  args: {
    children: 'Export CSV',
    icon: <Download />,
    variant: 'default',
    size: 'sm',
    menuLabel: 'More export options',
    // Each story builds its example menu from `onItemSelect` when `menu` is empty.
    menu: null,
    loading: false,
    disabled: false,
    onClick: fn(),
    onOpenChange: fn(),
    onItemSelect: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'primary', 'outline', 'destructive', 'warning'] },
    size: { control: 'inline-radio', options: ['tiny', 'sm', 'md', 'lg'] },
    children: { control: 'text' },
    menuLabel: { control: 'text' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    menuDisabled: { control: 'boolean' },
    type: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
    icon: { control: false },
    menu: { control: false },
    menuProps: { control: false },
    actionProps: { control: false },
    // Shown by the MenuOpen (`defaultOpen`) and ControlledMenu (`open` + `onOpenChange`) stories.
    open: { control: false },
    defaultOpen: { control: false },
    onClick: { control: false },
    onOpenChange: { control: false },
    onItemSelect: { control: false },
  },
  render: ({ onItemSelect, menu, ...args }) => <SplitButton {...args} menu={menu ?? exportItems(onItemSelect)} />,
} satisfies Meta<SplitButtonStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

/** Neutral split button: the main button exports a CSV, the chevron offers the other formats. Use the controls to try every prop. */
export const Default: Story = {}

/** `primary`: the main action of the view; a translucent divider separates the two halves. */
export const Primary: Story = {
  args: { children: 'Publish', icon: <Send />, variant: 'primary', menuLabel: 'More publish options' },
  render: ({ onItemSelect, menu, ...args }) => <SplitButton {...args} menu={menu ?? publishItems(onItemSelect)} />,
}

/**
 * `destructive`: an impactful action with safer or broader variants in the menu. Mark irreversible items
 * `variant="destructive"` and confirm them in a ConfirmDialog opened from `onSelect`.
 */
export const Danger: Story = {
  args: { children: 'Revoke key', icon: <Ban />, variant: 'destructive', menuLabel: 'More revoke options' },
  render: ({ onItemSelect, menu, ...args }) => <SplitButton {...args} menu={menu ?? revokeItems(onItemSelect)} />,
}

const variants: SplitButtonVariant[] = ['default', 'primary', 'outline', 'destructive', 'warning']

/** Every supported variant. Bordered variants share a single 1px seam; `primary` draws a divider. */
export const Variants: Story = {
  parameters: { layout: 'padded' },
  render: ({ onItemSelect, variant: _variant, children: _children, menuLabel: _menuLabel, ...args }) => (
    <div className="flex flex-wrap items-center gap-3">
      {variants.map((variant) => (
        <SplitButton
          key={variant}
          {...args}
          variant={variant}
          menuLabel={`More ${variant} options`}
          menu={exportItems(onItemSelect)}
        >
          {variant.charAt(0).toUpperCase() + variant.slice(1)}
        </SplitButton>
      ))}
    </div>
  ),
}

const sizes: { size: SplitButtonSize; label: string }[] = [
  { size: 'tiny', label: 'Tiny · 26px' },
  { size: 'sm', label: 'Small · 30px' },
  { size: 'md', label: 'Medium · 34px' },
  { size: 'lg', label: 'Large · 38px' },
]

/** Every size, in the default and primary variants: the chevron stays square and matches the main button's height. */
export const Sizes: Story = {
  parameters: { layout: 'padded' },
  render: ({ onItemSelect, size: _size, variant: _variant, children: _children, menuLabel: _menuLabel, ...args }) => (
    <div className="flex flex-col gap-4">
      {(['default', 'primary'] as const).map((variant) => (
        <div key={variant} className="flex flex-wrap items-center gap-3">
          {sizes.map(({ size, label }) => (
            <SplitButton
              key={size}
              {...args}
              variant={variant}
              size={size}
              menuLabel={`More options (${variant}, ${size})`}
              menu={exportItems(onItemSelect)}
            >
              {label}
            </SplitButton>
          ))}
        </div>
      ))}
    </div>
  ),
}

/** `loading`: spinner in place of the icon, and both halves are disabled while the main action runs. */
export const Loading: Story = {
  args: { ...Primary.args, children: 'Publishing…', loading: true },
  render: Primary.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const main = canvas.getByRole('button', { name: 'Publishing…' })
    await expect(main).toBeDisabled()
    await expect(main).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.getByRole('button', { name: 'More publish options' })).toBeDisabled()
  },
}

/** `disabled`: both halves are disabled. */
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Export CSV' })).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'More export options' })).toBeDisabled()
  },
}

/**
 * `disabled` with `menuDisabled={false}`: the main action is unavailable (the customer has no billing
 * email) but its alternatives still apply, so the menu stays reachable. Say why next to the button.
 */
export const MenuStillAvailable: Story = {
  args: { children: 'Send invoice', icon: <Mail />, variant: 'primary', disabled: true, menuDisabled: false, menuLabel: 'More invoice actions' },
  parameters: { layout: 'padded' },
  render: ({ onItemSelect, menu, ...args }) => (
    <div className="flex items-center gap-3">
      <p id="send-invoice-hint" className="text-[13px] text-foreground-light">
        Add a billing email to send this invoice.
      </p>
      <SplitButton
        {...args}
        actionProps={{ 'aria-describedby': 'send-invoice-hint' }}
        menu={
          menu ?? (
            <>
              <DropdownMenuItem onSelect={() => onItemSelect?.('pdf')}>
                <Download /> Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onItemSelect?.('link')}>
                <Link2 /> Copy payment link
              </DropdownMenuItem>
            </>
          )
        }
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const main = canvas.getByRole('button', { name: 'Send invoice' })
    await expect(main).toBeDisabled()
    await expect(main).toHaveAccessibleDescription('Add a billing email to send this invoice.')
    await expect(canvas.getByRole('button', { name: 'More invoice actions' })).toBeEnabled()
  },
}

/**
 * Interaction: the main button runs `onClick`; the chevron opens the menu from the keyboard (Enter),
 * focus lands on the first item, arrows move, Enter selects and closes, and focus returns to the chevron.
 */
export const MenuKeyboard: Story = {
  args: Primary.args,
  render: Primary.render,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Publish' }))
    await expect(args.onClick).toHaveBeenCalledOnce()

    const trigger = canvas.getByRole('button', { name: 'More publish options' })
    await expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    trigger.focus()
    await userEvent.keyboard('{Enter}')

    const menu = await body.findByRole('menu')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true)
    await waitFor(() => expect(within(menu).getByRole('menuitem', { name: 'Schedule for later…' })).toHaveFocus())
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(within(menu).getByRole('menuitem', { name: 'Publish to members only' })).toHaveFocus())
    await userEvent.keyboard('{Enter}')

    await expect(args.onItemSelect).toHaveBeenCalledWith('members')
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
    // The main action ran only once: opening the menu and picking an item do not trigger it.
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

/**
 * `defaultOpen`: the menu starts open (uncontrolled), right-aligned under the chevron. Shown here for
 * visual review of the panel; in an app the menu normally opens from the chevron.
 */
export const MenuOpen: Story = {
  args: { defaultOpen: true },
  // Own iframe on docs pages, tall enough for the panel under the centered button.
  parameters: { docs: { story: { inline: false, height: '420px' } } },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const menu = await body.findByRole('menu')
    await expect(within(menu).getByRole('menuitem', { name: 'Excel (.xlsx)' })).toBeInTheDocument()
    await expect(menu).toHaveAttribute('data-state', 'open')
  },
}

function ControlledMenuDemo({ onOpenChange, ...args }: SplitButtonProps) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="flex items-center gap-3">
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Open menu
      </Button>
      <SplitButton
        {...args}
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          onOpenChange?.(next)
        }}
      />
    </div>
  )
}

/**
 * Controlled menu: `open` + `onOpenChange` keep the state outside, so something else can open the
 * menu (here another button; in an app a keyboard shortcut or an onboarding step). Always update the
 * state from `onOpenChange`, or the menu cannot close.
 */
export const ControlledMenu: Story = {
  parameters: { layout: 'padded', docs: { story: { inline: false, height: '300px' } } },
  render: ({ onItemSelect, menu, ...args }) => (
    <ControlledMenuDemo {...args} menu={menu ?? exportItems(onItemSelect)} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole('button', { name: 'More export options' })
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }))
    const menu = await body.findByRole('menu')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')

    await userEvent.keyboard('{Escape}')
    // Checked through attributes: the menu stays mounted until its exit animation ends.
    await waitFor(() => expect(menu).toHaveAttribute('data-state', 'closed'))
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
  },
}

/** Composition: the primary action of a record page header, after a secondary button. */
export const InPageHeader: Story = {
  args: { children: 'Send invoice', icon: <Send />, variant: 'primary', menuLabel: 'More send options' },
  parameters: { layout: 'padded' },
  render: ({ onItemSelect, menu, ...args }) => (
    <div className="max-w-3xl">
      <PageHeader
        title="Invoice INV-2041"
        badges={<Badge variant="warning">Due in 5 days</Badge>}
        description="Northwind Traders · $4,280.00 · Issued Sep 30"
        actions={
          <>
            <Button icon={<Eye />}>Preview</Button>
            <SplitButton
              {...args}
              menuProps={{ className: 'w-60' }}
              menu={
                menu ?? (
                  <>
                    <DropdownMenuItem onSelect={() => onItemSelect?.('send-reminders')}>
                      <CalendarClock /> Send with payment reminders
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onItemSelect?.('send-copy')}>
                      <Mail /> Send and copy me
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => onItemSelect?.('pdf')}>
                      <Download /> Download PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onItemSelect?.('link')}>
                      <Link2 /> Copy payment link
                    </DropdownMenuItem>
                  </>
                )
              }
            />
          </>
        }
      />
    </div>
  ),
}

function ArticleFormDemo(args: Omit<SplitButtonStoryArgs, 'menu' | 'onItemSelect'>) {
  const [status, setStatus] = React.useState('')
  return (
    <form
      className="flex w-[440px] flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        setStatus('Published')
      }}
    >
      <Field label="Title">
        <Input defaultValue="Q3 product update" />
      </Field>
      <Field label="Summary">
        <Textarea defaultValue="New dashboards, faster exports and a refreshed billing page." rows={3} />
      </Field>
      <div className="flex items-center justify-end gap-2">
        <p role="status" className="mr-auto text-[13px] text-foreground-light">
          {status}
        </p>
        <Button type="reset" onClick={() => setStatus('')}>
          Cancel
        </Button>
        <SplitButton
          {...args}
          type="submit"
          menu={
            <>
              <DropdownMenuItem onSelect={() => setStatus('Scheduled for Monday 9:00')}>
                <CalendarClock /> Schedule for later…
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setStatus('Saved as draft')}>
                <Save /> Save as draft
              </DropdownMenuItem>
            </>
          }
        />
      </div>
    </form>
  )
}

/**
 * Composition: the submit button of a form (`type="submit"`), so Enter in a field runs the main action;
 * the menu offers the other ways to save.
 */
export const InForm: Story = {
  args: { children: 'Publish', icon: <Send />, variant: 'primary', menuLabel: 'More publish options' },
  parameters: { layout: 'padded' },
  render: ({ onItemSelect: _onItemSelect, menu: _menu, ...args }) => <ArticleFormDemo {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    // Grab the status first: while the modal menu is open (and animating out), the page is aria-hidden.
    const status = canvas.getByRole('status')
    await userEvent.click(canvas.getByRole('button', { name: 'Publish' }))
    await expect(status).toHaveTextContent('Published')

    const trigger = canvas.getByRole('button', { name: 'More publish options' })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    const menu = await body.findByRole('menu')
    await waitFor(() => expect(within(menu).getByRole('menuitem', { name: 'Schedule for later…' })).toHaveFocus())
    await userEvent.keyboard('{ArrowDown}{Enter}')
    await waitFor(() => expect(status).toHaveTextContent('Saved as draft'))
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
  },
}
