import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AlertTriangle,
  BellRing,
  CalendarClock,
  CreditCard,
  Database,
  FolderKanban,
  KeyRound,
  Mail,
  MessageSquare,
  Receipt,
  ShoppingCart,
  Smartphone,
  UserPlus,
  Webhook,
} from 'lucide-react'
import { expect, userEvent, within } from 'storybook/test'

import { Badge } from '../primitives/badge'
import { Button } from '../primitives/button'
import { cn } from '../../lib/utils'

import { IconBox, iconBoxVariants, type IconBoxSize, type IconBoxTone } from './icon-box'
import { StatusBadge } from './status'

const SIZES: { size: IconBoxSize; caption: string }[] = [
  { size: 'xs', caption: '28px · 14px icon' },
  { size: 'sm', caption: '32px · 16px icon' },
  { size: 'md', caption: '36px · 18px icon' },
  { size: 'lg', caption: '44px · 20px icon' },
  { size: 'xl', caption: '56 / 72px · 20px icon' },
]

const TONES: IconBoxTone[] = ['neutral', 'primary', 'success', 'warning', 'destructive', 'info']

const meta = {
  title: 'Patterns/Icon Box',
  component: IconBox,
  parameters: {
    docs: {
      description: {
        component:
          'Outlined square holding one line icon: the "kind" mark in front of a name in list rows, cards, page titles and overview tiles. Pick the `size` from where it sits (`xs`/`sm` in dense rows, `md` in cards, `lg` next to a page title, `xl` in overview tiles; `lg` and `xl` are elevated by default). Keep the `neutral` tone unless the box itself carries meaning: `primary` for the current or selected item, a status tone for a state. The icon is sized automatically and the box is decorative unless you give it a `label`. Use `iconBoxVariants` to give another element the same look. Do NOT use it for people (use `Avatar`) or as a button (use an `icon` `Button`).',
      },
    },
  },
  args: {
    children: <Receipt />,
    size: 'md',
    tone: 'neutral',
  },
  argTypes: {
    children: { control: false },
    size: { control: 'inline-radio', options: SIZES.map((s) => s.size) },
    tone: { control: 'select', options: TONES },
    elevated: { control: 'boolean' },
    label: { control: 'text' },
  },
} satisfies Meta<typeof IconBox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** The five sizes. `xl` grows from 56px to 72px at the `md` breakpoint; `lg` and `xl` carry the card shadow by default. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-end gap-6">
      {SIZES.map(({ size, caption }) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <IconBox {...args} size={size} />
          <span className="text-[12px] text-foreground-lighter">
            <span className="font-medium text-foreground-light">{size}</span> · {caption}
          </span>
        </div>
      ))}
    </div>
  ),
}

/** `neutral` is the default; `primary` marks the current or selected item; the status tones carry a state. */
export const Tones: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-end gap-6">
      {TONES.map((tone) => (
        <div key={tone} className="flex flex-col items-center gap-2">
          <IconBox {...args} tone={tone} />
          <span className="text-[12px] text-foreground-lighter">{tone}</span>
        </div>
      ))}
    </div>
  ),
}

/**
 * `elevated` adds the card shadow and, for `neutral`, a one-step stronger icon. Flat boxes suit inline
 * rows; elevated ones head a page, a dialog or a tile. Override the size default either way.
 */
export const Elevated: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {SIZES.map(({ size }) => (
        <div key={size} className="flex items-center gap-4">
          <span className="w-8 text-[12px] font-medium text-foreground-light">{size}</span>
          <IconBox {...args} size={size} elevated={false} />
          <IconBox {...args} size={size} elevated />
          <span className="text-[12px] text-foreground-lighter">flat · elevated</span>
        </div>
      ))}
    </div>
  ),
}

/** Every tone in every size, to check the scale at a glance. */
export const Matrix: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {TONES.map((tone) => (
        <div key={tone} className="flex items-center gap-4">
          <span className="w-20 text-[12px] text-foreground-lighter">{tone}</span>
          {SIZES.map(({ size }) => (
            <IconBox {...args} key={size} size={size} tone={tone} />
          ))}
        </div>
      ))}
    </div>
  ),
}

/** Without `label` the box is decorative (`aria-hidden`). With one, it becomes an image with that name. */
export const WithLabel: Story = {
  args: { children: <Database />, label: 'Database' },
  render: (args) => (
    <div className="flex items-center gap-3">
      <IconBox {...args} />
      <IconBox {...args} label={undefined} data-testid="decorative" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('img', { name: 'Database' })).toHaveAttribute('data-slot', 'icon-box')
    await expect(canvas.getByTestId('decorative')).toHaveAttribute('aria-hidden', 'true')
    await expect(canvas.getAllByRole('img')).toHaveLength(1)
  },
}

/** Force another icon size with an arbitrary-variant class on the box (a class on the `<svg>` is overridden). */
export const CustomIconSize: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <IconBox {...args} size="xs" />
      <IconBox {...args} size="xs" className="[&_svg]:size-4" />
      <span className="text-[12px] text-foreground-lighter">xs default (14px) · xs with 16px icon</span>
    </div>
  ),
}

/* -------------------------------------------------------------------------------------------------
 * Composition
 * -----------------------------------------------------------------------------------------------*/

/** `xs` / `sm` boxes in dense rows: a scheduled-export strip and a list of API keys. */
export const InListRows: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex max-w-xl flex-col gap-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-surface-100 px-4 py-3 shadow-card sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <IconBox size="sm">
            <CalendarClock />
          </IconBox>
          <div className="flex min-w-0 flex-col">
            <span className="text-sm text-foreground">
              Every Monday at 08:00 <span className="text-foreground-light">· weekly sales export</span>
            </span>
            <span className="text-[12.5px] text-foreground-lighter">Next run in 3 days · sent to finance@acme.com</span>
          </div>
        </div>
        <Button size="tiny" variant="default">
          Edit schedule
        </Button>
      </div>

      <ul className="divide-y rounded-lg border bg-surface-100 shadow-card">
        {[
          { name: 'Production server', prefix: 'sk_live_4f2a…', used: 'Used 2 minutes ago' },
          { name: 'Analytics export', prefix: 'sk_live_91cd…', used: 'Used yesterday' },
          { name: 'Local development', prefix: 'sk_test_07be…', used: 'Never used' },
        ].map((key) => (
          <li key={key.name} className="flex items-center gap-3 px-4 py-3">
            <IconBox size="xs">
              <KeyRound />
            </IconBox>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-[13px] font-medium text-foreground">{key.name}</span>
              <span className="truncate font-mono text-[12px] text-foreground-lighter">{key.prefix}</span>
            </div>
            <span className="shrink-0 text-[12px] text-foreground-lighter">{key.used}</span>
          </li>
        ))}
      </ul>
    </div>
  ),
}

/** An `lg` box (elevated by default) next to a page title. */
export const NextToPageTitle: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <h1 className="flex min-w-0 items-center gap-3 text-2xl font-medium text-foreground">
        <IconBox size="lg">
          <FolderKanban strokeWidth={1.6} />
        </IconBox>
        <span className="truncate">Website redesign</span>
      </h1>
      <Badge variant="outline" font="mono" case="normal">
        12 members
      </Badge>
      <StatusBadge tone="success" label="Active" />
    </div>
  ),
}

/** Status tones in an activity feed: the box colour carries the kind of event. */
export const ActivityFeed: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <ul className="flex max-w-md flex-col gap-4">
      {[
        { tone: 'success', icon: <Receipt />, title: 'Invoice INV-2026-0142 paid', meta: '$4,280.00 · 2 hours ago' },
        { tone: 'info', icon: <UserPlus />, title: 'Maya Chen joined the workspace', meta: 'Invited by Sam Lee · 5 hours ago' },
        { tone: 'warning', icon: <CreditCard />, title: 'Card ending 4242 expires soon', meta: 'Update it before Oct 31' },
        { tone: 'destructive', icon: <AlertTriangle />, title: 'Webhook delivery failed', meta: 'order.created · 3 retries left' },
        { tone: 'neutral', icon: <ShoppingCart />, title: 'Order #10482 archived', meta: 'Yesterday' },
      ].map((event) => (
        <li key={event.title} className="flex items-center gap-3">
          <IconBox size="sm" tone={event.tone as IconBoxTone}>
            {event.icon}
          </IconBox>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[13px] text-foreground">{event.title}</span>
            <span className="truncate text-[12px] text-foreground-lighter">{event.meta}</span>
          </div>
        </li>
      ))}
    </ul>
  ),
}

const CHANNELS = [
  { value: 'email', label: 'Email', description: 'A digest to every workspace admin', icon: <Mail /> },
  { value: 'sms', label: 'SMS', description: 'Only for failed payments', icon: <Smartphone /> },
  { value: 'chat', label: 'Chat', description: 'Posts to your team channel', icon: <MessageSquare /> },
  { value: 'webhook', label: 'Webhook', description: 'A signed POST to your endpoint', icon: <Webhook /> },
]

function ChannelPicker() {
  const [enabled, setEnabled] = React.useState<string[]>(['email'])
  return (
    <div role="group" aria-label="Notification channels" className="grid max-w-xl gap-3 sm:grid-cols-2">
      {CHANNELS.map((c) => {
        const on = enabled.includes(c.value)
        return (
          <button
            key={c.value}
            type="button"
            aria-pressed={on}
            onClick={() => setEnabled((prev) => (on ? prev.filter((v) => v !== c.value) : [...prev, c.value]))}
            className={cn(
              'flex items-center gap-3 rounded-lg border bg-surface-100 px-3.5 py-3 text-left shadow-card transition-colors outline-none',
              'hover:border-border-stronger focus-visible:ring-2 focus-visible:ring-ring',
              on && 'border-primary ring-1 ring-primary/40',
            )}
          >
            <IconBox size="md" tone={on ? 'primary' : 'neutral'} className="transition-colors">
              {c.icon}
            </IconBox>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">{c.label}</span>
              <span className="text-[12.5px] leading-snug text-foreground-light">{c.description}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

/** The `primary` tone marks the selected items of a multi-select (toggle cards here). */
export const SelectedItems: Story = {
  parameters: { layout: 'padded' },
  render: () => <ChannelPicker />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const sms = canvas.getByRole('button', { name: /sms/i })
    await expect(sms.querySelector('[data-slot="icon-box"]')).toHaveAttribute('data-tone', 'neutral')
    await userEvent.click(sms)
    await expect(sms).toHaveAttribute('aria-pressed', 'true')
    await expect(sms.querySelector('[data-slot="icon-box"]')).toHaveAttribute('data-tone', 'primary')
    const email = canvas.getByRole('button', { name: /email/i })
    await userEvent.click(email)
    await expect(email.querySelector('[data-slot="icon-box"]')).toHaveAttribute('data-tone', 'neutral')
  },
}

/**
 * `iconBoxVariants` returns the class string, for elements you cannot swap for `IconBox` (a
 * third-party component that only takes a `className`, a `<div>` where block content is required).
 */
export const VariantsClassName: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <div aria-hidden="true" className={iconBoxVariants({ size: 'lg', tone: 'primary' })}>
        <BellRing />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">Alerts are on</span>
        <span className="text-[12.5px] text-foreground-lighter">
          <code className="font-mono">iconBoxVariants({'{'} size: &apos;lg&apos;, tone: &apos;primary&apos; {'}'})</code>
        </span>
      </div>
    </div>
  ),
}
