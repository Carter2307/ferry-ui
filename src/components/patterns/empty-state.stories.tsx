import type { Meta, StoryObj } from '@storybook/react-vite'
import { FileQuestion, FolderOpen, History, Loader2, Plus, RefreshCw, Search, TriangleAlert, X } from 'lucide-react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Button } from '../primitives/button'
import { Card, CardContent, CardHeader, CardTitle } from '../primitives/card'

import { EmptyState, ErrorState, type EmptyStateProps, type ErrorStateProps } from './empty-state'

/**
 * EmptyState props, plus the ErrorState-only props (so the ErrorState stories have working controls)
 * and a story-only callback. `toEmptyStateProps` strips the extras before they reach `EmptyState`.
 */
type EmptyStateStoryArgs = EmptyStateProps &
  Pick<ErrorStateProps, 'error' | 'onRetry' | 'retrying' | 'retryLabel'> & {
    /** Story-only: wired to the action buttons of the interactive stories. */
    onAction?: () => void
  }

function toEmptyStateProps({
  onAction: _onAction,
  error: _error,
  onRetry: _onRetry,
  retrying: _retrying,
  retryLabel: _retryLabel,
  ...props
}: EmptyStateStoryArgs): EmptyStateProps {
  return props
}

const hidden = { table: { disable: true } } as const

const meta = {
  title: 'Patterns/Empty State',
  component: EmptyState,
  subcomponents: { ErrorState },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '`EmptyState` fills an area with nothing to show: icon, one-line title, what goes here, and the button that fills it. Use `dashed` (default) for empty lists, `bordered` for full-page dead ends (not found, crashed), `plain` inside an existing card. When loading failed, show `ErrorState` instead (red box with the error message and Retry); when stale data is still on screen, keep it and use `StaleDataCallout`.',
      },
    },
  },
  args: {
    icon: <FolderOpen />,
    title: 'No projects yet',
    description: 'Projects group your files, members and invoices. Create one to get started.',
    actions: (
      <Button variant="primary" icon={<Plus />}>
        New project
      </Button>
    ),
    variant: 'dashed',
    size: 'md',
    onAction: fn(),
    onRetry: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['dashed', 'bordered', 'plain'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    title: { control: 'text' },
    description: { control: 'text' },
    icon: { control: false },
    actions: { control: false },
    children: { control: false },
    onAction: { control: false },
    // ErrorState-only: shown in the ErrorState stories below.
    error: hidden,
    onRetry: hidden,
    retrying: hidden,
    retryLabel: hidden,
  },
  render: (args) => <EmptyState {...toEmptyStateProps(args)} />,
} satisfies Meta<EmptyStateStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** The three frames: `dashed` for empty lists, `bordered` for standalone pages, `plain` inside a card. */
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      {(['dashed', 'bordered', 'plain'] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <p className="mono-label">{variant}</p>
          <EmptyState {...toEmptyStateProps(args)} variant={variant} />
        </div>
      ))}
    </div>
  ),
}

/** Vertical padding: `sm` in cards and side panels, `md` in page sections, `lg` for a whole page or first run. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <p className="mono-label">{size}</p>
          <EmptyState {...toEmptyStateProps(args)} size={size} />
        </div>
      ))}
    </div>
  ),
}

/** Only a title: the smallest useful empty state. */
export const TitleOnly: Story = {
  args: { icon: undefined, description: undefined, actions: undefined, title: 'No comments yet', size: 'sm' },
}

/** `children` render under the actions, e.g. the command-line equivalent of the button. */
export const WithSnippet: Story = {
  args: {
    size: 'lg',
    children: (
      <div className="mt-3 flex w-full max-w-md flex-col gap-1.5 text-left">
        <p className="text-xs text-foreground-lighter">Or from the command line:</p>
        <pre className="overflow-x-auto rounded-md border bg-code px-3 py-2 font-mono text-[12.5px] text-foreground">
          npx acme projects create marketing-site
        </pre>
      </div>
    ),
  },
}

/** Filtered list with no match: say what was searched and offer a way out. */
export const NoResults: Story = {
  args: {
    icon: <Search />,
    title: 'No invoices match your filters',
    description: 'Nothing matches “northwind” in overdue invoices.',
  },
  render: (args) => (
    <EmptyState
      {...toEmptyStateProps(args)}
      actions={
        <Button icon={<X />} onClick={args.onAction}>
          Clear filters
        </Button>
      }
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('No invoices match your filters')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Clear filters' }))
    await expect(args.onAction).toHaveBeenCalledOnce()
  },
}

/** A spinning icon for "nothing yet, but it is coming". */
export const InProgress: Story = {
  args: {
    icon: <Loader2 className="animate-spin" />,
    title: 'Preparing your export',
    description: 'Large workspaces can take a few minutes. You can leave this page; we email you when it is ready.',
    actions: undefined,
  },
}

/** Long title and description wrap within a 448px column. */
export const LongContent: Story = {
  args: {
    title:
      'No activity was recorded for this workspace during the selected period, including sign-ins, exports and permission changes',
    description:
      'Activity is kept for 90 days on the Free plan and for 13 months on paid plans. Widen the date range, clear the member filter, or upgrade to keep a longer history of everything that happens in your workspace.',
  },
}

/** Plain variant inside a card: the card already frames the area. */
export const InsideCard: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState
          variant="plain"
          size="sm"
          icon={<History />}
          title="Nothing happened yet"
          description="Edits, comments and invitations appear here."
        />
      </CardContent>
    </Card>
  ),
}

/** Full-page dead end: `bordered` + `lg`, with a way back. */
export const PageNotFound: Story = {
  args: {
    variant: 'bordered',
    size: 'lg',
    icon: <FileQuestion />,
    title: 'Page not found',
    description: 'The page you are looking for was moved, deleted, or never existed.',
    actions: (
      <>
        <Button>Go back</Button>
        <Button asChild variant="primary">
          <a href="#dashboard">Go to dashboard</a>
        </Button>
      </>
    ),
  },
}

/** Rendering crash (error boundary fallback): tinted icon and the technical message in a code chip. */
export const PageCrashed: Story = {
  args: {
    variant: 'bordered',
    size: 'lg',
    icon: <TriangleAlert className="text-destructive" />,
    title: 'This page crashed',
    description: (
      <span className="flex flex-col gap-2">
        <span>An unexpected error occurred while rendering this page.</span>
        <code className="rounded-md bg-surface-200 px-2 py-1 font-mono text-[12px] break-words text-foreground">
          TypeError: Cannot read properties of undefined (reading &apos;total&apos;)
        </code>
      </span>
    ),
    actions: (
      <>
        <Button icon={<RefreshCw />}>Reload</Button>
        <Button asChild variant="primary">
          <a href="#dashboard">Go to dashboard</a>
        </Button>
      </>
    ),
  },
  // The description is an element: a text control would replace it with a string.
  argTypes: { description: { control: false } },
}

/* ---------------------------------------------------------------------------------------------- */
/* ErrorState                                                                                      */
/* ---------------------------------------------------------------------------------------------- */

/** Controls for the ErrorState stories: its own props on, the EmptyState-only ones off. */
const errorStateArgTypes = {
  error: { control: 'text', table: { disable: false } },
  onRetry: { control: false, table: { disable: false } },
  retrying: { control: 'boolean', table: { disable: false } },
  retryLabel: { control: 'text', table: { disable: false } },
  icon: hidden,
  actions: hidden,
  variant: hidden,
  size: hidden,
  children: hidden,
  onAction: hidden,
} as const

const errorStateStory = {
  argTypes: errorStateArgTypes,
  render: ({ title, description, error, onRetry, retrying, retryLabel, className }: EmptyStateStoryArgs) => (
    <ErrorState
      title={title}
      description={description}
      error={error}
      onRetry={onRetry}
      retrying={retrying}
      retryLabel={retryLabel}
      className={className}
    />
  ),
} satisfies Story

/**
 * `ErrorState`: the load failed and there is nothing to show. Title names what failed; the message comes
 * from `error` (an `Error`, a string, anything). Its controls drive this story.
 */
export const ErrorWithRetry: Story = {
  ...errorStateStory,
  args: {
    title: 'Could not load invoices',
    description: undefined,
    error: 'Request timed out after 30 seconds.',
    retrying: false,
    retryLabel: 'Retry',
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const alert = canvas.getByRole('alert')
    await expect(alert).toHaveTextContent('Could not load invoices')
    await expect(alert).toHaveTextContent('Request timed out after 30 seconds.')
    await userEvent.click(canvas.getByRole('button', { name: 'Retry' }))
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}

/** `retrying` puts a spinner on Retry and disables it while the new attempt runs. */
export const ErrorRetrying: Story = {
  ...errorStateStory,
  args: { ...ErrorWithRetry.args, retrying: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Retry' })).toBeDisabled()
  },
}

/** Without `onRetry` there is no button: use it when retrying cannot help (permissions, not found). */
export const ErrorWithoutRetry: Story = {
  ...errorStateStory,
  args: {
    title: 'You do not have access to billing',
    description: undefined,
    error: new Error('You need the Billing admin role to view invoices.'),
    onRetry: undefined,
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('button')).not.toBeInTheDocument()
  },
}

/** Defaults: generic title; a thrown value without a message (here a plain object) shows the title alone. */
export const ErrorDefaults: Story = {
  ...errorStateStory,
  args: { title: undefined, description: undefined, error: { status: 500 } },
  play: async ({ canvasElement }) => {
    const alert = within(canvasElement).getByRole('alert')
    await expect(alert).toHaveTextContent('Something went wrong')
    await expect(alert.querySelector('[data-slot="error-state-description"]')).toBeNull()
  },
}

/** `description` replaces the raw message, e.g. a friendlier text for a known error; long text wraps. */
export const ErrorCustomDescription: Story = {
  ...errorStateStory,
  args: {
    title: 'Could not load the member list',
    error: new Error('409 directory_sync_in_progress'),
    description:
      'The directory sync with your identity provider is still running. Members appear once it finishes, usually within a few minutes. Contact your workspace owner if this lasts more than an hour.',
    retryLabel: 'Try again',
  },
  play: async ({ canvasElement }) => {
    const alert = within(canvasElement).getByRole('alert')
    await expect(alert).toHaveTextContent('directory sync with your identity provider')
    await expect(alert).not.toHaveTextContent('directory_sync_in_progress')
    await expect(within(canvasElement).getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  },
}
