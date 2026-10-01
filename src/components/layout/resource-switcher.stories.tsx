import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Building2, FolderKanban, LayoutGrid, Plus, Settings, UserPlus, UsersRound } from 'lucide-react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

import type { LinkComponent } from '../../lib/link'
import { cn } from '../../lib/utils'
import { ResourceSwitcher, type ResourceSwitcherItem } from './resource-switcher'
import { TopBarSeparator } from './top-bar'

/** Open-by-default popovers render in their own iframe so the panel stays next to its trigger. */
const inFrame = (height: number) => ({ docs: { story: { inline: false, iframeHeight: `${height}px` } } })

/** Story-only router stand-in: records the destination instead of leaving the page. */
const navigate = fn().mockName('navigate')

const StoryLink: LinkComponent = ({ href, onClick, ...props }) => (
  <a
    href={href}
    {...props}
    onClick={(event) => {
      onClick?.(event)
      if (event.defaultPrevented) return
      event.preventDefault()
      navigate(href)
    }}
  />
)

function Dot({ className }: { className: string }) {
  return <span aria-hidden="true" className={cn('size-2 shrink-0 rounded-full', className)} />
}

const projects: ResourceSwitcherItem[] = [
  { id: 'customer-portal', label: 'Customer portal', icon: <FolderKanban /> },
  { id: 'marketing-site', label: 'Marketing site', icon: <FolderKanban /> },
  { id: 'mobile-app', label: 'Mobile app', icon: <FolderKanban /> },
  { id: 'analytics', label: 'Analytics', icon: <FolderKanban />, keywords: ['reports', 'dashboards'] },
  { id: 'billing', label: 'Billing', icon: <FolderKanban /> },
  { id: 'legacy-crm', label: 'Legacy CRM', icon: <FolderKanban />, disabled: true },
]

const teams: ResourceSwitcherItem[] = [
  {
    id: 'design',
    label: 'Design',
    icon: <UsersRound />,
    description: '8 members · Pro plan',
    meta: <Dot className="bg-success" />,
  },
  {
    id: 'engineering',
    label: 'Engineering',
    icon: <UsersRound />,
    description: '24 members · Enterprise plan',
    meta: <Dot className="bg-success" />,
  },
  {
    id: 'growth',
    label: 'Growth',
    icon: <UsersRound />,
    description: '5 members · Trial ends in 3 days',
    meta: <Dot className="bg-warning" />,
  },
  {
    id: 'support',
    label: 'Support',
    icon: <UsersRound />,
    description: '11 members · Payment overdue',
    meta: <Dot className="bg-destructive" />,
  },
]

const projectActions = [
  { id: 'all', label: 'All projects', icon: <LayoutGrid />, onSelect: fn().mockName('all projects') },
  { id: 'new', label: 'New project', icon: <Plus />, onSelect: fn().mockName('new project') },
]

const meta = {
  title: 'Layout/Resource Switcher',
  component: ResourceSwitcher,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Trail segment with a ⇕ searchable popover to jump between entities of one kind (projects, workspaces, teams): search field, list with the current item checked, footer commands such as "New project". Items with `href` render as real links through the link component; otherwise handle `onValueChange`. Use `Select` for form values and `DropdownMenu` for a few actions.',
      },
    },
  },
  args: {
    items: projects,
    value: 'customer-portal',
    actions: projectActions,
    searchPlaceholder: 'Find project…',
    placeholder: 'Select a project…',
    loading: false,
    align: 'start',
    onValueChange: fn(),
    onOpenChange: fn(),
  },
  argTypes: {
    items: { control: false },
    actions: { control: false },
    children: { control: false },
    icon: { control: false },
    heading: { control: 'text' },
    label: { control: 'text' },
    emptyMessage: { control: 'text' },
    loadingMessage: { control: 'text' },
    // Deprecated aliases of `emptyMessage` / `loadingMessage`.
    emptyText: { table: { disable: true } },
    loadingText: { table: { disable: true } },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    open: { control: false },
    linkComponent: { control: false },
    onValueChange: { control: false },
    onOpenChange: { control: false },
    onSearchChange: { control: false },
  },
} satisfies Meta<typeof ResourceSwitcher>

export default meta
type Story = StoryObj<typeof meta>

/** Controlled by `value`: the trigger shows the current project; choosing another calls `onValueChange`. */
export const Default: Story = {}

/** Opened for review: search field, checked current item, a disabled item and footer commands. */
export const Open: Story = {
  args: { defaultOpen: true, heading: 'Projects' },
  parameters: inFrame(460),
}

/** Rich rows: a description line and a status dot (`meta`) before the check mark. */
export const WithDescriptions: Story = {
  args: {
    items: teams,
    value: 'engineering',
    searchPlaceholder: 'Find team…',
    heading: 'Teams',
    actions: [{ id: 'new-team', label: 'Create team', icon: <Plus /> }],
    defaultOpen: true,
  },
  parameters: inFrame(420),
}

/**
 * While items load: the trigger shows a skeleton until the current item arrives, the list
 * shows `loadingMessage`, and footer commands stay available.
 */
export const Loading: Story = {
  args: { items: [], loading: true, label: 'switch project', defaultOpen: true },
  parameters: inFrame(240),
}

/** `disabled` dims the trigger and prevents opening. */
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: /Customer portal/ })
    await expect(trigger).toBeDisabled()
  },
}

/** No items at all: `emptyMessage` plus the footer commands, and the trigger shows the placeholder. */
export const Empty: Story = {
  args: { items: [], value: undefined, emptyMessage: 'No projects yet.', defaultOpen: true },
  parameters: inFrame(240),
}

/** Long names truncate at 180px in the trigger and to the popover width in the list. */
export const LongLabels: Story = {
  args: {
    items: [
      { id: 'q3', label: 'Quarterly revenue reporting dashboard for the finance team', icon: <FolderKanban /> },
      { id: 'onboarding', label: 'Customer onboarding flow redesign and experimentation', icon: <FolderKanban /> },
    ],
    value: 'q3',
    defaultOpen: true,
  },
  parameters: inFrame(260),
}

/**
 * Custom trigger: an `icon` (here a lettermark) and `children` as the text. `label` is the action
 * hint: the accessible name of the trigger is its visible text followed by the label.
 */
export const CustomTrigger: Story = {
  args: {
    items: [
      { id: 'acme', label: 'Acme Inc', icon: <Building2 /> },
      { id: 'globex', label: 'Globex', icon: <Building2 /> },
      { id: 'initech', label: 'Initech', icon: <Building2 /> },
    ],
    value: 'acme',
    label: 'switch organization',
    searchPlaceholder: 'Find organization…',
    actions: [{ id: 'settings', label: 'Organization settings', icon: <Settings /> }],
    icon: (
      <span className="flex size-5 items-center justify-center rounded-sm bg-primary-soft text-[10px] font-medium text-primary">
        A
      </span>
    ),
    children: 'Acme Inc',
  },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Acme Inc, switch organization' })
    await userEvent.click(trigger)
    // The popover is named by the label alone.
    const panel = await screen.findByRole('dialog', { name: 'switch organization' })
    await waitFor(() => expect(within(panel).getByPlaceholderText('Find organization…')).toHaveFocus())
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(panel).toHaveAttribute('data-state', 'closed'))
  },
}

/** Items with `href` render as links (router-agnostic): click, Enter and "open in new tab" all navigate. */
export const Links: Story = {
  args: {
    items: projects.map((p) => ({ ...p, href: `/projects/${p.id}` })),
    actions: [
      { id: 'all', label: 'All projects', icon: <LayoutGrid />, href: '/projects' },
      { id: 'new', label: 'New project', icon: <Plus />, href: '/projects/new' },
    ],
    linkComponent: StoryLink,
  },
  play: async ({ args, canvasElement }) => {
    navigate.mockClear()
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /Customer portal/ }))
    const panel = await screen.findByRole('dialog')
    const input = within(panel).getByPlaceholderText('Find project…')
    await waitFor(() => expect(input).toHaveFocus())
    // "reports" is a keyword of Analytics; Enter follows the highlighted link.
    await userEvent.type(input, 'reports')
    await waitFor(() => expect(within(panel).getByRole('option', { name: /Analytics/ })).toBeInTheDocument())
    await userEvent.keyboard('{Enter}')
    await expect(navigate).toHaveBeenCalledWith('/projects/analytics')
    await expect(navigate).toHaveBeenCalledTimes(1)
    await expect(args.onValueChange).toHaveBeenCalledWith('analytics', expect.objectContaining({ id: 'analytics' }))
    await waitFor(() => expect(panel).toHaveAttribute('data-state', 'closed'))
    // A mouse click follows the link exactly once too.
    await userEvent.click(canvas.getByRole('button', { name: /Customer portal/ }))
    const reopened = await screen.findByRole('dialog')
    await userEvent.click(await within(reopened).findByRole('option', { name: /Mobile app/ }))
    await expect(navigate).toHaveBeenLastCalledWith('/projects/mobile-app')
    await expect(navigate).toHaveBeenCalledTimes(2)
    await waitFor(() => expect(reopened).toHaveAttribute('data-state', 'closed'))
  },
}

/** Uncontrolled (`defaultValue`): the switcher tracks the selection itself. */
export const Uncontrolled: Story = {
  args: { value: undefined, defaultValue: 'mobile-app' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /Mobile app/ }))
    const panel = await screen.findByRole('dialog')
    const input = within(panel).getByPlaceholderText('Find project…')
    await waitFor(() => expect(input).toHaveFocus())
    await userEvent.type(input, 'bill')
    await waitFor(() => expect(within(panel).queryByRole('option', { name: /Marketing site/ })).toBeNull())
    await userEvent.keyboard('{Enter}')
    await expect(args.onValueChange).toHaveBeenCalledWith('billing', expect.objectContaining({ label: 'Billing' }))
    await waitFor(() => expect(canvas.getByRole('button', { name: /Billing/ })).toBeInTheDocument())
  },
}

/** Footer commands are never filtered out: with no match, "New project" is still one Enter away. */
export const FooterAction: Story = {
  play: async ({ canvasElement }) => {
    const newProject = projectActions[1]!.onSelect
    newProject.mockClear()
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /Customer portal/ }))
    const panel = await screen.findByRole('dialog')
    const input = within(panel).getByPlaceholderText('Find project…')
    await waitFor(() => expect(input).toHaveFocus())
    await userEvent.type(input, 'zzz')
    await waitFor(() => expect(within(panel).getByText('Nothing found.')).toBeInTheDocument())
    await userEvent.click(within(panel).getByRole('option', { name: /New project/ }))
    await expect(newProject).toHaveBeenCalledOnce()
    await waitFor(() => expect(panel).toHaveAttribute('data-state', 'closed'))
  },
}

function InTrailDemo(args: React.ComponentProps<typeof ResourceSwitcher>) {
  const [project, setProject] = React.useState(args.value)
  return (
    <div className="flex items-center gap-0.5">
      <ResourceSwitcher
        items={[
          { id: 'acme', label: 'Acme Inc', icon: <Building2 /> },
          { id: 'globex', label: 'Globex', icon: <Building2 /> },
        ]}
        defaultValue="acme"
        searchPlaceholder="Find organization…"
      />
      <TopBarSeparator />
      <ResourceSwitcher
        {...args}
        value={project}
        onValueChange={(id, item) => {
          setProject(id)
          args.onValueChange?.(id, item)
        }}
      />
    </div>
  )
}

/** Switchers in context: an organization / project trail, as in a `TopBar`. */
export const InTrail: Story = {
  render: (args) => <InTrailDemo {...args} />,
}

/** Team directory used by the server-side search story (`email` is what the fake API searches). */
const members = [
  { id: 'ana', name: 'Ana Silva', email: 'ana@acme.com' },
  { id: 'ben', name: 'Ben Carter', email: 'ben@acme.com' },
  { id: 'chloe', name: 'Chloé Martin', email: 'chloe@acme.com' },
  { id: 'diego', name: 'Diego Ramos', email: 'diego@acme.com' },
  { id: 'jordan', name: 'Jordan Lee', email: 'jordan@acme.com' },
  { id: 'maya', name: 'Maya Chen', email: 'maya@acme.com' },
  { id: 'priya', name: 'Priya Patel', email: 'priya@acme.com' },
  { id: 'sam', name: 'Sam Okafor', email: 'sam@acme.com' },
]

function Initials({ name }: { name: string }) {
  const letters = name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[9px] font-medium text-primary">
      {letters}
    </span>
  )
}

const toItem = (m: (typeof members)[number]): ResourceSwitcherItem => ({
  id: m.id,
  label: m.name,
  description: m.email,
  icon: <Initials name={m.name} />,
})

function ServerSideSearchDemo(args: React.ComponentProps<typeof ResourceSwitcher>) {
  const [value, setValue] = React.useState('priya')
  const [query, setQuery] = React.useState('')
  // Stand-in for a search endpoint: it returns at most 4 matches, so the current member may be missing.
  const q = query.trim().toLowerCase()
  const results = members.filter((m) => `${m.name} ${m.email}`.toLowerCase().includes(q)).slice(0, 4)
  const current = members.find((m) => m.id === value)
  return (
    <ResourceSwitcher
      {...args}
      items={results.map(toItem)}
      value={value}
      onValueChange={(id, item) => {
        setValue(id)
        args.onValueChange?.(id, item)
      }}
      shouldFilter={false}
      onSearchChange={(next) => {
        setQuery(next)
        args.onSearchChange?.(next)
      }}
      label="switch member"
      heading="Members"
      searchPlaceholder="Search members…"
      emptyMessage="No member matches."
      actions={[{ id: 'invite', label: 'Invite member', icon: <UserPlus /> }]}
      icon={current ? <Initials name={current.name} /> : null}
    >
      {current?.name}
    </ResourceSwitcher>
  )
}

/**
 * Server-side search: `shouldFilter={false}` and `onSearchChange` hand the query to your API, and
 * `items` are its results. The current member is not in the first page of results, so the trigger
 * text and icon are passed explicitly (`children`, `icon`).
 */
export const ServerSideSearch: Story = {
  args: { onSearchChange: fn() },
  render: (args) => <ServerSideSearchDemo {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Priya Patel, switch member' }))
    const panel = await screen.findByRole('dialog')
    const input = within(panel).getByPlaceholderText('Search members…')
    await waitFor(() => expect(input).toHaveFocus())
    await expect(within(panel).queryByRole('option', { name: /Priya Patel/ })).toBeNull()
    await userEvent.type(input, 'lee')
    await expect(args.onSearchChange).toHaveBeenLastCalledWith('lee')
    await waitFor(() => expect(within(panel).getAllByRole('option', { name: /@acme\.com/ })).toHaveLength(1))
    await userEvent.click(within(panel).getByRole('option', { name: /Jordan Lee/ }))
    await expect(args.onValueChange).toHaveBeenCalledWith('jordan', expect.objectContaining({ label: 'Jordan Lee' }))
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Jordan Lee, switch member' })).toBeInTheDocument())
  },
}
