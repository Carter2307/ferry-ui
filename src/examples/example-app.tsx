import * as React from 'react'
import {
  BookOpen,
  Building2,
  CircleHelp,
  CreditCard,
  FolderKanban,
  Home,
  KeyRound,
  LifeBuoy,
  LogOut,
  Plus,
  Settings,
  UserPlus,
  UserRound,
  Users,
} from 'lucide-react'

import {
  AppShell,
  Badge,
  Button,
  CommandMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  IconRail,
  IconRailItem,
  LinkProvider,
  MobileNav,
  ResourceSwitcher,
  ThemeMenu,
  Toaster,
  TopBar,
  TopBarIconButton,
  TopBarLogo,
  TopBarSearch,
  TopBarSegment,
  TopBarSeparator,
  TopBarUserMenu,
  toast,
  useTheme,
  type CommandMenuGroup,
  type LinkComponent,
  type NavGroup,
  type NavItem,
  type ResourceSwitcherItem,
  type StatusTone,
  type ThemePreference,
} from '../index'

/*
 * Shared frame of the `Examples/…` stories: the "Acme" workspace of a generic SaaS product
 * (projects, members, API keys, billing). It is story support code, not part of the library: it
 * imports everything from the public barrel, exactly like a consuming app would.
 */

/* -------------------------------------------------------------------------------------------------
 * Router adapter
 * -----------------------------------------------------------------------------------------------*/

const NavigateContext = React.createContext<((href: string) => void) | undefined>(undefined)

/**
 * The examples' router adapter: an anchor that cancels the full page load and reports the target
 * to the nearest {@link ExampleApp}'s `onNavigate` instead. In a real app this is your router's
 * link (`({ href, ...props }) => <RouterLink to={href} {...props} />`), given once to `LinkProvider`.
 * Use it directly for the page's own links, as you would use your router's link.
 */
export const ExampleLink: LinkComponent = ({ href, onClick, ...props }) => {
  const navigate = React.useContext(NavigateContext)
  return (
    <a
      href={href}
      {...props}
      onClick={(event) => {
        onClick?.(event)
        event.preventDefault()
        navigate?.(href)
      }}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Example data
 * -----------------------------------------------------------------------------------------------*/

/** Lifecycle of an example project. */
export type ProjectStatus = 'active' | 'paused' | 'archived'

/** One project of the Acme workspace, shared by the Dashboard and List Page examples. */
export interface ExampleProject {
  /** URL-safe id, used in `/projects/<id>`. */
  id: string
  /** Display name. */
  name: string
  /** Full name of the member who owns the project. */
  owner: string
  /** Current lifecycle state. */
  status: ProjectStatus
  /** Number of members with access. */
  members: number
  /** Team tag shown as a small mono badge. */
  team: string
  /** Relative time of the last change, already formatted. */
  updated: string
}

/**
 * Domain status → status vocabulary of the library, declared once next to the type and reused by
 * every `StatusBadge` / `StatusDot` / `StatusLine` that shows a project.
 */
export const PROJECT_STATUS: Record<ProjectStatus, { tone: StatusTone; label: string }> = {
  active: { tone: 'success', label: 'Active' },
  paused: { tone: 'warning', label: 'Paused' },
  archived: { tone: 'neutral', label: 'Archived' },
}

/** The projects of the Acme workspace. */
export const EXAMPLE_PROJECTS: ExampleProject[] = [
  { id: 'customer-portal', name: 'Customer portal', owner: 'Maya Chen', status: 'active', members: 8, team: 'product', updated: '2 hours ago' },
  { id: 'marketing-site', name: 'Marketing site', owner: 'Liam Ortiz', status: 'active', members: 5, team: 'growth', updated: '5 hours ago' },
  { id: 'billing-dashboard', name: 'Billing dashboard', owner: 'Sofia Rossi', status: 'paused', members: 3, team: 'finance', updated: '1 day ago' },
  { id: 'mobile-app', name: 'Mobile app', owner: 'Noah Kim', status: 'active', members: 11, team: 'product', updated: '1 day ago' },
  { id: 'onboarding-emails', name: 'Onboarding emails', owner: 'Ada Park', status: 'active', members: 4, team: 'growth', updated: '3 days ago' },
  { id: 'pricing-experiment', name: 'Pricing experiment', owner: 'Maya Chen', status: 'paused', members: 2, team: 'growth', updated: '6 days ago' },
  { id: 'quarterly-report', name: 'Quarterly report', owner: 'Sofia Rossi', status: 'active', members: 6, team: 'finance', updated: '1 week ago' },
  { id: 'legacy-intranet', name: 'Legacy intranet', owner: 'Noah Kim', status: 'archived', members: 1, team: 'internal', updated: '2 months ago' },
]

/** Initials of a full name ("Maya Chen" → "MC"), for `AvatarFallback`. */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/)
  const first = parts[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1] ?? '') : ''
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
}

/** Placeholder brand mark of the fictional Acme product (a generic geometric logo). Decorative. */
export function AcmeMark(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="6" className="fill-primary" />
      <path d="M7 15.5 12 7l5 8.5H7Z" className="fill-primary-foreground" />
    </svg>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Navigation
 * -----------------------------------------------------------------------------------------------*/

/** Top-level area of the example app; the one a page belongs to is marked as current in the navigation. */
export type ExampleSection = 'overview' | 'projects' | 'members' | 'api-keys' | 'billing' | 'settings'

/** One link segment of the top-bar trail, after the workspace switcher. */
export interface ExampleCrumb {
  /** Segment text. */
  label: string
  /** Destination of the segment. */
  href: string
}

const DESTINATIONS: (NavItem & { id: ExampleSection; href: string })[] = [
  { id: 'overview', label: 'Overview', href: '/', icon: <Home /> },
  { id: 'projects', label: 'Projects', href: '/projects', icon: <FolderKanban /> },
  { id: 'members', label: 'Members', href: '/members', icon: <Users /> },
  { id: 'api-keys', label: 'API keys', href: '/api-keys', icon: <KeyRound /> },
  { id: 'billing', label: 'Billing', href: '/billing', icon: <CreditCard /> },
  { id: 'settings', label: 'Settings', href: '/settings', icon: <Settings /> },
]

/** The same groups feed the desktop rail and the phone drawer; `active` comes from the router. */
function buildNavGroups(section: ExampleSection): NavGroup[] {
  const item = (id: ExampleSection): NavItem => {
    const destination = DESTINATIONS.find((d) => d.id === id)!
    return { ...destination, active: id === section }
  }
  return [
    { id: 'workspace', items: [item('overview'), item('projects'), item('members')] },
    { id: 'account', items: [item('api-keys'), item('billing'), item('settings')] },
  ]
}

const WORKSPACES: ResourceSwitcherItem[] = [
  { id: 'acme', label: 'Acme', icon: <Building2 />, description: 'Pro plan · 12 members' },
  { id: 'acme-labs', label: 'Acme Labs', icon: <Building2 />, description: 'Free plan · 3 members' },
  { id: 'personal', label: 'Maya Chen', icon: <UserRound />, description: 'Personal workspace' },
]

/**
 * Applies a theme choice the way `ThemeProvider` does (the `dark` class on `<html>`). Storybook's
 * toolbar owns that class in these stories, so the examples mirror it instead of mounting a
 * provider. In an app: mount `<ThemeProvider>` once at the root and render `<ThemeMenu />` bare.
 */
function applyTheme(next: ThemePreference) {
  const dark = next === 'dark' || (next === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', dark)
}

/* -------------------------------------------------------------------------------------------------
 * ExampleApp
 * -----------------------------------------------------------------------------------------------*/

/** Distance (px) between the viewport bottom and the toasts: clears a sticky `SaveBar`. */
const TOAST_BOTTOM_OFFSET = 72

/** Props of {@link ExampleApp}. */
export interface ExampleAppProps {
  /** Area the page belongs to: marked as current in the rail, the drawer and the top-bar trail. */
  section: ExampleSection
  /**
   * Trail segments after the workspace switcher, outermost first (`Projects`, then a record name).
   * The last one is the current page. Defaults to the section itself.
   */
  crumbs?: ExampleCrumb[]
  /**
   * Called with the target `href` whenever a link of the frame or of the page is followed. The
   * examples have no router: a real app navigates here.
   */
  onNavigate?: (href: string) => void
  /** The page, rendered in the shell's scrolling `<main>` region. */
  children?: React.ReactNode
}

/**
 * The signed-in frame every example page sits in, composed once at the app root:
 *
 * - `LinkProvider` so every ferry-ui link goes through the router adapter;
 * - `AppShell` with a `TopBar` (logo, workspace `ResourceSwitcher`, page trail, `TopBarSearch`,
 *   help button, `ThemeMenu`, `TopBarUserMenu`), an `IconRail` on desktop and a `MobileNav` drawer
 *   on phones, both fed by the same `NavGroup[]`;
 * - one `CommandMenu`, opened by the search trigger and by ⌘K / Ctrl+K (`onCommandShortcut`);
 * - one `Toaster` for the `toast()` calls of the pages, lifted above the sticky `SaveBar` of the
 *   pages that have one (`offset`), so a toast never covers Cancel / Save.
 */
export function ExampleApp({ section, crumbs, onNavigate, children }: ExampleAppProps) {
  const [commandOpen, setCommandOpen] = React.useState(false)
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false)
  const [workspace, setWorkspace] = React.useState('acme')
  // Without a ThemeProvider, useTheme() still reads the `dark` class (see applyTheme above).
  const { resolvedTheme } = useTheme()

  // Story support only: sonner keeps its toasts in a module-level store and replays the active
  // ones to every new Toaster, so a toast fired by one story would show up in the next. A real app
  // mounts a single Toaster for its whole life and needs none of this.
  React.useLayoutEffect(() => {
    toast.dismiss()
    return () => {
      toast.dismiss()
    }
  }, [])

  const groups = buildNavGroups(section)
  const current = DESTINATIONS.find((d) => d.id === section)
  const trail = crumbs ?? (current ? [{ label: current.label, href: current.href }] : [])

  // Navigation first, side-effect actions last: opening the palette and pressing Enter is harmless.
  const commandGroups: CommandMenuGroup[] = [
    { id: 'pages', label: 'Go to', items: DESTINATIONS.map(({ id, label, href, icon }) => ({ id, label, href, icon })) },
    {
      id: 'projects',
      label: 'Projects',
      items: EXAMPLE_PROJECTS.filter((project) => project.status !== 'archived').map((project) => ({
        id: `project-${project.id}`,
        label: project.name,
        href: `/projects/${project.id}`,
        icon: <FolderKanban />,
        hint: project.owner,
        keywords: [project.team],
      })),
    },
    {
      id: 'actions',
      label: 'Actions',
      items: [
        { id: 'new-project', label: 'New project', icon: <Plus />, onSelect: () => toast('New project', { description: 'Open your create dialog here.' }) },
        { id: 'invite-member', label: 'Invite member', icon: <UserPlus />, onSelect: () => toast('Invite member', { description: 'Open your invite dialog here.' }) },
      ],
    },
  ]

  return (
    <NavigateContext.Provider value={onNavigate}>
      <LinkProvider component={ExampleLink}>
        <AppShell
          scrollKey={section}
          // Controlled drawer: TopBar only exposes an "open" callback (`onOpenMobileNav`).
          mobileNavOpen={mobileNavOpen}
          onMobileNavOpenChange={setMobileNavOpen}
          onCommandShortcut={() => setCommandOpen((open) => !open)}
          topBar={
            <TopBar
              onOpenMobileNav={() => setMobileNavOpen(true)}
              logo={
                <TopBarLogo href="/" label="Acme home">
                  <AcmeMark />
                </TopBarLogo>
              }
              actions={
                <>
                  <TopBarSearch onClick={() => setCommandOpen(true)} />
                  <TopBarIconButton icon={<CircleHelp />} label="Help" href="/help" className="max-sm:hidden" />
                  <ThemeMenu value={resolvedTheme} onValueChange={applyTheme} className="max-sm:hidden" />
                  <TopBarUserMenu name="Maya Chen" description="maya@acme.example">
                    <DropdownMenuItem onSelect={() => onNavigate?.('/account')}>
                      <UserRound /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onNavigate?.('/settings')}>
                      <Settings /> Workspace settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onNavigate?.('/docs')}>
                      <BookOpen /> Documentation
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => toast('Signed out')}>
                      <LogOut /> Sign out
                    </DropdownMenuItem>
                  </TopBarUserMenu>
                </>
              }
            >
              <TopBarSeparator />
              <ResourceSwitcher
                items={WORKSPACES}
                value={workspace}
                onValueChange={(id, item) => {
                  setWorkspace(id)
                  toast(`Switched to ${item.label}`)
                }}
                heading="Workspaces"
                searchPlaceholder="Find workspace…"
                label="switch workspace"
                actions={[
                  { id: 'new-workspace', label: 'New workspace', icon: <Plus />, onSelect: () => toast('New workspace') },
                ]}
              />
              {workspace === 'acme' && (
                <Badge font="mono" case="normal" className="max-lg:hidden">
                  Pro
                </Badge>
              )}
              {/* A separator and its segment hide together on phones. */}
              {trail.map((crumb, index) => (
                <span key={crumb.href} className="flex min-w-0 items-center gap-0.5 max-sm:hidden">
                  <TopBarSeparator />
                  <TopBarSegment href={crumb.href} current={index === trail.length - 1}>
                    {crumb.label}
                  </TopBarSegment>
                </span>
              ))}
            </TopBar>
          }
          rail={
            <IconRail
              groups={groups}
              footer={<IconRailItem item={{ id: 'help', label: 'Help center', href: '/help', icon: <LifeBuoy /> }} />}
            />
          }
          mobileNav={
            <MobileNav
              groups={groups}
              logo={<AcmeMark className="size-5" />}
              title="Acme"
              description="Pro plan · 12 members"
              footer={
                <Button className="w-full" icon={<LogOut />} onClick={() => toast('Signed out')}>
                  Sign out
                </Button>
              }
            />
          }
        >
          {children}
        </AppShell>
        <CommandMenu
          open={commandOpen}
          onOpenChange={setCommandOpen}
          groups={commandGroups}
          placeholder="Search pages, projects and actions…"
        />
        {/* Bottom-right, above the sticky SaveBar (about 56px tall) of the pages that have one. */}
        <Toaster offset={{ bottom: TOAST_BOTTOM_OFFSET }} mobileOffset={{ bottom: TOAST_BOTTOM_OFFSET }} />
      </LinkProvider>
    </NavigateContext.Provider>
  )
}

/**
 * Story parameters shared by the examples: no canvas padding, an iframe of app height on docs
 * pages (the shell fills the viewport) and the given text as the docs description.
 */
export function exampleParameters(description: string) {
  return {
    layout: 'fullscreen',
    docs: {
      description: { component: description },
      story: { inline: false, height: '760px' },
    },
  }
}
