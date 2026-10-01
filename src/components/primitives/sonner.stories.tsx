import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

import { getErrorMessage } from '../../lib/errors'
import { Button } from './button'
import { Toaster, toast } from './sonner'

type ToasterStoryArgs = React.ComponentProps<typeof Toaster> & {
  /** Story-only: called when the "Undo" action of the action toast is clicked. */
  onUndo?: () => void
}

/** Resolves (or rejects) after `ms`, standing in for a network request. */
const fakeRequest = (ms: number, fail = false) =>
  new Promise<{ name: string }>((resolve, reject) =>
    setTimeout(() => (fail ? reject(new Error('Network error')) : resolve({ name: 'Q3 report' })), ms),
  )

function ToastButtons({ onUndo }: { onUndo?: () => void }) {
  return (
    <div className="flex max-w-xl flex-wrap gap-2">
      <Button onClick={() => toast('Event created', { description: 'Sprint review, Friday at 10:00' })}>
        Default
      </Button>
      <Button
        onClick={() => toast.success('Invoice sent', { description: 'INV-2041 was emailed to billing@northwind.com.' })}
      >
        Success
      </Button>
      <Button
        onClick={() => toast.error('Payment failed', { description: 'The card ending in 4242 was declined.' })}
      >
        Error
      </Button>
      <Button onClick={() => toast.warning('Your trial ends in 3 days', { description: 'Add a payment method to keep your projects.' })}>
        Warning
      </Button>
      <Button onClick={() => toast.info('A new version is available', { description: 'Reload the page to update.' })}>
        Info
      </Button>
      <Button
        onClick={() => {
          const id = toast.loading('Exporting members to CSV…')
          setTimeout(() => toast.success('Export ready', { id, description: '128 rows exported.' }), 2000)
        }}
      >
        Loading
      </Button>
      <Button
        onClick={() =>
          toast.promise(fakeRequest(1500), {
            loading: 'Saving changes…',
            success: (data) => `${data.name} saved`,
            error: 'Could not save changes',
          })
        }
      >
        Promise
      </Button>
      <Button
        onClick={() =>
          toast.promise(fakeRequest(1500, true), {
            loading: 'Uploading avatar…',
            success: 'Avatar updated',
            error: (err) => `Upload failed: ${getErrorMessage(err, 'unknown error')}`,
          })
        }
      >
        Promise (rejects)
      </Button>
      <Button
        onClick={() =>
          toast('Project archived', {
            description: 'Website redesign was moved to the archive.',
            action: { label: 'Undo', onClick: () => onUndo?.() },
          })
        }
      >
        With action
      </Button>
      <Button
        onClick={() =>
          toast('Remove 3 members?', {
            description: 'They lose access to every project in this workspace.',
            action: { label: 'Remove', onClick: () => {} },
            cancel: { label: 'Keep', onClick: () => {} },
          })
        }
      >
        Action + cancel
      </Button>
      <Button variant="ghost" onClick={() => toast.dismiss()}>
        Dismiss all
      </Button>
    </div>
  )
}

/**
 * Sonner replays still-active toasts to every newly mounted Toaster, so toasts fired in one story
 * would reappear in the next. Dismiss them all when a story mounts and unmounts.
 */
function ResetToasts({ children }: { children: React.ReactNode }) {
  React.useLayoutEffect(() => {
    toast.dismiss()
    return () => {
      toast.dismiss()
    }
  }, [])
  return children
}

const meta = {
  title: 'Primitives/Toaster',
  component: Toaster,
  parameters: {
    layout: 'padded',
    // Each story mounts its own Toaster: render them in separate frames so a toast fired in one
    // story never shows up in every Toaster on the docs page.
    docs: {
      story: { inline: false, iframeHeight: '360px' },
      description: {
        component:
          'Toast notifications (sonner) on the raised popover surface with a colored status icon. Mount `<Toaster />` once near the app root and fire `toast()`, `toast.success/error/warning/info/loading/promise()` anywhere, importing `toast` from this library (not from `sonner` directly) so calls always reach this Toaster. Use toasts for brief, non-blocking feedback; errors that need a decision belong in an alert dialog, persistent status in an inline alert.',
      },
    },
  },
  args: {
    position: 'bottom-right',
    expand: false,
    closeButton: true,
    visibleToasts: 3,
    duration: 4000,
    onUndo: fn(),
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'],
    },
    expand: { control: 'boolean' },
    closeButton: { control: 'boolean' },
    visibleToasts: { control: 'number' },
    duration: { control: 'number' },
    theme: { control: false },
    icons: { control: false },
    toastOptions: { control: false },
    style: { control: false },
    // Array / object options: the auto-inferred "object" control would set `{}` and crash sonner
    // (`hotkey.join is not a function`). Set them in code.
    hotkey: { control: false },
    swipeDirections: { control: false },
    offset: { control: false },
    mobileOffset: { control: false },
    onUndo: { control: false },
  },
  decorators: [
    (Story) => (
      <ResetToasts>
        <Story />
      </ResetToasts>
    ),
  ],
  render: ({ onUndo, ...args }) => (
    <>
      <Toaster {...args} />
      <ToastButtons onUndo={onUndo} />
    </>
  ),
} satisfies Meta<ToasterStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

/** Fire every toast type from the buttons; controls change the Toaster options. */
export const Default: Story = {}

/** Fires every toast type on mount (persistent, expanded) for visual review. */
function StatusShowcase() {
  React.useEffect(() => {
    // Fixed ids make re-mounts replace the same toasts instead of stacking duplicates.
    toast('Project archived', {
      id: 'showcase-action',
      duration: Infinity,
      description: 'Website redesign was moved to the archive.',
      action: { label: 'Undo', onClick: () => {} },
      cancel: { label: 'Dismiss', onClick: () => {} },
    })
    toast.loading('Exporting members to CSV…', { id: 'showcase-loading', duration: Infinity })
    toast.info('A new version is available', { id: 'showcase-info', duration: Infinity, description: 'Reload the page to update.' })
    toast.warning('Your trial ends in 3 days', { id: 'showcase-warning', duration: Infinity, description: 'Add a payment method to keep your projects.' })
    toast.error('Payment failed', { id: 'showcase-error', duration: Infinity, description: 'The card ending in 4242 was declined.' })
    toast.success('Invoice sent', { id: 'showcase-success', duration: Infinity, description: 'INV-2041 was emailed to billing@northwind.com.' })
  }, [])
  return null
}

/**
 * Every toast type stacked open (`expand`): success, error, warning, info and loading icons, plus
 * the action, cancel and close buttons, all visible at once.
 */
export const StatusTypes: Story = {
  args: { expand: true, visibleToasts: 6 },
  parameters: { docs: { story: { inline: false, iframeHeight: '560px' } } },
  render: ({ onUndo: _onUndo, ...args }) => (
    <>
      <Toaster {...args} />
      <StatusShowcase />
      <p className="text-[13px] text-foreground-light">Toasts are pinned open in the bottom-right corner.</p>
    </>
  ),
}

/** `position` moves the stack; top positions suit apps whose bottom edge holds a footer bar or chat widget. */
export const TopCenter: Story = {
  args: { position: 'top-center' },
}

/** Clicking a success button shows the toast with its title and description. */
export const ShowsToast: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Success' }))
    await expect(await screen.findByText('Invoice sent')).toBeInTheDocument()
    await expect(screen.getByText('INV-2041 was emailed to billing@northwind.com.')).toBeInTheDocument()
  },
}

/** An action button (keyboard-activated here) runs its callback and dismisses the toast. */
export const ActionToast: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'With action' }))
    await screen.findByText('Project archived')
    // Keyboard activation: pointer events on a toast start sonner's swipe handling (setPointerCapture),
    // which jsdom does not implement.
    const undo = await screen.findByRole('button', { name: 'Undo' })
    undo.focus()
    await userEvent.keyboard('{Enter}')
    await expect(args.onUndo).toHaveBeenCalledOnce()
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Undo' })).toBeNull())
  },
}

/**
 * `toastOptions` (and its `classNames`) given to the Toaster are merged with the design-system
 * defaults: here every toast lasts 8s and gets an extra class, and keeps the default styling.
 */
export const MergedToastOptions: Story = {
  args: { toastOptions: { duration: 8000, classNames: { toast: 'custom-toast' } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Info' }))
    const title = await screen.findByText('A new version is available')
    const item = title.closest('[data-sonner-toast]')
    await expect(item).toHaveClass('custom-toast')
    await expect(item).toHaveClass('!shadow-overlay')
  },
}
