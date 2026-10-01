import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import {
  BookOpen,
  Copy,
  ExternalLink,
  FolderKanban,
  Globe,
  LayoutDashboard,
  MoreVertical,
  Smartphone,
  Trash2,
  Users,
  Wrench,
} from 'lucide-react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

import type { LinkComponent } from '../../lib/link'
import { Badge } from '../primitives/badge'
import { Button } from '../primitives/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../primitives/dropdown-menu'

import { ResourceCard, ResourceCardSkeleton, ResourceGrid, resourceGridClassName } from './resource-card'
import { StatusLine, type StatusTone } from './status'

/* Module-level spies so play functions can assert on menu actions and router navigation. */
const onMenuAction = fn().mockName('onMenuAction')
const navigate = fn().mockName('navigate')

/** Minimal router adapter: prevents the full page load and reports the target instead. */
const RouterLink: LinkComponent = ({ href, onClick, ...props }) => (
  <a
    href={href}
    data-router-link=""
    {...props}
    onClick={(event) => {
      onClick?.(event)
      event.preventDefault()
      navigate(href)
    }}
  />
)

function ProjectMenu({ name }: { name: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-tiny"
          icon={<MoreVertical />}
          aria-label={`Actions for ${name}`}
          className="text-foreground-lighter"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onSelect={() => onMenuAction('open', name)}>
          <ExternalLink /> Open project
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onMenuAction('copy-id', name)}>
          <Copy /> Copy project ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => onMenuAction('delete', name)}>
          <Trash2 /> Delete project…
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Typical footer: a metadata line, then a status row with a timestamp on the right. */
function ProjectFooter({
  members,
  tone,
  status,
  spin,
  updated,
}: {
  members: number
  tone: StatusTone
  status: string
  spin?: boolean
  updated: string
}) {
  return (
    <>
      <span className="inline-flex min-w-0 items-center gap-1.5 truncate text-[13px] text-foreground-lighter">
        <Users className="size-3.5 shrink-0" aria-hidden="true" />
        <span className="text-foreground-light tabular">{members}</span> members
      </span>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <StatusLine tone={tone} spin={spin}>
          {status}
        </StatusLine>
        <span className="text-[12.5px] text-foreground-lighter">Updated {updated}</span>
      </div>
    </>
  )
}

const meta = {
  title: 'Patterns/Resource Card',
  component: ResourceCard,
  subcomponents: { ResourceGrid, ResourceCardSkeleton },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Clickable entity card for browsable collections (projects, workspaces, integrations): icon + name + ⋮ `menu`, `subtitle`, mono `badges`, and a `footer` pinned to the bottom (typically a metadata line and a `StatusLine`). The whole card opens `href` through a stretched link rendered by your router adapter (`linkComponent` prop or `LinkProvider`). Lay cards out in a `ResourceGrid` and show `ResourceCardSkeleton`s while loading; use a `Table` instead for dense, comparable rows.',
      },
    },
  },
  args: {
    name: 'acme-web',
    href: '#projects/acme-web',
    icon: <LayoutDashboard />,
    subtitle: <span className="truncate">Growth team · Customer-facing web app</span>,
    badges: (
      <>
        <Badge font="mono" shape="square">
          pro
        </Badge>
        <Badge font="mono" shape="square" variant="outline" case="normal">
          v2.4
        </Badge>
      </>
    ),
    footer: <ProjectFooter members={12} tone="success" status="Project is active" updated="2h ago" />,
  },
  argTypes: {
    name: { control: 'text' },
    href: { control: 'text' },
    as: { control: 'inline-radio', options: ['li', 'div'] },
    titleAs: { control: 'select', options: ['h2', 'h3', 'h4', 'h5', 'h6', 'div'] },
    icon: { control: false },
    menu: { control: false },
    subtitle: { control: false },
    badges: { control: false },
    footer: { control: false },
    linkComponent: { control: false },
    // A ref is not serializable: no control.
    ref: { control: false },
  },
  render: (args) => (
    <ResourceGrid aria-label="Projects" className="max-w-sm">
      <ResourceCard {...args} />
    </ResourceGrid>
  ),
} satisfies Meta<typeof ResourceCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Just a name, an icon and a link: the card keeps its 188px minimum height so grids stay aligned. */
export const Minimal: Story = {
  args: { subtitle: undefined, badges: undefined, footer: undefined, name: 'docs-portal', icon: <BookOpen /> },
}

/** The ⋮ `menu` sits above the stretched link: opening it never opens the card. */
export const WithMenu: Story = {
  args: { menu: <ProjectMenu name="acme-web" /> },
  play: async ({ canvasElement }) => {
    onMenuAction.mockClear()
    const canvas = within(canvasElement)
    canvas.getByRole('button', { name: 'Actions for acme-web' }).focus()
    await userEvent.keyboard('{Enter}')
    const menu = await screen.findByRole('menu')
    await waitFor(() => expect(within(menu).getByRole('menuitem', { name: /Open project/ })).toHaveFocus())
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{Enter}')
    await expect(onMenuAction).toHaveBeenCalledWith('copy-id', 'acme-web')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

/**
 * Keyboard: the stretched link is the first tab stop (focus rings the whole card), the ⋮ menu
 * trigger the second.
 */
export const KeyboardNavigation: Story = {
  args: { menu: <ProjectMenu name="acme-web" /> },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const link = canvas.getByRole('link', { name: 'acme-web' })
    link.focus()
    await expect(link).toHaveFocus()
    await userEvent.tab()
    await expect(canvas.getByRole('button', { name: 'Actions for acme-web' })).toHaveFocus()
    await userEvent.tab({ shift: true })
    await expect(link).toHaveFocus()
  },
}

/** `titleAs` sets the element around the name: `h2` here, for a grid placed right under the page title. */
export const HeadingLevel: Story = {
  args: { titleAs: 'h2' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('heading', { level: 2, name: 'acme-web' })).toBeInTheDocument()
  },
}

/** Without `href` the card is static: no link, no hover lift. */
export const Static: Story = {
  args: { href: undefined, name: 'Archived workspace', icon: <FolderKanban /> },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('link')).toBeNull()
    await expect(canvas.getByRole('heading', { name: 'Archived workspace' })).toBeInTheDocument()
  },
}

/** Long names and subtitles truncate on one line; badges wrap. */
export const LongContent: Story = {
  args: {
    name: 'customer-success-analytics-and-reporting-dashboard',
    subtitle: (
      <span className="truncate font-mono text-[12.5px]" title="acme/customer-success-analytics-and-reporting-dashboard">
        acme/customer-success-analytics-and-reporting-dashboard
      </span>
    ),
    badges: (
      <>
        <Badge font="mono" shape="square">
          enterprise
        </Badge>
        <Badge font="mono" shape="square" variant="outline" case="normal">
          v12.0.3-beta
        </Badge>
        <Badge font="mono" shape="square" variant="outline">
          annual
        </Badge>
        <Badge font="mono" shape="square" variant="outline" case="normal">
          +4 domains
        </Badge>
        <Badge font="mono" shape="square" variant="outline" case="normal">
          sso
        </Badge>
      </>
    ),
    footer: (
      <ProjectFooter
        members={148}
        tone="warning"
        status="Seat limit almost reached for this workspace plan"
        updated="3 weeks ago"
      />
    ),
    menu: <ProjectMenu name="customer-success-analytics-and-reporting-dashboard" />,
  },
}

/** Pass a router adapter through `linkComponent` (or once for the whole app with `LinkProvider`). */
export const CustomLinkComponent: Story = {
  args: { href: '/projects/acme-web', linkComponent: RouterLink, menu: <ProjectMenu name="acme-web" /> },
  play: async ({ canvasElement }) => {
    navigate.mockClear()
    const canvas = within(canvasElement)
    const link = canvas.getByRole('link', { name: 'acme-web' })
    await expect(link).toHaveAttribute('data-router-link')
    await userEvent.click(link)
    await expect(navigate).toHaveBeenCalledWith('/projects/acme-web')
  },
}

/** Standalone card outside a grid: render it as a `div`. */
export const Standalone: Story = {
  args: { as: 'div', className: 'max-w-sm' },
  render: (args) => <ResourceCard {...args} />,
}

/** Loading state: skeletons in an `aria-busy` grid. */
export const Loading: Story = {
  render: () => (
    <ResourceGrid aria-label="Loading projects" aria-busy="true">
      <ResourceCardSkeleton />
      <ResourceCardSkeleton />
      <ResourceCardSkeleton />
    </ResourceGrid>
  ),
  play: async ({ canvasElement }) => {
    const grid = within(canvasElement).getByRole('list', { name: 'Loading projects' })
    await expect(grid).toHaveAttribute('aria-busy', 'true')
    await expect(grid.querySelectorAll('[data-slot="resource-card-skeleton"]')).toHaveLength(3)
  },
}

const PROJECTS: {
  name: string
  icon: ReactNode
  team: string
  description: string
  plan: string
  version: string
  members: number
  tone: StatusTone
  status: string
  spin?: boolean
  updated: string
  site?: string
}[] = [
  {
    name: 'acme-web',
    icon: <LayoutDashboard />,
    team: 'Growth',
    description: 'Customer-facing web app',
    plan: 'pro',
    version: 'v2.4',
    members: 12,
    tone: 'success',
    status: 'Project is active',
    updated: '2h ago',
    site: 'app.acme.example',
  },
  {
    name: 'mobile-app',
    icon: <Smartphone />,
    team: 'Mobile',
    description: 'iOS and Android clients',
    plan: 'pro',
    version: 'v5.1',
    members: 8,
    tone: 'info',
    status: 'Importing data…',
    spin: true,
    updated: '5 min ago',
  },
  {
    name: 'marketing-site',
    icon: <Globe />,
    team: 'Marketing',
    description: 'Public website and blog',
    plan: 'free',
    version: 'v1.9',
    members: 4,
    tone: 'warning',
    status: 'Trial ends in 3 days',
    updated: 'yesterday',
    site: 'www.acme.example',
  },
  {
    name: 'internal-tools',
    icon: <Wrench />,
    team: 'Platform',
    description: 'Admin console and back-office scripts',
    plan: 'enterprise',
    version: 'v0.8',
    members: 23,
    tone: 'destructive',
    status: 'Payment failed',
    updated: '3 days ago',
  },
  {
    name: 'docs-portal',
    icon: <BookOpen />,
    team: 'Developer relations',
    description: 'API reference and guides',
    plan: 'free',
    version: 'v3.0',
    members: 2,
    tone: 'neutral',
    status: 'Project is paused',
    updated: 'last month',
  },
]

/** Realistic use: a projects list with menus, status footers and an external link above the stretched link. */
export const ProjectsGrid: Story = {
  render: () => (
    <ResourceGrid aria-label="Projects">
      {PROJECTS.map((project) => (
        <ResourceCard
          key={project.name}
          href={`#projects/${project.name}`}
          name={project.name}
          icon={project.icon}
          menu={<ProjectMenu name={project.name} />}
          subtitle={
            <span className="truncate">
              {project.team} · {project.description}
            </span>
          }
          badges={
            <>
              <Badge font="mono" shape="square">
                {project.plan}
              </Badge>
              <Badge font="mono" shape="square" variant="outline" case="normal">
                {project.version}
              </Badge>
            </>
          }
          footer={
            <>
              {project.site ? (
                <a
                  href={`https://${project.site}`}
                  target="_blank"
                  rel="noreferrer"
                  className="relative z-10 inline-flex max-w-full min-w-0 items-center gap-1.5 rounded-sm text-[13px] text-foreground-light outline-none hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="truncate">{project.site}</span>
                  <ExternalLink className="size-3 shrink-0 opacity-70" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : (
                <span className="inline-flex min-w-0 items-center gap-1.5 truncate text-[13px] text-foreground-lighter">
                  <Users className="size-3.5 shrink-0" aria-hidden="true" />
                  <span className="text-foreground-light tabular">{project.members}</span> members
                </span>
              )}
              <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <StatusLine tone={project.tone} spin={project.spin}>
                  {project.status}
                </StatusLine>
                <span className="text-[12.5px] text-foreground-lighter">Updated {project.updated}</span>
              </div>
            </>
          }
        />
      ))}
    </ResourceGrid>
  ),
  play: async ({ canvasElement }) => {
    const grid = within(canvasElement).getByRole('list', { name: 'Projects' })
    await expect(within(grid).getAllByRole('listitem')).toHaveLength(PROJECTS.length)
    await expect(within(grid).getByRole('link', { name: 'marketing-site' })).toHaveAttribute(
      'href',
      '#projects/marketing-site',
    )
  },
}

/** `minItemWidth` changes the column breakpoint (here 200px instead of 248px) for denser lists. */
export const DenseGrid: Story = {
  render: () => (
    <ResourceGrid aria-label="Integrations" minItemWidth={200}>
      {['Slack', 'GitHub', 'Stripe', 'Linear', 'Zendesk', 'HubSpot'].map((name, i) => (
        <ResourceCard
          key={name}
          href={`#integrations/${name.toLowerCase()}`}
          name={name}
          icon={<Globe />}
          subtitle={<span className="truncate">{i % 2 ? 'Notifications' : 'Data sync'}</span>}
          footer={
            <StatusLine tone={i === 4 ? 'neutral' : 'success'}>{i === 4 ? 'Not connected' : 'Connected'}</StatusLine>
          }
        />
      ))}
    </ResourceGrid>
  ),
}

/**
 * `resourceGridClassName` puts the same responsive grid on an element you render yourself (here a
 * plain `ul` mixing loaded cards with a skeleton for the next page).
 */
export const GridClassName: Story = {
  render: () => (
    <ul className={resourceGridClassName} aria-label="Team spaces">
      <ResourceCard href="#spaces/design" name="Design" icon={<FolderKanban />} subtitle="14 members" />
      <ResourceCard href="#spaces/sales" name="Sales" icon={<FolderKanban />} subtitle="31 members" />
      <ResourceCardSkeleton />
    </ul>
  ),
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', { name: 'Team spaces' })
    await expect(within(list).getAllByRole('link')).toHaveLength(2)
  },
}
