import type { Meta, StoryObj } from '@storybook/react-vite'
import { AlertTriangle, Check, Clock, Lock, Sparkles, X } from 'lucide-react'
import { expect, userEvent, within } from 'storybook/test'

import { Badge, badgeVariants } from './badge'

const meta = {
  title: 'Primitives/Badge',
  component: Badge,
  parameters: {
    docs: {
      description: {
        component:
          'Tiny 20px label with a 1px border, uppercase and tracked by default, for short static metadata: a plan tier, a version, a count, a tag. `default` / `outline` are the neutral tags, the tinted variants (`success`, `warning`, `destructive`, `info`) colour a tag (a `warning` "Beta") and `primary` adds emphasis, sparingly ("New"). For the state of a record use `StatusBadge`. Switch to `font="mono"` for machine-like values (plan tiers, versions, regions) and `case="normal"` for sentence-case text; never use a badge as a button.',
      },
    },
  },
  args: {
    children: 'Beta',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'success', 'warning', 'destructive', 'info', 'primary'],
    },
    font: { control: 'inline-radio', options: ['sans', 'mono'] },
    shape: { control: 'inline-radio', options: ['pill', 'square'] },
    case: { control: 'inline-radio', options: ['upper', 'normal'] },
    asChild: { control: false },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** One badge per `variant`: neutral tags, the four tinted tags and the solid `primary` for emphasis. */
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge {...args} variant="default">
        Default
      </Badge>
      <Badge {...args} variant="outline">
        Outline
      </Badge>
      <Badge {...args} variant="success">
        Stable
      </Badge>
      <Badge {...args} variant="warning">
        Beta
      </Badge>
      <Badge {...args} variant="destructive">
        Deprecated
      </Badge>
      <Badge {...args} variant="info">
        Preview
      </Badge>
      <Badge {...args} variant="primary">
        New
      </Badge>
    </div>
  ),
}

/** `primary` is the solid fill in the primary colour: use it sparingly, for emphasis. */
export const PrimaryVariant: Story = {
  args: { variant: 'primary', children: 'New' },
  play: async ({ canvasElement }) => {
    const badge = within(canvasElement).getByText('New')
    await expect(badge).toHaveAttribute('data-variant', 'primary')
    await expect(badge).toHaveClass('bg-primary-solid', 'text-primary-foreground')
  },
}

export const Mono: Story = {
  args: { font: 'mono' },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge {...args}>Pro</Badge>
      <Badge {...args} variant="outline">
        v2.4.1
      </Badge>
      <Badge {...args} variant="outline" shape="square">
        EUR
      </Badge>
      <Badge {...args} variant="info" shape="square">
        API
      </Badge>
    </div>
  ),
}

export const Shapes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge {...args} shape="pill">
        Pill
      </Badge>
      <Badge {...args} shape="square">
        Square
      </Badge>
      <Badge {...args} variant="outline" shape="square" font="mono">
        Square mono
      </Badge>
    </div>
  ),
}

export const NormalCase: Story = {
  args: { case: 'normal', variant: 'outline', children: 'Design team' },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge {...args} />
      <Badge {...args} variant="success">
        Up to date
      </Badge>
      <Badge {...args} variant="default">
        3 seats left
      </Badge>
    </div>
  ),
}

export const WithIcons: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge {...args} variant="success">
        <Check />
        Active
      </Badge>
      <Badge {...args} variant="warning">
        <Clock />
        Trial ends soon
      </Badge>
      <Badge {...args} variant="destructive">
        <X />
        Failed
      </Badge>
      <Badge {...args} variant="info">
        <AlertTriangle />
        Action required
      </Badge>
      <Badge {...args} variant="primary">
        <Sparkles />
        New
      </Badge>
      <Badge {...args} variant="outline" case="normal">
        <Lock />
        Private
      </Badge>
    </div>
  ),
}

export const AsLink: Story = {
  args: { asChild: true, variant: 'outline', case: 'normal' },
  render: (args) => (
    <Badge {...args}>
      <a href="#changelog" className="hover:bg-surface-200 hover:text-foreground">
        What&apos;s new
      </a>
    </Badge>
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: "What's new" })
    await expect(link).toHaveAttribute('data-slot', 'badge')
    await expect(link).toHaveAttribute('href', '#changelog')
    // The badge classes include a focus-visible ring, so a badge link is keyboard-reachable.
    await userEvent.tab()
    await expect(link).toHaveFocus()
  },
}

export const ClassHelper: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`badgeVariants()` returns the badge classes for any element — here list items of a tag list — when rendering `<Badge>` (a `<span>`) or `asChild` does not fit.',
      },
    },
  },
  render: () => (
    <ul aria-label="Tags" className="flex flex-wrap gap-1.5">
      {['Design', 'Frontend', 'Q3 roadmap', 'Customer request'].map((tag) => (
        <li key={tag} className={badgeVariants({ variant: 'outline', case: 'normal' })}>
          {tag}
        </li>
      ))}
    </ul>
  ),
  play: async ({ canvasElement }) => {
    const items = within(canvasElement).getAllByRole('listitem')
    await expect(items).toHaveLength(4)
    await expect(items[0]).toHaveClass('rounded-full', 'normal-case')
  },
}

export const LongContent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Badges never wrap. For user-provided text, cap the width and wrap the text in a `truncate` span; keep the full value in a `title`.',
      },
    },
  },
  render: (args) => {
    const label = 'Enterprise annual plan with priority support'
    return (
      <div className="flex w-64 flex-col items-start gap-2 rounded-md border p-3">
        <Badge {...args} case="normal" variant="outline" className="max-w-full justify-start" title={label}>
          <span className="truncate">{label}</span>
        </Badge>
        <span className="text-xs text-foreground-lighter">Truncated to the container width</span>
      </div>
    )
  },
}

const invoices = [
  { id: 'INV-2041', customer: 'Northwind Traders', amount: '$1,240.00', status: 'paid' },
  { id: 'INV-2042', customer: 'Acme Corporation', amount: '$860.50', status: 'pending' },
  { id: 'INV-2043', customer: 'Globex Inc.', amount: '$3,105.00', status: 'overdue' },
  { id: 'INV-2044', customer: 'Initech', amount: '$420.00', status: 'draft' },
] as const

const statusVariant = {
  paid: 'success',
  pending: 'warning',
  overdue: 'destructive',
  draft: 'default',
} as const

export const InvoiceList: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="max-w-lg divide-y rounded-lg border bg-card">
      {invoices.map((invoice) => (
        <div key={invoice.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
          <span className="w-20 font-mono text-[13px] text-foreground-light">{invoice.id}</span>
          <span className="flex-1 truncate text-foreground">{invoice.customer}</span>
          <span className="tabular text-foreground-light">{invoice.amount}</span>
          <Badge {...args} variant={statusVariant[invoice.status]} className="w-[72px]">
            {invoice.status}
          </Badge>
        </div>
      ))}
    </div>
  ),
}

export const ProjectHeader: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <h2 className="text-lg font-medium text-foreground">Onboarding revamp</h2>
      <Badge {...args} variant="success">
        On track
      </Badge>
      <Badge {...args} variant="outline" font="mono" shape="square">
        Pro
      </Badge>
      <Badge {...args} variant="outline" case="normal">
        8 members
      </Badge>
    </div>
  ),
}
