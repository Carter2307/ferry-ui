import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Send, Trash2 } from 'lucide-react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'

/** Story args: the `AlertDialog` root props plus a confirm callback wired to `AlertDialogAction`. */
type AlertDialogStoryArgs = React.ComponentProps<typeof AlertDialog> & {
  /** Called when the user clicks the confirm action. */
  onConfirm?: () => void
}

/** Open-by-default stories render in their own iframe so the modal does not cover the docs page. */
const openInDocs = { docs: { story: { inline: false, iframeHeight: 420 } } }

const meta = {
  title: 'Primitives/Alert Dialog',
  component: AlertDialog,
  subcomponents: {
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogPortal,
    AlertDialogOverlay,
  },
  parameters: {
    docs: {
      description: {
        component:
          'Blocking confirmation for destructive or irreversible actions: no outside-click dismiss, no close icon, focus starts on Cancel. Title it as a question, state the consequence in the description, and use `variant="destructive-solid"` on `AlertDialogAction` when the action destroys data; set `loading` on it while an async action runs. `AlertDialogPortal` + `AlertDialogOverlay` are already rendered by `AlertDialogContent`; use them only to build a custom panel. For forms or anything richer than two choices use `Dialog`.',
      },
    },
  },
  args: {
    onOpenChange: fn(),
    onConfirm: fn(),
  },
  argTypes: {
    open: { control: false, description: 'Controlled open state (use with `onOpenChange`).' },
    defaultOpen: { control: 'boolean', description: 'Initial open state when uncontrolled.' },
    onOpenChange: { control: false, description: 'Called with the next open state (trigger, Cancel, Action, Escape).' },
    onConfirm: { control: false, description: 'Story-only: wired to `AlertDialogAction` `onClick`.' },
    children: { control: false },
  },
  render: ({ onConfirm, ...args }) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" icon={<Trash2 />}>
          Delete project
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this project?</AlertDialogTitle>
          <AlertDialogDescription>
            The project “Marketing site” and all of its files will be permanently deleted. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive-solid" onClick={onConfirm}>
            Delete project
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
} satisfies Meta<AlertDialogStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

/** Destructive confirmation: `destructive` trigger, `destructive-solid` action. */
export const Default: Story = {}

/** Opened on load, for visual review. */
export const Open: Story = {
  args: { defaultOpen: true },
  parameters: openInDocs,
}

/** Non-destructive but consequential action: keep the default `primary` action variant. */
export const PrimaryAction: Story = {
  args: { defaultOpen: true },
  parameters: openInDocs,
  render: ({ onConfirm, ...args }) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger asChild>
        <Button icon={<Send />}>Send invoice</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Send invoice INV-2041?</AlertDialogTitle>
          <AlertDialogDescription>
            Northwind Traders will receive the invoice by email and it can no longer be edited.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Not yet</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Send invoice</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

/**
 * `AlertDialogCancel` and `AlertDialogAction` take Button's `variant` and `size`: here a `ghost`
 * Cancel and both buttons at `size="md"` (34px) instead of the default `sm` (30px). Keep both
 * buttons the same size.
 */
export const ActionSizes: Story = {
  args: { defaultOpen: true },
  parameters: openInDocs,
  render: ({ onConfirm, ...args }) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger asChild>
        <Button>Sign out everywhere</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign out of all devices?</AlertDialogTitle>
          <AlertDialogDescription>
            Every other session of your account ends now. You stay signed in on this device.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="ghost" size="md">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction size="md" onClick={onConfirm}>
            Sign out everywhere
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

/** `AlertDialogBody` lists what will be affected when the description alone is not enough. */
export const WithConsequences: Story = {
  args: { defaultOpen: true },
  parameters: openInDocs,
  render: ({ onConfirm, ...args }) => (
    <AlertDialog {...args}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove 3 members?</AlertDialogTitle>
          <AlertDialogDescription>They lose access to every project in this workspace immediately.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogBody className="gap-0 py-2">
          {[
            ['Ada Park', 'ada@example.com', 'Admin'],
            ['Liam Chen', 'liam@example.com', 'Developer'],
            ['Sofia Rossi', 'sofia@example.com', 'Viewer'],
          ].map(([name, email, role]) => (
            <div key={email} className="flex items-center justify-between gap-3 border-b py-2 last:border-b-0">
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-[13px] font-medium text-foreground">{name}</span>
                <span className="truncate text-xs text-foreground-lighter">{email}</span>
              </div>
              <span className="text-xs text-foreground-light">{role}</span>
            </div>
          ))}
        </AlertDialogBody>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive-solid" onClick={onConfirm}>
            Remove members
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

const archivedProjects = Array.from({ length: 24 }, (_, i) => ({
  name: ['Marketing site', 'Customer portal', 'Billing service', 'Mobile app', 'Docs', 'Analytics'][i % 6] + ` ${Math.floor(i / 6) + 1}`,
  updated: `${i + 3} months ago`,
}))

/** Long list in `AlertDialogBody`: only the body scrolls, the title and the actions stay visible. */
export const LongContent: Story = {
  args: { defaultOpen: true },
  parameters: { docs: { story: { inline: false, iframeHeight: 520 } } },
  render: ({ onConfirm, ...args }) => (
    <AlertDialog {...args}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {archivedProjects.length} archived projects?</AlertDialogTitle>
          <AlertDialogDescription>Their files and history will be permanently deleted.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogBody className="gap-0 py-2">
          {archivedProjects.map((project) => (
            <div key={project.name} className="flex items-center justify-between gap-3 border-b py-2 last:border-b-0">
              <span className="truncate text-[13px] text-foreground">{project.name}</span>
              <span className="shrink-0 text-xs text-foreground-lighter">{project.updated}</span>
            </div>
          ))}
        </AlertDialogBody>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive-solid" onClick={onConfirm}>
            Delete {archivedProjects.length} projects
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

function TypeToConfirmDialog({ onConfirm, ...args }: AlertDialogStoryArgs) {
  const [value, setValue] = React.useState('')
  const expected = 'acme-production'
  return (
    <AlertDialog {...args}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" icon={<Trash2 />}>
          Delete workspace
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete workspace?</AlertDialogTitle>
          <AlertDialogDescription>
            All projects, members and invoices of this workspace will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogBody>
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm-name">
              Type <span className="font-mono text-destructive">{expected}</span> to confirm
            </Label>
            <Input
              id="confirm-name"
              mono
              autoComplete="off"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </div>
        </AlertDialogBody>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive-solid" disabled={value !== expected} onClick={onConfirm}>
            Delete workspace
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/** High-stakes deletion: the action unlocks only once the user types the exact name. */
export const TypeToConfirm: Story = {
  render: (args) => <TypeToConfirmDialog {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Delete workspace' }))
    const dialog = await body.findByRole('alertdialog', { name: 'Delete workspace?' })
    const confirm = within(dialog).getByRole('button', { name: 'Delete workspace' })
    await expect(confirm).toBeDisabled()
    await userEvent.type(within(dialog).getByRole('textbox'), 'acme-production')
    await expect(confirm).toBeEnabled()
    await userEvent.click(confirm)
    await expect(args.onConfirm).toHaveBeenCalledOnce()
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'closed'))
  },
}

function AsyncConfirmDialog({ onConfirm, onOpenChange, ...args }: AlertDialogStoryArgs) {
  const [open, setOpen] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const handleOpenChange = (next: boolean) => {
    if (pending) return
    setOpen(next)
    onOpenChange?.(next)
  }
  const handleConfirm = (event: React.MouseEvent) => {
    // Keep the dialog open until the request settles.
    event.preventDefault()
    setPending(true)
    window.setTimeout(() => {
      onConfirm?.()
      setPending(false)
      setOpen(false)
      onOpenChange?.(false)
    }, 600)
  }
  return (
    <AlertDialog {...args} open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Revoke API key</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke this API key?</AlertDialogTitle>
          <AlertDialogDescription>
            Requests signed with “Analytics export” will start failing immediately.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive-solid" loading={pending} onClick={handleConfirm}>
            {pending ? 'Revoking…' : 'Revoke key'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/**
 * Async confirmation: `open` is controlled, the action calls `preventDefault()` so the dialog stays
 * open, and `loading` shows the spinner and disables it until the request settles.
 */
export const AsyncConfirm: Story = {
  render: (args) => <AsyncConfirmDialog {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Revoke API key' }))
    const dialog = await body.findByRole('alertdialog')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Revoke key' }))
    const busy = within(dialog).getByRole('button', { name: 'Revoking…' })
    await expect(busy).toBeDisabled()
    await expect(busy).toHaveAttribute('aria-busy', 'true')
    await expect(within(dialog).getByRole('button', { name: 'Cancel' })).toBeDisabled()
    await waitFor(() => expect(args.onConfirm).toHaveBeenCalledOnce(), { timeout: 2000 })
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'closed'))
  },
}

/** Cancel closes without calling the action; focus starts on Cancel when the dialog opens. */
export const CancelInteraction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Delete project' }))
    const dialog = await body.findByRole('alertdialog', { name: 'Delete this project?' })
    await expect(dialog).toHaveAttribute('data-state', 'open')
    const cancel = within(dialog).getByRole('button', { name: 'Cancel' })
    await waitFor(() => expect(cancel).toHaveFocus())
    await userEvent.click(cancel)
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'closed'))
    await expect(args.onConfirm).not.toHaveBeenCalled()
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
  },
}

/** The action runs its callback and closes the dialog. */
export const ConfirmInteraction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Delete project' }))
    const dialog = await body.findByRole('alertdialog', { name: 'Delete this project?' })
    await userEvent.click(within(dialog).getByRole('button', { name: 'Delete project' }))
    await expect(args.onConfirm).toHaveBeenCalledOnce()
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'closed'))
  },
}

/** Escape cancels, like the Cancel button. */
export const CloseWithEscape: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Delete project' }))
    const dialog = await body.findByRole('alertdialog', { name: 'Delete this project?' })
    await expect(dialog).toHaveAttribute('data-state', 'open')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'closed'))
    await expect(args.onConfirm).not.toHaveBeenCalled()
  },
}
