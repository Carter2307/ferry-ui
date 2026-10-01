import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bell, BookOpen, CreditCard, FolderKanban, Home, Inbox, Keyboard, LifeBuoy, Settings, Users } from 'lucide-react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

import { LinkProvider, type LinkComponent } from '../../lib/link'
import { Avatar, AvatarFallback } from '../primitives/avatar'
import { Badge } from '../primitives/badge'
import { Button } from '../primitives/button'

import { IconRail, IconRailItem, useIconRail } from './icon-rail'
import type { NavGroup, NavItem } from './types'

/* Module-level spies so play functions can assert on router navigation and item actions. */
const navigate = fn().mockName('navigate')
const openNotifications = fn().mockName('openNotifications')
const openShortcuts = fn().mockName('openShortcuts')

/** Minimal router adapter: prevents the full page load and reports the target instead. */
const StoryLink: LinkComponent = ({ href, onClick, ...props }) => (
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

const home: NavItem = { id: 'home', label: 'Home', href: '/', icon: <Home /> }
const projects: NavItem = { id: 'projects', label: 'Projects', href: '/projects', icon: <FolderKanban />, active: true }
const team: NavItem = { id: 'team', label: 'Team', href: '/team', icon: <Users /> }
const billing: NavItem = { id: 'billing', label: 'Billing', href: '/billing', icon: <CreditCard /> }
const settings: NavItem = { id: 'settings', label: 'Settings', href: '/settings', icon: <Settings /> }

const groups: NavGroup[] = [
  { id: 'main', items: [home] },
  { id: 'workspace', items: [projects, team] },
  { id: 'account', items: [billing, settings] },
]

const labelledGroups: NavGroup[] = [
  { id: 'main', items: [home, { id: 'inbox', label: 'Inbox', href: '/inbox', icon: <Inbox /> }] },
  { id: 'workspace', label: 'Workspace', items: [projects, team] },
  { id: 'account', label: 'Account', items: [billing, settings] },
]

/** Square brand mark that grows into a wordmark when the rail is expanded. */
function AcmeLogo() {
  const rail = useIconRail()
  return (
    <StoryLink
      href="/"
      aria-label="Acme home"
      className="flex h-9 min-w-0 items-center gap-2 rounded-md px-[5px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span
        aria-hidden="true"
        className="flex size-[26px] shrink-0 items-center justify-center rounded-md bg-primary-solid text-xs font-medium text-primary-foreground"
      >
        A
      </span>
      {rail?.expanded && <span className="truncate text-sm font-medium text-foreground">Acme</span>}
    </StoryLink>
  )
}

/** Account row for the footer slot: an avatar, plus the name when the rail is expanded. */
function AccountRow() {
  const rail = useIconRail()
  return (
    <div className="flex h-9 min-w-0 items-center gap-3 px-[5px]">
      <Avatar size="sm" className="size-[26px]">
        <AvatarFallback className="text-[11px]">AP</AvatarFallback>
      </Avatar>
      {rail?.expanded && <span className="truncate text-sm text-foreground-light">Ada Park</span>}
    </div>
  )
}

const meta = {
  title: 'Layout/Icon Rail',
  component: IconRail,
  subcomponents: { IconRailItem },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Left-edge icon navigation for an app: 56px with tooltips, expandable to 200px with labels. Give it 3–10 top-level destinations as `groups` (dividers between them) or `items`, mark the current one with `active: true`, and use it as the `rail` of an `AppShell`. Use `logo` / `footer` slots for the brand mark and secondary rows (`IconRailItem`), and `MobileNav` on phones.',
      },
    },
  },
  decorators: [
    (Story) => (
      <LinkProvider component={StoryLink}>
        <div className="flex h-[480px] border-b">
          <Story />
          <div className="flex-1 bg-dot-grid" />
        </div>
      </LinkProvider>
    ),
  ],
  args: {
    groups,
    defaultExpanded: false,
    collapsible: true,
    onExpandedChange: fn(),
  },
  argTypes: {
    groups: { control: false },
    items: { control: false },
    logo: { control: false },
    footer: { control: false },
    linkComponent: { control: false },
    expanded: { control: 'boolean' },
    labels: { control: 'object' },
  },
} satisfies Meta<typeof IconRail>

export default meta
type Story = StoryObj<typeof meta>

/** Collapsed: icons only, labels in tooltips on the right. */
export const Default: Story = {}

/** Expanded: 200px with labels; the toggle at the bottom collapses it again. */
export const Expanded: Story = {
  args: { defaultExpanded: true },
}

/** A single list of items (`items`) instead of groups: no dividers. */
export const FlatItems: Story = {
  args: { groups: undefined, items: [home, projects, team, billing, settings], defaultExpanded: true },
}

/** Group `label`s show as mono headings while expanded and name the lists for screen readers. */
export const GroupLabels: Story = {
  args: { groups: labelledGroups, defaultExpanded: true },
}

/** `logo` slot on top (adapts with `useIconRail()`), `footer` slot with secondary `IconRailItem`s and an avatar. */
export const WithLogoAndFooter: Story = {
  args: {
    defaultExpanded: true,
    logo: <AcmeLogo />,
    footer: (
      <>
        <IconRailItem item={{ id: 'help', label: 'Help center', href: '/help', icon: <LifeBuoy /> }} />
        <IconRailItem
          item={{ id: 'docs', label: 'Documentation', href: 'https://example.com/docs', icon: <BookOpen />, external: true }}
        />
        <AccountRow />
      </>
    ),
  },
}

/** Badges (a dot while collapsed, the badge itself while expanded), a disabled item and an external link. */
export const BadgesAndStates: Story = {
  args: {
    groups: [
      {
        id: 'main',
        items: [
          home,
          {
            id: 'inbox',
            label: 'Inbox',
            href: '/inbox',
            icon: <Inbox />,
            badge: (
              <Badge variant="primary" font="mono">
                12
              </Badge>
            ),
          },
          projects,
        ],
      },
      {
        id: 'more',
        items: [
          { ...billing, disabled: true },
          { id: 'docs', label: 'Documentation', href: 'https://example.com/docs', icon: <BookOpen />, external: true },
        ],
      },
    ],
  },
  render: (args) => (
    <div className="flex h-full">
      <IconRail {...args} defaultExpanded={false} aria-label="Collapsed example" />
      <IconRail {...args} defaultExpanded aria-label="Expanded example" />
    </div>
  ),
}

/**
 * Items without `href` render as buttons that call `onSelect` (open a panel, a dialog…); here a
 * notifications action in the list and a shortcuts action in the footer.
 */
export const ActionItems: Story = {
  args: {
    groups: [
      ...groups,
      {
        id: 'actions',
        items: [{ id: 'notifications', label: 'Notifications', icon: <Bell />, onSelect: openNotifications }],
      },
    ],
    footer: <IconRailItem item={{ id: 'shortcuts', label: 'Keyboard shortcuts', icon: <Keyboard />, onSelect: openShortcuts }} />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Notifications' }))
    await expect(openNotifications).toHaveBeenCalled()
    await userEvent.click(canvas.getByRole('button', { name: 'Keyboard shortcuts' }))
    await expect(openShortcuts).toHaveBeenCalled()
  },
}

/** `labels` renames the toggle (translation, or wording that fits your app). */
export const CustomToggleLabels: Story = {
  args: { labels: { expand: 'Show labels', collapse: 'Hide labels', collapseText: 'Hide labels' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Show labels' }))
    await expect(canvas.getByRole('button', { name: 'Hide labels' })).toHaveAttribute('aria-expanded', 'true')
  },
}

/**
 * `external` items open a new tab through a plain `<a>` (they skip the router adapter), show a ↗
 * while expanded and announce it to screen readers with `labels.external` (here translated).
 */
export const ExternalItems: Story = {
  args: {
    groups: undefined,
    items: [
      home,
      { id: 'docs', label: 'Documentation', href: 'https://example.com/docs', icon: <BookOpen />, external: true },
    ],
    footer: (
      <IconRailItem
        item={{ id: 'help', label: 'Help center', href: 'https://example.com/help', icon: <LifeBuoy />, external: true }}
      />
    ),
    defaultExpanded: true,
    labels: { external: '(nouvel onglet)' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // List rows and footer `IconRailItem`s share the rail's `labels.external`.
    // `\s*`: jsdom drops the space between the label and the screen-reader suffix, browsers keep it.
    for (const name of [/^Documentation\s*\(nouvel onglet\)$/, /^Help center\s*\(nouvel onglet\)$/]) {
      const link = canvas.getByRole('link', { name })
      await expect(link).toHaveAttribute('target', '_blank')
      await expect(link).toHaveAttribute('rel', 'noreferrer')
    }
    await expect(canvas.getByRole('link', { name: 'Home' })).not.toHaveAttribute('target')
  },
}

/** Without the toggle (`collapsible={false}`): the rail stays at the width you set. */
export const NotCollapsible: Story = {
  args: { collapsible: false },
}

/** Very long labels truncate with an ellipsis instead of widening the rail. */
export const LongLabels: Story = {
  args: {
    defaultExpanded: true,
    items: [
      home,
      { id: 'long', label: 'Quarterly revenue reports and forecasts', href: '/reports', icon: <CreditCard /> },
      team,
    ],
    groups: undefined,
  },
}

/** Controlled: the expanded state lives in the parent (here toggled from the page as well) and could be persisted. */
export const Controlled: Story = {
  render: function Render(args) {
    const [expanded, setExpanded] = React.useState(true)
    return (
      <div className="flex h-full flex-1">
        <IconRail
          {...args}
          expanded={expanded}
          onExpandedChange={(next) => {
            setExpanded(next)
            args.onExpandedChange?.(next)
          }}
        />
        <div className="flex flex-col items-start gap-2 p-6 text-sm text-foreground-light">
          <span>
            Rail is <strong className="text-foreground">{expanded ? 'expanded' : 'collapsed'}</strong>
          </span>
          <Button size="sm" onClick={() => setExpanded((e) => !e)}>
            Toggle from outside
          </Button>
        </div>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nav = canvas.getByRole('navigation', { name: 'Main' })
    await expect(nav).toHaveAttribute('data-expanded', 'true')
    await userEvent.click(canvas.getByRole('button', { name: 'Toggle from outside' }))
    await expect(nav).toHaveAttribute('data-expanded', 'false')
    await expect(canvas.getByText('collapsed')).toBeInTheDocument()
  },
}

/** Clicking the toggle expands the rail and reports the new state. */
export const ToggleInteraction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const nav = canvas.getByRole('navigation', { name: 'Main' })
    await expect(nav).toHaveAttribute('data-expanded', 'false')
    await userEvent.click(canvas.getByRole('button', { name: 'Expand menu' }))
    await expect(args.onExpandedChange).toHaveBeenCalledWith(true)
    await expect(nav).toHaveAttribute('data-expanded', 'true')
    await expect(canvas.getByRole('button', { name: 'Collapse menu' })).toHaveAttribute('aria-expanded', 'true')
  },
}

/** While collapsed, focusing an item shows its label in a tooltip on the right. */
export const CollapsedTooltip: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const link = canvas.getByRole('link', { name: 'Home' })
    await userEvent.tab()
    await expect(link).toHaveFocus()
    const tooltip = await screen.findByRole('tooltip')
    await expect(tooltip).toHaveTextContent('Home')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(link).toHaveAttribute('data-state', 'closed'))
  },
}

/** Stateful example: `onSelect` moves the `active` item, links go through the router adapter. */
export const Navigation: Story = {
  args: { defaultExpanded: true },
  render: function Render(args) {
    const [active, setActive] = React.useState('home')
    const withState = (item: NavItem): NavItem => ({ ...item, active: item.id === active, onSelect: () => setActive(item.id) })
    return (
      <IconRail
        {...args}
        groups={groups.map((group) => ({ ...group, items: group.items.map(withState) }))}
        footer={<AccountRow />}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
    await userEvent.click(canvas.getByRole('link', { name: 'Team' }))
    await expect(navigate).toHaveBeenLastCalledWith('/team')
    await expect(canvas.getByRole('link', { name: 'Team' })).toHaveAttribute('aria-current', 'page')
    await expect(canvas.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current')
  },
}
