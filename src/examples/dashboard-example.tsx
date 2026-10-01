import { CalendarDays, Crown, FolderKanban, MoreHorizontal, Plus, Receipt, UserPlus, UserRound } from 'lucide-react'

import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  InfoTile,
  MetricCard,
  MetricTrend,
  PageContainer,
  PageHeader,
  PageSection,
  ResourceCard,
  ResourceCardSkeleton,
  ResourceGrid,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeletonRows,
  UsageBar,
  toast,
} from '../index'

import { EXAMPLE_PROJECTS, ExampleApp, ExampleLink, initialsOf, PROJECT_STATUS } from './example-app'

// The page of the "Examples/Dashboard" stories. It lives in its own module (not in the story file)
// so Storybook's docgen reads its props: story files are skipped by react-docgen-typescript.

/* ---------------------------------------------------------------------------------------------- */
/* Example data                                                                                    */
/* ---------------------------------------------------------------------------------------------- */

const ACTIVITY = [
  { id: 'a1', member: 'Maya Chen', event: 'Created the API key “Production server”', area: 'API keys', when: '12 min ago' },
  { id: 'a2', member: 'Liam Ortiz', event: 'Invited sofia@acme.example as Editor', area: 'Members', when: '1 hour ago' },
  { id: 'a3', member: 'Sofia Rossi', event: 'Paused the project “Billing dashboard”', area: 'Projects', when: '3 hours ago' },
  { id: 'a4', member: 'Noah Kim', event: 'Paid invoice INV-2041 ($480.00)', area: 'Billing', when: 'Yesterday' },
  { id: 'a5', member: 'Ada Park', event: 'Renamed the workspace to “Acme”', area: 'Settings', when: '2 days ago' },
]

/** The six most recently updated projects that are still in use. */
const FEATURED_PROJECTS = EXAMPLE_PROJECTS.filter((project) => project.status !== 'archived').slice(0, 6)

/* ---------------------------------------------------------------------------------------------- */
/* Page                                                                                            */
/* ---------------------------------------------------------------------------------------------- */

/** Props of {@link DashboardExample}. */
export interface DashboardExampleProps {
  /** First load in flight: tiles, metrics, cards and table rows show their skeletons. */
  loading?: boolean
  /** Called with the target `href` when a link of the app is followed (a real app navigates). */
  onNavigate?: (href: string) => void
  /** Called by the page's primary action ("New project"). */
  onCreateProject?: () => void
}

/**
 * Workspace overview: the landing page of the signed-in app. Facts about the workspace as
 * `InfoTile`s, comparable numbers as `MetricCard`s, the projects as a `ResourceGrid` of
 * `ResourceCard`s and the latest events as a `Table`.
 */
export function DashboardExample({ loading = false, onNavigate, onCreateProject }: DashboardExampleProps) {
  return (
    <ExampleApp section="overview" onNavigate={onNavigate}>
      <PageContainer>
        <PageHeader
          title="Overview"
          description="What is happening in the Acme workspace."
          actions={
            <>
              <Button icon={<UserPlus />} onClick={() => toast('Invite member', { description: 'Open your invite dialog here.' })}>
                Invite member
              </Button>
              <Button variant="primary" icon={<Plus />} onClick={onCreateProject}>
                New project
              </Button>
            </>
          }
        />

        {/* Non-numeric facts: InfoTile (no border of its own), in a plain responsive grid. */}
        <div className="mb-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          <InfoTile icon={<Crown />} label="Plan" value="Pro" hint="Renews on Nov 1, 2026" loading={loading} />
          <InfoTile icon={<UserRound />} label="Owner" value="Maya Chen" hint="maya@acme.example" loading={loading} />
          <InfoTile icon={<Receipt />} label="Next invoice" value="$480.00" hint="Due on Nov 1, 2026" loading={loading} />
          <InfoTile icon={<CalendarDays />} label="Created" value="Jan 14, 2025" hint="1 year, 8 months ago" loading={loading} />
        </div>

        {/* Numbers people compare: MetricCard, four across on desktop. */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Active projects"
            value="6"
            trend={<MetricTrend direction="up">+2</MetricTrend>}
            hint="Since last month"
            loading={loading}
          />
          <MetricCard label="Seats" value="12" unit="of 20" info="Members and pending invitations both use a seat." loading={loading}>
            <UsageBar value={loading ? null : 60} label="Seats used" />
          </MetricCard>
          <MetricCard
            label="API requests"
            value="1.28M"
            trend={<MetricTrend direction="up">+12.5%</MetricTrend>}
            hint="Last 30 days"
            loading={loading}
          />
          <MetricCard
            label="Error rate"
            value="0.42%"
            trend={
              <MetricTrend direction="down" sentiment="positive">
                -0.1 pts
              </MetricTrend>
            }
            hint="Last 30 days"
            loading={loading}
          />
        </div>

        <PageSection
          title="Projects"
          description="Recently updated projects of the workspace."
          actions={
            <Button asChild variant="ghost">
              <ExampleLink href="/projects">View all</ExampleLink>
            </Button>
          }
        >
          {/* 300px columns: three across on desktop, so the six cards fill two rows. */}
          <ResourceGrid aria-label="Projects" aria-busy={loading || undefined} minItemWidth={300}>
            {loading
              ? Array.from({ length: 6 }, (_, index) => <ResourceCardSkeleton key={index} />)
              : FEATURED_PROJECTS.map((project) => {
                  const status = PROJECT_STATUS[project.status]
                  return (
                    <ResourceCard
                      key={project.id}
                      name={project.name}
                      href={`/projects/${project.id}`}
                      icon={<FolderKanban />}
                      subtitle={`Owned by ${project.owner}`}
                      badges={
                        <>
                          <Badge font="mono" shape="square" case="normal">
                            {project.team}
                          </Badge>
                          <Badge font="mono" shape="square" case="normal">
                            {project.members} members
                          </Badge>
                        </>
                      }
                      menu={
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-tiny"
                              icon={<MoreHorizontal />}
                              aria-label={`Actions for ${project.name}`}
                            />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => onNavigate?.(`/projects/${project.id}`)}>Open</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => onNavigate?.(`/projects/${project.id}/settings`)}>
                              Settings
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      }
                      footer={
                        <div className="flex items-center justify-between gap-3">
                          <StatusBadge tone={status.tone} label={status.label} />
                          <span className="truncate text-[12px] text-foreground-lighter">Updated {project.updated}</span>
                        </div>
                      }
                    />
                  )
                })}
          </ResourceGrid>
        </PageSection>

        <PageSection title="Recent activity" description="The last changes made by members of the workspace.">
          <Table aria-label="Recent activity">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Member</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Area</TableHead>
                <TableHead className="text-right">When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody aria-busy={loading || undefined}>
              {loading ? (
                <TableSkeletonRows columns={4} rows={5} />
              ) : (
                ACTIVITY.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <span className="flex items-center gap-2.5">
                        <Avatar size="sm">
                          <AvatarFallback>{initialsOf(entry.member)}</AvatarFallback>
                        </Avatar>
                        {entry.member}
                      </span>
                    </TableCell>
                    <TableCell className="w-full max-w-0">
                      <span className="block truncate text-foreground-light" title={entry.event}>
                        {entry.event}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry.area}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-foreground-lighter tabular">{entry.when}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </PageSection>
      </PageContainer>
    </ExampleApp>
  )
}
