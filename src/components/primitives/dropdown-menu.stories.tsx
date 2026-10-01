import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import {
  Archive,
  BookOpen,
  ChevronDown,
  Copy,
  CreditCard,
  FolderInput,
  LogOut,
  Mail,
  MoreHorizontal,
  Pencil,
  Settings,
  Settings2,
  Share2,
  Trash2,
  User,
  UserCog,
} from 'lucide-react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

import { isMac } from '../../lib/platform'
import { Avatar, AvatarFallback } from './avatar'
import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu'

/** Platform-aware shortcut label: "⌘E" on Apple platforms, "Ctrl+E" elsewhere. */
const shortcut = (key: string) => (isMac ? `⌘${key}` : `Ctrl+${key}`)

type DropdownMenuStoryArgs = React.ComponentProps<typeof DropdownMenu> & {
  /** Story-only: called with the id of the selected item. */
  onItemSelect?: (id: string) => void
}

/** Keeps open-state stories contained in their own frame on the docs page. */
const inFrame = (height: number) => ({ docs: { story: { inline: false, iframeHeight: `${height}px` } } })

const meta = {
  title: 'Primitives/Dropdown Menu',
  component: DropdownMenu,
  subcomponents: {
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuPortal,
  },
  parameters: {
    docs: {
      description: {
        component:
          'Menu of actions or options opened from a trigger button: raised popover panel, 13px items, mono uppercase section labels. Use it for contextual actions (row "more" menus, account menus) and display options (checkbox / radio items); use `variant="destructive"` for irreversible actions and keep submenus one level deep. To pick a form value use Select; for rich interactive content use Popover.',
      },
    },
  },
  args: {
    modal: true,
    onOpenChange: fn(),
    onItemSelect: fn(),
  },
  argTypes: {
    open: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
    modal: { control: 'boolean' },
    dir: { control: 'inline-radio', options: ['ltr', 'rtl'] },
    children: { control: false },
    onItemSelect: { control: false },
  },
  render: ({ onItemSelect, ...args }) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger asChild>
        <Button iconRight={<ChevronDown />}>Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuLabel>Project</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => onItemSelect?.('edit')}>
            <Pencil />
            Edit
            <DropdownMenuShortcut>{shortcut('E')}</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onItemSelect?.('duplicate')}>
            <Copy />
            Duplicate
            <DropdownMenuShortcut>{shortcut('D')}</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onItemSelect?.('share')}>
            <Share2 />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onItemSelect?.('archive')}>
            <Archive />
            Archive
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => onItemSelect?.('delete')}>
          <Trash2 />
          Delete project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
} satisfies Meta<DropdownMenuStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

/** Click the trigger (or focus it and press Enter) to open the menu. */
export const Default: Story = {}

/** Opened by default for visual review (`modal={false}` keeps the rest of the page usable). */
export const Open: Story = {
  args: { defaultOpen: true, modal: false },
  parameters: { layout: 'padded', ...inFrame(300) },
}

/** Every item state: label, plain, with icon, inset label + item, with shortcut, disabled, destructive and destructive + disabled. */
export const ItemStates: Story = {
  args: { defaultOpen: true, modal: false },
  parameters: { layout: 'padded', ...inFrame(400) },
  render: ({ onItemSelect: _onItemSelect, ...args }) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger asChild>
        <Button iconRight={<ChevronDown />}>Item states</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Label</DropdownMenuLabel>
        <DropdownMenuItem>Plain item</DropdownMenuItem>
        <DropdownMenuItem>
          <Mail />
          With icon
        </DropdownMenuItem>
        <DropdownMenuLabel inset>Inset label</DropdownMenuLabel>
        <DropdownMenuItem inset>Inset item</DropdownMenuItem>
        <DropdownMenuItem>
          With shortcut
          <DropdownMenuShortcut>{shortcut('S')}</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <FolderInput />
          Disabled item
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2 />
          Destructive item
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" disabled>
          <Trash2 />
          Destructive, disabled
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

function ColumnsMenuDemo(props: React.ComponentProps<typeof DropdownMenu>) {
  const [columns, setColumns] = React.useState({ email: true, role: true, status: false, lastActive: true })
  const toggle = (key: keyof typeof columns) => (checked: boolean) => setColumns((c) => ({ ...c, [key]: checked }))
  // preventDefault keeps the menu open so several columns can be toggled in a row.
  const keepOpen = (event: Event) => event.preventDefault()
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        <Button icon={<Settings2 />}>View</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Columns</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked disabled>
          Name
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={columns.email} onCheckedChange={toggle('email')} onSelect={keepOpen}>
          Email
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={columns.role} onCheckedChange={toggle('role')} onSelect={keepOpen}>
          Role
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={columns.status} onCheckedChange={toggle('status')} onSelect={keepOpen}>
          Status
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={columns.lastActive}
          onCheckedChange={toggle('lastActive')}
          onSelect={keepOpen}
        >
          Last active
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Checkbox items toggle display options; the menu stays open while toggling. "Name" is locked (checked + disabled). */
export const CheckboxItems: Story = {
  args: { defaultOpen: true, modal: false },
  parameters: { layout: 'padded', ...inFrame(280) },
  render: ({ onItemSelect: _onItemSelect, ...args }) => (
    <div className="flex justify-end">
      <ColumnsMenuDemo {...args} />
    </div>
  ),
}

/** Toggling a checkbox item flips its state and, thanks to `preventDefault` in `onSelect`, keeps the menu open. */
export const CheckboxToggle: Story = {
  args: { modal: false },
  parameters: { layout: 'padded', ...inFrame(280) },
  render: ({ onItemSelect: _onItemSelect, ...args }) => <ColumnsMenuDemo {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'View' }))
    const menu = await screen.findByRole('menu')
    const status = within(menu).getByRole('menuitemcheckbox', { name: 'Status' })
    await expect(status).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(status)
    await waitFor(() => expect(status).toHaveAttribute('aria-checked', 'true'))
    await expect(canvas.getByRole('button', { name: 'View' })).toHaveAttribute('aria-expanded', 'true')
    await expect(within(menu).getByRole('menuitemcheckbox', { name: 'Name' })).toHaveAttribute('aria-disabled', 'true')
  },
}

function SortMenuDemo({
  onItemSelect,
  ...props
}: React.ComponentProps<typeof DropdownMenu> & { onItemSelect?: (id: string) => void }) {
  const [sort, setSort] = React.useState('newest')
  const [density, setDensity] = React.useState('comfortable')
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        <Button iconRight={<ChevronDown />}>Sort &amp; display</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={sort}
          onValueChange={(value) => {
            setSort(value)
            onItemSelect?.(`sort:${value}`)
          }}
        >
          <DropdownMenuRadioItem value="newest">Newest first</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="oldest">Oldest first</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="name">Name (A–Z)</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="amount" disabled>
            Amount
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Density</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={density}
          onValueChange={(value) => {
            setDensity(value)
            onItemSelect?.(`density:${value}`)
          }}
        >
          <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Radio groups hold one exclusive choice each (sort order, density). */
export const RadioItems: Story = {
  args: { defaultOpen: true, modal: false },
  parameters: { layout: 'padded', ...inFrame(330) },
  render: (args) => <SortMenuDemo {...args} />,
}

/**
 * Picking a radio item by keyboard: Enter opens the menu on its first item, ArrowDown moves, Enter
 * selects and closes. Reopened, the menu shows the new choice checked.
 */
export const RadioSelect: Story = {
  parameters: { layout: 'padded', ...inFrame(330) },
  render: (args) => <SortMenuDemo {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Sort & display' })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    const menu = await screen.findByRole('menu')
    const newest = within(menu).getByRole('menuitemradio', { name: 'Newest first' })
    const oldest = within(menu).getByRole('menuitemradio', { name: 'Oldest first' })
    await expect(newest).toHaveAttribute('aria-checked', 'true')
    await expect(oldest).toHaveAttribute('aria-checked', 'false')
    await waitFor(() => expect(newest).toHaveFocus())
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(oldest).toHaveFocus())
    await userEvent.keyboard('{Enter}')
    await expect(args.onItemSelect).toHaveBeenCalledWith('sort:oldest')
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())

    trigger.focus()
    await userEvent.keyboard('{Enter}')
    const reopened = await screen.findByRole('menu')
    await expect(within(reopened).getByRole('menuitemradio', { name: 'Oldest first' })).toHaveAttribute('aria-checked', 'true')
    await expect(within(reopened).getByRole('menuitemradio', { name: 'Newest first' })).toHaveAttribute('aria-checked', 'false')
  },
}

/**
 * A submenu opened by default. Wrap `DropdownMenuSubContent` in `DropdownMenuPortal` so it is never clipped.
 * Below the separator, `inset` on a `DropdownMenuSubTrigger` without icon lines its text up with the
 * checkbox item above it.
 */
export const Submenu: Story = {
  args: { defaultOpen: true, modal: false },
  parameters: { layout: 'padded', ...inFrame(340) },
  render: ({ onItemSelect, ...args }) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger asChild>
        <Button iconRight={<ChevronDown />}>Document</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem onSelect={() => onItemSelect?.('rename')}>
          <Pencil />
          Rename
        </DropdownMenuItem>
        <DropdownMenuSub defaultOpen>
          <DropdownMenuSubTrigger>
            <FolderInput />
            Move to
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-44">
              <DropdownMenuItem onSelect={() => onItemSelect?.('move:marketing')}>Marketing</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onItemSelect?.('move:product')}>Product</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onItemSelect?.('move:finance')}>Finance</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>Archive (read-only)</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked onSelect={(event) => event.preventDefault()}>
          Show comments
        </DropdownMenuCheckboxItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger inset>Export as</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-36">
              <DropdownMenuItem onSelect={() => onItemSelect?.('export:pdf')}>PDF</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onItemSelect?.('export:csv')}>CSV</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => onItemSelect?.('delete')}>
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async () => {
    const inset = await screen.findByRole('menuitem', { name: 'Export as' })
    await expect(inset).toHaveAttribute('data-inset', 'true')
    await expect(inset).toHaveAttribute('aria-haspopup', 'menu')
    await expect(screen.getByRole('menuitem', { name: 'Move to' })).not.toHaveAttribute('data-inset')
  },
}

const workspaces = [
  'Acme Corp',
  'Northwind Trading Company International Holdings',
  'Globex',
  'Initech',
  'Umbrella Health',
  'Stark Industries',
  'Wayne Enterprises',
  'Hooli',
  'Pied Piper',
  'Soylent',
  'Tyrell Corporation',
  'Wonka Industries',
  'Cyberdyne Systems',
  'Aperture Science',
]

/** Long lists scroll inside the panel (cap the height with `max-h-*`) and long labels truncate with `truncate`. */
export const LongContent: Story = {
  args: { defaultOpen: true, modal: false },
  parameters: { layout: 'padded', ...inFrame(340) },
  render: ({ onItemSelect, ...args }) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger asChild>
        <Button iconRight={<ChevronDown />}>Switch workspace</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-64 w-56">
        <DropdownMenuLabel>Workspaces · {workspaces.length}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value="Acme Corp" onValueChange={(value) => onItemSelect?.(`workspace:${value}`)}>
          {workspaces.map((name) => (
            <DropdownMenuRadioItem key={name} value={name}>
              <span className="truncate">{name}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

const members = [
  { name: 'Olivia Martin', email: 'olivia@acme.com', role: 'Owner', status: 'active' },
  { name: 'Jackson Lee', email: 'jackson@acme.com', role: 'Admin', status: 'active' },
  { name: 'Isabella Nguyen', email: 'isabella@acme.com', role: 'Member', status: 'invited' },
] as const

/** Composition: a "more" menu on each row of a team members list, with a role submenu and a destructive action. */
export const RowActions: Story = {
  parameters: { layout: 'padded' },
  render: ({ onItemSelect }) => (
    <div className="w-full max-w-lg divide-y rounded-lg border bg-card">
      {members.map((member) => (
        <div key={member.email} className="flex items-center gap-3 px-4 py-2.5">
          <Avatar size="sm">
            <AvatarFallback>
              {member.name
                .split(' ')
                .map((part) => part[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-medium text-foreground">{member.name}</div>
            <div className="truncate text-xs text-foreground-lighter">{member.email}</div>
          </div>
          <span className="text-xs text-foreground-light">{member.role}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                aria-label={`Actions for ${member.name}`}
                icon={<MoreHorizontal />}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onSelect={() => onItemSelect?.(`copy-email:${member.email}`)}>
                <Copy />
                Copy email
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={member.status !== 'invited'}
                onSelect={() => onItemSelect?.(`resend:${member.email}`)}
              >
                <Mail />
                Resend invitation
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger disabled={member.role === 'Owner'}>
                  <UserCog />
                  Change role
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={member.role}
                      onValueChange={(role) => onItemSelect?.(`role:${member.email}:${role}`)}
                    >
                      <DropdownMenuRadioItem value="Admin">Admin</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Member">Member</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Viewer">Viewer</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                disabled={member.role === 'Owner'}
                onSelect={() => onItemSelect?.(`remove:${member.email}`)}
              >
                <Trash2 />
                Remove from team
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  ),
}

function AccountMenuDemo({
  onItemSelect,
  ...props
}: React.ComponentProps<typeof DropdownMenu> & { onItemSelect?: (id: string) => void }) {
  const [theme, setTheme] = React.useState('system')
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Avatar>
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <div className="px-2 pt-1.5 pb-2">
          <div className="text-[13px] font-medium text-foreground">Olivia Martin</div>
          <div className="truncate text-xs text-foreground-lighter">olivia@acme.com</div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => onItemSelect?.('profile')}>
            <User />
            Profile
            <DropdownMenuShortcut>{shortcut('P')}</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onItemSelect?.('billing')}>
            <CreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onItemSelect?.('settings')}>
            <Settings />
            Settings
            <DropdownMenuShortcut>{shortcut(',')}</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="#documentation">
              <BookOpen />
              Documentation
            </a>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => onItemSelect?.('sign-out')}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Composition: an avatar-triggered account menu with a custom header, a link item (`asChild`) and a theme radio group. */
export const AccountMenu: Story = {
  args: { defaultOpen: true, modal: false },
  parameters: { layout: 'padded', ...inFrame(440) },
  render: (args) => (
    <div className="flex justify-end">
      <AccountMenuDemo {...args} />
    </div>
  ),
}

/** Keyboard flow: Enter opens the menu on the first item, arrows move, Enter selects and closes. */
export const KeyboardNavigation: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Open menu' })
    await userEvent.tab()
    await expect(trigger).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    const menu = await screen.findByRole('menu')
    await waitFor(() => expect(within(menu).getByRole('menuitem', { name: /^Edit/ })).toHaveFocus())
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(within(menu).getByRole('menuitem', { name: /^Duplicate/ })).toHaveFocus())
    await userEvent.keyboard('{Enter}')
    await expect(args.onItemSelect).toHaveBeenCalledWith('duplicate')
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
  },
}

/** Submenus by keyboard: ArrowRight opens "Change role", Enter picks a role and closes the whole menu. */
export const SubmenuKeyboard: Story = {
  parameters: { layout: 'padded' },
  render: RowActions.render,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Actions for Jackson Lee' })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    const menu = await screen.findByRole('menu')
    const subTrigger = within(menu).getByRole('menuitem', { name: 'Change role' })
    subTrigger.focus()
    await userEvent.keyboard('{ArrowRight}')
    const submenu = await waitFor(() => {
      const [, sub] = screen.getAllByRole('menu')
      if (!sub) throw new Error('Submenu not open yet')
      return sub
    })
    const viewer = within(submenu).getByRole('menuitemradio', { name: 'Viewer' })
    await waitFor(() => expect(within(submenu).getByRole('menuitemradio', { name: 'Admin' })).toHaveFocus())
    await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    await waitFor(() => expect(viewer).toHaveFocus())
    await userEvent.keyboard('{Enter}')
    await expect(args.onItemSelect).toHaveBeenCalledWith('role:jackson@acme.com:Viewer')
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
  },
}
