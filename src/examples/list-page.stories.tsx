import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

import { EXAMPLE_PROJECTS, exampleParameters } from './example-app'
import { ListPageExample } from './list-page-example'

/* ---------------------------------------------------------------------------------------------- */
/* Meta                                                                                            */
/* ---------------------------------------------------------------------------------------------- */

const meta = {
  title: 'Examples/List Page',
  component: ListPageExample,
  parameters: exampleParameters(
    [
      'A filterable collection page (here: the projects of a workspace), built only from the public `libui` exports.',
      '',
      '- **Header** — `PageHeader` carries the title and the single `primary` action of the page ("New project").',
      '- **Toolbar** — `ListToolbar` sits right above the table: a controlled `SearchInput` first, then a `FilterMenu` (multi-select, with `StatusDot` icons and counts); the result count goes in `actions`.',
      '- **Table** — `Table` with a `StatusBadge` per row (tone from one `PROJECT_STATUS` map), mono `Badge` tags, `Avatar` owners and right-aligned `tabular` numbers.',
      '- **Rows** — `rowLinkProps()` makes the whole row open the record while the link in the first cell stays the accessible target; clicks on the ⋮ `DropdownMenu` never open the row.',
      '- **Row actions** — instant ones (pause / resume) answer with a `toast`; delete opens one controlled `ConfirmDialog` shared by every row.',
      '- **States** — `TableSkeletonRows` under the real header while loading, an `EmptyState` with "Clear filters" when the filters match nothing, a first-run `EmptyState` with the create action when there is no record at all, and a `TableErrorRow` (message + Retry, toolbar disabled) when the first load failed.',
    ].join('\n'),
  ),
  args: {
    projects: EXAMPLE_PROJECTS,
    loading: false,
    onRetry: fn(),
    onNavigate: fn(),
    onCreateProject: fn(),
    onDeleteProject: fn(),
  },
  argTypes: {
    projects: { control: false },
    error: { control: false },
  },
} satisfies Meta<typeof ListPageExample>

export default meta
type Story = StoryObj<typeof meta>

/** The loaded list: eight projects, searchable by name or owner and filterable by status. */
export const Default: Story = {}

/** Typing in the search filters the rows; a query without match swaps the table for an `EmptyState`, and "Clear filters" brings the rows back. */
export const SearchFiltering: Story = {
  play: async ({ canvasElement }) => {
    const main = within(within(canvasElement).getByRole('main'))
    const search = main.getByRole('searchbox', { name: 'Search projects' })
    await userEvent.type(search, 'portal')
    await expect(main.getByRole('link', { name: 'Customer portal' })).toBeInTheDocument()
    await expect(main.queryByRole('link', { name: 'Marketing site' })).not.toBeInTheDocument()
    await expect(main.getByText('1 of 8 projects')).toBeInTheDocument()

    await userEvent.clear(search)
    await userEvent.type(search, 'zzz')
    await expect(main.getByText('No projects match your filters')).toBeInTheDocument()
    await expect(main.queryByRole('table')).not.toBeInTheDocument()

    await userEvent.click(main.getByRole('button', { name: 'Clear filters' }))
    await expect(search).toHaveValue('')
    await expect(main.getAllByRole('row')).toHaveLength(9)
  },
}

/** Picking "Paused" in the status `FilterMenu` (keyboard) keeps only the paused projects and updates the trigger. */
export const StatusFiltering: Story = {
  play: async ({ canvasElement }) => {
    const main = within(within(canvasElement).getByRole('main'))
    const body = within(canvasElement.ownerDocument.body)
    const trigger = main.getByRole('button', { name: 'Filter by status' })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    const menu = await body.findByRole('menu')
    const paused = within(menu).getByRole('menuitemcheckbox', { name: /Paused/ })
    await waitFor(() => expect(within(menu).getByRole('menuitemcheckbox', { name: /Active/ })).toHaveFocus())
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(paused).toHaveFocus())
    await userEvent.keyboard('{Enter}')
    await expect(paused).toHaveAttribute('aria-checked', 'true')
    await userEvent.keyboard('{Escape}')
    // Checked through attributes: the page stays aria-hidden until the menu's exit animation ends.
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
    await expect(trigger).toHaveAttribute('aria-label', 'Status filter: Paused')
    await expect(main.getByText('Billing dashboard')).toBeInTheDocument()
    await expect(main.getByText('Pricing experiment')).toBeInTheDocument()
    await expect(main.queryByText('Customer portal')).not.toBeInTheDocument()
  },
}

/** A click anywhere on a row opens the record (`rowLinkProps`); a click on its ⋮ button opens the menu instead. */
export const RowNavigation: Story = {
  play: async ({ args, canvasElement }) => {
    const main = within(within(canvasElement).getByRole('main'))
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(main.getByText('5 hours ago'))
    await expect(args.onNavigate).toHaveBeenCalledOnce()
    await expect(args.onNavigate).toHaveBeenLastCalledWith('/projects/marketing-site')

    await userEvent.click(main.getByRole('button', { name: 'Actions for Marketing site' }))
    const menu = await body.findByRole('menu')
    await expect(within(menu).getByRole('menuitem', { name: /Delete/ })).toBeInTheDocument()
    await expect(args.onNavigate).toHaveBeenCalledOnce()
    await userEvent.keyboard('{Escape}')
    // Checked through the attribute: the menu stays mounted until its exit animation ends.
    await waitFor(() => expect(menu).toHaveAttribute('data-state', 'closed'))
  },
}

/** "Delete…" in a row menu opens the shared `ConfirmDialog`; confirming removes the row and shows a toast. */
export const DeleteFromRowMenu: Story = {
  play: async ({ args, canvasElement }) => {
    const main = within(within(canvasElement).getByRole('main'))
    const body = within(canvasElement.ownerDocument.body)
    const trigger = main.getByRole('button', { name: 'Actions for Legacy intranet' })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    const menu = await body.findByRole('menu')
    const item = within(menu).getByRole('menuitem', { name: /Delete/ })
    item.focus()
    await userEvent.keyboard('{Enter}')
    const dialog = await body.findByRole('alertdialog', { name: 'Delete project “Legacy intranet”?' })
    await userEvent.click(within(dialog).getByRole('button', { name: 'Delete project' }))
    await expect(args.onDeleteProject).toHaveBeenCalledOnce()
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'closed'))
    await expect(await screen.findByText('Legacy intranet deleted')).toBeInTheDocument()
    // By text, not role: the page stays aria-hidden until the dialog's exit animation ends.
    await waitFor(() => expect(within(canvasElement).queryByText('Legacy intranet')).not.toBeInTheDocument())
  },
}

/** First load: the real header stays, `TableSkeletonRows` stand in for the rows and the toolbar is disabled. */
export const Loading: Story = {
  args: { loading: true },
  play: async ({ canvasElement }) => {
    const main = within(within(canvasElement).getByRole('main'))
    await expect(main.getByRole('searchbox', { name: 'Search projects' })).toBeDisabled()
    await expect(main.getByRole('table', { name: 'Projects' })).toBeInTheDocument()
    await expect(main.queryByRole('link', { name: 'Customer portal' })).not.toBeInTheDocument()
  },
}

/** No record at all: a first-run `EmptyState` replaces the toolbar and the table, with the create action. */
export const Empty: Story = {
  args: { projects: [] },
  play: async ({ args, canvasElement }) => {
    const main = within(within(canvasElement).getByRole('main'))
    await expect(main.getByText('No projects yet')).toBeInTheDocument()
    await expect(main.queryByRole('searchbox')).not.toBeInTheDocument()
    await userEvent.click(main.getAllByRole('button', { name: 'New project' })[1]!)
    await expect(args.onCreateProject).toHaveBeenCalledOnce()
  },
}

/**
 * The first load failed: the real header stays, a `TableErrorRow` shows the error's message
 * (announced as an alert) with a Retry button, and the toolbar is disabled until a retry succeeds.
 */
export const LoadError: Story = {
  args: { projects: [], error: new Error('The request timed out.') },
  play: async ({ args, canvasElement }) => {
    const main = within(within(canvasElement).getByRole('main'))
    await expect(main.getByRole('table', { name: 'Projects' })).toBeInTheDocument()
    await expect(main.getByRole('alert')).toHaveTextContent('The request timed out.')
    await expect(main.getByRole('searchbox', { name: 'Search projects' })).toBeDisabled()
    await expect(main.queryByText('No projects yet')).not.toBeInTheDocument()
    await userEvent.click(main.getByRole('button', { name: 'Retry' }))
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}
