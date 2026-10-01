import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import {
  Activity,
  BellRing,
  ChevronsUpDown,
  CreditCard,
  FileText,
  FolderKanban,
  KeyRound,
  LayoutDashboard,
  ListChecks,
  Plug,
  Settings2,
  ShieldCheck,
  Trash2,
  User,
  Users,
} from 'lucide-react'
import { expect, fireEvent, fn, userEvent, within, type Mock } from 'storybook/test'

import type { LinkComponent } from '../../lib/link'
import { Badge } from '../primitives/badge'
import { Button } from '../primitives/button'

import { InnerMenu } from './inner-menu'
import type { NavGroup } from './types'

/* Module-level spy so play functions can assert on router navigation. */
const navigate = fn().mockName('navigate')

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

/** Sections of one project, as a router would mark them (Overview is the current page). */
const generalGroup: NavGroup = {
  id: 'general',
  label: 'General',
  items: [
    { id: 'overview', label: 'Overview', href: '/projects/website-redesign', icon: <LayoutDashboard />, active: true },
    { id: 'activity', label: 'Activity', href: '/projects/website-redesign/activity', icon: <Activity /> },
    {
      id: 'tasks',
      label: 'Tasks',
      href: '/projects/website-redesign/tasks',
      icon: <ListChecks />,
      badge: <Badge variant="info">12</Badge>,
    },
    { id: 'files', label: 'Files', href: '/projects/website-redesign/files', icon: <FileText /> },
  ],
}

const configurationGroup: NavGroup = {
  id: 'configuration',
  label: 'Configuration',
  items: [
    { id: 'members', label: 'Members', href: '/projects/website-redesign/members', icon: <Users /> },
    { id: 'integrations', label: 'Integrations', href: '/projects/website-redesign/integrations', icon: <Plug /> },
    { id: 'settings', label: 'Settings', href: '/projects/website-redesign/settings', icon: <Settings2 /> },
  ],
}

const linksGroup: NavGroup = {
  id: 'links',
  label: 'Links',
  items: [{ id: 'brief', label: 'Project brief', href: 'https://example.com/brief', external: true }],
}

const projectGroups: NavGroup[] = [generalGroup, configurationGroup, linksGroup]

/** Account settings sections switched in place (no router): items are buttons, `value` marks the current one. */
const settingsGroups: NavGroup[] = [
  {
    id: 'account',
    label: 'Account',
    items: [
      { id: 'profile', label: 'Profile', icon: <User /> },
      { id: 'notifications', label: 'Notifications', icon: <BellRing /> },
      { id: 'security', label: 'Security', icon: <ShieldCheck /> },
    ],
  },
  {
    id: 'workspace',
    label: 'Workspace',
    items: [
      { id: 'members', label: 'Members', icon: <Users /> },
      { id: 'billing', label: 'Billing', icon: <CreditCard /> },
      { id: 'api-keys', label: 'API keys', icon: <KeyRound />, badge: <Badge variant="warning">BETA</Badge> },
    ],
  },
]

/** A fixed-height app frame: the menu on the left, scrolling placeholder content on the right. */
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[520px] flex-col overflow-hidden rounded-lg border bg-background md:flex-row">
      {children}
      <main className="min-w-0 flex-1 overflow-y-auto p-8">
        <div className="flex max-w-xl flex-col gap-3">
          <div className="h-7 w-48 rounded-md bg-surface-200" />
          <div className="h-4 w-full rounded bg-surface-100" />
          <div className="h-4 w-5/6 rounded bg-surface-100" />
          <div className="mt-4 h-40 rounded-lg border border-dashed" />
        </div>
      </main>
    </div>
  )
}

const meta = {
  title: 'Layout/Inner Menu',
  component: InnerMenu,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Secondary side menu for the sections of one area (an entity’s pages, a settings area), placed between the primary navigation and the content. Mark the current item with `active` (from your router) or pass `value` for in-place section switching; links render through `linkComponent` / `LinkProvider`. Below `md` it becomes a scrolling tab strip.',
      },
    },
  },
  args: {
    title: 'Website redesign',
    groups: projectGroups,
    mobileTabs: true,
    onValueChange: fn(),
    linkComponent: RouterLink,
  },
  argTypes: {
    groups: { control: false },
    header: { control: false },
    footer: { control: false },
    linkComponent: { control: false },
    title: { control: 'text' },
    value: { control: 'text' },
    label: { control: 'text' },
    mobileTabs: { control: 'boolean' },
  },
  render: (args) => (
    <Frame>
      <InnerMenu {...args} />
    </Frame>
  ),
} satisfies Meta<typeof InnerMenu>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Queries scoped to the form of the menu that is on screen. From `md` up that is the side menu
 * (`<aside>`); below, the side menu is `display: none` and the tab strip replaces it, so the queries
 * run on the whole canvas (hidden elements are ignored by role queries). jsdom loads no stylesheet:
 * both forms render there, and the side menu is used.
 */
function visibleMenu(canvasElement: HTMLElement) {
  const side = canvasElement.querySelector<HTMLElement>('[data-slot="inner-menu"]')
  const sideVisible = side != null && getComputedStyle(side).display !== 'none'
  return within(sideVisible ? side : canvasElement)
}

/** Route-driven menu: groups with mono headings, a count badge, the active page and an external link. */
export const Default: Story = {}

/**
 * Without a title bar and with an unlabeled first group: the lightest form. With no `title` to
 * default to, `label` names the navigation landmark.
 */
export const WithoutTitle: Story = {
  args: {
    title: undefined,
    label: 'Project sections',
    groups: [{ ...generalGroup, label: undefined }, configurationGroup],
  },
  play: async ({ canvasElement }) => {
    const menu = visibleMenu(canvasElement)
    await expect(menu.getByRole('navigation', { name: 'Project sections' })).toBeInTheDocument()
  },
}

/** `header` slot (here a switcher button) under the title, and a `footer` pinned under the groups. */
export const WithHeaderAndFooter: Story = {
  args: {
    title: 'Settings',
    groups: [generalGroup, configurationGroup],
    header: (
      <Button
        className="w-full justify-between font-normal"
        icon={<FolderKanban className="text-foreground-lighter" />}
        iconRight={<ChevronsUpDown className="text-foreground-lighter" />}
      >
        <span className="mr-auto truncate">Website redesign</span>
      </Button>
    ),
    footer: (
      <div className="flex flex-col gap-2 rounded-lg border border-dashed p-3">
        <p className="text-[13px] text-foreground-light">Archived projects stay readable for 30 days.</p>
        <Button variant="destructive" size="tiny" icon={<Trash2 />} className="self-start">
          Delete project
        </Button>
      </div>
    ),
  },
}

/** States: a disabled item, badges, and long labels that truncate instead of wrapping. */
export const States: Story = {
  args: {
    title: 'Customer success operations and onboarding',
    groups: [
      {
        id: 'reports',
        label: 'Reports',
        items: [
          { id: 'weekly', label: 'Weekly revenue by region and sales channel', href: '#weekly', active: true },
          { id: 'churn', label: 'Churn', href: '#churn', badge: <Badge variant="destructive">3</Badge> },
          { id: 'forecast', label: 'Forecast', href: '#forecast', badge: <Badge variant="warning">BETA</Badge> },
          { id: 'exports', label: 'Scheduled exports', href: '#exports', disabled: true },
        ],
      },
    ],
  },
}

/** Holds the current section in local state; the `value` control of the Controls panel drives it too. */
function SectionSwitcher(args: React.ComponentProps<typeof InnerMenu>) {
  const [value, setValue] = React.useState(args.value ?? 'profile')
  const [prevArg, setPrevArg] = React.useState(args.value)
  if (args.value !== prevArg) {
    setPrevArg(args.value)
    if (args.value !== undefined) setValue(args.value)
  }
  return (
    <Frame>
      <InnerMenu
        {...args}
        value={value}
        onValueChange={(id) => {
          setValue(id)
          args.onValueChange?.(id)
        }}
      />
    </Frame>
  )
}

/** In-place section switching without a router: items are buttons, `value` + `onValueChange` hold the current one. */
export const ControlledSections: Story = {
  args: { title: 'Settings', groups: settingsGroups, value: 'profile' },
  render: (args) => <SectionSwitcher {...args} />,
  play: async ({ args, canvasElement }) => {
    const menu = visibleMenu(canvasElement)
    // The navigation landmark takes its name from the string `title`.
    await expect(menu.getByRole('navigation', { name: 'Settings' })).toBeInTheDocument()
    await expect(menu.getByRole('button', { name: 'Profile' })).toHaveAttribute('aria-current', 'page')
    await userEvent.click(menu.getByRole('button', { name: 'Billing' }))
    await expect(args.onValueChange).toHaveBeenCalledWith('billing')
    await expect(menu.getByRole('button', { name: 'Billing' })).toHaveAttribute('aria-current', 'page')
    await expect(menu.getByRole('button', { name: 'Profile' })).not.toHaveAttribute('aria-current')
  },
}

/**
 * Links go through the configured link component: clicking one navigates via the router adapter
 * and reports the section. New-tab clicks and external links leave the current section unchanged.
 */
export const LinkNavigation: Story = {
  play: async ({ args, canvasElement }) => {
    navigate.mockClear()
    ;(args.onValueChange as Mock).mockClear()
    const menu = visibleMenu(canvasElement)
    await expect(menu.getByRole('navigation', { name: 'Website redesign' })).toBeInTheDocument()
    await expect(menu.getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page')
    await userEvent.click(menu.getByRole('link', { name: /Tasks/ }))
    await expect(navigate).toHaveBeenCalledWith('/projects/website-redesign/tasks')
    await expect(args.onValueChange).toHaveBeenCalledWith('tasks')

    // Cmd/Ctrl-click opens a new tab: no section change.
    await fireEvent.click(menu.getByRole('link', { name: 'Files' }), { metaKey: true, ctrlKey: true })
    await expect(args.onValueChange).not.toHaveBeenCalledWith('files')

    const external = menu.getByRole('link', { name: /Project brief/ })
    // `externalLabel` ends the accessible name of external items.
    await expect(external).toHaveAccessibleName(/^Project brief\s*\(opens in a new tab\)$/)
    await expect(external).toHaveAttribute('target', '_blank')
    await expect(external).toHaveAttribute('rel', 'noreferrer')
    // Keep the test from opening a tab, then check the click does not change the section.
    external.addEventListener('click', (event) => event.preventDefault(), { once: true })
    await userEvent.click(external)
    await expect(args.onValueChange).not.toHaveBeenCalledWith('brief')
  },
}

/** `mobileTabs={false}`: the side menu stays visible at every width (e.g. inside a wide panel). */
export const AlwaysSideMenu: Story = {
  args: { mobileTabs: false },
}

/**
 * Phone width: the side menu is replaced by a scrolling pill strip (all groups flattened, no icons)
 * that keeps the active tab in view and fades its edges while more tabs are hidden.
 */
export const MobileTabStrip: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  args: {
    groups: [
      {
        id: 'general',
        items: [
          ...generalGroup.items.map((item) => ({ ...item, active: item.id === 'files' })),
          ...configurationGroup.items,
        ],
      },
      linksGroup,
    ],
  },
  play: async ({ canvasElement }) => {
    // Attribute queries, not roles: at desktop widths (docs page, iframe without the viewport
    // global) the strip is display:none, and hidden elements have no accessible name.
    const strip = canvasElement.querySelector<HTMLElement>('[data-slot="inner-menu-tabs"]')
    await expect(strip).toHaveAttribute('aria-label', 'Website redesign')
    const tabs = Array.from(strip?.querySelectorAll<HTMLElement>('[data-slot="inner-menu-tab"]') ?? [])
    await expect(tabs).toHaveLength(8)
    const current = tabs.filter((tab) => tab.getAttribute('aria-current') === 'page')
    await expect(current.map((tab) => tab.textContent)).toEqual(['Files'])
    const external = tabs.find((tab) => tab.textContent?.includes('Project brief'))
    await expect(external).toHaveAttribute('target', '_blank')
  },
}
