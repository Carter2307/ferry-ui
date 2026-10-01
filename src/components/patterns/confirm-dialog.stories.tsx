import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AlertTriangle, KeyRound, Pause, Send, Trash2 } from 'lucide-react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Button } from '../primitives/button'
import { Checkbox } from '../primitives/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../primitives/table'

import { Callout } from './callout'
import { ConfirmDialog, type ConfirmDialogProps } from './confirm-dialog'

/** Open-by-default stories render in their own iframe so the modal does not cover the docs page. */
const openInDocs = { docs: { story: { inline: false, iframeHeight: 480 } } }

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const meta = {
  title: 'Patterns/Confirm Dialog',
  component: ConfirmDialog,
  parameters: {
    docs: {
      description: {
        component:
          'Ready-made confirmation for destructive or impactful actions. Pass an async `onConfirm`: the dialog shows a spinner, blocks dismissal, closes on success and shows the error inline on failure. Use `tone="destructive"` (default) for deletes, `warning` for disruptive but reversible actions, `primary` for consequential safe ones, and add `confirmText` (type the name) only for irreversible, high-impact deletes.',
      },
    },
  },
  args: {
    title: 'Delete project “Marketing site”?',
    description: 'All files, comments and share links of this project are permanently deleted. This cannot be undone.',
    confirmLabel: 'Delete project',
    cancelLabel: 'Cancel',
    tone: 'destructive',
    trigger: (
      <Button variant="destructive" icon={<Trash2 />}>
        Delete project
      </Button>
    ),
    onConfirm: fn(),
    onOpenChange: fn(),
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['destructive', 'warning', 'primary'] },
    title: { control: 'text' },
    description: { control: 'text' },
    confirmLabel: { control: 'text' },
    cancelLabel: { control: 'text' },
    confirmText: { control: 'text' },
    confirmTextLabel: { control: false },
    defaultOpen: { control: 'boolean' },
    open: { control: false },
    trigger: { control: false },
    children: { control: false },
    onConfirm: { control: false },
    onOpenChange: { control: false },
  },
  // `defaultOpen` is read once on mount: remount when the control flips so it takes effect.
  render: (args) => <ConfirmDialog key={args.defaultOpen ? 'open' : 'closed'} {...args} />,
} satisfies Meta<typeof ConfirmDialog>

export default meta
type Story = StoryObj<typeof meta>

/** Uncontrolled: the `trigger` opens it. Click the button to try it. */
export const Default: Story = {}

/** Opened on load, for visual review. Focus starts on Cancel so Enter never confirms by accident. */
export const Open: Story = {
  args: { defaultOpen: true },
  parameters: openInDocs,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const dialog = await body.findByRole('alertdialog', { name: 'Delete project “Marketing site”?' })
    await expect(dialog).toHaveAccessibleDescription(/permanently deleted/)
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Cancel' })).toHaveFocus())
  },
}

/**
 * Typed confirmation: the confirm button unlocks only once the exact name is typed. Focus starts in the
 * field, and Enter submits only when the text matches.
 */
export const TypedConfirmation: Story = {
  args: {
    defaultOpen: true,
    title: 'Delete workspace “acme-marketing”?',
    description: (
      <>
        <p>All projects, members, invoices and API keys of this workspace are permanently deleted.</p>
        <p>
          <strong className="font-medium text-foreground">This cannot be undone.</strong> Export your data first if
          you may need it later.
        </p>
      </>
    ),
    confirmText: 'acme-marketing',
    confirmLabel: 'Delete workspace',
    trigger: (
      <Button variant="destructive" icon={<Trash2 />}>
        Delete workspace
      </Button>
    ),
  },
  // The description is an element: a text control would replace it with a string.
  argTypes: { description: { control: false } },
  parameters: openInDocs,
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const dialog = await body.findByRole('alertdialog', { name: 'Delete workspace “acme-marketing”?' })
    const field = within(dialog).getByRole('textbox')
    const confirm = within(dialog).getByRole('button', { name: 'Delete workspace' })
    await waitFor(() => expect(field).toHaveFocus())
    await expect(confirm).toBeDisabled()
    await userEvent.type(field, 'acme-mark{Enter}')
    await expect(confirm).toBeDisabled()
    await expect(args.onConfirm).not.toHaveBeenCalled()
    await userEvent.type(field, 'eting')
    await expect(confirm).toBeEnabled()
    await userEvent.click(confirm)
    await expect(args.onConfirm).toHaveBeenCalledOnce()
    await waitFor(() => expect(body.queryByRole('alertdialog')).not.toBeInTheDocument())
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
  },
}

/** `confirmTextLabel` replaces the "Type … to confirm." sentence, e.g. to translate it. Include the text to type yourself. */
export const CustomConfirmTextLabel: Story = {
  args: {
    defaultOpen: true,
    title: 'Supprimer le projet « site-vitrine » ?',
    description: 'Tous les fichiers et commentaires du projet sont supprimés définitivement.',
    confirmText: 'site-vitrine',
    confirmTextLabel: (
      <>
        Saisissez <span className="font-mono font-medium text-foreground select-all">site-vitrine</span> pour confirmer.
      </>
    ),
    confirmLabel: 'Supprimer le projet',
    cancelLabel: 'Annuler',
    trigger: <Button variant="destructive">Supprimer le projet</Button>,
  },
  parameters: openInDocs,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const dialog = await body.findByRole('alertdialog')
    // The custom label still labels the field.
    await expect(within(dialog).getByRole('textbox', { name: 'Saisissez site-vitrine pour confirmer.' })).toBeInTheDocument()
  },
}

/** `warning` tone for a disruptive but reversible action; the safe button is renamed so it does not read "Cancel". */
export const WarningTone: Story = {
  args: {
    defaultOpen: true,
    tone: 'warning',
    title: 'Pause your subscription?',
    description:
      'Your team keeps read-only access to every project until you resume. Billing stops at the end of the current period.',
    confirmLabel: 'Pause subscription',
    cancelLabel: 'Keep subscription',
    trigger: <Button icon={<Pause />}>Pause subscription</Button>,
  },
  parameters: openInDocs,
}

/** `primary` tone for a consequential but safe action. */
export const PrimaryTone: Story = {
  args: {
    defaultOpen: true,
    tone: 'primary',
    title: 'Send invoice INV-2041?',
    description: 'Northwind Traders receives the invoice by email and it can no longer be edited.',
    confirmLabel: 'Send invoice',
    cancelLabel: 'Not yet',
    trigger: <Button icon={<Send />}>Send invoice</Button>,
  },
  parameters: openInDocs,
}

/** Title only: no description, no body; the panel collapses to header + footer. */
export const TitleOnly: Story = {
  args: {
    defaultOpen: true,
    tone: 'primary',
    title: 'Sign out of all other devices?',
    description: undefined,
    confirmLabel: 'Sign out',
    trigger: <Button>Sign out everywhere</Button>,
  },
  parameters: openInDocs,
}

/** `children` add content between the description and the actions: a warning callout and an opt-in checkbox. */
export const WithExtraContent: Story = {
  args: {
    defaultOpen: true,
    title: 'Remove Jonas Weber from the team?',
    description: 'Jonas loses access to every project of Northwind immediately. You can invite him again later.',
    confirmLabel: 'Remove member',
    trigger: <Button variant="destructive">Remove member</Button>,
    children: (
      <>
        <Callout tone="warning" icon={<AlertTriangle />} title="Jonas owns 3 projects">
          <ul className="mt-1 flex list-disc flex-col gap-0.5 pl-4">
            <li>Marketing site</li>
            <li>Mobile app</li>
            <li>Q3 analytics</li>
          </ul>
        </Callout>
        <label className="flex cursor-pointer items-start gap-2.5 text-[13px] text-foreground">
          <Checkbox defaultChecked className="mt-0.5" />
          <span>
            Transfer his projects to me <span className="text-foreground-light">(otherwise they are archived)</span>
          </span>
        </label>
      </>
    ),
  },
  parameters: openInDocs,
}

/** Long title, description and name: the title wraps, the name breaks anywhere, the body scrolls when needed. */
export const LongContent: Story = {
  args: {
    defaultOpen: true,
    title:
      'Delete the “Northwind Traders – Quarterly renewals and expansion forecast (EMEA, 2026)” project and all of its invoices?',
    description: (
      <>
        <p>
          The project, its 1,284 invoices, 36 scheduled reports and every comment posted in the last 90 days are
          permanently deleted. Shared links to it stop working and show an error.
        </p>
        <p>The 14 members of the project are notified by email.</p>
      </>
    ),
    confirmText: 'northwind-traders-quarterly-renewals-and-expansion-forecast-emea-2026',
    confirmLabel: 'Delete project',
    trigger: <Button variant="destructive">Delete project</Button>,
  },
  // The description is an element: a text control would replace it with a string.
  argTypes: { description: { control: false } },
  parameters: openInDocs,
}

/** Async `onConfirm`: spinner on the confirm button, Cancel disabled, then the dialog closes by itself. */
export const AsyncConfirm: Story = {
  args: {
    title: 'Revoke API key “Analytics export”?',
    description: 'Requests signed with this key start failing immediately.',
    confirmLabel: 'Revoke key',
    trigger: (
      <Button variant="destructive" icon={<KeyRound />}>
        Revoke key
      </Button>
    ),
    onConfirm: fn(() => wait(400)),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Revoke key' }))
    const dialog = await body.findByRole('alertdialog')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Revoke key' }))
    await expect(args.onConfirm).toHaveBeenCalledOnce()
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Revoke key' })).toHaveAttribute('aria-busy', 'true'))
    await expect(within(dialog).getByRole('button', { name: 'Cancel' })).toBeDisabled()
    await waitFor(() => expect(body.queryByRole('alertdialog')).not.toBeInTheDocument(), { timeout: 3000 })
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
  },
}

/** A rejected `onConfirm` keeps the dialog open and shows the error message inline, so the user can retry. */
export const ConfirmError: Story = {
  args: {
    defaultOpen: true,
    title: 'Delete team “Design”?',
    description: 'The team is removed; its members keep their accounts.',
    confirmLabel: 'Delete team',
    trigger: <Button variant="destructive">Delete team</Button>,
    onConfirm: fn(async () => {
      await wait(50)
      throw new Error('This team still owns 2 projects. Transfer or archive them first.')
    }),
  },
  parameters: openInDocs,
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const dialog = await body.findByRole('alertdialog', { name: 'Delete team “Design”?' })
    await userEvent.click(within(dialog).getByRole('button', { name: 'Delete team' }))
    const alert = await within(dialog).findByRole('alert')
    await expect(alert).toHaveTextContent('This team still owns 2 projects.')
    await expect(args.onConfirm).toHaveBeenCalledOnce()
    await expect(body.getByRole('alertdialog')).toBeInTheDocument()
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Delete team' })).toBeEnabled())
  },
}

/** Cancel (or Escape) closes without running the action. */
export const CancelInteraction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Delete project' }))
    const dialog = await body.findByRole('alertdialog')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(body.queryByRole('alertdialog')).not.toBeInTheDocument())
    await userEvent.click(canvas.getByRole('button', { name: 'Delete project' }))
    await body.findByRole('alertdialog')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('alertdialog')).not.toBeInTheDocument())
    await expect(args.onConfirm).not.toHaveBeenCalled()
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
  },
}

/** A double-click on the confirm button runs the action once: clicks are ignored while the panel animates out. */
export const DoubleClickRunsOnce: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Delete project' }))
    const dialog = await body.findByRole('alertdialog')
    await userEvent.dblClick(within(dialog).getByRole('button', { name: 'Delete project' }))
    await waitFor(() => expect(body.queryByRole('alertdialog')).not.toBeInTheDocument())
    await expect(args.onConfirm).toHaveBeenCalledOnce()
  },
}

type ApiKey = { id: string; name: string; prefix: string; lastUsed: string }

const initialKeys: ApiKey[] = [
  { id: 'k1', name: 'Analytics export', prefix: 'sk_live_4f9a', lastUsed: '2 min ago' },
  { id: 'k2', name: 'Billing webhook', prefix: 'sk_live_81c2', lastUsed: '1 hour ago' },
  { id: 'k3', name: 'CI pipeline', prefix: 'sk_test_0b7e', lastUsed: 'Yesterday' },
]

function ApiKeysExample({ onConfirm, onOpenChange }: Pick<ConfirmDialogProps, 'onConfirm' | 'onOpenChange'>) {
  const [keys, setKeys] = React.useState(initialKeys)
  // Keep the target separate from `open` so the title does not go blank during the close animation.
  const [target, setTarget] = React.useState<ApiKey | null>(null)
  const [open, setOpen] = React.useState(false)
  return (
    <div className="w-[560px] max-w-full">
      <Table aria-label="API keys">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Name</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Last used</TableHead>
            <TableHead className="w-[1%]">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keys.map((key) => (
            <TableRow key={key.id}>
              <TableCell className="font-medium">{key.name}</TableCell>
              <TableCell className="font-mono text-[13px] text-foreground-light">{key.prefix}…</TableCell>
              <TableCell className="text-foreground-light">{key.lastUsed}</TableCell>
              <TableCell>
                <Button
                  size="tiny"
                  variant="destructive"
                  aria-label={`Revoke ${key.name}`}
                  onClick={() => {
                    setTarget(key)
                    setOpen(true)
                  }}
                >
                  Revoke
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ConfirmDialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          onOpenChange?.(next)
        }}
        title={`Revoke API key “${target?.name ?? ''}”?`}
        description="Requests signed with this key start failing immediately. Create a new key before revoking one in use."
        confirmLabel="Revoke key"
        onConfirm={async () => {
          await onConfirm()
          await wait(300)
          setKeys((current) => current.filter((key) => key.id !== target?.id))
        }}
      />
    </div>
  )
}

/**
 * Controlled composition: one dialog for a whole list, opened from row buttons with `open` +
 * `onOpenChange`. The row disappears once the async revoke resolves.
 */
export const ControlledFromList: Story = {
  parameters: { layout: 'padded' },
  args: { trigger: undefined },
  render: (args) => <ApiKeysExample onConfirm={args.onConfirm} onOpenChange={args.onOpenChange} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Revoke Analytics export' }))
    const dialog = await body.findByRole('alertdialog', { name: 'Revoke API key “Analytics export”?' })
    await userEvent.click(within(dialog).getByRole('button', { name: 'Revoke key' }))
    await waitFor(() => expect(body.queryByRole('alertdialog')).not.toBeInTheDocument(), { timeout: 3000 })
    await expect(args.onConfirm).toHaveBeenCalledOnce()
    await waitFor(() => expect(canvas.queryByText('Analytics export')).not.toBeInTheDocument())
    await expect(canvas.getByText('Billing webhook')).toBeInTheDocument()
  },
}
