import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Bell,
  BookOpen,
  Building2,
  CircleHelp,
  CreditCard,
  FolderKanban,
  LayoutGrid,
  LogOut,
  Plus,
  Settings,
  UserRound,
  Users,
} from 'lucide-react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

import { Badge } from '../primitives/badge'
import { Button } from '../primitives/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../primitives/dropdown-menu'
import type { ThemePreference } from '../../theme/theme-provider'
import { ResourceSwitcher, type ResourceSwitcherItem } from './resource-switcher'
import { ThemeMenu } from './theme-menu'
import {
  TopBar,
  TopBarIconButton,
  TopBarLogo,
  TopBarSearch,
  TopBarSegment,
  TopBarSeparator,
  TopBarUserMenu,
} from './top-bar'

/** Open-by-default overlays render in their own iframe so the panel stays next to its trigger. */
const inFrame = (height: number) => ({ docs: { story: { inline: false, iframeHeight: `${height}px` } } })

/** Placeholder brand mark (a generic geometric logo). */
function DemoLogo(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="6" className="fill-primary" />
      <path d="M7 15.5 12 7l5 8.5H7Z" className="fill-primary-foreground" />
    </svg>
  )
}

const projects: ResourceSwitcherItem[] = [
  { id: 'customer-portal', label: 'Customer portal', icon: <FolderKanban /> },
  { id: 'marketing-site', label: 'Marketing site', icon: <FolderKanban /> },
  { id: 'mobile-app', label: 'Mobile app', icon: <FolderKanban /> },
  { id: 'analytics', label: 'Analytics', icon: <FolderKanban /> },
  { id: 'billing', label: 'Billing', icon: <FolderKanban /> },
]

/** Workspace scope menu: a TopBarSegment as DropdownMenu trigger. */
function WorkspaceSegment() {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <TopBarSegment
          icon={<Building2 />}
          aria-label="Workspace Acme Inc, open workspace menu"
          badge={
            <Badge font="mono" case="normal" className="hidden xl:inline-flex">
              Pro
            </Badge>
          }
          className="gap-2"
        >
          Acme Inc
        </TopBarSegment>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel>Workspace</DropdownMenuLabel>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 px-2 pt-1 pb-2 text-[13px]">
          <dt className="text-foreground-lighter">Plan</dt>
          <dd className="truncate text-right text-foreground">Pro</dd>
          <dt className="text-foreground-lighter">Members</dt>
          <dd className="truncate text-right font-mono text-foreground">12</dd>
          <dt className="text-foreground-lighter">Currency</dt>
          <dd className="truncate text-right font-mono text-foreground">EUR</dd>
        </dl>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Settings /> Workspace settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Users /> Invite members
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** The account menu used across stories. */
function DemoUserMenu({
  onSignOut,
  ...props
}: Partial<React.ComponentProps<typeof TopBarUserMenu>> & { onSignOut?: () => void }) {
  return (
    <TopBarUserMenu name="Maya Chen" description="maya@acme.com" {...props}>
      <DropdownMenuItem>
        <UserRound /> Profile
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Settings /> Account settings
      </DropdownMenuItem>
      <DropdownMenuItem>
        <CreditCard /> Billing
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <a href="#documentation">
          <BookOpen /> Documentation
        </a>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={onSignOut}>
        <LogOut /> Sign out
      </DropdownMenuItem>
    </TopBarUserMenu>
  )
}

/** Story args: the `TopBar` props plus story-only callbacks wired into the default actions. */
type TopBarStoryArgs = React.ComponentProps<typeof TopBar> & {
  /** Story-only: called when the search trigger is pressed. */
  onSearch?: () => void
  /** Story-only: called when "Sign out" is chosen in the account menu. */
  onSignOut?: () => void
  /** Story-only: called with the project id chosen in the project switcher (full composition). */
  onProjectChange?: (id: string) => void
}

const meta = {
  title: 'Layout/Top Bar',
  component: TopBar,
  subcomponents: {
    TopBarLogo,
    TopBarSeparator,
    TopBarSegment,
    TopBarSearch,
    TopBarIconButton,
    TopBarUserMenu,
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The 48px application header: a `TopBarLogo`, then a slash-separated trail (`TopBarSeparator` before each `TopBarSegment` or `ResourceSwitcher`), and a right-hand `actions` cluster (`TopBarSearch`, links, `TopBarIconButton`, `ThemeMenu`, `TopBarUserMenu` last). It holds no state: open your command palette from the search trigger and your mobile navigation from `onOpenMobileNav`.',
      },
    },
  },
  args: {
    navLabel: 'Breadcrumb',
    mobileNavLabel: 'Open navigation',
    logo: (
      <TopBarLogo href="#home" label="Acme home">
        <DemoLogo />
      </TopBarLogo>
    ),
    children: (
      <>
        <TopBarSeparator />
        <TopBarSegment icon={<Building2 />} aria-label="Workspace Acme Inc">
          Acme Inc
        </TopBarSegment>
        <TopBarSeparator />
        <TopBarSegment icon={<FolderKanban />} aria-label="Project Customer portal">
          Customer portal
        </TopBarSegment>
      </>
    ),
    onSearch: fn(),
    onSignOut: fn(),
  },
  argTypes: {
    logo: { control: false },
    children: { control: false },
    actions: {
      control: false,
      description: 'Right-aligned cluster. The stories default to a search trigger and an account menu.',
    },
    onOpenMobileNav: { control: false },
    onSearch: { control: false, table: { category: 'Story' } },
    onSignOut: { control: false, table: { category: 'Story' } },
    onProjectChange: { control: false, table: { category: 'Story' } },
  },
  render: ({ onSearch, onSignOut, actions, ...args }) => (
    <TopBar
      {...args}
      actions={
        actions === undefined ? (
          <>
            <TopBarSearch onClick={onSearch} />
            <DemoUserMenu onSignOut={onSignOut} />
          </>
        ) : (
          actions
        )
      }
    />
  ),
} satisfies Meta<TopBarStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

/** Logo, a two-level trail and the essential actions (search + account). */
export const Default: Story = {}

function FullCompositionDemo({
  onOpenMobileNav,
  onSearch,
  onProjectChange,
  onSignOut,
}: {
  onOpenMobileNav?: () => void
  onSearch?: () => void
  onProjectChange?: (id: string) => void
  onSignOut?: () => void
}) {
  const [project, setProject] = React.useState('customer-portal')
  const [theme, setTheme] = React.useState<ThemePreference>('system')
  return (
    <TopBar
      onOpenMobileNav={onOpenMobileNav}
      logo={
        <TopBarLogo href="#home" label="Acme home">
          <DemoLogo />
        </TopBarLogo>
      }
      actions={
        <>
          <Button asChild variant="ghost" size="sm" className="hidden text-foreground-light xl:inline-flex">
            <a href="#docs">Docs</a>
          </Button>
          <TopBarSearch onClick={onSearch} />
          <TopBarIconButton icon={<Bell />} label="Notifications" className="hidden sm:inline-flex" />
          <ThemeMenu value={theme} onValueChange={setTheme} className="max-sm:hidden" />
          <TopBarIconButton
            icon={<CircleHelp />}
            label="Help center"
            href="https://example.com/help"
            external
            className="hidden sm:inline-flex"
          />
          <DemoUserMenu onSignOut={onSignOut} />
        </>
      }
    >
      <span className="flex min-w-0 items-center gap-0.5 max-sm:hidden">
        <TopBarSeparator />
        <WorkspaceSegment />
      </span>
      <TopBarSeparator />
      <ResourceSwitcher
        label={`Project ${projects.find((p) => p.id === project)?.label}, switch project`}
        items={projects}
        value={project}
        onValueChange={(id) => {
          setProject(id)
          onProjectChange?.(id)
        }}
        searchPlaceholder="Find project…"
        actions={[
          { id: 'all', label: 'All projects', icon: <LayoutGrid /> },
          { id: 'new', label: 'New project', icon: <Plus /> },
        ]}
      />
      <span className="hidden items-center gap-1.5 xl:flex">
        <Badge variant="outline">Private</Badge>
        <Badge variant="success">Active</Badge>
      </span>
    </TopBar>
  )
}

/**
 * Everything together: workspace scope menu (hidden with its slash on phones), a project
 * switcher, status pills (from `xl`), and the full action cluster: docs link, search,
 * notifications, theme menu, help link and account menu. The play function switches project
 * from the keyboard and checks that the trail follows.
 */
export const FullComposition: Story = {
  parameters: inFrame(420),
  args: { onOpenMobileNav: fn(), onProjectChange: fn() },
  render: ({ onOpenMobileNav, onSearch, onSignOut, onProjectChange }) => (
    <FullCompositionDemo
      onOpenMobileNav={onOpenMobileNav}
      onSearch={onSearch}
      onSignOut={onSignOut}
      onProjectChange={onProjectChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Project Customer portal, switch project' }))
    const panel = await screen.findByRole('dialog', { name: 'Project Customer portal, switch project' })
    const input = within(panel).getByPlaceholderText('Find project…')
    await waitFor(() => expect(input).toHaveFocus())
    await userEvent.type(input, 'mobile')
    await waitFor(() => expect(within(panel).getByRole('option', { name: /Mobile app/ })).toHaveAttribute('aria-selected', 'true'))
    await userEvent.keyboard('{Enter}')
    await expect(args.onProjectChange).toHaveBeenCalledWith('mobile-app')
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Project Mobile app, switch project' })).toBeInTheDocument())
  },
}

/** Link crumbs: segments with `href` render through the link component; `current` marks the page. */
export const LinkTrail: Story = {
  args: {
    children: (
      <>
        <TopBarSeparator />
        <TopBarSegment href="#projects" icon={<LayoutGrid />}>
          Projects
        </TopBarSegment>
        <TopBarSeparator />
        <TopBarSegment href="#customer-portal">Customer portal</TopBarSegment>
        <TopBarSeparator />
        <TopBarSegment href="#settings" current>
          Settings
        </TopBarSegment>
      </>
    ),
  },
}

/**
 * Segment states: loading skeleton, trailing badge (hidden below `sm`), long text truncated at 180px,
 * and disabled. On a narrow bar the segments shrink and clip their own content.
 */
export const SegmentStates: Story = {
  args: {
    children: (
      <>
        <TopBarSeparator />
        <TopBarSegment icon={<Building2 />} loading aria-label="Loading workspace" />
        <TopBarSeparator />
        <TopBarSegment
          icon={<Building2 />}
          badge={
            <Badge font="mono" case="normal">
              Enterprise
            </Badge>
          }
        >
          Acme Inc
        </TopBarSegment>
        <TopBarSeparator />
        <TopBarSegment icon={<FolderKanban />}>Quarterly revenue reporting dashboard for the finance team</TopBarSegment>
        <TopBarSeparator />
        <TopBarSegment icon={<FolderKanban />} disabled>
          Archived project
        </TopBarSegment>
      </>
    ),
  },
}

/**
 * `chevron` overrides the default (shown on a button, hidden on a link): hide it on a button that
 * is not a switcher, or show it on a link that leads to a picker page.
 */
export const SegmentChevron: Story = {
  args: {
    children: (
      <>
        <TopBarSeparator />
        <TopBarSegment icon={<Building2 />}>Default button</TopBarSegment>
        <TopBarSeparator />
        <TopBarSegment icon={<Building2 />} chevron={false}>
          No chevron
        </TopBarSegment>
        <TopBarSeparator />
        <TopBarSegment href="#team">Default link</TopBarSegment>
        <TopBarSeparator />
        <TopBarSegment href="#team" chevron>
          Link with chevron
        </TopBarSegment>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const chevronOf = (segment: HTMLElement) => segment.querySelector('.lucide-chevrons-up-down')
    await expect(chevronOf(canvas.getByRole('button', { name: 'Default button' }))).toBeInTheDocument()
    await expect(chevronOf(canvas.getByRole('button', { name: 'No chevron' }))).not.toBeInTheDocument()
    await expect(chevronOf(canvas.getByRole('link', { name: 'Default link' }))).not.toBeInTheDocument()
    await expect(chevronOf(canvas.getByRole('link', { name: 'Link with chevron' }))).toBeInTheDocument()
  },
}

/** Without an `actions` slot and with a static (non-link) logo: the trail takes the full width. */
export const TrailOnly: Story = {
  args: {
    logo: (
      <TopBarLogo label="Acme">
        <DemoLogo />
      </TopBarLogo>
    ),
    actions: null,
  },
}

/** `onOpenMobileNav` adds a hamburger below `md` (always in the DOM, hidden by CSS on wider screens). */
export const MobileNavButton: Story = {
  args: { onOpenMobileNav: fn() },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  play: async ({ args, canvasElement }) => {
    // Queried by label, not role: from `md` up the button is display:none (e.g. on the docs page),
    // which removes it from the accessibility tree.
    const button = within(canvasElement).getByLabelText('Open navigation')
    await expect(button).toHaveClass('md:hidden')
    await userEvent.click(button)
    await expect(args.onOpenMobileNav).toHaveBeenCalledOnce()
  },
}

/**
 * `TopBarSearch` variants: default hint (⌘K / Ctrl K), a custom shortcut, no hint, and a
 * trigger that never collapses. It only calls `onClick`: bind the key and open the palette yourself.
 */
export const SearchTrigger: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <TopBarSearch />
      <TopBarSearch placeholder="Search docs…" shortcut="/" keyShortcuts="/" />
      <TopBarSearch placeholder="Jump to…" shortcut={false} />
      <TopBarSearch compactOnMobile={false} />
    </div>
  ),
}

/** Clicking the search trigger in the bar calls its `onClick` (open your command palette there). */
export const SearchInteraction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: /^Search/ })
    await expect(trigger).toHaveAttribute('aria-keyshortcuts')
    await userEvent.click(trigger)
    await expect(args.onSearch).toHaveBeenCalledOnce()
  },
}

/** Round icon buttons: a plain button, a link, an external link and one without tooltip. */
export const IconButtons: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex items-center gap-2">
      <TopBarIconButton icon={<Bell />} label="Notifications" />
      <TopBarIconButton icon={<Settings />} label="Settings" href="#settings" />
      <TopBarIconButton icon={<CircleHelp />} label="Help center" href="https://example.com/help" external />
      <TopBarIconButton icon={<LogOut />} label="Sign out" tooltip={false} />
    </div>
  ),
}

/** Focusing an icon button shows its label as a tooltip; the label is also its accessible name. */
export const IconButtonTooltip: Story = {
  parameters: { layout: 'padded' },
  render: () => <TopBarIconButton icon={<Bell />} label="Notifications" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await expect(canvas.getByRole('button', { name: 'Notifications' })).toHaveFocus()
    const tooltip = await screen.findByRole('tooltip')
    await expect(tooltip).toHaveTextContent('Notifications')
  },
}

/** Account menu opened for review: initials fallback, name / email header and items. */
export const UserMenuOpen: Story = {
  parameters: { layout: 'padded', ...inFrame(380) },
  render: () => (
    <div className="flex justify-end">
      <DemoUserMenu defaultOpen modal={false} />
    </div>
  ),
}

/**
 * A menu that is not about a person: `header` replaces the name / description block, `fallback` the
 * initials, `label` names the trigger, and `align` / `contentClassName` place and size the panel.
 */
export const UserMenuCustomHeader: Story = {
  parameters: { layout: 'padded', ...inFrame(380) },
  render: () => (
    <TopBarUserMenu
      defaultOpen
      modal={false}
      label="Workspace account"
      fallback={<Building2 className="size-3.5" />}
      align="start"
      contentClassName="w-64"
      header={
        <div className="flex items-center justify-between gap-2 px-2 py-1.5 text-[13px] text-foreground">
          <span className="truncate font-medium">Acme Inc</span>
          <Badge font="mono" case="normal">
            Enterprise
          </Badge>
        </div>
      }
    >
      <DropdownMenuItem>
        <Settings /> Workspace settings
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Users /> Members
      </DropdownMenuItem>
      <DropdownMenuItem>
        <CreditCard /> Billing
      </DropdownMenuItem>
    </TopBarUserMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Workspace account' })).toHaveAttribute('aria-expanded', 'true')
    const menu = await screen.findByRole('menu')
    await expect(within(menu).getByText('Acme Inc')).toBeInTheDocument()
    await expect(within(menu).getByText('Enterprise')).toBeInTheDocument()
    await expect(within(menu).getByRole('menuitem', { name: /Workspace settings/ })).toBeInTheDocument()
  },
}

/** Trigger fallbacks: initials from `name`, a picture (`avatarSrc`), and the icon when there is no name. */
export const UserMenuTriggers: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex items-center gap-3">
      <TopBarUserMenu name="Maya Chen" />
      <TopBarUserMenu name="Jordan" avatarSrc="/avatars/portrait-4.svg" />
      <TopBarUserMenu />
    </div>
  ),
}

/** Keyboard: Enter opens the account menu on its first item, End jumps to "Sign out", Enter runs it. */
export const UserMenuInteraction: Story = {
  parameters: { layout: 'padded' },
  render: ({ onSignOut }) => <DemoUserMenu onSignOut={onSignOut} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Account' })
    await userEvent.tab()
    await expect(trigger).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    const menu = await screen.findByRole('menu')
    await expect(within(menu).getByText('maya@acme.com')).toBeInTheDocument()
    await waitFor(() => expect(within(menu).getByRole('menuitem', { name: /Profile/ })).toHaveFocus())
    await userEvent.keyboard('{End}')
    await waitFor(() => expect(within(menu).getByRole('menuitem', { name: /Sign out/ })).toHaveFocus())
    await userEvent.keyboard('{Enter}')
    await expect(args.onSignOut).toHaveBeenCalledOnce()
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
  },
}
