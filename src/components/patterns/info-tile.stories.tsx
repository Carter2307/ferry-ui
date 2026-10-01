import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Activity, CalendarDays, Check, Copy, CreditCard, Fingerprint, Globe, KeyRound, Receipt, UserRound } from 'lucide-react'
import { expect, userEvent, within } from 'storybook/test'

import { Badge } from '../primitives/badge'
import { Button } from '../primitives/button'

import { InfoTile } from './info-tile'

const meta = {
  title: 'Patterns/Info Tile',
  component: InfoTile,
  parameters: {
    docs: {
      description: {
        component:
          'Borderless overview tile: square outlined icon box, mono label, one-line value and an optional hint. Lay several out in a `grid gap-x-8 gap-y-6 sm:grid-cols-2` at the top of a detail page to summarise an entity. For numbers to compare or chart, use `MetricCard` instead.',
      },
    },
  },
  args: {
    icon: <CreditCard />,
    label: 'Plan',
    value: 'Pro',
    hint: 'Renews on Nov 1, 2026',
    loading: false,
  },
  argTypes: {
    icon: { control: false },
    label: { control: 'text' },
    value: { control: 'text' },
    hint: { control: 'text' },
  },
} satisfies Meta<typeof InfoTile>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutHint: Story = {
  args: { icon: <Globe />, label: 'Timezone', value: 'Europe/Paris', hint: undefined },
}

export const WithoutIcon: Story = {
  args: { icon: undefined, label: 'Billing email', value: 'billing@acme.com', hint: 'Invoices are sent here' },
}

/** While loading, the value becomes a skeleton, the hint is hidden and the tile is `aria-busy`. */
export const Loading: Story = {
  args: { icon: <CalendarDays />, label: 'Next invoice', value: undefined, loading: true },
  play: async ({ canvasElement }) => {
    const tile = canvasElement.querySelector('[data-slot="info-tile"]')
    await expect(tile).toHaveAttribute('aria-busy', 'true')
    await expect(canvasElement.querySelector('[data-slot="info-tile-hint"]')).toBeNull()
  },
}

export const WithBadge: Story = {
  args: {
    icon: <Activity />,
    label: 'Status',
    value: <Badge variant="success">Active</Badge>,
    hint: 'Since Sep 12, 2026',
  },
  // The value is an element: a text control would replace it with a string.
  argTypes: { value: { control: false } },
}

/** Values and hints truncate to one line; put the full text in a `title`. */
export const LongValue: Story = {
  args: {
    icon: <Globe />,
    label: 'Website',
    value: (
      <span className="font-mono text-[14px] md:text-[15px]" title="www.northwind-traders-international.example.com">
        www.northwind-traders-international.example.com
      </span>
    ),
    hint: 'Shown on invoices and in the footer of every email sent to customers',
  },
  argTypes: { value: { control: false } },
  render: (args) => (
    <div className="w-80">
      <InfoTile {...args} />
    </div>
  ),
}

/** A link as the value. Use your router's link component in an app; a plain `<a>` works everywhere. */
export const WithLink: Story = {
  args: {
    icon: <Receipt />,
    label: 'Latest invoice',
    value: (
      <a
        href="#invoices/INV-2026-0142"
        className="group flex min-w-0 items-center gap-2 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Badge variant="success">Paid</Badge>
        <span className="truncate font-mono text-[14px] text-foreground-light group-hover:text-foreground group-hover:underline md:text-[15px]">
          INV-2026-0142
        </span>
      </a>
    ),
    hint: '$4,280.00 · 2 days ago',
  },
  argTypes: { value: { control: false } },
}

function CopyableId({ value, what }: { value: string; what: string }) {
  const [copied, setCopied] = React.useState(false)
  return (
    <span className="flex min-w-0 items-center gap-2">
      <span className="truncate font-mono text-[14px] md:text-[15px]" title={value}>
        {value}
      </span>
      <Button
        variant="ghost"
        size="icon-tiny"
        className="shrink-0"
        aria-label={copied ? 'Copied' : `Copy ${what}`}
        icon={copied ? <Check /> : <Copy />}
        onClick={() => {
          // Real apps would use the Copy pattern or `useCopy`; the story only flips its own state.
          void navigator.clipboard?.writeText(value).catch(() => undefined)
          setCopied(true)
        }}
      />
    </span>
  )
}

/** A value with an inline copy button (the icon box stays hidden from assistive technology). */
export const WithCopyAction: Story = {
  args: {
    icon: <Fingerprint />,
    label: 'Workspace ID',
    value: <CopyableId value="ws_8f3a21c9e04b" what="workspace ID" />,
    hint: 'Use it when contacting support',
  },
  argTypes: { value: { control: false } },
  render: (args) => (
    <div className="w-80">
      <InfoTile {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Copy workspace ID' }))
    await expect(canvas.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
    await expect(canvasElement.querySelector('[data-slot="info-tile-icon"]')).toHaveAttribute('aria-hidden', 'true')
  },
}

/** Realistic overview: the key facts of a workspace in a two-column grid, one of them still loading. */
export const OverviewGrid: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="grid max-w-3xl grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
      <InfoTile icon={<Activity />} label="Status" value={<Badge variant="success">Active</Badge>} hint="Since Sep 12, 2026" />
      <InfoTile icon={<CreditCard />} label="Plan" value="Pro · annual" hint="8 of 10 seats used" />
      <InfoTile icon={<UserRound />} label="Owner" value="Maya Chen" hint="maya@acme.com" />
      <InfoTile icon={<Globe />} label="Timezone" value="Europe/Paris" hint="Used for reports and invoice dates" />
      <InfoTile
        icon={<KeyRound />}
        label="API keys"
        value={
          <span className="tabular">
            3<span className="text-foreground-lighter">/5</span>
          </span>
        }
        hint="Active / allowed"
      />
      <InfoTile icon={<CalendarDays />} label="Next invoice" loading />
    </div>
  ),
}
