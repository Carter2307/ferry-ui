import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CreditCard, FolderKanban, Home, LifeBuoy, LogOut, Menu, Plus, Search, Settings, Users } from 'lucide-react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { useModKey } from '../../hooks/use-platform'
import { LinkProvider, type LinkComponent } from '../../lib/link'
import { Kbd } from '../patterns/kbd'
import { Avatar, AvatarFallback } from '../primitives/avatar'
import { Badge } from '../primitives/badge'
import { Button } from '../primitives/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '../primitives/card'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../primitives/command'

import { AppShell, useAppShell } from './app-shell'
import { IconRail, IconRailItem } from './icon-rail'
import { MobileNav, MobileNavTrigger } from './mobile-nav'
import type { NavGroup, NavItem } from './types'

/* Module-level spy so play functions can assert on router navigation. */
const navigate = fn().mockName('navigate')

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

/* ---------------------------------------------------------------------------------------------- */
/* Example data                                                                                    */
/* ---------------------------------------------------------------------------------------------- */

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', href: '/', icon: <Home /> },
  { id: 'projects', label: 'Projects', href: '/projects', icon: <FolderKanban /> },
  { id: 'team', label: 'Team', href: '/team', icon: <Users /> },
  { id: 'billing', label: 'Billing', href: '/billing', icon: <CreditCard /> },
  { id: 'settings', label: 'Settings', href: '/settings', icon: <Settings /> },
]

/** Groups the items (Home · Projects, Team · Billing, Settings) and marks `activeId` as the current page. */
function buildGroups(activeId: string, onSelect?: (id: string) => void): NavGroup[] {
  const item = (id: string): NavItem => {
    const base = navItems.find((i) => i.id === id)!
    return { ...base, active: id === activeId, onSelect: onSelect ? () => onSelect(id) : undefined }
  }
  return [
    { id: 'main', items: [item('home')] },
    { id: 'workspace', items: [item('projects'), item('team')] },
    { id: 'account', items: [item('billing'), item('settings')] },
  ]
}

const projects = [
  { name: 'Website redesign', owner: 'Ada Park', updated: '2 hours ago', status: 'Active' },
  { name: 'Mobile app', owner: 'Liam Chen', updated: 'yesterday', status: 'Active' },
  { name: 'Customer portal', owner: 'Sofia Rossi', updated: '3 days ago', status: 'Paused' },
  { name: 'Quarterly report', owner: 'Noah Kim', updated: 'last week', status: 'Draft' },
  { name: 'Onboarding emails', owner: 'Ada Park', updated: 'last week', status: 'Active' },
  { name: 'Pricing experiment', owner: 'Maya Singh', updated: '2 weeks ago', status: 'Draft' },
]

function AcmeMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={
        className ??
        'flex size-5 shrink-0 items-center justify-center rounded-sm bg-primary-solid text-[10px] font-medium text-primary-foreground'
      }
    >
      A
    </span>
  )
}

/** Square brand link for the rail's `logo` slot. */
function RailLogo() {
  return (
    <StoryLink
      href="/"
      aria-label="Acme home"
      className="flex size-9 items-center justify-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <AcmeMark className="flex size-[26px] items-center justify-center rounded-md bg-primary-solid text-xs font-medium text-primary-foreground" />
    </StoryLink>
  )
}

/**
 * A simple 48px header: drawer trigger, brand, search button and avatar. By default the trigger is a
 * `MobileNavTrigger` (phones only); `menuButton` replaces it (e.g. a bar with its own open callback).
 */
function DemoTopBar({ onSearch, menuButton }: { onSearch?: () => void; menuButton?: React.ReactNode }) {
  // Hook rather than the `modKey` constant: hydration-safe in server-rendered apps.
  const modKey = useModKey()
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-background pr-3 pl-2 md:pr-4 md:pl-3">
      {menuButton ?? <MobileNavTrigger />}
      <StoryLink
        href="/"
        aria-label="Acme home"
        className="flex size-8 shrink-0 items-center justify-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <AcmeMark />
      </StoryLink>
      <span className="truncate text-sm font-medium text-foreground">Acme</span>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" icon={<Search />} onClick={onSearch} className="text-foreground-lighter">
          Search…
          <Kbd className="max-sm:hidden">{modKey} K</Kbd>
        </Button>
        <Avatar size="sm">
          <AvatarFallback className="text-[11px]">AP</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}

/** Example page: a heading row and a grid of project cards. */
function DemoPage({ title = 'Projects', repeat = 1 }: { title?: string; repeat?: number }) {
  const rows = Array.from({ length: repeat }, () => projects).flat()
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-medium text-foreground">{title}</h1>
          <p className="text-[13px] text-foreground-light">Everything your team is working on.</p>
        </div>
        <Button variant="primary" icon={<Plus />}>
          New project
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((project, i) => (
          <Card key={`${project.name}-${i}`}>
            <CardHeader>
              <div className="flex min-w-0 flex-col">
                <CardTitle className="truncate">{project.name}</CardTitle>
                <CardDescription className="truncate">{project.owner}</CardDescription>
              </div>
              <CardAction>
                <Badge variant={project.status === 'Active' ? 'success' : 'default'}>{project.status}</Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="text-[13px] text-foreground-light">Updated {project.updated}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function DemoMobileNav({ groups }: { groups: NavGroup[] }) {
  return (
    <MobileNav
      groups={groups}
      logo={<AcmeMark />}
      title="Acme"
      description="Acme workspace · Pro plan"
      footer={
        <Button className="w-full" icon={<LogOut />}>
          Sign out
        </Button>
      }
    />
  )
}

/** A custom drawer button built on `useAppShell()`: shown on every screen size, reflects the drawer state. */
function ShellMenuButton() {
  const shell = useAppShell()
  return (
    <Button
      variant="ghost"
      size="icon"
      icon={<Menu />}
      aria-label="Menu"
      aria-expanded={shell?.mobileNavOpen ?? false}
      onClick={() => shell?.setMobileNavOpen(true)}
    />
  )
}

const defaultGroups = buildGroups('projects')

/* ---------------------------------------------------------------------------------------------- */
/* Meta                                                                                            */
/* ---------------------------------------------------------------------------------------------- */

const meta = {
  title: 'Layout/App Shell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The application frame: `topBar` across the top, `rail` (an `IconRail`) on the left from 768px, the page as `children` in the only scrolling region, and `mobileNav` (a `MobileNav`, opened by a `MobileNavTrigger` in the top bar) on phones. Use it once at the root of the signed-in app; pass `scrollKey` (the pathname) and `onCommandShortcut` (⌘K) as needed.',
      },
      story: { inline: false, height: '640px' },
    },
  },
  decorators: [
    (Story) => (
      <LinkProvider component={StoryLink}>
        <Story />
      </LinkProvider>
    ),
  ],
  args: {
    rail: <IconRail groups={defaultGroups} />,
    topBar: <DemoTopBar />,
    mobileNav: <DemoMobileNav groups={defaultGroups} />,
    children: <DemoPage />,
    defaultMobileNavOpen: false,
    skipLinkLabel: 'Skip to content',
    onCommandShortcut: fn(),
    onMobileNavOpenChange: fn(),
  },
  argTypes: {
    rail: { control: false },
    topBar: { control: false },
    mobileNav: { control: false },
    children: { control: false },
    mobileNavOpen: { control: 'boolean' },
    scrollKey: { control: 'text' },
  },
} satisfies Meta<typeof AppShell>

export default meta
type Story = StoryObj<typeof meta>

/** Top bar, collapsed icon rail and a page of project cards. Narrow the viewport to see the drawer trigger. */
export const Default: Story = {}

/** The mobile navigation drawer open (`defaultMobileNavOpen`); choosing an item closes it through the shell state. */
export const MobileNavigationOpen: Story = {
  args: { defaultMobileNavOpen: true },
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const drawer = await body.findByRole('dialog', { name: 'Acme' })
    await userEvent.click(within(drawer).getByRole('link', { name: 'Team' }))
    await expect(navigate).toHaveBeenLastCalledWith('/team')
    await waitFor(() => expect(drawer).toHaveAttribute('data-state', 'closed'))
    await expect(args.onMobileNavOpenChange).toHaveBeenLastCalledWith(false)
  },
}

/** Expanded rail with a logo and footer rows. */
export const ExpandedRail: Story = {
  args: {
    rail: (
      <IconRail
        groups={defaultGroups}
        defaultExpanded
        footer={<IconRailItem item={{ id: 'help', label: 'Help center', href: '/help', icon: <LifeBuoy /> }} />}
      />
    ),
  },
}

/** No top bar: the rail carries the brand mark in its `logo` slot. */
export const WithoutTopBar: Story = {
  args: {
    topBar: undefined,
    rail: (
      <IconRail
        groups={defaultGroups}
        logo={<RailLogo />}
      />
    ),
  },
}

/** No rail: a top bar and the page only (simple apps with 1–2 sections). */
export const WithoutRail: Story = {
  args: { rail: undefined },
}

/** Long page: only the main region scrolls; the top bar and the rail stay in place. */
export const LongContent: Story = {
  args: { children: <DemoPage repeat={5} /> },
}

/**
 * Phone viewport: the rail is hidden and the top bar's `MobileNavTrigger` opens the `MobileNav`
 * through the shell state (no `open` prop wired by hand).
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    // By label, not role: the trigger is `md:hidden`, so this also passes when the canvas is wider than a phone.
    await userEvent.click(canvas.getByLabelText('Open navigation'))
    const drawer = await body.findByRole('dialog', { name: 'Acme' })
    await expect(args.onMobileNavOpenChange).toHaveBeenLastCalledWith(true)
    await expect(within(drawer).getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(drawer).toHaveAttribute('data-state', 'closed'))
    await expect(args.onMobileNavOpenChange).toHaveBeenLastCalledWith(false)
  },
}

/**
 * Controlled drawer (`mobileNavOpen` + `onMobileNavOpenChange`): the parent owns the state, so a top
 * bar that only exposes an open callback (like TopBar's `onOpenMobileNav`) can open it.
 */
export const ControlledMobileNav: Story = {
  render: function Render(args) {
    const [open, setOpen] = React.useState(false)
    return (
      <AppShell
        {...args}
        mobileNavOpen={open}
        onMobileNavOpenChange={(next) => {
          setOpen(next)
          args.onMobileNavOpenChange?.(next)
        }}
        topBar={
          <DemoTopBar
            menuButton={
              <Button variant="ghost" size="icon" icon={<Menu />} aria-label="Open menu" onClick={() => setOpen(true)} />
            }
          />
        }
      />
    )
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }))
    const drawer = await body.findByRole('dialog', { name: 'Acme' })
    await userEvent.click(within(drawer).getByRole('link', { name: 'Billing' }))
    await expect(navigate).toHaveBeenLastCalledWith('/billing')
    await waitFor(() => expect(drawer).toHaveAttribute('data-state', 'closed'))
    await expect(args.onMobileNavOpenChange).toHaveBeenLastCalledWith(false)
  },
}

/** `useAppShell()` builds a custom drawer button inside the top bar (here visible on every screen size). */
export const UseAppShellHook: Story = {
  args: { topBar: <DemoTopBar menuButton={<ShellMenuButton />} /> },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const button = canvas.getByRole('button', { name: 'Menu' })
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(button)
    const drawer = await body.findByRole('dialog', { name: 'Acme' })
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(within(drawer).getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(drawer).toHaveAttribute('data-state', 'closed'))
    await expect(button).toHaveAttribute('aria-expanded', 'false')
  },
}

/** ⌘K / Ctrl+K anywhere calls `onCommandShortcut`. */
export const CommandShortcut: Story = {
  play: async ({ args }) => {
    await userEvent.keyboard('{Control>}k{/Control}')
    await expect(args.onCommandShortcut).toHaveBeenCalledOnce()
  },
}

/** The first Tab stop is the "Skip to content" link, which targets the main region. */
export const SkipLink: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    const skip = canvas.getByRole('link', { name: 'Skip to content' })
    await expect(skip).toHaveFocus()
    const main = canvas.getByRole('main')
    await expect(skip).toHaveAttribute('href', `#${main.id}`)
  },
}

/**
 * A complete, stateful composition: the rail and the drawer share the active page, `scrollKey`
 * resets scrolling on navigation, and ⌘K (or the search button) opens a command palette.
 */
export const ComposedApp: Story = {
  render: function Render(args) {
    const [active, setActive] = React.useState('projects')
    const [commandOpen, setCommandOpen] = React.useState(false)
    const groups = buildGroups(active, setActive)
    const current = navItems.find((i) => i.id === active)
    return (
      <>
        <AppShell
          {...args}
          scrollKey={active}
          onCommandShortcut={() => {
            setCommandOpen((open) => !open)
            args.onCommandShortcut?.()
          }}
          rail={<IconRail groups={groups} />}
          topBar={<DemoTopBar onSearch={() => setCommandOpen(true)} />}
          mobileNav={<DemoMobileNav groups={groups} />}
        >
          <DemoPage title={current?.label} repeat={3} />
        </AppShell>
        <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
          <CommandInput placeholder="Go to…" />
          <CommandList>
            <CommandEmpty>No pages found.</CommandEmpty>
            <CommandGroup heading="Pages">
              {navItems.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => {
                    setActive(item.id)
                    setCommandOpen(false)
                  }}
                >
                  {item.icon}
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await expect(canvas.getByRole('heading', { name: 'Projects' })).toBeInTheDocument()
    const main = canvas.getByRole('main')
    main.scrollTop = 240
    await userEvent.keyboard('{Control>}k{/Control}')
    const palette = await body.findByRole('dialog', { name: 'Command Palette' })
    await userEvent.click(within(palette).getByRole('option', { name: 'Billing' }))
    await waitFor(() => expect(canvas.getByRole('heading', { name: 'Billing' })).toBeInTheDocument())
    // `scrollKey` changed with the page: the main region is back at the top.
    await waitFor(() => expect(main.scrollTop).toBe(0))
    // The rail is hidden below `md` (the drawer takes over on phones): only assert on it when it is displayed.
    const rail = canvasElement.querySelector('[data-slot="app-shell-rail"]')
    if (rail && window.getComputedStyle(rail).display !== 'none') {
      const nav = within(canvas.getByRole('navigation', { name: 'Main' }))
      await expect(nav.getByRole('link', { name: 'Billing' })).toHaveAttribute('aria-current', 'page')
    }
  },
}
