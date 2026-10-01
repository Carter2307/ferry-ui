import * as React from 'react'
import { FolderPlus, MoreHorizontal, Pause, Play, Plus, SearchX, SquareArrowOutUpRight, Trash2 } from 'lucide-react'

import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  ConfirmDialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  FilterMenu,
  ListToolbar,
  PageContainer,
  PageHeader,
  SearchInput,
  StatusBadge,
  StatusDot,
  Table,
  TableBody,
  TableCell,
  TableErrorRow,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeletonRows,
  rowLinkProps,
  toast,
  type FilterOption,
} from '../index'

import {
  EXAMPLE_PROJECTS,
  ExampleApp,
  ExampleLink,
  initialsOf,
  PROJECT_STATUS,
  type ExampleProject,
  type ProjectStatus,
} from './example-app'

const STATUSES: ProjectStatus[] = ['active', 'paused', 'archived']
const COLUMNS = 6

/* ---------------------------------------------------------------------------------------------- */
/* Page                                                                                            */
/* ---------------------------------------------------------------------------------------------- */

/** Props of the List Page example. */
export interface ListPageExampleProps {
  /** The records to list. Search, status filter, pause / resume and delete are applied on top of them. */
  projects?: ExampleProject[]
  /** First load in flight: the table keeps its header and shows skeleton rows; the toolbar is disabled. */
  loading?: boolean
  /**
   * What the first load threw or rejected with. The table keeps its header and shows a
   * `TableErrorRow` with the message; the toolbar is disabled. Ignored while `loading`.
   */
  error?: unknown
  /** Called by the Retry button of the error row (a real app refetches). */
  onRetry?: () => void
  /** Called with the target `href` when a link or a row is opened (a real app navigates). */
  onNavigate?: (href: string) => void
  /** Called by the page's primary action ("New project"). */
  onCreateProject?: () => void
  /** Called with the project once its deletion is confirmed. */
  onDeleteProject?: (project: ExampleProject) => void
}

/**
 * A filterable collection page: `PageHeader` with the primary action, a `ListToolbar` (search +
 * status `FilterMenu`) and a `Table` whose rows open the record, with a row menu and a confirmed
 * delete.
 */
export function ListPageExample({
  projects = EXAMPLE_PROJECTS,
  loading = false,
  error,
  onRetry,
  onNavigate,
  onCreateProject,
  onDeleteProject,
}: ListPageExampleProps) {
  const [query, setQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string[]>([])
  // Local edits layered over `projects` (a real app would mutate on the server and refetch).
  const [statusOverrides, setStatusOverrides] = React.useState<Record<string, ProjectStatus>>({})
  const [deletedIds, setDeletedIds] = React.useState<string[]>([])
  // The target outlives `deleteOpen` so the title stays put while the dialog animates out.
  const [deleteTarget, setDeleteTarget] = React.useState<ExampleProject | null>(null)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const rows = projects
    .filter((project) => !deletedIds.includes(project.id))
    .map((project) => ({ ...project, status: statusOverrides[project.id] ?? project.status }))

  const needle = query.trim().toLowerCase()
  const visible = rows.filter(
    (project) =>
      (statusFilter.length === 0 || statusFilter.includes(project.status)) &&
      (needle === '' || project.name.toLowerCase().includes(needle) || project.owner.toLowerCase().includes(needle)),
  )
  const filtered = needle !== '' || statusFilter.length > 0
  // The first load failed: there is nothing to list, search or filter until a retry succeeds.
  const failed = error !== undefined && !loading
  const unavailable = loading || failed

  const statusOptions: FilterOption[] = STATUSES.map((status) => ({
    value: status,
    label: PROJECT_STATUS[status].label,
    icon: <StatusDot tone={PROJECT_STATUS[status].tone} />,
    count: rows.filter((project) => project.status === status).length,
  }))

  const clearFilters = () => {
    setQuery('')
    setStatusFilter([])
  }

  const open = (project: ExampleProject) => onNavigate?.(`/projects/${project.id}`)

  const togglePaused = (project: ExampleProject) => {
    const next: ProjectStatus = project.status === 'paused' ? 'active' : 'paused'
    setStatusOverrides((overrides) => ({ ...overrides, [project.id]: next }))
    toast.success(next === 'paused' ? `${project.name} paused` : `${project.name} resumed`)
  }

  return (
    <ExampleApp section="projects" onNavigate={onNavigate}>
      <PageContainer>
        <PageHeader
          title="Projects"
          description="Everything the Acme workspace is working on."
          actions={
            <Button variant="primary" icon={<Plus />} onClick={onCreateProject}>
              New project
            </Button>
          }
        />

        {!unavailable && rows.length === 0 ? (
          // Nothing exists yet: explain what goes here and offer the action that creates it.
          <EmptyState
            size="lg"
            icon={<FolderPlus />}
            title="No projects yet"
            description="Projects group the work, members and API keys of one product. Create the first one to get started."
            actions={
              <Button variant="primary" icon={<Plus />} onClick={onCreateProject}>
                New project
              </Button>
            }
          />
        ) : (
          <>
            <ListToolbar
              className="mb-4"
              actions={
                !unavailable && (
                  <span className="text-[13px] text-foreground-lighter tabular" aria-live="polite">
                    {filtered ? `${visible.length} of ${rows.length} projects` : `${rows.length} projects`}
                  </span>
                )
              }
            >
              <SearchInput placeholder="Search projects" value={query} onValueChange={setQuery} disabled={unavailable} />
              <FilterMenu
                label="Status"
                options={statusOptions}
                value={statusFilter}
                onValueChange={setStatusFilter}
                disabled={unavailable}
              />
            </ListToolbar>

            {!unavailable && visible.length === 0 ? (
              // The filters match nothing: say so and offer the way back.
              <EmptyState
                icon={<SearchX />}
                title="No projects match your filters"
                description="Try another name or owner, or clear the status filter."
                actions={<Button onClick={clearFilters}>Clear filters</Button>}
              />
            ) : (
              <Table aria-label="Projects">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead className="text-right">Members</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="w-[1%]">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody aria-busy={loading || undefined}>
                  {loading ? (
                    <TableSkeletonRows columns={COLUMNS} rows={6} />
                  ) : failed ? (
                    // The load failed: keep the header, show the message and offer Retry.
                    <TableErrorRow colSpan={COLUMNS} error={error} onRetry={onRetry} />
                  ) : (
                    visible.map((project) => {
                      const status = PROJECT_STATUS[project.status]
                      return (
                        // The whole row opens the record; the link in the first cell is what
                        // keyboard and screen-reader users (and cmd/ctrl-click) rely on.
                        <TableRow key={project.id} {...rowLinkProps(() => open(project))}>
                          <TableCell>
                            <span className="flex items-center gap-2">
                              <ExampleLink
                                href={`/projects/${project.id}`}
                                className="rounded-sm font-medium text-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                              >
                                {project.name}
                              </ExampleLink>
                              <Badge font="mono" shape="square" case="normal">
                                {project.team}
                              </Badge>
                            </span>
                          </TableCell>
                          <TableCell>
                            <StatusBadge tone={status.tone} label={status.label} />
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-2 text-foreground-light">
                              <Avatar size="sm">
                                <AvatarFallback>{initialsOf(project.owner)}</AvatarFallback>
                              </Avatar>
                              {project.owner}
                            </span>
                          </TableCell>
                          <TableCell className="text-right tabular">{project.members}</TableCell>
                          <TableCell className="text-foreground-lighter">{project.updated}</TableCell>
                          <TableCell>
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
                                <DropdownMenuItem onSelect={() => open(project)}>
                                  <SquareArrowOutUpRight /> Open
                                </DropdownMenuItem>
                                {project.status !== 'archived' && (
                                  <DropdownMenuItem onSelect={() => togglePaused(project)}>
                                    {project.status === 'paused' ? <Play /> : <Pause />}
                                    {project.status === 'paused' ? 'Resume' : 'Pause'}
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                {/* Opens the controlled ConfirmDialog rendered once, below the table. */}
                                <DropdownMenuItem
                                  variant="destructive"
                                  onSelect={() => {
                                    setDeleteTarget(project)
                                    setDeleteOpen(true)
                                  }}
                                >
                                  <Trash2 /> Delete…
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            )}
          </>
        )}
      </PageContainer>

      {/* One controlled dialog for every row, opened from the row menu. It closes itself on success. */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete project “${deleteTarget?.name ?? ''}”?`}
        description="Its tasks, files and API keys are permanently deleted. This cannot be undone."
        confirmLabel="Delete project"
        onConfirm={() => {
          if (!deleteTarget) return
          setDeletedIds((ids) => [...ids, deleteTarget.id])
          onDeleteProject?.(deleteTarget)
          toast.success(`${deleteTarget.name} deleted`)
        }}
      />
    </ExampleApp>
  )
}
