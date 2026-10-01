import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Activity, LayoutDashboard, Settings, Users } from 'lucide-react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Button } from './button'
import { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants } from './tabs'

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-card">
      <div className="text-sm font-medium text-foreground">{title}</div>
      <div className="mt-1 text-[13px] text-foreground-light">{children}</div>
    </div>
  )
}

function Count({ children }: { children: React.ReactNode }) {
  return (
    <span className="tabular rounded-full border bg-surface-200 px-1.5 text-[11px] leading-4 text-foreground-lighter">
      {children}
    </span>
  )
}

const meta = {
  title: 'Primitives/Tabs',
  component: Tabs,
  subcomponents: { TabsList, TabsTrigger, TabsContent },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Switches between sibling panels of one view. `TabsList variant="underline"` (default) is for page-level sections on a full-width bottom hairline; `variant="pills"` is a compact segmented control for cards, panels and toolbars. Do not use tabs for navigating between routes, or to filter the same content (use `ToggleGroup`).',
      },
    },
  },
  args: {
    defaultValue: 'overview',
    onValueChange: fn(),
  },
  argTypes: {
    value: { control: 'text' },
    defaultValue: { control: 'text' },
    orientation: { control: false },
    activationMode: { control: 'inline-radio', options: ['automatic', 'manual'] },
    children: { control: false },
    asChild: { control: false },
  },
  render: (args) => (
    <Tabs {...args} className="max-w-2xl">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Panel title="Overview">Website redesign · 14 open tasks · due Oct 18.</Panel>
      </TabsContent>
      <TabsContent value="activity">
        <Panel title="Activity">Maya Chen moved “Pricing page” to Review.</Panel>
      </TabsContent>
      <TabsContent value="members">
        <Panel title="Members">6 members · 2 pending invitations.</Panel>
      </TabsContent>
      <TabsContent value="settings">
        <Panel title="Settings">Rename, archive or transfer this project.</Panel>
      </TabsContent>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

/** The `underline` list: page-level tabs on a full-width bottom hairline; the active tab is underlined. */
export const Default: Story = {}

/** The `pills` list: a compact segmented control on a `surface-200` track. */
export const Pills: Story = {
  args: { defaultValue: 'monthly' },
  render: (args) => (
    <Tabs {...args} className="max-w-sm">
      <TabsList variant="pills">
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
        <TabsTrigger value="yearly">Yearly</TabsTrigger>
      </TabsList>
      <TabsContent value="monthly">
        <Panel title="Pro plan">$24 per seat, billed monthly.</Panel>
      </TabsContent>
      <TabsContent value="yearly">
        <Panel title="Pro plan">$20 per seat, billed yearly (save 17%).</Panel>
      </TabsContent>
    </Tabs>
  ),
}

export const Variants: Story = {
  render: (args) => (
    <div className="flex max-w-2xl flex-col gap-8">
      {(['underline', 'pills'] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <div className="mono-label">{variant}</div>
          <Tabs {...args}>
            <TabsList variant={variant} aria-label={`Project sections (${variant})`}>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      ))}
    </div>
  ),
}

export const WithIcons: Story = {
  render: (args) => (
    <div className="flex max-w-2xl flex-col gap-8">
      {(['underline', 'pills'] as const).map((variant) => (
        <Tabs key={variant} {...args}>
          <TabsList variant={variant} aria-label={`Project sections with icons (${variant})`}>
            <TabsTrigger value="overview">
              <LayoutDashboard /> Overview
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Activity /> Activity
            </TabsTrigger>
            <TabsTrigger value="members">
              <Users /> Members
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings /> Settings
            </TabsTrigger>
          </TabsList>
        </Tabs>
      ))}
    </div>
  ),
}

/** Triggers can carry a trailing count. Keep it short and use tabular figures. */
export const WithCounts: Story = {
  args: { defaultValue: 'open' },
  render: (args) => (
    <Tabs {...args} className="max-w-2xl">
      <TabsList aria-label="Issues">
        <TabsTrigger value="open">
          Open <Count>24</Count>
        </TabsTrigger>
        <TabsTrigger value="in-review">
          In review <Count>3</Count>
        </TabsTrigger>
        <TabsTrigger value="closed">
          Closed <Count>1,208</Count>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  ),
}

export const DisabledTab: Story = {
  render: (args) => (
    <div className="flex max-w-2xl flex-col gap-8">
      {(['underline', 'pills'] as const).map((variant) => (
        <Tabs key={variant} {...args}>
          <TabsList variant={variant} aria-label={`Project sections, one disabled (${variant})`}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
        </Tabs>
      ))}
    </div>
  ),
}

/** Underline lists scroll horizontally (scrollbar hidden) when triggers overflow the width. */
export const Overflow: Story = {
  render: (args) => (
    <Tabs {...args} className="w-80 rounded-lg border p-3">
      <TabsList aria-label="Account settings">
        {['Overview', 'Profile', 'Notifications', 'Security', 'Billing', 'Integrations', 'API keys', 'Audit log'].map(
          (label) => (
            <TabsTrigger key={label} value={label === 'Overview' ? 'overview' : label.toLowerCase()}>
              {label}
            </TabsTrigger>
          ),
        )}
      </TabsList>
    </Tabs>
  ),
}

function ControlledTabsExample({ onValueChange }: { onValueChange?: (value: string) => void }) {
  const steps = ['details', 'members', 'review']
  const [value, setValue] = React.useState('details')
  const change = (next: string) => {
    setValue(next)
    onValueChange?.(next)
  }
  const index = steps.indexOf(value)
  const go = (delta: number) => {
    const next = steps[index + delta]
    if (next) change(next)
  }
  return (
    <Tabs value={value} onValueChange={change} className="max-w-md">
      <TabsList variant="pills" aria-label="New project">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="review">Review</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <Panel title="Details">Name, description and visibility.</Panel>
      </TabsContent>
      <TabsContent value="members">
        <Panel title="Members">Invite teammates by email.</Panel>
      </TabsContent>
      <TabsContent value="review">
        <Panel title="Review">Check everything before creating the project.</Panel>
      </TabsContent>
      <div className="flex justify-between">
        <Button size="tiny" disabled={index === 0} onClick={() => go(-1)}>
          Back
        </Button>
        <Button size="tiny" variant="primary" disabled={index === steps.length - 1} onClick={() => go(1)}>
          Next
        </Button>
      </div>
    </Tabs>
  )
}

/** Controlled with `value` + `onValueChange`, so outside buttons can move between tabs. */
export const Controlled: Story = {
  render: (args) => <ControlledTabsExample onValueChange={args.onValueChange} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }))
    await expect(canvas.getByRole('tab', { name: 'Members' })).toHaveAttribute('aria-selected', 'true')
    await expect(args.onValueChange).toHaveBeenLastCalledWith('members')
  },
}

const snippets = {
  curl: `curl https://api.example.com/v1/invoices \\
  -H "Authorization: Bearer $API_KEY" \\
  -d customer=cus_1042 -d amount=4900`,
  javascript: `const invoice = await client.invoices.create({
  customer: 'cus_1042',
  amount: 4900,
})`,
  python: `invoice = client.invoices.create(
    customer="cus_1042",
    amount=4900,
)`,
}

/**
 * Pills inside a card header: switching the language of an API request example. The panels are flush
 * with a card that clips its content (`overflow-hidden`), so their focus ring is drawn inside
 * (`focus-visible:ring-inset`) and the fill sits on the panel itself, under the ring.
 */
export const CodeSnippetCard: Story = {
  args: { defaultValue: 'curl' },
  render: (args) => (
    <Tabs {...args} className="max-w-xl gap-0 overflow-hidden rounded-lg border bg-card shadow-card">
      <div className="flex h-12 items-center justify-between border-b px-4">
        <div className="text-sm font-medium text-foreground">Create an invoice</div>
        <TabsList variant="pills" aria-label="Language">
          <TabsTrigger value="curl">cURL</TabsTrigger>
          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
          <TabsTrigger value="python">Python</TabsTrigger>
        </TabsList>
      </div>
      {Object.entries(snippets).map(([lang, code]) => (
        <TabsContent key={lang} value={lang} className="rounded-none bg-code focus-visible:ring-inset">
          <pre className="overflow-x-auto px-4 py-3 font-mono text-xs leading-5 text-foreground-light">
            <code>{code}</code>
          </pre>
        </TabsContent>
      ))}
    </Tabs>
  ),
}

export const Interaction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const activity = canvas.getByRole('tab', { name: 'Activity' })

    await userEvent.click(activity)
    await expect(activity).toHaveAttribute('aria-selected', 'true')
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Maya Chen moved')
    await expect(args.onValueChange).toHaveBeenLastCalledWith('activity')

    // Arrow keys move focus and (automatic activation) select the next tab.
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByRole('tab', { name: 'Members' })).toHaveAttribute('aria-selected', 'true')
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('6 members')

    // Tab leaves the list for the active panel, which is a tab stop with a visible focus ring.
    await userEvent.tab()
    const panel = canvas.getByRole('tabpanel')
    await waitFor(() => expect(panel).toHaveFocus())
    await expect(panel).toHaveClass('focus-visible:ring-2', 'focus-visible:ring-ring')
  },
}

/**
 * `activationMode="manual"`: arrow keys only move focus; Enter or Space opens the focused tab.
 * Use it when rendering a panel is expensive.
 */
export const ManualActivation: Story = {
  args: { activationMode: 'manual' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const overview = canvas.getByRole('tab', { name: 'Overview' })
    const activity = canvas.getByRole('tab', { name: 'Activity' })

    overview.focus()
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => expect(activity).toHaveFocus())
    await expect(activity).toHaveAttribute('aria-selected', 'false')
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('14 open tasks')

    await userEvent.keyboard('{Enter}')
    await expect(activity).toHaveAttribute('aria-selected', 'true')
    await expect(args.onValueChange).toHaveBeenLastCalledWith('activity')
  },
}

/**
 * `tabsListVariants()` returns the list classes for an element you render yourself: here a route
 * navigation whose links should look like the `underline` tab row. Real tabs (panels switched in
 * place) must use `TabsList`, which also wires the ARIA roles and the keyboard.
 */
export const ClassHelper: Story = {
  render: () => (
    <nav aria-label="Project pages" data-variant="underline" className={tabsListVariants({ variant: 'underline' })}>
      {['Overview', 'Activity', 'Settings'].map((page, index) => (
        <a
          key={page}
          href={`#${page.toLowerCase()}`}
          aria-current={index === 0 ? 'page' : undefined}
          className="flex h-full items-center text-sm outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset aria-[current=page]:text-foreground aria-[current=page]:shadow-[inset_0_-1px_0_0_var(--foreground)]"
        >
          {page}
        </a>
      ))}
    </nav>
  ),
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation', { name: 'Project pages' })
    await expect(nav).toHaveClass('h-10', 'w-full', 'gap-5')
    await expect(within(nav).getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page')
  },
}
