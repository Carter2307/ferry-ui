import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { DashboardExample } from './dashboard-example'
import { exampleParameters } from './example-app'

/* ---------------------------------------------------------------------------------------------- */
/* Meta                                                                                            */
/* ---------------------------------------------------------------------------------------------- */

const meta = {
  title: 'Examples/Dashboard',
  component: DashboardExample,
  parameters: exampleParameters(
    [
      'The landing page of a signed-in app, built only from the public `libui` exports.',
      '',
      '- **Frame** — `AppShell` holds a `TopBar` (logo, workspace `ResourceSwitcher`, page trail, `TopBarSearch`, `ThemeMenu`, `TopBarUserMenu`), an `IconRail` on desktop and a `MobileNav` drawer on phones; both navigations are fed by the same `NavGroup[]`. The search trigger and ⌘K / Ctrl+K open one `CommandMenu`. A `LinkProvider` routes every link through the router adapter.',
      '- **Page** — `PageContainer` > `PageHeader` (secondary action, then the single `primary` one) > `PageSection`s.',
      '- **Facts vs numbers** — non-numeric facts (plan, owner, next invoice) are `InfoTile`s; numbers people compare are `MetricCard`s with a `MetricTrend` or a `UsageBar`.',
      '- **Collections** — browsable named things are `ResourceCard`s in a `ResourceGrid` (whole card clickable, ⋮ menu above the link, `StatusBadge` in the footer); the event log people scan row by row is a `Table`.',
      '- **Loading** — every block has its own skeleton (`loading` props, `ResourceCardSkeleton`, `TableSkeletonRows`), so the layout does not jump when data arrives.',
    ].join('\n'),
  ),
  args: {
    loading: false,
    onNavigate: fn(),
    onCreateProject: fn(),
  },
} satisfies Meta<typeof DashboardExample>

export default meta
type Story = StoryObj<typeof meta>

/** The loaded overview. Cards and rail items are links: following one reports its target to `onNavigate`. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const main = within(within(canvasElement).getByRole('main'))
    await expect(main.getByRole('heading', { level: 1, name: 'Overview' })).toBeInTheDocument()
    const projects = main.getByRole('list', { name: 'Projects' })
    await expect(within(projects).getAllByRole('listitem')).toHaveLength(6)
    await userEvent.click(within(projects).getByRole('link', { name: 'Customer portal' }))
    await expect(args.onNavigate).toHaveBeenLastCalledWith('/projects/customer-portal')
    await userEvent.click(main.getByRole('button', { name: 'New project' }))
    await expect(args.onCreateProject).toHaveBeenCalledOnce()
  },
}

/** First load: tiles, metric cards, project cards and table rows are replaced by their skeletons. */
export const Loading: Story = {
  args: { loading: true },
  play: async ({ canvasElement }) => {
    const main = within(within(canvasElement).getByRole('main'))
    await expect(main.getByRole('list', { name: 'Projects' })).toHaveAttribute('aria-busy', 'true')
    await expect(main.queryByRole('link', { name: 'Customer portal' })).not.toBeInTheDocument()
  },
}

/** The search trigger of the top bar opens the `CommandMenu`; choosing a page navigates and closes it. */
export const CommandPalette: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: /^Search/ }))
    const palette = await body.findByRole('dialog', { name: 'Command menu' })
    await userEvent.click(within(palette).getByRole('option', { name: 'Members' }))
    await expect(args.onNavigate).toHaveBeenLastCalledWith('/members')
    // Checked through the attribute: the panel stays mounted until its exit animation ends.
    await waitFor(() => expect(palette).toHaveAttribute('data-state', 'closed'))
  },
}

/** ⌘K / Ctrl+K anywhere toggles the same palette (`AppShell` `onCommandShortcut`). */
export const CommandShortcut: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.keyboard('{Control>}k{/Control}')
    const palette = await body.findByRole('dialog', { name: 'Command menu' })
    await expect(within(palette).getByRole('option', { name: 'New project' })).toBeInTheDocument()
    await userEvent.keyboard('{Control>}k{/Control}')
    await waitFor(() => expect(palette).toHaveAttribute('data-state', 'closed'))
  },
}

/** Phone viewport: the rail is hidden, the top bar's menu button opens the `MobileNav` drawer. */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    // By label, not role: the button is `md:hidden`, so this also passes on a wide canvas.
    await userEvent.click(canvas.getByLabelText('Open navigation'))
    const drawer = await body.findByRole('dialog', { name: 'Acme' })
    await expect(within(drawer).getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page')
    await userEvent.click(within(drawer).getByRole('link', { name: 'Projects' }))
    await expect(args.onNavigate).toHaveBeenLastCalledWith('/projects')
    await waitFor(() => expect(drawer).toHaveAttribute('data-state', 'closed'))
  },
}
