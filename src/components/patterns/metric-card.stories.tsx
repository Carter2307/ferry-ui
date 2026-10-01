import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Badge } from '../primitives/badge'

import { LEGEND_DOT_TONES, LegendDot, MetricCard, MetricTrend, UsageBar } from './metric-card'

const meta = {
  title: 'Patterns/Metric Card',
  component: MetricCard,
  subcomponents: { MetricTrend, UsageBar, LegendDot },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Bordered KPI card: mono label (with optional (i) tooltip and header `aside`), a big tabular value with `unit`, `trend` and `hint`, and room for a bar or chart as `children`. Pair it with `UsageBar` for quotas, `MetricTrend` for deltas and `LegendDot` to name chart series. Use `compact` in dense grids; use `InfoTile` for non-numeric facts.',
      },
    },
  },
  args: {
    label: 'Monthly revenue',
    value: '$48,200',
    info: 'Sum of paid invoices this calendar month, before refunds.',
    loading: false,
    compact: false,
  },
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    unit: { control: 'text' },
    hint: { control: 'text' },
    info: { control: 'text' },
    infoLabel: { control: 'text' },
    trend: { control: false },
    aside: { control: false },
    children: { control: false },
  },
  render: (args) => (
    <div className="w-80">
      <MetricCard {...args} />
    </div>
  ),
} satisfies Meta<typeof MetricCard>

export default meta
type Story = StoryObj<typeof meta>

/* Deterministic sample series: requests per hour over the last 24 hours. */
const HOURLY_REQUESTS = [
  42, 38, 31, 26, 22, 20, 24, 35, 58, 74, 81, 88, 92, 86, 90, 95, 99, 93, 80, 71, 64, 57, 49, 45,
]

function RequestBars({ values }: { values: number[] }) {
  const peak = Math.max(...values)
  return (
    <div className="flex flex-col gap-1.5">
      <div
        role="img"
        aria-label={`Requests per hour, last ${values.length} hours, peak ${peak}k`}
        className="flex h-12 items-end gap-[3px] border-b border-dashed border-border-strong pb-px"
      >
        {values.map((v, i) => (
          <span
            key={i}
            className="min-w-0 flex-1 rounded-[1.5px] bg-brand/85"
            style={{ height: Math.max(3, Math.round((v / peak) * 46)) }}
          />
        ))}
      </div>
      <div className="flex justify-between font-mono text-[10.5px] tracking-[0.04em] text-foreground-lighter tabular">
        <span>24h ago</span>
        <span>now</span>
      </div>
    </div>
  )
}

export const Default: Story = {}

export const WithTrend: Story = {
  args: {
    trend: <MetricTrend direction="up">+12.5%</MetricTrend>,
    hint: 'vs. last month',
  },
}

export const NegativeTrend: Story = {
  args: {
    label: 'Churn rate',
    value: '3.1%',
    info: undefined,
    trend: (
      <MetricTrend direction="up" sentiment="negative">
        +0.4 pts
      </MetricTrend>
    ),
    hint: 'Rising churn is bad, so the up arrow is red',
  },
}

export const WithUnitAndUsage: Story = {
  args: {
    label: 'Seats',
    value: '8',
    unit: 'of 10',
    info: 'Paid seats on the current plan.',
    children: <UsageBar value={80} label="Seats used" />,
  },
}

export const WithInfoTooltip: Story = {
  args: { infoLabel: 'About monthly revenue' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'About monthly revenue' })
    // Start from a neutral focus so the first Tab lands on the (i) button whatever ran before.
    ;(document.activeElement as HTMLElement | null)?.blur()
    await userEvent.tab()
    await expect(button).toHaveFocus()
    const tooltip = await within(document.body).findByRole('tooltip')
    await expect(tooltip).toHaveTextContent(String(args.info))
    await userEvent.keyboard('{Escape}')
  },
}

export const WithAsideAndChart: Story = {
  args: {
    label: 'API requests',
    value: '1.42M',
    unit: 'last 24h',
    info: undefined,
    aside: <LegendDot tone="brand">Requests</LegendDot>,
    children: <RequestBars values={HOURLY_REQUESTS} />,
  },
}

export const WithStatusAside: Story = {
  args: {
    label: 'Net promoter score',
    value: '62',
    info: undefined,
    hint: 'Last 30 days',
    aside: <Badge variant="success">On track</Badge>,
  },
}

/** `0` is a real value and is shown; only `undefined`/`null` hide the value row. */
export const ZeroValue: Story = {
  args: { label: 'Failed payments', value: 0, info: undefined, hint: 'Last 7 days' },
  play: async ({ canvasElement }) => {
    const valueRow = canvasElement.querySelector('[data-slot="metric-card-value"]')
    await expect(valueRow).toHaveTextContent('0')
  },
}

/** While loading, the value is a skeleton, `unit`/`trend`/`hint` are hidden and the card is `aria-busy`. */
export const Loading: Story = {
  args: { label: 'Active users', loading: true, hint: 'Hidden while loading' },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[data-slot="metric-card"]')
    await expect(card).toHaveAttribute('aria-busy', 'true')
    await expect(canvasElement.querySelector('[data-slot="metric-card-hint"]')).toBeNull()
  },
}

export const LoadingWithChildren: Story = {
  args: {
    label: 'Storage',
    loading: true,
    children: <UsageBar value={null} label="Storage used" />,
  },
}

export const Compact: Story = {
  args: { compact: true, label: 'Open tickets', value: '14', info: undefined },
}

export const LabelAndContentOnly: Story = {
  args: {
    label: 'Plan limits',
    value: undefined,
    info: undefined,
    children: (
      <div className="flex flex-col gap-3 text-[13px] text-foreground-light">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between">
            <span>Projects</span>
            <span className="text-foreground tabular">12 / 20</span>
          </div>
          <UsageBar value={60} label="Projects used" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between">
            <span>Storage</span>
            <span className="text-foreground tabular">46 / 50 GB</span>
          </div>
          <UsageBar value={92} label="Storage used" />
        </div>
      </div>
    ),
  },
}

export const LongContent: Story = {
  args: {
    label: 'Lifetime gross merchandise volume across all regions',
    value: '$1,284,930,442',
    unit: 'USD',
    trend: <MetricTrend direction="flat">0.0%</MetricTrend>,
    hint: 'Includes marketplace orders, subscriptions and one-off invoices from every connected store',
  },
  render: (args) => (
    <div className="w-60">
      <MetricCard {...args} />
    </div>
  ),
}

export const Dashboard: Story = {
  render: () => (
    <div className="grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        label="Revenue"
        value="$48,200"
        trend={<MetricTrend direction="up">+12.5%</MetricTrend>}
        hint="vs. last month"
      />
      <MetricCard
        label="Active users"
        value="3,912"
        trend={<MetricTrend direction="down">-2.1%</MetricTrend>}
        hint="Last 7 days"
      />
      <MetricCard label="Storage" value="46 GB" unit="/ 50 GB" info="Files and attachments across all projects.">
        <UsageBar value={92} label="Storage used" />
      </MetricCard>
      <MetricCard label="Orders today" loading />
    </div>
  ),
}

export const MetricTrends: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <MetricTrend direction="up">+12.5%</MetricTrend>
      <MetricTrend direction="down">-4.2%</MetricTrend>
      <MetricTrend direction="flat">0.0%</MetricTrend>
      <MetricTrend direction="up" sentiment="negative">
        +180 ms latency
      </MetricTrend>
      <MetricTrend direction="down" sentiment="positive">
        -3 open tickets
      </MetricTrend>
    </div>
  ),
}

export const UsageBars: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4 text-[12.5px] text-foreground-light">
      {[
        { label: 'API calls used', value: 32 },
        { label: 'Seats used', value: 78 },
        { label: 'Storage used', value: 95 },
        { label: 'Emails sent', value: null },
      ].map((bar) => (
        <div key={bar.label} className="flex flex-col gap-1.5">
          <div className="flex justify-between">
            <span>{bar.label} (auto)</span>
            <span className="tabular">{bar.value === null ? 'no data' : `${bar.value}%`}</span>
          </div>
          <UsageBar value={bar.value} label={bar.label} />
        </div>
      ))}
      <div className="flex flex-col gap-1.5">
        <span>Forced tones: brand · warning · destructive</span>
        <UsageBar value={95} tone="brand" label="Forced brand" />
        <UsageBar value={40} tone="warning" label="Forced warning" />
        <UsageBar value={40} tone="destructive" label="Forced destructive" />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between gap-3">
          <span>Custom thresholds (warning at 50, destructive at 80)</span>
          <span className="shrink-0 whitespace-nowrap tabular">46 / 80 GB</span>
        </div>
        <UsageBar value={57.5} warningAt={50} destructiveAt={80} label="Backups" aria-valuetext="46 of 80 GB" />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const storage = canvas.getByRole('meter', { name: 'Storage used' })
    await expect(storage).toHaveAttribute('aria-valuenow', '95')
    await expect(storage).toHaveAttribute('data-tone', 'destructive')
    await expect(canvas.getByRole('meter', { name: 'Seats used' })).toHaveAttribute('data-tone', 'warning')
    await expect(canvas.getByRole('meter', { name: 'API calls used' })).toHaveAttribute('data-tone', 'brand')
    await expect(canvas.getByRole('meter', { name: 'Forced brand' })).toHaveAttribute('data-tone', 'brand')
    const backups = canvas.getByRole('meter', { name: 'Backups' })
    await expect(backups).toHaveAttribute('data-tone', 'warning')
    await expect(backups).toHaveAttribute('aria-valuetext', '46 of 80 GB')
    await waitFor(() =>
      expect(canvas.getByRole('meter', { name: 'Emails sent' })).toHaveAttribute('aria-valuenow', '0'),
    )
  },
}

/** One dot per tone; `dotClassName` sets a custom series colour (here a faded brand for "previous period"). */
export const LegendDots: Story = {
  render: () => (
    <div className="flex max-w-md flex-wrap gap-x-4 gap-y-2 text-foreground-lighter">
      {LEGEND_DOT_TONES.map((tone) => (
        <LegendDot key={tone} tone={tone}>
          {tone}
        </LegendDot>
      ))}
      <LegendDot dotClassName="bg-brand/50">Previous period</LegendDot>
    </div>
  ),
}

/** A realistic chart legend: one dot per series of an invoices chart, in the card header. */
export const LegendInHeader: Story = {
  args: {
    label: 'Invoices',
    value: '1,208',
    unit: 'this quarter',
    info: undefined,
    aside: (
      <>
        <LegendDot tone="success">Paid</LegendDot>
        <LegendDot tone="warning">Pending</LegendDot>
        <LegendDot tone="destructive">Failed</LegendDot>
      </>
    ),
  },
  render: (args) => (
    <div className="w-[26rem]">
      <MetricCard {...args} />
    </div>
  ),
}
