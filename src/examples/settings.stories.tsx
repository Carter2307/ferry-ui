import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

import { exampleParameters } from './example-app'
import { SECTIONS, SettingsExample } from './settings-example'

/* ---------------------------------------------------------------------------------------------- */
/* Meta                                                                                            */
/* ---------------------------------------------------------------------------------------------- */

const meta = {
  title: 'Examples/Settings',
  component: SettingsExample,
  parameters: exampleParameters(
    [
      'A settings area with sections, one form and a danger zone, built only from the public `@roger.b/libui` exports.',
      '',
      '- **Sections** — `InnerMenu` is the first child of a `flex-col md:flex-row` container next to the scrolling content; its items have no `href`, so `value` + `onValueChange` switch sections in place (a tab strip on phones).',
      '- **Label-left rows** — `FormCard` + `FormRow` hold `Input`, `Textarea`, `Select`, `Checkbox` and a `RadioCardGroup` (a `vertical` row for wide controls). The cards are `asDiv` because the page owns the single `<form>`.',
      '- **Stacked fields** — in the billing card, `Field` wires label, hint, error and ids for a dense two-column grid, with its render function for the `Select`.',
      '- **Free-form map** — the webhook headers are a `KeyValueEditor` driven by `useKeyValueRows` (rows, validation, dirty state, masked secrets).',
      '- **Saving** — one sticky `SaveBar` reflects `dirty` / `invalid` / `saving` for every section; Save is the submit button, and success is a `toast` through the `Toaster` of the app frame.',
      '- **Danger zone** — a `tone="destructive"` `FormCard` of `ActionRow`s, kept outside the form; each action opens a `ConfirmDialog` (`warning` tone for the reversible one, typed confirmation for the delete).',
    ].join('\n'),
  ),
  args: {
    defaultSection: 'general',
    onNavigate: fn(),
    onSave: fn(),
    onDeleteWorkspace: fn(),
  },
  argTypes: {
    defaultSection: { control: 'select', options: Object.keys(SECTIONS) },
  },
  // `defaultSection` is read on mount: remount when the control changes it.
  render: (args) => <SettingsExample key={args.defaultSection} {...args} />,
} satisfies Meta<typeof SettingsExample>

export default meta
type Story = StoryObj<typeof meta>

/** The General section: Input, Textarea, Select and RadioCardGroup rows, with the idle `SaveBar` at the bottom. */
export const Default: Story = {}

/** Editing a field makes the form dirty; saving shows a spinner, then a toast, and the bar goes back to idle. */
export const SaveChanges: Story = {
  play: async ({ args, canvasElement }) => {
    const main = within(within(canvasElement).getByRole('main'))
    const save = main.getByRole('button', { name: 'Save changes' })
    await expect(save).toBeDisabled()
    await expect(main.getByText('All changes saved')).toBeInTheDocument()

    await userEvent.type(main.getByRole('textbox', { name: 'Name' }), ' Inc')
    await expect(main.getByText('Unsaved changes')).toBeInTheDocument()
    await userEvent.click(save)
    await expect(await screen.findByText('Workspace settings saved')).toBeInTheDocument()
    await expect(args.onSave).toHaveBeenCalledOnce()
    await waitFor(() => expect(main.getByText('All changes saved')).toBeInTheDocument())
    await expect(main.getByRole('textbox', { name: 'Name' })).toHaveValue('Acme Inc')
  },
}

/** An invalid value shows its error under the field (`FormRow` `error`) and keeps Save disabled; Cancel restores the saved values. */
export const ValidationError: Story = {
  play: async ({ canvasElement }) => {
    const main = within(within(canvasElement).getByRole('main'))
    const slug = main.getByRole('textbox', { name: 'URL slug' })
    await userEvent.clear(slug)
    await userEvent.type(slug, 'Acme Inc')
    await expect(main.getByRole('alert')).toHaveTextContent('Use lowercase letters, digits and single hyphens.')
    await expect(slug).toHaveAttribute('aria-invalid', 'true')
    await expect(main.getByText(/fix the highlighted fields/)).toBeInTheDocument()
    await expect(main.getByRole('button', { name: 'Save changes' })).toBeDisabled()

    await userEvent.click(main.getByRole('button', { name: 'Cancel' }))
    await expect(slug).toHaveValue('acme')
    await expect(main.queryByRole('alert')).not.toBeInTheDocument()
  },
}

/** The `InnerMenu` switches sections in place; unsaved edits follow the user from one section to the next. */
export const SwitchSection: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const main = within(canvas.getByRole('main'))
    // The side menu and its phone tab strip are both in the DOM; CSS shows one of them.
    await userEvent.click(main.getAllByRole('button', { name: 'Notifications' })[0]!)
    await expect(main.getByRole('heading', { level: 1, name: 'Notifications' })).toBeInTheDocument()
    const reminders = main.getByRole('checkbox', { name: 'Invoice reminders' })
    await expect(reminders).not.toBeChecked()
    await userEvent.click(reminders)
    await expect(reminders).toBeChecked()
    await expect(main.getByText('Unsaved changes')).toBeInTheDocument()

    await userEvent.click(main.getAllByRole('button', { name: 'General' })[0]!)
    await expect(main.getByRole('heading', { level: 1, name: 'General' })).toBeInTheDocument()
    await expect(main.getByText('Unsaved changes')).toBeInTheDocument()
  },
}

/** `Checkbox` rows saved with the rest of the form (a `Switch` would apply on change). */
export const Notifications: Story = {
  args: { defaultSection: 'notifications' },
}

/** Stacked `Field`s in a two-column grid; an invalid email shows its error in place of the hint. */
export const BillingContact: Story = {
  args: { defaultSection: 'billing' },
  play: async ({ canvasElement }) => {
    const main = within(within(canvasElement).getByRole('main'))
    const email = main.getByRole('textbox', { name: 'Billing email' })
    await expect(email).toHaveAccessibleDescription('Invoices and receipts are sent here.')
    await userEvent.clear(email)
    await userEvent.type(email, 'billing@acme')
    await expect(email).toHaveAttribute('aria-invalid', 'true')
    await expect(email).toHaveAccessibleDescription('Enter a valid email address.')
    await expect(main.getByRole('button', { name: 'Save changes' })).toBeDisabled()
  },
}

/** The webhook headers in a `KeyValueEditor`: adding a row makes the form dirty, and a duplicate key is rejected. */
export const Webhooks: Story = {
  args: { defaultSection: 'webhooks' },
  play: async ({ canvasElement }) => {
    const main = within(within(canvasElement).getByRole('main'))
    const list = main.getByRole('list', { name: 'Request headers' })
    await expect(within(list).getAllByRole('listitem')).toHaveLength(2)
    await userEvent.click(main.getByRole('button', { name: 'Add header' }))
    await expect(within(list).getAllByRole('listitem')).toHaveLength(3)
    const key = main.getByRole('textbox', { name: 'Header 3' })
    await waitFor(() => expect(key).toHaveFocus())
    await userEvent.type(key, 'Authorization')
    await expect(main.getByText('Duplicate key Authorization')).toBeInTheDocument()
    await expect(main.getByRole('button', { name: 'Save changes' })).toBeDisabled()
    await userEvent.clear(key)
    await userEvent.type(key, 'X-Acme-Team')
    await expect(main.getByRole('button', { name: 'Save changes' })).toBeEnabled()
  },
}

/** The danger zone: a destructive `FormCard` of `ActionRow`s, each confirmed by a `ConfirmDialog`. */
export const DangerZone: Story = {
  args: { defaultSection: 'danger' },
}

/** Deleting the workspace asks to type its slug: the confirm button unlocks only on an exact match, then a toast confirms. */
export const DeleteWorkspace: Story = {
  args: { defaultSection: 'danger' },
  play: async ({ args, canvasElement }) => {
    const main = within(within(canvasElement).getByRole('main'))
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(main.getByRole('button', { name: 'Delete workspace' }))
    const dialog = await body.findByRole('alertdialog', { name: 'Delete workspace “Acme”?' })
    const field = within(dialog).getByRole('textbox')
    const confirm = within(dialog).getByRole('button', { name: 'Delete workspace' })
    await waitFor(() => expect(field).toHaveFocus())
    await expect(confirm).toBeDisabled()
    await userEvent.type(field, 'acme')
    await expect(confirm).toBeEnabled()
    await userEvent.click(confirm)
    await waitFor(() => expect(args.onDeleteWorkspace).toHaveBeenCalledOnce())
    // Checked through the attribute: the dialog stays mounted until its exit animation ends.
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'closed'))
    await expect(await screen.findByText('Workspace deleted')).toBeInTheDocument()
  },
}
