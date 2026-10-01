import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import {
  BookOpen,
  CreditCard,
  FileText,
  FolderKanban,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Monitor,
  Moon,
  Plus,
  Rows3,
  Settings,
  Sun,
  UserPlus,
  Users,
} from 'lucide-react'
import { expect, fn, screen, userEvent, waitFor, within, type Mock } from 'storybook/test'

import { useCommandShortcut } from '../../hooks/use-command-shortcut'
import type { LinkComponent } from '../../lib/link'
import { isMac } from '../../lib/platform'
import { Avatar, AvatarFallback } from '../primitives/avatar'
import { Badge } from '../primitives/badge'
import { CommandGroup, CommandItem, CommandSeparator } from '../primitives/command'

import { CommandMenu, type CommandMenuGroup, type CommandMenuProps } from './command-menu'
import { TopBarSearch } from './top-bar'

/* Module-level spies so play functions can assert on navigation and actions. */
const navigate = fn().mockName('navigate')
const createProject = fn().mockName('createProject')
const inviteTeammate = fn().mockName('inviteTeammate')
const toggleCompact = fn().mockName('toggleCompact')
const setTheme = fn().mockName('setTheme')
const signOut = fn().mockName('signOut')
const openMember = fn().mockName('openMember')

/** Minimal router adapter: prevents the full page load and reports the target instead. */
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

/** Platform-aware shortcut label: "⌘N" on Apple platforms, "Ctrl+N" elsewhere. */
const shortcut = (key: string) => (isMac ? `⌘${key}` : `Ctrl+${key}`)

/** Navigation first (harmless for ⌘K + Enter), records next, side-effect actions and preferences last. */
const workspaceGroups: CommandMenuGroup[] = [
  {
    id: 'pages',
    label: 'Pages',
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '/', icon: <LayoutDashboard />, hint: 'Home', keywords: ['home'] },
      { id: 'projects', label: 'Projects', href: '/projects', icon: <FolderKanban />, hint: 'All projects' },
      { id: 'team', label: 'Team', href: '/team', icon: <Users />, hint: 'Members & roles' },
      {
        id: 'billing',
        label: 'Billing',
        href: '/billing',
        icon: <CreditCard />,
        hint: 'Plan & invoices',
        keywords: ['invoices', 'payment', 'plan'],
      },
      { id: 'settings', label: 'Settings', href: '/settings', icon: <Settings />, shortcut: shortcut(',') },
      { id: 'docs', label: 'Documentation', href: 'https://example.com/docs', icon: <BookOpen />, external: true },
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    items: [
      {
        id: 'project-website',
        label: 'Website redesign',
        value: 'project Website redesign',
        href: '/projects/website-redesign',
        icon: <FolderKanban />,
        hint: '14 tasks',
      },
      {
        id: 'project-mobile',
        label: 'Mobile app launch',
        value: 'project Mobile app launch',
        href: '/projects/mobile-app-launch',
        icon: <FolderKanban />,
        hint: '8 tasks',
        badge: <Badge variant="warning">Due soon</Badge>,
      },
      {
        id: 'project-onboarding',
        label: 'Customer onboarding revamp for enterprise accounts in the EMEA region',
        value: 'project Customer onboarding revamp',
        href: '/projects/customer-onboarding-revamp',
        icon: <FolderKanban />,
        hint: 'Shared with Sales, Support and Customer Success',
        keywords: ['emea', 'enterprise'],
      },
    ],
  },
  {
    id: 'actions',
    label: 'Actions',
    items: [
      { id: 'new-project', label: 'Create project', icon: <Plus />, shortcut: shortcut('N'), onSelect: createProject },
      {
        id: 'invite',
        label: 'Invite teammate',
        icon: <UserPlus />,
        keywords: ['member', 'add user'],
        onSelect: inviteTeammate,
      },
      { id: 'api-key', label: 'Generate API key', icon: <KeyRound />, disabled: true, hint: 'Admins only' },
    ],
  },
  {
    id: 'preferences',
    label: 'Preferences',
    items: [
      { id: 'light', label: 'Light theme', icon: <Sun />, keywords: ['appearance'], onSelect: () => setTheme('light') },
      { id: 'dark', label: 'Dark theme', icon: <Moon />, keywords: ['appearance'], onSelect: () => setTheme('dark') },
      {
        id: 'system',
        label: 'System theme',
        icon: <Monitor />,
        keywords: ['appearance', 'auto'],
        onSelect: () => setTheme('system'),
      },
      {
        id: 'compact',
        label: 'Toggle compact rows',
        icon: <Rows3 />,
        keywords: ['density', 'dense'],
        hint: 'Stays open',
        keepOpen: true,
        onSelect: toggleCompact,
      },
      { id: 'sign-out', label: 'Sign out', icon: <LogOut />, keywords: ['logout', 'log out'], onSelect: signOut },
    ],
  },
]

/**
 * Resolves once no palette is open. Checks `data-state` rather than removal: a closing dialog stays
 * mounted during its exit animation (and indefinitely in a background tab, where animations pause).
 */
const waitForClosed = () =>
  waitFor(() => expect(document.querySelector('[role="dialog"][data-state="open"]')).toBeNull())

/** Keeps overlay stories contained in their own frame on the docs page. */
const inFrame = (height: number) => ({ story: { inline: false, iframeHeight: `${height}px` } })

/**
 * How an app wires the palette: local open state, the top-bar search trigger and the ⌘K / Ctrl+K
 * shortcut through `useCommandShortcut`. The `open` control of the Controls panel drives it too.
 */
function PaletteDemo({ open: openArg, defaultOpen, onOpenChange, ...props }: CommandMenuProps) {
  const [open, setOpen] = React.useState(openArg ?? defaultOpen ?? false)
  const [prevOpenArg, setPrevOpenArg] = React.useState(openArg)
  if (openArg !== prevOpenArg) {
    setPrevOpenArg(openArg)
    if (openArg !== undefined) setOpen(openArg)
  }
  const change = (next: boolean) => {
    setOpen(next)
    onOpenChange?.(next)
  }
  // With the `shortcut` prop the menu binds the key itself: binding it here too would toggle twice.
  useCommandShortcut(() => change(!open), { enabled: !props.shortcut })
  return (
    <>
      <TopBarSearch compactOnMobile={false} onClick={() => change(true)} />
      <CommandMenu {...props} open={open} onOpenChange={change} />
    </>
  )
}

const meta = {
  title: 'Layout/Command Menu',
  component: CommandMenu,
  parameters: {
    docs: {
      ...inFrame(560),
      description: {
        component:
          'The app-wide ⌘K command palette: grouped commands that navigate (`href`, through the link component) or run actions (`onSelect`). Mount it once, control it with `open` / `onOpenChange` and toggle it with `useCommandShortcut`. Put navigation first and side-effect actions last so ⌘K + Enter is harmless; for inline searchable pickers use `Command` in a `Popover` instead.',
      },
    },
  },
  args: {
    groups: workspaceGroups,
    placeholder: 'Search pages, projects and actions…',
    title: 'Command menu',
    loading: false,
    shouldFilter: true,
    onOpenChange: fn(),
    onItemSelect: fn(),
    onSearchChange: fn(),
    linkComponent: RouterLink,
  },
  argTypes: {
    groups: { control: false },
    children: { control: false },
    linkComponent: { control: false },
    open: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
    loading: { control: 'boolean' },
    shouldFilter: { control: 'boolean' },
    emptyMessage: { control: 'text' },
    loadingMessage: { control: 'text' },
    shortcut: { control: 'boolean' },
  },
  render: (args) => <PaletteDemo {...args} />,
} satisfies Meta<typeof CommandMenu>

export default meta
type Story = StoryObj<typeof meta>

/** Closed palette behind its trigger: click the field, press ⌘K / Ctrl+K or toggle the `open` control. */
export const Default: Story = {}

/**
 * Open for visual review: hints, a badge, shortcuts, an external link, a disabled action and a long
 * label and hint that truncate instead of wrapping.
 */
export const Open: Story = {
  args: { open: true },
  play: async () => {
    const dialog = await screen.findByRole('dialog')
    await expect(dialog).toHaveAttribute('data-slot', 'command-menu')
    // An external item is a plain new-tab anchor (it skips the link component).
    const external = dialog.querySelector('[data-slot="command-menu-link"][target="_blank"]')
    await expect(external).toHaveAttribute('href', 'https://example.com/docs')
    await expect(external).toHaveAttribute('rel', 'noreferrer')
    await expect(external).toHaveTextContent('(opens in a new tab)')
  },
}

/** `useCommandShortcut` toggles the palette; typing filters (keywords too) and Enter navigates via the router adapter. */
export const KeyboardShortcut: Story = {
  play: async ({ args }) => {
    navigate.mockClear()
    await userEvent.keyboard('{Control>}k{/Control}')
    const dialog = await screen.findByRole('dialog')
    const input = within(dialog).getByRole('combobox')
    await waitFor(() => expect(input).toHaveFocus())
    await userEvent.type(input, 'invoices')
    await waitFor(() => expect(within(dialog).getByText('Billing')).toBeInTheDocument())
    await expect(within(dialog).queryByText('Sign out')).toBeNull()
    await userEvent.keyboard('{Enter}')
    await expect(navigate).toHaveBeenCalledOnce()
    await expect(navigate).toHaveBeenCalledWith('/billing')
    await expect(args.onItemSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'billing' }))
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'closed'))
  },
}

/**
 * `shortcut` lets the menu bind ⌘K / Ctrl+K itself (or another letter, e.g. `shortcut="j"`): no
 * state or hook needed for the simple case. Each press toggles it.
 */
export const BuiltInShortcut: Story = {
  args: { shortcut: true },
  render: (args) => (
    <>
      <p className="text-[13px] text-foreground-light">Press ⌘K / Ctrl+K to toggle the menu.</p>
      <CommandMenu {...args} />
    </>
  ),
  play: async ({ args }) => {
    ;(args.onOpenChange as Mock).mockClear()
    await userEvent.keyboard('{Control>}k{/Control}')
    const dialog = await screen.findByRole('dialog')
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true)
    await waitFor(() => expect(within(dialog).getByRole('combobox')).toHaveFocus())
    await userEvent.keyboard('{Control>}k{/Control}')
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
    await expect(args.onOpenChange).toHaveBeenCalledTimes(2)
    await waitForClosed()
  },
}

/**
 * Pointer selection: a click on the row padding and a click on the link itself both navigate
 * through the router adapter exactly once, then close the palette.
 */
export const ClickNavigation: Story = {
  args: { open: true },
  play: async () => {
    navigate.mockClear()
    const dialog = await screen.findByRole('dialog')
    await userEvent.click(within(dialog).getByRole('option', { name: /Team/ }))
    await expect(navigate).toHaveBeenCalledOnce()
    await expect(navigate).toHaveBeenLastCalledWith('/team')
    await waitForClosed()

    // Reopen with the shortcut (the trigger stays inert while the dialog animates out).
    await userEvent.keyboard('{Control>}k{/Control}')
    const link = await waitFor(() => {
      const found = document.querySelector<HTMLElement>(
        '[role="dialog"][data-state="open"] [data-slot="command-menu-link"][href="/billing"]',
      )
      expect(found).not.toBeNull()
      return found as HTMLElement
    })
    await userEvent.click(link)
    await expect(navigate).toHaveBeenCalledTimes(2)
    await expect(navigate).toHaveBeenLastCalledWith('/billing')
    await waitForClosed()
  },
}

/** Actions run their `onSelect`, then the palette closes. */
export const RunAction: Story = {
  args: { open: true },
  play: async ({ args }) => {
    inviteTeammate.mockClear()
    const dialog = await screen.findByRole('dialog')
    await userEvent.type(within(dialog).getByRole('combobox'), 'invite')
    await waitFor(() => expect(within(dialog).getByText('Invite teammate')).toBeInTheDocument())
    await userEvent.keyboard('{Enter}')
    await expect(inviteTeammate).toHaveBeenCalledOnce()
    await expect(args.onOpenChange).toHaveBeenCalledWith(false)
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'closed'))
  },
}

/** `keepOpen` commands (toggles, multi-step commands) run without closing the palette. */
export const KeepOpen: Story = {
  args: { open: true },
  play: async ({ args }) => {
    toggleCompact.mockClear()
    ;(args.onOpenChange as Mock).mockClear()
    const dialog = await screen.findByRole('dialog')
    await userEvent.type(within(dialog).getByRole('combobox'), 'compact')
    await waitFor(() => expect(within(dialog).getByText('Toggle compact rows')).toBeInTheDocument())
    await userEvent.keyboard('{Enter}')
    await expect(toggleCompact).toHaveBeenCalledOnce()
    await expect(args.onItemSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'compact' }))
    await expect(args.onOpenChange).not.toHaveBeenCalledWith(false)
    await expect(dialog).toHaveAttribute('data-state', 'open')
  },
}

/** Uncontrolled: `defaultOpen` without `open`; Escape closes it and reports through `onOpenChange`. */
export const Uncontrolled: Story = {
  args: { defaultOpen: true },
  render: (args) => <CommandMenu {...args} />,
  play: async ({ args }) => {
    ;(args.onOpenChange as Mock).mockClear()
    const dialog = await screen.findByRole('dialog')
    await waitFor(() => expect(within(dialog).getByRole('combobox')).toHaveFocus())
    await userEvent.keyboard('{Escape}')
    await expect(args.onOpenChange).toHaveBeenCalledWith(false)
    await waitForClosed()
  },
}

/** Empty state: nothing matches the query. */
export const NoResults: Story = {
  args: { open: true, emptyMessage: 'No page, project or action matches.' },
  play: async () => {
    const dialog = await screen.findByRole('dialog')
    await userEvent.type(within(dialog).getByRole('combobox'), 'quarterly board deck')
    await waitFor(() => expect(within(dialog).getByText('No page, project or action matches.')).toBeInTheDocument())
  },
}

/** Loading state: a spinner row above the commands already available (the empty message is hidden). */
export const Loading: Story = {
  args: { open: true, loading: true, loadingMessage: 'Searching projects…', groups: workspaceGroups.slice(0, 1) },
  play: async () => {
    const dialog = await screen.findByRole('dialog')
    await expect(within(dialog).getByRole('status')).toHaveTextContent('Searching projects…')
    await expect(within(dialog).getByRole('listbox')).toHaveAttribute('aria-busy', 'true')
  },
}

/** No commands at all: the empty message shows right away. */
export const Empty: Story = {
  args: { open: true, groups: [], emptyMessage: 'No commands available yet.' },
}

const members = [
  { id: 'ada', name: 'Ada Lovelace', email: 'ada@example.com', role: 'Owner' },
  { id: 'grace', name: 'Grace Hopper', email: 'grace@example.com', role: 'Admin' },
  { id: 'alan', name: 'Alan Turing', email: 'alan@example.com', role: 'Member' },
]

/**
 * Composition: `children` append hand-built rows after the data-driven groups (here team members
 * with an avatar and two lines of text). Their `onSelect` closes the menu itself.
 */
export const CustomRows: Story = {
  args: { open: true, groups: workspaceGroups.slice(0, 1) },
  render: function Render(args) {
    const [open, setOpen] = React.useState(args.open ?? false)
    const change = (next: boolean) => {
      setOpen(next)
      args.onOpenChange?.(next)
    }
    return (
      <>
        <TopBarSearch compactOnMobile={false} onClick={() => change(true)} />
        <CommandMenu {...args} open={open} onOpenChange={change}>
          <CommandSeparator />
          <CommandGroup heading="Team members">
            {members.map((member) => (
              <CommandItem
                key={member.id}
                value={`member ${member.name}`}
                keywords={[member.email, member.role]}
                onSelect={() => {
                  change(false)
                  openMember(member.id)
                }}
              >
                <Avatar size="sm">
                  <AvatarFallback>
                    {member.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-foreground">{member.name}</span>
                  <span className="truncate text-[12px] text-foreground-lighter">{member.email}</span>
                </span>
                <span className="ml-auto text-[12px] text-foreground-lighter">{member.role}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandMenu>
      </>
    )
  },
  play: async () => {
    openMember.mockClear()
    const dialog = await screen.findByRole('dialog')
    await userEvent.type(within(dialog).getByRole('combobox'), 'grace')
    await waitFor(() => expect(within(dialog).getByText('Grace Hopper')).toBeInTheDocument())
    await userEvent.keyboard('{Enter}')
    await expect(openMember).toHaveBeenCalledWith('grace')
    await waitForClosed()
  },
}

const invoices = [
  { id: 'INV-2041', customer: 'Northwind Trading', amount: '$4,200.00' },
  { id: 'INV-2042', customer: 'Acme Corp', amount: '$860.00' },
  { id: 'INV-2043', customer: 'Globex Logistics', amount: '$12,940.50' },
  { id: 'INV-2044', customer: 'Initech', amount: '$1,315.00' },
  { id: 'INV-2045', customer: 'Umbrella Health', amount: '$7,020.00' },
]

/** Simulated server search: results arrive 400ms after the query changes. */
function RemoteSearchDemo(args: CommandMenuProps) {
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState(invoices)
  const [pending, setPending] = React.useState(false)

  React.useEffect(() => {
    const q = query.trim().toLowerCase()
    const timer = window.setTimeout(() => {
      setResults(invoices.filter((inv) => !q || `${inv.id} ${inv.customer}`.toLowerCase().includes(q)))
      setPending(false)
    }, 400)
    return () => window.clearTimeout(timer)
  }, [query])

  const groups: CommandMenuGroup[] = [
    {
      id: 'invoices',
      label: `Invoices · ${results.length}`,
      items: results.map((inv) => ({
        id: inv.id,
        label: `${inv.id} · ${inv.customer}`,
        href: `/invoices/${inv.id}`,
        icon: <FileText />,
        hint: inv.amount,
      })),
    },
  ]

  return (
    <PaletteDemo
      {...args}
      groups={groups}
      shouldFilter={false}
      loading={pending}
      loadingMessage="Searching invoices…"
      emptyMessage={`No invoice matches “${query}”.`}
      placeholder="Search invoices by number or customer…"
      onSearchChange={(q) => {
        args.onSearchChange?.(q)
        if (q !== query) {
          setPending(true)
          setQuery(q)
        }
      }}
    />
  )
}

/** Composition: server-side search with `shouldFilter={false}`, `onSearchChange` and `loading`. */
export const RemoteSearch: Story = {
  args: { open: true },
  render: (args) => <RemoteSearchDemo {...args} />,
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog')
    await userEvent.type(within(dialog).getByRole('combobox'), 'acme')
    await expect(args.onSearchChange).toHaveBeenLastCalledWith('acme')
    await waitFor(() => expect(within(dialog).getByText('INV-2042 · Acme Corp')).toBeInTheDocument(), {
      timeout: 2000,
    })
    await waitFor(() => expect(within(dialog).queryByText('INV-2041 · Northwind Trading')).toBeNull())
  },
}
