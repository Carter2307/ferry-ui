import type { Meta, StoryObj } from '@storybook/react-vite'
import type * as React from 'react'
import { Bold, Copy, Italic, Link2, RefreshCw, Search, Settings, Share2, Trash2, Underline } from 'lucide-react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

import { modKey } from '../../lib/platform'
import { Button } from './button'
import { Hint, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

type TooltipStoryArgs = React.ComponentProps<typeof Tooltip> & {
  /** Story-only: text rendered inside TooltipContent. */
  label: string
  /** Story-only: forwarded to TooltipContent `side`. */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Story-only: forwarded to TooltipContent `align`. */
  align?: 'start' | 'center' | 'end'
}

const meta = {
  title: 'Primitives/Tooltip',
  component: Tooltip,
  subcomponents: { TooltipTrigger, TooltipContent, TooltipProvider, Hint },
  parameters: {
    docs: {
      description: {
        component:
          'Short text label shown on hover and keyboard focus, on the raised popover surface with no arrow. Reach for `Hint` in the common case (icon-only buttons, truncated text); compose `Tooltip` + `TooltipTrigger` + `TooltipContent` for controlled state or custom positioning. Mount `TooltipProvider` once at the app root, and never put interactive or essential content in a tooltip.',
      },
    },
  },
  args: {
    label: 'Copy to clipboard',
    side: 'top',
    align: 'center',
    onOpenChange: fn(),
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    open: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
    delayDuration: { control: 'number' },
    children: { control: false },
  },
  render: ({ label, side, align, ...args }) => (
    <Tooltip {...args}>
      <TooltipTrigger asChild>
        <Button size="icon" aria-label="Copy" icon={<Copy />} />
      </TooltipTrigger>
      <TooltipContent side={side} align={align}>
        {label}
      </TooltipContent>
    </Tooltip>
  ),
} satisfies Meta<TooltipStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

/** Hover or focus the button to reveal the tooltip. */
export const Default: Story = {}

/** Forced open for visual review. */
export const Open: Story = {
  args: { defaultOpen: true },
  parameters: { layout: 'padded', docs: { story: { inline: false, iframeHeight: 140 } } },
  decorators: [
    (Story) => (
      <div className="flex justify-center pt-12">
        <Story />
      </div>
    ),
  ],
}

/** `side` places the bubble on any edge of the trigger; it flips automatically when there is no room. */
export const Sides: Story = {
  parameters: { docs: { story: { inline: false, iframeHeight: 260 } } },
  render: () => (
    <div className="grid grid-cols-2 gap-x-40 gap-y-16 p-12">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side} open>
          <TooltipTrigger asChild>
            <Button>{side}</Button>
          </TooltipTrigger>
          <TooltipContent side={side}>Tooltip on the {side}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
}

/** Long text wraps (balanced) past 20rem. Prefer a few words: a tooltip is not a place for paragraphs. */
export const LongContent: Story = {
  args: {
    defaultOpen: true,
    side: 'bottom',
    label:
      'Rotating this API key immediately invalidates the current one. Update every client that uses it before the next request.',
  },
  parameters: { docs: { story: { inline: false, iframeHeight: 180 } } },
  decorators: [
    (Story) => (
      <div className="flex justify-center pb-24">
        <Story />
      </div>
    ),
  ],
}

/** `Hint` is the one-liner for the common case. Icon-only buttons still need their own `aria-label`. */
export const HintHelper: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Hint label="Refresh">
        <Button size="icon" aria-label="Refresh" icon={<RefreshCw />} />
      </Hint>
      <Hint label="Settings" side="bottom">
        <Button size="icon" aria-label="Settings" icon={<Settings />} />
      </Hint>
      <Hint label="Delete project" side="right">
        <Button size="icon" variant="destructive" aria-label="Delete project" icon={<Trash2 />} />
      </Hint>
    </div>
  ),
}

/**
 * `TooltipProvider` sets the timing. The app-root provider (250ms) covers most cases; nest one with
 * `delayDuration={0}` so a dense toolbar answers instantly on hover.
 */
export const ProviderDelay: Story = {
  render: () => (
    <TooltipProvider delayDuration={0}>
      <div className="flex items-center gap-0.5 rounded-lg border bg-surface-100 p-1">
        <Hint label="Bold">
          <Button size="icon" variant="ghost" aria-label="Bold" icon={<Bold />} />
        </Hint>
        <Hint label="Italic">
          <Button size="icon" variant="ghost" aria-label="Italic" icon={<Italic />} />
        </Hint>
        <Hint label="Underline">
          <Button size="icon" variant="ghost" aria-label="Underline" icon={<Underline />} />
        </Hint>
      </div>
    </TooltipProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const italic = canvas.getByRole('button', { name: 'Italic' })
    await userEvent.hover(italic)
    await expect(await screen.findByRole('tooltip')).toHaveTextContent('Italic')
    // Close with Escape: closing on pointer leave depends on real pointer geometry (not in jsdom).
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(italic).toHaveAttribute('data-state', 'closed'))
  },
}

/** The label accepts any node, e.g. a keyboard shortcut next to the action name. */
export const WithShortcut: Story = {
  parameters: { docs: { story: { inline: false, iframeHeight: 140 } } },
  render: () => (
    <div className="pt-10">
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button icon={<Search />} className="w-56 justify-start text-foreground-lighter">
            Search…
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span className="flex items-center gap-2">
            Search everything
            <span className="font-mono text-[11px] tracking-widest text-foreground-lighter">{modKey} K</span>
          </span>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

/**
 * Disabled buttons fire no pointer events, so wrap them in a focusable span to explain why an
 * action is unavailable.
 */
export const OnDisabledButton: Story = {
  render: () => (
    <Hint label="Only workspace admins can delete projects">
      <span tabIndex={0} className="inline-flex rounded-md">
        <Button variant="destructive" icon={<Trash2 />} disabled>
          Delete project
        </Button>
      </span>
    </Hint>
  ),
}

const invoices = [
  { id: 'INV-2041', customer: 'Northwind Trading Company International Holdings', amount: '$4,200.00' },
  { id: 'INV-2042', customer: 'Acme Corp', amount: '$860.00' },
  { id: 'INV-2043', customer: 'Globex Logistics & Supply Chain Partners Ltd.', amount: '$12,940.50' },
]

/** Composition: reveal the full value of truncated cells without widening the layout. */
export const TruncatedText: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="w-80 divide-y rounded-lg border bg-card text-[13px]">
      {invoices.map((invoice) => (
        <div key={invoice.id} className="flex items-center gap-3 px-3 py-2">
          <span className="shrink-0 font-mono text-xs text-foreground-lighter">{invoice.id}</span>
          <Hint label={invoice.customer}>
            <span tabIndex={0} className="min-w-0 flex-1 truncate rounded-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {invoice.customer}
            </span>
          </Hint>
          <span className="tabular shrink-0 text-foreground-light">{invoice.amount}</span>
        </div>
      ))}
    </div>
  ),
}

/** Composition: an editor toolbar where every icon button carries a Hint. */
export const Toolbar: Story = {
  render: () => (
    <div className="flex items-center gap-0.5 rounded-lg border bg-surface-100 p-1">
      <Hint label="Bold">
        <Button size="icon" variant="ghost" aria-label="Bold" icon={<Bold />} />
      </Hint>
      <Hint label="Italic">
        <Button size="icon" variant="ghost" aria-label="Italic" icon={<Italic />} />
      </Hint>
      <Hint label="Underline">
        <Button size="icon" variant="ghost" aria-label="Underline" icon={<Underline />} />
      </Hint>
      <span className="mx-1 h-4 w-px bg-border" aria-hidden="true" />
      <Hint label="Insert link">
        <Button size="icon" variant="ghost" aria-label="Insert link" icon={<Link2 />} />
      </Hint>
      <Hint label="Share document">
        <Button size="icon" variant="ghost" aria-label="Share document" icon={<Share2 />} />
      </Hint>
    </div>
  ),
}

/** Keyboard users get the tooltip on focus; Escape dismisses it. */
export const KeyboardFocus: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Copy' })
    await userEvent.tab()
    await expect(trigger).toHaveFocus()
    const tooltip = await screen.findByRole('tooltip')
    await expect(tooltip).toHaveTextContent('Copy to clipboard')
    await expect(args.onOpenChange).toHaveBeenCalledWith(true)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(trigger).toHaveAttribute('data-state', 'closed'))
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
  },
}
