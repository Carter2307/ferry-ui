import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bell, BookOpen, ChevronsUpDown, CreditCard, FolderKanban, Home, LogOut, Settings, Users } from 'lucide-react'
import { expect, fn, userEvent, waitFor, within, type Mock } from 'storybook/test'

import { LinkProvider, type LinkComponent } from '../../lib/link'
import type { ThemePreference } from '../../theme/theme-provider'
import { Badge } from '../primitives/badge'
import { Button } from '../primitives/button'

import { AppShell } from './app-shell'
import { MobileNav, MobileNavSection, MobileNavTrigger } from './mobile-nav'
import type { NavGroup, NavItem } from './types'

/* Module-level spies so play functions can assert on router navigation and item actions. */
const navigate = fn().mockName('navigate')
const openNotifications = fn().mockName('openNotifications')
const shellOpenChange = fn().mockName('onMobileNavOpenChange')

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

function AcmeMark() {
  return (
    <span
      aria-hidden="true"
      className="flex size-5 shrink-0 items-center justify-center rounded-sm bg-primary-solid text-[10px] font-medium text-primary-foreground"
    >
      A
    </span>
  )
}

const signOut = (
  <Button className="w-full" icon={<LogOut />}>
    Sign out
  </Button>
)

const meta = {
  title: 'Layout/Mobile Nav',
  component: MobileNav,
  subcomponents: { MobileNavTrigger, MobileNavSection },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Phone navigation drawer sliding from the left: header (logo, title, description), the same `groups` as the desktop `IconRail` as 40px rows, optional `MobileNavSection`s and theme control, and a `footer` slot (sign out). On open, focus moves to the current destination, never to the footer action. Inside an `AppShell` it follows the shell state and opens from a `MobileNavTrigger`; standalone, pass `trigger` or control `open`.',
      },
      story: { inline: false, height: '640px' },
    },
  },
  decorators: [
    (Story) => (
      <LinkProvider component={StoryLink}>
        <div className="min-h-[640px] p-4">
          <Story />
        </div>
      </LinkProvider>
    ),
  ],
  args: {
    groups,
    logo: <AcmeMark />,
    title: 'Acme',
    description: 'Acme workspace · Pro plan',
    defaultOpen: true,
    showThemeToggle: false,
    closeOnSelect: true,
    side: 'left',
    onOpenChange: fn(),
    onThemeChange: fn(),
    footer: signOut,
  },
  argTypes: {
    groups: { control: false },
    items: { control: false },
    logo: { control: false },
    footer: { control: false },
    trigger: { control: false },
    children: { control: false },
    linkComponent: { control: false },
    title: { control: 'text' },
    description: { control: 'text' },
    open: { control: 'boolean' },
    labels: { control: 'object' },
    side: { control: 'inline-radio', options: ['left', 'right'] },
    theme: { control: 'inline-radio', options: ['light', 'dark', 'system'] },
  },
} satisfies Meta<typeof MobileNav>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Open drawer with a brand header, three groups and a sign-out footer. On open, focus lands on the
 * current destination (`active` item), not on the footer action.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const drawer = await body.findByRole('dialog', { name: 'Acme' })
    await waitFor(() => expect(within(drawer).getByRole('link', { name: 'Projects' })).toHaveFocus())
    await expect(within(drawer).getByRole('button', { name: 'Sign out' })).not.toHaveFocus()
  },
}

/** Closed by default, opened by a `MobileNavTrigger` passed as `trigger` (shown here on every screen size). */
export const WithTrigger: Story = {
  args: { defaultOpen: false, trigger: <MobileNavTrigger className="md:inline-flex" /> },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Open navigation' }))
    const drawer = await body.findByRole('dialog', { name: 'Acme' })
    await expect(args.onOpenChange).toHaveBeenCalledWith(true)
    await expect(within(drawer).getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page')
    await userEvent.click(within(drawer).getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(drawer).toHaveAttribute('data-state', 'closed'))
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
  },
}

/**
 * Inside an `AppShell`, a `MobileNav` can sit in the top bar with a `MobileNavTrigger` as its
 * `trigger`, keeping the button and the drawer together. The drawer follows the shell state (no
 * `open` prop), and one click opens it once: `onMobileNavOpenChange` fires a single time.
 */
export const TriggerInAppShell: Story = {
  args: { defaultOpen: false, trigger: <MobileNavTrigger className="md:inline-flex" /> },
  render: (args) => (
    <AppShell
      className="h-[608px] rounded-lg border"
      onMobileNavOpenChange={shellOpenChange}
      topBar={
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-2">
          <MobileNav {...args} />
          <AcmeMark />
          <span className="text-sm font-medium text-foreground">Acme</span>
        </header>
      }
    >
      <p className="p-6 text-[13px] text-foreground-light">Open the navigation from the top bar.</p>
    </AppShell>
  ),
  play: async ({ args, canvasElement }) => {
    shellOpenChange.mockClear()
    ;(args.onOpenChange as Mock).mockClear()
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Open navigation' }))
    const drawer = await body.findByRole('dialog', { name: 'Acme' })
    await expect(shellOpenChange).toHaveBeenCalledOnce()
    await expect(shellOpenChange).toHaveBeenCalledWith(true)
    await expect(args.onOpenChange).toHaveBeenCalledOnce()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(drawer).toHaveAttribute('data-state', 'closed'))
    await expect(shellOpenChange).toHaveBeenCalledTimes(2)
    await expect(shellOpenChange).toHaveBeenLastCalledWith(false)
  },
}

/** Choosing an item navigates through the link component and closes the drawer (`closeOnSelect`). */
export const CloseOnSelect: Story = {
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const drawer = await body.findByRole('dialog', { name: 'Acme' })
    await userEvent.click(within(drawer).getByRole('link', { name: 'Team' }))
    await expect(navigate).toHaveBeenLastCalledWith('/team')
    await waitFor(() => expect(drawer).toHaveAttribute('data-state', 'closed'))
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
  },
}

/**
 * Group labels, a count badge, a disabled item and an external link (a plain `<a target="_blank">`
 * whose name ends with `labels.external` for screen readers).
 */
export const GroupLabelsAndBadges: Story = {
  args: {
    groups: [
      { id: 'main', items: [home, { ...projects, badge: <Badge font="mono">8</Badge> }] },
      { id: 'people', label: 'People', items: [team, { id: 'guests', label: 'Guests', href: '/guests', icon: <Users />, disabled: true }] },
      {
        id: 'resources',
        label: 'Resources',
        items: [
          billing,
          { id: 'docs', label: 'Documentation', href: 'https://example.com/docs', icon: <BookOpen />, external: true },
        ],
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const drawer = await body.findByRole('dialog')
    const docs = within(drawer).getByRole('link', { name: /^Documentation\s*\(opens in a new tab\)$/ })
    await expect(docs).toHaveAttribute('target', '_blank')
    await expect(docs).toHaveAttribute('rel', 'noreferrer')
  },
}

/** Extra `MobileNavSection`s below the groups, and the theme control (controlled here with `theme` + `onThemeChange`). */
export const WithSectionsAndTheme: Story = {
  args: { showThemeToggle: true },
  render: function Render(args) {
    const [theme, setTheme] = React.useState<ThemePreference>('light')
    return (
      <MobileNav
        {...args}
        theme={theme}
        onThemeChange={(next) => {
          setTheme(next)
          args.onThemeChange?.(next)
        }}
      >
        <MobileNavSection label="Workspace">
          <Button variant="outline" className="w-full justify-between" iconRight={<ChevronsUpDown />}>
            Acme Marketing
          </Button>
        </MobileNavSection>
      </MobileNav>
    )
  },
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const drawer = await body.findByRole('dialog', { name: 'Acme' })
    const dark = within(drawer).getByRole('radio', { name: 'Dark' })
    await userEvent.click(dark)
    await expect(args.onThemeChange).toHaveBeenLastCalledWith('dark')
    await expect(dark).toHaveAttribute('aria-checked', 'true')
  },
}

/**
 * `closeOnSelect={false}` keeps the drawer open after a choice. Items without `href` render as
 * buttons that call `onSelect` (here a notifications panel).
 */
export const KeepOpenOnSelect: Story = {
  args: {
    closeOnSelect: false,
    groups: [
      ...groups,
      { id: 'actions', items: [{ id: 'notifications', label: 'Notifications', icon: <Bell />, onSelect: openNotifications }] },
    ],
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const drawer = await body.findByRole('dialog', { name: 'Acme' })
    await userEvent.click(within(drawer).getByRole('button', { name: 'Notifications' }))
    await expect(openNotifications).toHaveBeenCalled()
    await expect(drawer).toHaveAttribute('data-state', 'open')
    await expect(within(drawer).getByRole('button', { name: 'Notifications' })).toBeVisible()
  },
}

/**
 * `labels` translates the built-in texts: the name of the `<nav>` landmark, the theme control
 * (heading and options), the close button and the screen-reader suffix of external items. The other
 * texts are your own props (`title`, items, `footer`).
 */
export const TranslatedLabels: Story = {
  args: {
    showThemeToggle: true,
    title: 'Menu',
    description: undefined,
    labels: {
      navigation: 'Principal',
      theme: 'Thème',
      light: 'Clair',
      dark: 'Sombre',
      system: 'Système',
      close: 'Fermer',
      external: '(nouvel onglet)',
    },
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const drawer = await body.findByRole('dialog', { name: 'Menu' })
    await expect(within(drawer).getByRole('navigation', { name: 'Principal' })).toBeInTheDocument()
    await expect(within(drawer).getByRole('radiogroup', { name: 'Thème' })).toBeInTheDocument()
    await expect(within(drawer).getByRole('radio', { name: 'Clair' })).toBeInTheDocument()
    await expect(within(drawer).getByRole('radio', { name: 'Sombre' })).toBeInTheDocument()
    await expect(within(drawer).getByRole('radio', { name: 'Système' })).toBeInTheDocument()
    await expect(within(drawer).getByRole('button', { name: 'Fermer' })).toBeInTheDocument()
  },
}

/** Flat `items`, no description, no footer: the minimum. */
export const Minimal: Story = {
  args: { groups: undefined, items: [home, projects, team, billing, settings], description: undefined, footer: undefined, logo: undefined, title: 'Menu' },
}

/** Many items scroll inside the drawer while the header and footer stay in place; long labels truncate. */
export const LongList: Story = {
  args: {
    groups: [
      ...groups,
      {
        id: 'projects-list',
        label: 'Recent projects',
        items: Array.from({ length: 12 }, (_, i) => ({
          id: `project-${i}`,
          label: i === 0 ? 'Customer onboarding redesign for the enterprise tier' : `Project ${i + 1}`,
          href: `/projects/${i + 1}`,
          icon: <FolderKanban />,
        })),
      },
    ],
  },
}

/** Slides in from the right edge (`side="right"`). */
export const RightSide: Story = {
  args: { side: 'right' },
}
