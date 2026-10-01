import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { RefreshCw, ShieldCheck } from 'lucide-react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Badge } from '../primitives/badge'
import { Button } from '../primitives/button'
import { Checkbox } from '../primitives/checkbox'
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../primitives/dialog'
import { Input } from '../primitives/input'
import { Label } from '../primitives/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../primitives/table'

import { Callout, StaleDataCallout, type CalloutProps, type CalloutTone, type StaleDataCalloutProps } from './callout'

/**
 * Callout props, plus the StaleDataCallout-only props (so its stories have working controls) and
 * story-only callbacks. `toCalloutProps` strips the extras before they reach `Callout`.
 */
type CalloutStoryArgs = CalloutProps &
  Partial<Pick<StaleDataCalloutProps, 'error' | 'retrying' | 'retryLabel'>> & {
    /** Story-only: wired to the action buttons / submit of the interactive stories. */
    onAction?: () => void
    /** Story-only: wired to the Retry buttons (`StaleDataCallout` `onRetry`, error callouts). */
    onRetry?: () => void
  }

function toCalloutProps({
  onAction: _onAction,
  onRetry: _onRetry,
  error: _error,
  retrying: _retrying,
  retryLabel: _retryLabel,
  ...props
}: CalloutStoryArgs): CalloutProps {
  return props
}

const hidden = { table: { disable: true } } as const

const tones: CalloutTone[] = ['info', 'warning', 'destructive', 'success', 'neutral']

const toneExample: Record<CalloutTone, { title: string; body: string }> = {
  info: {
    title: 'Two-factor authentication is off',
    body: 'Members can sign in with a password only. Require 2FA in the security settings.',
  },
  warning: { title: 'Your trial ends in 3 days', body: 'Add a payment method to keep access to your projects.' },
  destructive: {
    title: 'The last payment failed',
    body: 'The card ending in 4242 was declined. Update it to avoid losing access.',
  },
  success: { title: 'Your domain is verified', body: 'Emails sent from acme.com are now signed and delivered.' },
  neutral: {
    title: 'Invoices are generated monthly',
    body: 'They are sent to the billing email on the 1st of each month.',
  },
}

/** Open-by-default stories render in their own iframe so the modal does not cover the docs page. */
const openInDocs = { docs: { story: { inline: false, iframeHeight: 520 } } }

const meta = {
  title: 'Patterns/Callout',
  component: Callout,
  subcomponents: { StaleDataCallout },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Inline tinted message that stays on screen with the section it describes: `info` for guidance, `warning` for something that needs attention, `destructive` for a failure (announced as an alert), `success` for a lasting positive outcome, `neutral` for a side note. Use `size="sm"` for compact errors under form fields or inside dialogs, `variant="banner"` for a flush strip at the top of a card or panel, and `actionsPlacement="end"` for a single Retry-style action on the right. `StaleDataCallout` is the ready-made warning for a failed background refresh while older data is still shown. For transient feedback use the Toaster; for empty collections use EmptyState.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
  args: {
    tone: 'info',
    size: 'md',
    variant: 'box',
    actionsPlacement: 'bottom',
    title: 'Two-factor authentication is off',
    children: 'Members can sign in with a password only. Require 2FA in the security settings to protect this workspace.',
    onAction: fn(),
    onRetry: fn(),
  },
  argTypes: {
    tone: { control: 'inline-radio', options: tones },
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    variant: { control: 'inline-radio', options: ['box', 'banner'] },
    actionsPlacement: { control: 'inline-radio', options: ['bottom', 'end'] },
    title: { control: 'text' },
    children: { control: 'text' },
    role: { control: 'text' },
    icon: { control: false },
    actions: { control: false },
    onAction: { control: false },
    onRetry: { control: false },
    // StaleDataCallout-only: shown in the StaleDataCallout stories below.
    error: hidden,
    retrying: hidden,
    retryLabel: hidden,
  },
  render: (args) => <Callout {...toCalloutProps(args)} />,
} satisfies Meta<CalloutStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

/** Driven by the controls: switch tone, size, variant and role. The icon follows the tone. */
export const Default: Story = {}

/** Every tone with its default icon (`neutral` has none). The `size` and `variant` controls apply to all. */
export const AllTones: Story = {
  render: ({ size, variant }) => (
    <div className="flex flex-col gap-3">
      {tones.map((tone) => (
        <Callout key={tone} tone={tone} size={size} variant={variant} title={toneExample[tone].title}>
          {toneExample[tone].body}
        </Callout>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('note')).toHaveLength(4)
    await expect(canvas.getByRole('alert')).toHaveTextContent('The last payment failed')
    await expect(canvasElement.querySelectorAll('[data-icon]')).toHaveLength(4)
  },
}

/** `md` for sections and cards; `sm` for compact messages in forms and dialogs (body in the main foreground). */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="mono-label text-foreground-lighter">size=&quot;md&quot;</span>
        <Callout tone="warning" title="This invoice is overdue">
          It was due on March 3. Reminders are sent to the customer every 7 days.
        </Callout>
      </div>
      <div className="flex flex-col gap-2">
        <span className="mono-label text-foreground-lighter">size=&quot;sm&quot;</span>
        <Callout tone="destructive" size="sm">
          The tax ID does not match the format expected for Germany.
        </Callout>
      </div>
      <div className="flex flex-col gap-2">
        <span className="mono-label text-foreground-lighter">size=&quot;sm&quot; with a title</span>
        <Callout tone="destructive" size="sm" title="The import file was rejected">
          <span className="font-mono text-[12.5px]">Row 14: unknown column &quot;amount_usd&quot;</span>
        </Callout>
      </div>
    </div>
  ),
}

const activity = [
  { who: 'Maya Chen', what: 'approved invoice INV-2041', when: '2 min ago' },
  { who: 'Liam Novak', what: 'invited ines@acme.com to Billing', when: '14 min ago' },
  { who: 'Ines Duarte', what: 'rotated the analytics API key', when: '1 h ago' },
]

/** `variant="banner"`: a flush strip at the top of a card or panel, message in the tone colour. */
export const Banner: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-lg border bg-surface-100 shadow-card">
        <div className="flex items-center justify-between border-b px-4 py-2.5">
          <span className="text-sm font-medium text-foreground">Activity</span>
          <Badge>Paused</Badge>
        </div>
        <Callout variant="banner" tone="destructive" icon={false}>
          The live feed disconnected. New events appear again once the connection is restored.
        </Callout>
        <ul className="divide-y text-[13px]">
          {activity.map((item) => (
            <li key={item.what} className="flex items-center justify-between gap-4 px-4 py-2.5">
              <span className="min-w-0 truncate text-foreground-light">
                <span className="font-medium text-foreground">{item.who}</span> {item.what}
              </span>
              <span className="shrink-0 text-xs text-foreground-lighter">{item.when}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="overflow-hidden rounded-lg border">
        {tones.map((tone) => (
          <Callout key={tone} variant="banner" tone={tone} className="last:border-b-0">
            {toneExample[tone].title}.
          </Callout>
        ))}
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const banners = canvasElement.querySelectorAll('[data-slot="callout"][data-variant="banner"]')
    await expect(banners).toHaveLength(6)
    await expect(within(canvasElement).getAllByRole('alert')[0]).toHaveTextContent('The live feed disconnected')
  },
}

/** `actions` sit under the text by default; keep them `size="tiny"`. */
export const WithActions: Story = {
  args: {
    tone: 'warning',
    title: 'This document was changed by someone else',
    children: 'Saving now replaces their changes with yours.',
  },
  render: (args) => (
    <Callout
      {...toCalloutProps(args)}
      actions={
        <>
          <Button size="tiny" onClick={args.onAction}>
            Discard my edits and reload
          </Button>
          <Button size="tiny" variant="ghost">
            Compare versions
          </Button>
        </>
      }
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('note')).toHaveTextContent('This document was changed by someone else')
    await userEvent.click(canvas.getByRole('button', { name: 'Discard my edits and reload' }))
    await expect(args.onAction).toHaveBeenCalledOnce()
  },
}

/** `actionsPlacement="end"`: one short action on the right (stacked under the text on phones). */
export const ActionsAtEnd: Story = {
  render: ({ onAction, onRetry }) => (
    <div className="flex flex-col gap-4">
      <Callout
        tone="destructive"
        title="Could not load invoices"
        actionsPlacement="end"
        actions={
          <Button size="tiny" icon={<RefreshCw />} onClick={onRetry}>
            Retry
          </Button>
        }
      >
        The billing service did not answer in time (504 Gateway Timeout).
      </Callout>
      <Callout
        tone="destructive"
        size="sm"
        title="The import file was rejected"
        actionsPlacement="end"
        actions={
          <Button size="tiny" onClick={onAction}>
            Show row 14
          </Button>
        }
      >
        <span className="font-mono text-[12.5px]">Row 14: unknown column &quot;amount_usd&quot;</span>
      </Callout>
      <Callout
        tone="info"
        actionsPlacement="end"
        actions={
          <Button size="tiny" onClick={onAction}>
            Review
          </Button>
        }
      >
        3 new members are waiting for approval.
      </Callout>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    // The icon stays a direct child of the root (beside the text at every width); only the text and
    // the action stack on phones, inside `callout-body`.
    for (const callout of canvasElement.querySelectorAll('[data-slot="callout"]')) {
      await expect(callout.firstElementChild).toHaveAttribute('data-slot', 'callout-icon')
      await expect(callout).not.toHaveClass('flex-col')
      const body = callout.querySelector('[data-slot="callout-body"]')
      await expect(body?.querySelector('[data-slot="callout-content"]')).not.toBeNull()
      await expect(body?.querySelector('[data-slot="callout-actions"]')).not.toBeNull()
    }
    await userEvent.click(canvas.getByRole('button', { name: 'Retry' }))
    await expect(args.onRetry).toHaveBeenCalledOnce()
    await userEvent.click(canvas.getByRole('button', { name: 'Show row 14' }))
    await expect(args.onAction).toHaveBeenCalledOnce()
  },
}

/** Title only, for a one-line status. */
export const TitleOnly: Story = {
  args: { tone: 'success', title: 'Your domain is verified', children: undefined },
}

/** Body only, for a plain sentence of guidance. */
export const BodyOnly: Story = {
  args: {
    tone: 'neutral',
    title: undefined,
    children: 'Invoices are generated on the 1st of each month and sent to the billing email.',
  },
}

/** `icon={false}` hides the tone icon; the text then aligns with the box padding. */
export const NoIcon: Story = {
  args: { icon: false },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[data-icon]')).toBeNull()
  },
}

/** Any Lucide icon replaces the tone's default one and keeps the tone colour. */
export const CustomIcon: Story = {
  args: {
    tone: 'success',
    icon: <ShieldCheck />,
    title: 'Single sign-on is enforced',
    children: 'Members of acme.com must sign in through your identity provider.',
  },
}

/** `role` overrides the default (`alert` for destructive, `note` otherwise), e.g. `status` for a polite live update. */
export const RoleOverride: Story = {
  args: {
    tone: 'success',
    role: 'status',
    title: 'All changes saved',
    children: 'Edits to this page are saved automatically as you type.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('status')).toHaveTextContent('All changes saved')
    await expect(canvas.queryByRole('note')).toBeNull()
  },
}

/** Long titles and unbroken technical messages wrap inside the box. */
export const LongText: Story = {
  args: {
    tone: 'destructive',
    title: 'The payment for invoice INV-2041 could not be captured and the subscription was moved to past due',
    children: (
      <span className="font-mono text-[12.5px] whitespace-pre-wrap">
        card_declined: The card issuer declined the charge of $1,250.00 for invoice INV-2041
        (reason=insufficient_funds, request_id=req_8f3a9c1e7b2d4a6f9e0c5b1d3a7f2e8c4b6d9a0e1f2c3b4a5d6e7f8a9b0c1d2e3).
        Ask the customer to use another payment method or retry after the issuer confirms the charge.
      </span>
    ),
  },
  // The message is an element: a text control would replace it with a string.
  argTypes: { children: { control: false } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toHaveTextContent('could not be captured')
  },
}

const takenSlugs = ['marketing-site', 'docs']

function RenameProjectDialog({ onSubmit }: { onSubmit?: () => void }) {
  const [slug, setSlug] = React.useState('marketing-site')
  const [error, setError] = React.useState<string | null>(null)
  const errorId = React.useId()

  return (
    <Dialog defaultOpen>
      <DialogContent size="md">
        <form
          className="flex min-h-0 flex-col"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit?.()
            const value = slug.trim()
            setError(takenSlugs.includes(value) ? `A project with the slug “${value}” already exists in this workspace.` : null)
          }}
        >
          <DialogHeader>
            <DialogTitle>Rename project</DialogTitle>
            <DialogDescription>The slug appears in every link to this project.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="flex flex-col gap-2">
              <Label htmlFor="project-slug">Slug</Label>
              <Input
                id="project-slug"
                mono
                value={slug}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                onChange={(event) => setSlug(event.target.value)}
              />
            </div>
            {error && (
              <Callout id={errorId} tone="destructive" size="sm">
                {error}
              </Callout>
            )}
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/** Composition: `size="sm"` destructive callout under the fields of a dialog after a failed submit. */
export const InDialogFormError: Story = {
  parameters: openInDocs,
  render: ({ onAction }) => <RenameProjectDialog onSubmit={onAction} />,
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const dialog = await body.findByRole('dialog', { name: 'Rename project' })
    await expect(within(dialog).queryByRole('alert')).toBeNull()
    await userEvent.click(within(dialog).getByRole('button', { name: 'Save' }))
    const alert = await within(dialog).findByRole('alert')
    await expect(alert).toHaveTextContent('already exists in this workspace')
    await expect(alert).toHaveAttribute('data-size', 'sm')
    await expect(within(dialog).getByLabelText('Slug')).toHaveAttribute('aria-invalid', 'true')
    await expect(args.onAction).toHaveBeenCalledOnce()
  },
}

function DeleteBoardConfirmation({ onConfirm }: { onConfirm?: () => void }) {
  const [force, setForce] = React.useState(false)
  const checkboxId = React.useId()

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-surface-100 p-5 shadow-card">
      <div className="flex flex-col gap-1">
        <p className="text-base font-medium text-foreground">Delete the “Q3 roadmap” board?</p>
        <p className="text-[13px] text-foreground-light">The board, its 42 cards and their comments are removed for everyone.</p>
      </div>
      <Callout tone="warning" size="sm" icon={false}>
        <div className="flex items-start gap-2.5">
          <Checkbox id={checkboxId} checked={force} onCheckedChange={(checked) => setForce(checked === true)} className="mt-0.5" />
          <Label htmlFor={checkboxId} className="flex-col items-start gap-0.5 text-[13px] leading-normal font-normal">
            <span className="font-medium text-foreground">Delete even though 3 automations use it</span>
            <span className="text-foreground-light">Those automations stop running until you point them to another board.</span>
          </Label>
        </div>
      </Callout>
      <div className="flex justify-end gap-2">
        <Button>Cancel</Button>
        <Button variant="destructive-solid" disabled={!force} onClick={onConfirm}>
          Delete board
        </Button>
      </div>
    </div>
  )
}

/** Composition: `size="sm"` warning without icon wrapping a Checkbox + Label that unlocks a destructive action. */
export const CheckboxConfirmation: Story = {
  render: ({ onAction }) => <DeleteBoardConfirmation onConfirm={onAction} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const confirm = canvas.getByRole('button', { name: 'Delete board' })
    await expect(confirm).toBeDisabled()
    await userEvent.click(canvas.getByRole('checkbox'))
    await expect(canvas.getByRole('checkbox')).toBeChecked()
    await expect(confirm).toBeEnabled()
    await userEvent.click(confirm)
    await expect(args.onAction).toHaveBeenCalledOnce()
  },
}

/* ---------------------------------------------------------------------------------------------- */
/* StaleDataCallout                                                                                */
/* ---------------------------------------------------------------------------------------------- */

/** Controls for the StaleDataCallout stories: its own props on, the ones it fixes (tone, icon, actions) off. */
const staleDataArgTypes = {
  error: { control: 'text', table: { disable: false } },
  retrying: { control: 'boolean', table: { disable: false } },
  retryLabel: { control: 'text', table: { disable: false } },
  tone: hidden,
  icon: hidden,
  actions: hidden,
  onAction: hidden,
} as const

const staleDataStory = {
  argTypes: staleDataArgTypes,
  render: ({ error, onRetry, retrying, retryLabel, title, children, size, variant, actionsPlacement, className }) => (
    <StaleDataCallout
      error={error}
      onRetry={onRetry ?? (() => {})}
      retrying={retrying}
      retryLabel={retryLabel}
      title={title}
      size={size}
      variant={variant}
      actionsPlacement={actionsPlacement}
      className={className}
    >
      {children}
    </StaleDataCallout>
  ),
} satisfies Story

/**
 * `StaleDataCallout`: a background refresh failed; the older data stays on screen under it. The message
 * comes from `error` (an `Error`, a string, anything). Its controls drive this story.
 */
export const StaleData: Story = {
  ...staleDataStory,
  args: {
    title: undefined,
    children: undefined,
    error: 'Network request failed (503 Service Unavailable).',
    retrying: false,
    retryLabel: 'Retry',
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('note')).toHaveTextContent(
      'This data may be out of date. Refreshing failed: Network request failed',
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Retry' }))
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}

/** `retrying` puts a spinner on Retry (and disables it) while the new attempt runs. */
export const StaleDataRetrying: Story = {
  ...staleDataStory,
  args: { ...StaleData.args, retrying: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Retry' })).toBeDisabled()
  },
}

/** `children` replace the default sentence (say how old the data is); `title` adds a bold first line. */
export const StaleDataCustomMessage: Story = {
  ...staleDataStory,
  args: {
    title: 'Orders may be out of date',
    children: 'Showing orders as of 10:42. The orders service did not answer in time.',
    error: new Error('Gateway timeout'),
    retryLabel: 'Refresh now',
  },
  play: async ({ canvasElement }) => {
    const note = within(canvasElement).getByRole('note')
    await expect(note).toHaveTextContent('Showing orders as of 10:42.')
    await expect(note).not.toHaveTextContent('Gateway timeout')
    await expect(within(canvasElement).getByRole('button', { name: 'Refresh now' })).toBeEnabled()
  },
}

const orders = [
  { id: 'ORD-1042', customer: 'Northwind Traders', status: 'Shipped', total: '$1,250.00' },
  { id: 'ORD-1043', customer: 'Acme Corporation', status: 'Processing', total: '$348.00' },
  { id: 'ORD-1044', customer: 'Globex', status: 'Delivered', total: '$92.50' },
]

/** Composition: the callout sits above the stale table, which stays readable. */
export const StaleDataAboveContent: Story = {
  render: ({ onRetry }) => (
    <div className="flex flex-col gap-4">
      <StaleDataCallout error="The orders service did not answer in time." onRetry={onRetry ?? (() => {})} />
      <Table aria-label="Orders">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-[13px]">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>
                <Badge>{order.status}</Badge>
              </TableCell>
              <TableCell className="tabular text-right">{order.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
}
