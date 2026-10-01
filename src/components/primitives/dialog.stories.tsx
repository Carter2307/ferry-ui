import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AlertTriangle, KeyRound, Pencil, UserPlus } from 'lucide-react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Button } from './button'
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from './dialog'
import { Input } from './input'
import { Label } from './label'
import { Switch } from './switch'
import { Textarea } from './textarea'

/** Story args: the `Dialog` root props plus the options of `DialogContent`. */
type DialogStoryArgs = React.ComponentProps<typeof Dialog> &
  Pick<React.ComponentProps<typeof DialogContent>, 'size' | 'showCloseButton' | 'closeLabel'>

type DialogSize = NonNullable<DialogStoryArgs['size']>

const sizes: DialogSize[] = ['sm', 'md', 'lg', 'xl', 'xxl']

/** Open-by-default stories render in their own iframe so the modal does not cover the docs page. */
const openInDocs = { docs: { story: { inline: false, iframeHeight: 560 } } }

function ProjectFields() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor="project-name">Project name</Label>
        <Input id="project-name" defaultValue="Marketing site" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="project-description">Description</Label>
        <Textarea id="project-description" defaultValue="Public website and blog for the spring campaign." />
      </div>
    </>
  )
}

const meta = {
  title: 'Primitives/Dialog',
  component: Dialog,
  subcomponents: {
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogBody,
    DialogFooter,
    DialogClose,
    DialogPortal,
    DialogOverlay,
  },
  parameters: {
    docs: {
      description: {
        component:
          'Centered modal for focused tasks such as forms and settings. Compose `DialogContent` from `DialogHeader` (title + description), `DialogBody` (the only scrolling part) and `DialogFooter` (Cancel first, primary action last); pick `size` from the content width. `DialogPortal` + `DialogOverlay` are only needed to build a custom panel. To confirm a destructive action use `AlertDialog` instead; for side panels use `Sheet`.',
      },
    },
  },
  args: {
    size: 'md',
    showCloseButton: true,
    closeLabel: 'Close',
    modal: true,
    onOpenChange: fn(),
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: sizes,
      description: 'DialogContent max width: sm 384px, md 448px, lg 512px, xl 672px, xxl 896px.',
      table: { category: 'DialogContent', defaultValue: { summary: 'md' } },
    },
    showCloseButton: {
      control: 'boolean',
      description: 'DialogContent: renders the top-right close (X) button.',
      table: { category: 'DialogContent', defaultValue: { summary: 'true' } },
    },
    closeLabel: {
      control: 'text',
      description: 'DialogContent: accessible name of the built-in close (X) button, for translation.',
      table: { category: 'DialogContent', defaultValue: { summary: 'Close' } },
    },
    open: { control: false, description: 'Controlled open state (use with `onOpenChange`).' },
    defaultOpen: { control: 'boolean', description: 'Initial open state when uncontrolled.' },
    modal: { control: 'boolean', description: 'Blocks interaction with the page and traps focus. Keep `true`.' },
    onOpenChange: { control: false, description: 'Called with the next open state (trigger, Escape, outside click, close buttons).' },
    children: { control: false },
  },
  render: ({ size, showCloseButton, closeLabel, ...args }) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button icon={<Pencil />}>Edit project</Button>
      </DialogTrigger>
      <DialogContent size={size} showCloseButton={showCloseButton} closeLabel={closeLabel}>
        <DialogHeader>
          <DialogTitle>Edit project</DialogTitle>
          <DialogDescription>Update the name and description shown to your team.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <ProjectFields />
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="primary">Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
} satisfies Meta<DialogStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Opened on load, for visual review. */
export const Open: Story = {
  args: { defaultOpen: true },
  parameters: openInDocs,
}

/** The three sections of `DialogContent`, each labelled with the component that renders it. */
export const Anatomy: Story = {
  args: { defaultOpen: true },
  parameters: openInDocs,
  render: ({ size, showCloseButton, closeLabel, ...args }) => (
    <Dialog {...args}>
      <DialogContent size={size} showCloseButton={showCloseButton} closeLabel={closeLabel}>
        <DialogHeader>
          <span className="mono-label text-primary">DialogHeader</span>
          <DialogTitle>DialogTitle: Invite team members</DialogTitle>
          <DialogDescription>DialogDescription: one sentence announced to screen readers.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <span className="mono-label text-primary">DialogBody</span>
          <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-border-stronger text-[13px] text-foreground-lighter">
            Form fields, lists or previews. Only this section scrolls.
          </div>
        </DialogBody>
        <DialogFooter className="sm:justify-between">
          <span className="mono-label text-primary">DialogFooter</span>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <DialogClose asChild>
              <Button>DialogClose</Button>
            </DialogClose>
            <Button variant="primary">Primary action</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/** One trigger per `size`; open each to compare widths. */
export const Sizes: Story = {
  render: ({ size: _size, showCloseButton, closeLabel, ...args }) => (
    <div className="flex flex-wrap items-center gap-2">
      {sizes.map((size) => (
        <Dialog key={size} {...args}>
          <DialogTrigger asChild>
            <Button>size=&quot;{size}&quot;</Button>
          </DialogTrigger>
          <DialogContent size={size} showCloseButton={showCloseButton} closeLabel={closeLabel}>
            <DialogHeader>
              <DialogTitle>Size {size}</DialogTitle>
              <DialogDescription>Max width applies from the sm breakpoint; phones always get full width.</DialogDescription>
            </DialogHeader>
            <DialogBody>
              <ProjectFields />
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  ),
}

/** `size="xxl"` holding a wide, read-only preview. */
export const ExtraLarge: Story = {
  args: { defaultOpen: true, size: 'xxl' },
  parameters: openInDocs,
  render: ({ size, showCloseButton, closeLabel, ...args }) => (
    <Dialog {...args}>
      <DialogContent size={size} showCloseButton={showCloseButton} closeLabel={closeLabel}>
        <DialogHeader>
          <DialogTitle>Invoice INV-2041</DialogTitle>
          <DialogDescription>Issued to Northwind Traders on March 3, 2026.</DialogDescription>
        </DialogHeader>
        <DialogBody className="gap-0 p-0">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-6 border-b bg-surface-75 px-5 py-2 text-xs text-foreground-lighter">
            <span>Item</span>
            <span className="text-right">Qty</span>
            <span className="text-right">Unit price</span>
            <span className="text-right">Amount</span>
          </div>
          {[
            ['Team plan (annual)', 12, 29, 348],
            ['Additional storage, 100 GB', 3, 10, 30],
            ['Priority support', 1, 120, 120],
          ].map(([item, qty, price, amount]) => (
            <div key={item} className="grid grid-cols-[1fr_auto_auto_auto] gap-x-6 border-b px-5 py-2.5 text-[13px]">
              <span className="text-foreground">{item}</span>
              <span className="tabular text-right text-foreground-light">{qty}</span>
              <span className="tabular text-right text-foreground-light">${price}.00</span>
              <span className="tabular text-right text-foreground">${amount}.00</span>
            </div>
          ))}
          <div className="flex justify-end gap-6 px-5 py-3 text-[13px]">
            <span className="text-foreground-light">Total</span>
            <span className="tabular font-medium text-foreground">$498.00</span>
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
          <Button variant="primary">Download PDF</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/** `showCloseButton={false}`: the footer must then offer a way out. */
export const WithoutCloseButton: Story = {
  args: { defaultOpen: true, showCloseButton: false },
  parameters: openInDocs,
}

/**
 * `closeLabel` names the built-in close (X) button for screen readers. The default is "Close":
 * pass the translation in a localized app (here French).
 */
export const TranslatedCloseLabel: Story = {
  args: { defaultOpen: true, closeLabel: 'Fermer' },
  parameters: openInDocs,
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const dialog = await body.findByRole('dialog', { name: 'Edit project' })
    await expect(within(dialog).queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    await userEvent.click(within(dialog).getByRole('button', { name: 'Fermer' }))
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'closed'))
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
  },
}

/** Long content: header and footer stay pinned while `DialogBody` scrolls. */
export const ScrollingBody: Story = {
  args: { defaultOpen: true, size: 'lg' },
  parameters: openInDocs,
  render: ({ size, showCloseButton, closeLabel, ...args }) => (
    <Dialog {...args}>
      <DialogContent size={size} showCloseButton={showCloseButton} closeLabel={closeLabel}>
        <DialogHeader>
          <DialogTitle>Terms of service</DialogTitle>
          <DialogDescription>Please read the updated terms before continuing.</DialogDescription>
        </DialogHeader>
        <DialogBody className="text-[13px] leading-relaxed text-foreground-light">
          {Array.from({ length: 14 }, (_, i) => (
            <p key={i}>
              <span className="font-medium text-foreground">Section {i + 1}. </span>
              The service is provided on a subscription basis. Fees are billed in advance for each billing period and
              are non-refundable except where required by law. You may cancel at any time from your billing settings.
            </p>
          ))}
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Decline</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="primary">Accept terms</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/** A dialog with a long, unbroken title wraps instead of running under the close button. */
export const LongTitle: Story = {
  args: { defaultOpen: true, size: 'sm' },
  parameters: openInDocs,
  render: ({ size, showCloseButton, closeLabel, ...args }) => (
    <Dialog {...args}>
      <DialogContent size={size} showCloseButton={showCloseButton} closeLabel={closeLabel}>
        <DialogHeader>
          <DialogTitle className="break-words">Rename quarterly-revenue-forecast-2026-final-v3-approved.xlsx</DialogTitle>
          <DialogDescription>The file keeps its sharing settings.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Input aria-label="File name" mono defaultValue="quarterly-revenue-forecast-2026-final-v3-approved.xlsx" />
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
          <Button variant="primary">Rename</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

function ControlledDialog({ size, showCloseButton, closeLabel, onOpenChange, ...args }: DialogStoryArgs) {
  const [open, setOpen] = React.useState(false)
  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    onOpenChange?.(next)
  }
  return (
    <div className="flex items-center gap-3">
      <Button onClick={() => handleOpenChange(true)}>Open from outside</Button>
      <span className="text-[13px] text-foreground-light">
        open: <span className="font-mono text-foreground">{String(open)}</span>
      </span>
      <Dialog {...args} open={open} onOpenChange={handleOpenChange}>
        <DialogContent size={size} showCloseButton={showCloseButton} closeLabel={closeLabel}>
          <DialogHeader>
            <DialogTitle>Controlled dialog</DialogTitle>
            <DialogDescription>No trigger: the parent owns `open` and updates it in `onOpenChange`.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => handleOpenChange(false)}>Close from state</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/** Controlled with `open` + `onOpenChange`, opened by a button that is not a `DialogTrigger`. */
export const Controlled: Story = {
  render: (args) => <ControlledDialog {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Open from outside' }))
    const dialog = await body.findByRole('dialog', { name: 'Controlled dialog' })
    await expect(dialog).toHaveAttribute('data-state', 'open')
    await userEvent.click(body.getByRole('button', { name: 'Close from state' }))
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'closed'))
    await expect(canvas.getByText('false')).toBeInTheDocument()
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
  },
}

function CreateApiKeyDialog({ size, showCloseButton, closeLabel, ...args }: DialogStoryArgs) {
  const [name, setName] = React.useState('')
  return (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button variant="primary" icon={<KeyRound />}>
          Create API key
        </Button>
      </DialogTrigger>
      <DialogContent size={size} showCloseButton={showCloseButton} closeLabel={closeLabel}>
        <DialogHeader>
          <DialogTitle>Create API key</DialogTitle>
          <DialogDescription>Keys grant access to your workspace data. You can revoke them at any time.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-2">
            <Label htmlFor="key-name">Name</Label>
            <Input
              id="key-name"
              placeholder="e.g. Analytics export"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <p className="text-xs text-foreground-lighter">Only used to recognise the key in the list.</p>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-md border px-3 py-2.5">
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="key-read-only">Read-only</Label>
              <span className="text-xs text-foreground-lighter">The key cannot create, update or delete records.</span>
            </div>
            <Switch id="key-read-only" defaultChecked />
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="primary" disabled={!name.trim()}>
              Create key
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** Realistic form: the primary action stays disabled until the required field is filled. */
export const CreateApiKey: Story = {
  render: (args) => <CreateApiKeyDialog {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Create API key' }))
    const dialog = await body.findByRole('dialog', { name: 'Create API key' })
    const submit = within(dialog).getByRole('button', { name: 'Create key' })
    await expect(submit).toBeDisabled()
    await userEvent.type(within(dialog).getByLabelText('Name'), 'Analytics export')
    await expect(submit).toBeEnabled()
    await userEvent.click(submit)
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'closed'))
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
  },
}

function InviteMemberDialog({ size, showCloseButton, closeLabel, onOpenChange, ...args }: DialogStoryArgs) {
  const [open, setOpen] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const handleOpenChange = (next: boolean) => {
    // Escape, outside clicks and the close buttons are ignored while the request runs.
    if (pending) return
    setOpen(next)
    if (!next) {
      setEmail('')
      setError(null)
    }
    onOpenChange?.(next)
  }
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setPending(true)
    setError(null)
    // Simulated request that fails, to show the inline error state.
    window.setTimeout(() => {
      setPending(false)
      setError(`${email} is already a member of this workspace.`)
    }, 600)
  }
  return (
    <Dialog {...args} open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button icon={<UserPlus />}>Invite member</Button>
      </DialogTrigger>
      <DialogContent size={size} showCloseButton={showCloseButton} closeLabel={closeLabel}>
        {/* `flex min-h-0 flex-col` keeps DialogBody scrolling inside the form. */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
          <DialogHeader>
            <DialogTitle>Invite a member</DialogTitle>
            <DialogDescription>They get an email with a link to join the workspace.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="flex flex-col gap-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                disabled={pending}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? 'invite-error' : undefined}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            {error && (
              <div
                id="invite-error"
                role="alert"
                className="flex items-start gap-2 rounded-md border border-destructive-border bg-destructive-soft p-3 text-[13px] text-foreground"
              >
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
                <span className="break-words">{error}</span>
              </div>
            )}
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={pending}>Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="primary" loading={pending}>
              Send invite
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Form submit with pending and error states: sections wrapped in a `<form>`, the submit `Button` shows
 * `loading`, `onOpenChange` ignores close requests while pending, and the failure renders inline.
 */
export const SubmitWithError: Story = {
  render: (args) => <InviteMemberDialog {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Invite member' }))
    const dialog = await body.findByRole('dialog', { name: 'Invite a member' })
    await userEvent.type(within(dialog).getByLabelText('Email'), 'ada@example.com')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Send invite' }))
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Send invite' })).toHaveAttribute('aria-busy', 'true'))
    await userEvent.keyboard('{Escape}')
    await expect(dialog).toHaveAttribute('data-state', 'open')
    const alert = await within(dialog).findByRole('alert', {}, { timeout: 2000 })
    await expect(alert).toHaveTextContent('ada@example.com is already a member of this workspace.')
    await expect(within(dialog).getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
  },
}

/**
 * Building blocks for a custom panel: `DialogPortal` + `DialogOverlay` around your own Radix
 * `Dialog.Content` (here a near full-screen preview). The section parts still work inside it.
 */
export const CustomContent: Story = {
  args: { defaultOpen: true },
  parameters: openInDocs,
  render: ({ size: _size, showCloseButton: _showCloseButton, closeLabel: _closeLabel, ...args }) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button>Open preview</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          data-slot="dialog-content"
          className="fixed inset-4 z-50 flex flex-col overflow-hidden rounded-lg border border-border-strong bg-popover text-popover-foreground shadow-overlay outline-none motion-safe:data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:animate-in data-[state=open]:fade-in-0"
        >
          <DialogHeader className="flex-row items-center justify-between pr-5">
            <div className="flex min-w-0 flex-col gap-1">
              <DialogTitle>Q3 roadmap.pdf</DialogTitle>
              <DialogDescription>Shared by Ada Park, 12 pages.</DialogDescription>
            </div>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogHeader>
          <DialogBody className="flex-1 items-center bg-surface-75">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className="flex aspect-[3/4] w-full max-w-sm shrink-0 items-center justify-center rounded-md border bg-background text-[13px] text-foreground-lighter shadow-card"
              >
                Page {i + 1}
              </div>
            ))}
          </DialogBody>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  ),
}

/** Opens from the trigger (focus moves to the first field), then closes with the Escape key. */
export const CloseWithEscape: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Edit project' }))
    const dialog = await body.findByRole('dialog', { name: 'Edit project' })
    await expect(dialog).toHaveAttribute('data-state', 'open')
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true)
    // Focus moves into the dialog (first field) and stays trapped there while it is open.
    await waitFor(() => expect(within(dialog).getByLabelText('Project name')).toHaveFocus())
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'closed'))
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
  },
}

/** Opens from the trigger, then closes with the built-in close (X) button. */
export const CloseWithButton: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Edit project' }))
    const dialog = await body.findByRole('dialog', { name: 'Edit project' })
    await expect(within(dialog).getByLabelText('Project name')).toHaveValue('Marketing site')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'closed'))
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
  },
}
