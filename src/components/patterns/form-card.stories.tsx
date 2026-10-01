import * as React from 'react'
import type { ArgTypes, Meta, StoryObj } from '@storybook/react-vite'
import { Archive, ArrowRightLeft, Download, ExternalLink, LogOut, Trash2 } from 'lucide-react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Badge } from '../primitives/badge'
import { Button } from '../primitives/button'
import { Checkbox } from '../primitives/checkbox'
import { Input } from '../primitives/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../primitives/select'
import { Switch } from '../primitives/switch'
import { Textarea } from '../primitives/textarea'
import { ToggleGroup, ToggleGroupItem } from '../primitives/toggle-group'

import { CodeBlock } from './code-block'
import { ConfirmDialog } from './confirm-dialog'
import { CopyField, SecretField } from './copy'
import { ActionRow, FormActions, FormCard, FormRow, type FormCardProps } from './form-card'

const meta = {
  title: 'Patterns/Form Card',
  component: FormCard,
  subcomponents: { FormRow, FormActions, ActionRow },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Settings-style form card: one `FormRow` per setting (label + help text on the left, control + error on the right, stacked below `md`), hairlines between rows, and `FormActions` in the `footer` (unsaved status, Cancel, Save). It renders a `<form noValidate>`: validate in `onSubmit` and pass errors to each row. With `htmlFor`, a row gives its single control the `id`, `aria-describedby` and `aria-invalid` wiring (use the render-function child for a `Select` or a group). Use `asDiv` for read-only cards (copy fields, instant toggles) and `layout="vertical"` on rows with wide controls.\n\nFor one-click actions use `ActionRow` (title + description on the left, one button on the right) in an `asDiv` card. Group irreversible actions in a single `tone="destructive"` **Danger zone** card at the bottom of the settings page: red-tinted border, and every `ActionRow` inside inherits a faint red wash. Confirm destructive actions with a `ConfirmDialog` (typed confirmation for deletes).',
      },
    },
  },
  args: {
    title: 'General',
    description: 'Basic information about this project.',
    asDiv: false,
    tone: 'neutral',
    onSubmit: fn((e: React.FormEvent<HTMLFormElement>) => e.preventDefault()),
    className: 'max-w-3xl',
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['neutral', 'destructive'] },
    title: { control: 'text' },
    description: { control: 'text' },
    headerActions: { control: false },
    footer: { control: false },
    children: { control: false },
  },
  render: (args) => (
    <FormCard {...args} footer={<FormActions dirty={false} onReset={() => {}} />}>
      <FormRow label="Project name" htmlFor="default-name" description="Used in URLs and the API. Lowercase letters, digits and dashes.">
        <Input mono defaultValue="acme-web" />
      </FormRow>
      <FormRow label="Description" htmlFor="default-description" description="Shown on the project overview.">
        <Textarea defaultValue="Marketing site and customer portal." />
      </FormRow>
    </FormCard>
  ),
} satisfies Meta<typeof FormCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** `headerActions` sit at the right of the header row: keep them small (a docs link, a badge). */
export const WithHeaderActions: Story = {
  args: {
    title: 'Billing contact',
    description: 'Invoices and payment receipts are sent to this address.',
    headerActions: (
      <Button size="tiny" variant="ghost" iconRight={<ExternalLink />} asChild>
        <a href="#billing-docs">Docs</a>
      </Button>
    ),
  },
  render: (args) => (
    <FormCard {...args} footer={<FormActions dirty={false} />}>
      <FormRow label="Email" htmlFor="billing-email">
        <Input type="email" defaultValue="billing@northwind.example" />
      </FormRow>
    </FormCard>
  ),
}

/** Hides controls that the meta declares but a subcomponent story does not use. */
const hideControls = (...names: string[]): ArgTypes =>
  Object.fromEntries(names.map((name) => [name, { table: { disable: true } }]))

/** FormCard-only controls, hidden on the FormRow / FormActions playgrounds. */
const hideCardControls = hideControls('title', 'asDiv', 'tone', 'onSubmit', 'headerActions', 'footer', 'className')

/**
 * `FormRow` driven by the controls. With `htmlFor`, the row gives its single control the `id`, and
 * links the description and the error to it (`aria-describedby`, plus `aria-invalid` on error): the
 * `Input` below sets none of them.
 */
export const Row: StoryObj<typeof FormRow> = {
  args: {
    label: 'Project name',
    description: 'Used in URLs and the API. Lowercase letters, digits and dashes.',
    htmlFor: 'row-name',
    error: '',
    layout: 'horizontal',
  },
  argTypes: {
    ...hideCardControls,
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    htmlFor: { control: 'text' },
    layout: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    controlClassName: { control: 'text' },
    children: { control: false },
  },
  render: ({ label, description, htmlFor, error, layout, controlClassName }) => (
    <FormCard asDiv className="max-w-3xl">
      <FormRow
        label={label}
        description={description}
        htmlFor={htmlFor}
        error={error || undefined}
        layout={layout}
        controlClassName={controlClassName}
      >
        <Input mono defaultValue="acme-web" />
      </FormRow>
    </FormCard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Project name')
    await expect(input).toHaveAttribute('id', 'row-name')
    await expect(input).toHaveAccessibleDescription(
      'Used in URLs and the API. Lowercase letters, digits and dashes.',
    )
    await expect(input).not.toHaveAttribute('aria-invalid')
  },
}

/** `FormRow` with an error: the message is announced (`role="alert"`), linked to the control, and the control gets `aria-invalid`. */
export const RowWithError: StoryObj<typeof FormRow> = {
  ...Row,
  args: { ...Row.args, error: 'Use 3–40 lowercase letters, digits or dashes.' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Project name')
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(canvas.getByRole('alert')).toHaveTextContent('Use 3–40 lowercase letters, digits or dashes.')
    await expect(input).toHaveAccessibleDescription(
      'Used in URLs and the API. Lowercase letters, digits and dashes. Use 3–40 lowercase letters, digits or dashes.',
    )
  },
}

/**
 * `FormActions` driven by the controls, in a `<div>` card (`asDiv`), so Save calls `onSave`
 * instead of submitting a form.
 */
export const Actions: StoryObj<typeof FormActions> = {
  args: {
    dirty: true,
    saving: false,
    invalid: false,
    saveLabel: 'Save changes',
    cancelLabel: 'Cancel',
    unsavedLabel: 'Unsaved changes',
    invalidMessage: 'fix the highlighted fields',
    hint: 'Changes apply to new invoices only',
    onReset: fn(),
    onSave: fn(),
  },
  argTypes: {
    ...hideCardControls,
    saveLabel: { control: 'text' },
    cancelLabel: { control: 'text' },
    unsavedLabel: { control: 'text' },
    invalidMessage: { control: 'text' },
    hint: { control: 'text' },
    children: { control: false },
  },
  render: ({ dirty, saving, invalid, onReset, onSave, saveLabel, cancelLabel, unsavedLabel, invalidMessage, hint }) => (
    <FormCard
      asDiv
      className="max-w-3xl"
      title="Invoicing"
      footer={
        <FormActions
          dirty={dirty ?? false}
          saving={saving}
          invalid={invalid}
          onReset={onReset}
          onSave={onSave}
          saveLabel={saveLabel}
          cancelLabel={cancelLabel}
          unsavedLabel={unsavedLabel}
          invalidMessage={invalidMessage}
          hint={hint}
        />
      }
    >
      <FormRow label="Invoice prefix" htmlFor="actions-prefix" description="Added before every invoice number.">
        <Input mono defaultValue="INV-" />
      </FormRow>
    </FormCard>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Unsaved changes')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }))
    await expect(args.onReset).toHaveBeenCalledOnce()
    const save = canvas.getByRole('button', { name: 'Save changes' })
    await expect(save).toHaveAttribute('type', 'button')
    await userEvent.click(save)
    await expect(args.onSave).toHaveBeenCalledOnce()
  },
}

/** Without `title`, `description` and `headerActions` the card starts directly with its rows. */
export const WithoutHeader: Story = {
  args: { title: undefined, description: undefined, 'aria-label': 'Workspace settings' },
}

/**
 * All the common field types in one card, with live validation after the first submit, dirty
 * tracking and a simulated save. Clear the name or turn notifications on without an email to see errors.
 */
export const FieldTypes: Story = {
  args: { title: 'Project settings', description: 'Changes apply to every member of the workspace.' },
  render: (args) => <ProjectSettingsDemo {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const save = canvas.getByRole('button', { name: 'Save changes' })
    await expect(save).toBeDisabled()

    const name = canvas.getByLabelText('Project name')
    await userEvent.clear(name)
    await expect(save).toBeEnabled()
    await userEvent.click(save)
    await expect(await canvas.findByText('Enter a project name.')).toBeInTheDocument()
    await expect(name).toHaveAttribute('aria-invalid', 'true')
    await expect(canvas.getByText(/fix the highlighted fields/)).toBeInTheDocument()
    await expect(args.onSubmit).not.toHaveBeenCalled()

    await userEvent.type(name, 'acme-portal')
    await expect(name).not.toHaveAttribute('aria-invalid')
    await userEvent.click(canvas.getByRole('switch', { name: 'Email notifications' }))
    await userEvent.click(save)
    await expect(await canvas.findByText('Enter an email to receive notifications.')).toBeInTheDocument()

    await userEvent.type(canvas.getByLabelText('Notification email'), 'ops@acme.example')
    await userEvent.click(save)
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Save changes' })).toBeDisabled())
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
  },
}

/**
 * Every field type in its error state: the row sets `aria-invalid` on the control (which paints its
 * error border) and links the message. The `Select` uses the render-function child, because the
 * focusable element is its trigger.
 */
export const ValidationErrors: Story = {
  args: { title: 'Invite member', description: 'They receive an email with a link to join.' },
  render: (args) => (
    <FormCard
      {...args}
      footer={<FormActions dirty invalid onReset={() => {}} saveLabel="Send invite" />}
    >
      <FormRow label="Email" htmlFor="invite-email" error="Enter a valid email address.">
        <Input type="email" defaultValue="jane.doe@" />
      </FormRow>
      <FormRow label="Role" htmlFor="invite-role" description="What they can do in this workspace." error="Pick a role.">
        {(control) => (
          <Select>
            <SelectTrigger {...control} className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        )}
      </FormRow>
      <FormRow
        label="Personal note"
        htmlFor="invite-note"
        description="Optional, up to 200 characters."
        error="Keep the note under 200 characters (212 now)."
      >
        <Textarea defaultValue="Hi Jane! Welcome to the team. This workspace holds every project we ship for our customers: the marketing site, the customer portal and the internal admin tools. Ping me if anything is unclear." />
      </FormRow>
      <FormRow
        label="Require two-factor authentication"
        htmlFor="invite-2fa"
        error="Your plan requires two-factor authentication for admins."
      >
        <Switch />
      </FormRow>
    </FormCard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const email = canvas.getByLabelText('Email')
    await expect(email).toHaveAttribute('aria-invalid', 'true')
    await expect(email).toHaveAccessibleDescription('Enter a valid email address.')
    const role = canvas.getByRole('combobox', { name: 'Role' })
    await expect(role).toHaveAttribute('aria-invalid', 'true')
    await expect(role).toHaveAccessibleDescription('What they can do in this workspace. Pick a role.')
    const note = canvas.getByLabelText('Personal note')
    await expect(note).toHaveAccessibleDescription(
      'Optional, up to 200 characters. Keep the note under 200 characters (212 now).',
    )
    const twoFactor = canvas.getByRole('switch', { name: 'Require two-factor authentication' })
    await expect(twoFactor).toHaveAttribute('aria-invalid', 'true')
    await expect(twoFactor).toHaveAccessibleDescription('Your plan requires two-factor authentication for admins.')
  },
}

/**
 * A group has no single focus target: omit `htmlFor` and use the render-function child. The label
 * is then plain text with an id, and `control` carries `aria-labelledby` (plus the description and
 * error ids) for the group.
 */
export const RowWithGroup: Story = {
  args: { title: 'Invoices', description: 'Defaults for new invoices.', asDiv: true },
  render: (args) => (
    <FormCard {...args}>
      <FormRow label="Payment terms" description="Days a customer has to pay an invoice.">
        {(control) => (
          <ToggleGroup {...control} type="single" variant="outline" defaultValue="30">
            <ToggleGroupItem value="14">14 days</ToggleGroupItem>
            <ToggleGroupItem value="30">30 days</ToggleGroupItem>
            <ToggleGroupItem value="60">60 days</ToggleGroupItem>
          </ToggleGroup>
        )}
      </FormRow>
    </FormCard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole('radiogroup', { name: 'Payment terms' })
    await expect(group).toHaveAccessibleDescription('Days a customer has to pay an invoice.')
    await expect(within(group).getByRole('radio', { name: '30 days' })).toBeChecked()
  },
}

/**
 * `asDiv` renders a plain container: use it for read-only values that are copied, not edited. The
 * remaining props (`id`, `data-*`, `aria-*`…) go to the card, which is a `role="group"` named by its title.
 */
export const ReadOnly: Story = {
  args: {
    title: 'API access',
    description: 'Use these values to call the API from your backend.',
    asDiv: true,
    id: 'api-access',
  },
  render: (args) => (
    <FormCard {...args}>
      <FormRow label="Base URL" htmlFor="ro-base" description="Every endpoint lives under this URL.">
        <CopyField value="https://api.example.com/v2" what="base URL" />
      </FormRow>
      <FormRow label="Project ID" htmlFor="ro-id">
        <CopyField value="prj_7Hq2kLx9Vd3mN4" what="project ID" />
      </FormRow>
      <FormRow label="Secret key" htmlFor="ro-secret" description="Keep it server-side. Rotate it if it leaks.">
        <SecretField value="sk_demo_4f9a2c7e1b8d3f6a" what="secret key" />
      </FormRow>
      <FormRow label="Plan">
        <div className="flex items-center gap-2 text-sm text-foreground">
          Pro <Badge variant="success">Active</Badge>
        </div>
      </FormRow>
    </FormCard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const card = canvas.getByRole('group', { name: 'API access' })
    await expect(card).toHaveAttribute('id', 'api-access')
    await expect(card).toHaveAttribute('data-slot', 'form-card')
    await expect(canvasElement.querySelector('form')).toBeNull()
    await expect(canvas.getByLabelText('Base URL')).toHaveAccessibleDescription('Every endpoint lives under this URL.')
    await expect(canvas.getByLabelText('Secret key')).toHaveAccessibleDescription(
      'Keep it server-side. Rotate it if it leaks.',
    )
  },
}

/** `layout="vertical"` stacks label and control: for wide content such as code or a table. */
export const VerticalRow: Story = {
  args: { title: 'Quick start', asDiv: true },
  render: (args) => (
    <FormCard {...args}>
      <FormRow label="API key" htmlFor="qs-key" description="Scoped to read-only access.">
        <SecretField value="sk_demo_read_91b3e7c5" what="API key" />
      </FormRow>
      <FormRow layout="vertical" label="Example request" description="List the invoices of your workspace.">
        <CodeBlock code={'curl https://api.example.com/v2/invoices \\\n  -H "Authorization: Bearer $API_KEY"'} />
      </FormRow>
    </FormCard>
  ),
}

/** The states of `FormActions`: pristine with a hint, dirty, dirty + invalid, saving, and extra left content. */
export const ActionsStates: Story = {
  args: { title: undefined, description: undefined, asDiv: true },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <FormCard {...args} footer={<FormActions dirty={false} onReset={() => {}} hint="Changes apply to new invoices only" />}>
        <FormRow label="Pristine">
          <span className="text-sm text-foreground-light">Save and Cancel disabled, hint visible.</span>
        </FormRow>
      </FormCard>
      <FormCard {...args} footer={<FormActions dirty onReset={() => {}} />}>
        <FormRow label="Dirty">
          <span className="text-sm text-foreground-light">Unsaved status, actions enabled.</span>
        </FormRow>
      </FormCard>
      <FormCard {...args} footer={<FormActions dirty invalid onReset={() => {}} />}>
        <FormRow label="Invalid">
          <span className="text-sm text-foreground-light">Shown after a submit with errors.</span>
        </FormRow>
      </FormCard>
      <FormCard {...args} footer={<FormActions dirty saving onReset={() => {}} saveLabel="Update plan" />}>
        <FormRow label="Saving">
          <span className="text-sm text-foreground-light">Spinner on Save, Cancel disabled.</span>
        </FormRow>
      </FormCard>
      <FormCard
        {...args}
        footer={
          <FormActions dirty unsavedLabel={null} onReset={() => {}}>
            <label className="flex items-center gap-2 text-[13px] text-foreground-light">
              <Checkbox defaultChecked /> Notify members by email
            </label>
          </FormActions>
        }
      >
        <FormRow label="Extra content">
          <span className="text-sm text-foreground-light">Children go on the left; status hidden.</span>
        </FormRow>
      </FormCard>
    </div>
  ),
}

/** Cancel restores the saved values; Save is disabled again once the form is back to pristine. */
export const ResetInteraction: Story = {
  args: { title: 'Profile' },
  render: (args) => <ProfileDemo {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Display name')
    await userEvent.type(input, ' Jr.')
    await expect(canvas.getByText('Unsaved changes')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }))
    await expect(input).toHaveValue('Jane Doe')
    await expect(canvas.getByRole('button', { name: 'Save changes' })).toBeDisabled()
  },
}

/**
 * `ActionRow` driven by the controls: title + description on the left, one action on the right (stacked
 * below `sm`). `tone="destructive"` adds the faint red wash; inside a destructive card it is the default.
 */
export const ActionRowStory: StoryObj<typeof ActionRow> = {
  name: 'Action row',
  args: {
    title: 'Export data',
    description: 'Download every project, member and invoice of this workspace as a ZIP of CSV files.',
    tone: 'neutral',
  },
  argTypes: {
    ...hideControls('asDiv', 'onSubmit', 'headerActions', 'footer', 'className', 'children'),
    title: { control: 'text' },
    description: { control: 'text' },
    tone: { control: 'inline-radio', options: ['neutral', 'destructive'] },
    action: { control: false },
  },
  render: ({ title, description, tone }) => (
    <FormCard asDiv className="max-w-3xl">
      <ActionRow
        title={title}
        description={description}
        tone={tone}
        action={<Button icon={<Download />}>Export data</Button>}
      />
    </FormCard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const row = canvasElement.querySelector('[data-slot="action-row"]')
    await expect(row).toHaveAttribute('data-tone', 'neutral')
    await expect(canvas.getByText('Export data', { selector: 'p' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Export data' })).toBeEnabled()
  },
}

/**
 * Neutral action rows in a regular `asDiv` card: reversible or non-destructive actions. They mix with
 * `FormRow`s in the same card.
 */
export const ActionRows: StoryObj<FormCardProps & Pick<DemoActions, 'onExport' | 'onSignOut'>> = {
  args: {
    title: 'Security',
    description: 'Sessions and data of your account.',
    asDiv: true,
    onExport: fn(),
    onSignOut: fn(),
  },
  render: ({ onExport, onSignOut, ...card }) => (
    <FormCard {...card}>
      <FormRow
        label="Two-factor authentication"
        htmlFor="sec-2fa"
        description="Ask for a code from your authenticator app at sign-in."
      >
        <Switch defaultChecked />
      </FormRow>
      <ActionRow
        title="Sign out everywhere"
        description="Ends every session except this one. Other devices must sign in again."
        action={
          <Button icon={<LogOut />} onClick={onSignOut}>
            Sign out other sessions
          </Button>
        }
      />
      <ActionRow
        title="Export your data"
        description="A ZIP of your projects, comments and invoices, sent to your email within an hour."
        action={
          <Button icon={<Download />} onClick={onExport}>
            Request export
          </Button>
        }
      />
    </FormCard>
  ),
  play: async ({ args: { onExport, onSignOut }, canvasElement }) => {
    const canvas = within(canvasElement)
    for (const row of canvasElement.querySelectorAll('[data-slot="action-row"]')) {
      await expect(row).toHaveAttribute('data-tone', 'neutral')
    }
    await userEvent.click(canvas.getByRole('button', { name: 'Sign out other sessions' }))
    await expect(onSignOut).toHaveBeenCalledOnce()
    await userEvent.click(canvas.getByRole('button', { name: 'Request export' }))
    await expect(onExport).toHaveBeenCalledOnce()
  },
}

/**
 * The "Danger zone" card: `tone="destructive"` on an `asDiv` card, one `ActionRow` per irreversible action
 * (the rows inherit the red wash). Delete opens a `ConfirmDialog` with typed confirmation; its async
 * `onConfirm` shows a spinner, then closes the dialog.
 */
export const DangerZone: StoryObj<FormCardProps & Pick<DemoActions, 'onTransfer' | 'onArchive' | 'onDelete'>> = {
  args: {
    title: 'Danger zone',
    description: 'Actions that move, freeze or remove this project.',
    asDiv: true,
    tone: 'destructive',
    onTransfer: fn(),
    onArchive: fn(),
    onDelete: fn(() => wait(300)),
  },
  argTypes: { asDiv: { table: { disable: true } } },
  render: (args) => <DangerZoneDemo {...args} />,
  play: async ({ args: { onTransfer, onArchive, onDelete }, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    await expect(canvasElement.querySelector('[data-slot="form-card"]')).toHaveAttribute('data-tone', 'destructive')
    const rows = canvasElement.querySelectorAll('[data-slot="action-row"]')
    await expect(rows).toHaveLength(3)
    for (const row of rows) await expect(row).toHaveAttribute('data-tone', 'destructive')

    await userEvent.click(canvas.getByRole('button', { name: 'Transfer project' }))
    await expect(onTransfer).toHaveBeenCalledOnce()
    await userEvent.click(canvas.getByRole('button', { name: 'Archive project' }))
    await expect(onArchive).toHaveBeenCalledOnce()

    await userEvent.click(canvas.getByRole('button', { name: 'Delete project' }))
    const dialog = await body.findByRole('alertdialog', { name: 'Delete project “acme-web”?' })
    const field = within(dialog).getByRole('textbox')
    const confirm = within(dialog).getByRole('button', { name: 'Delete project' })
    await waitFor(() => expect(field).toHaveFocus())
    await expect(confirm).toBeDisabled()
    await userEvent.type(field, 'acme-web')
    await expect(confirm).toBeEnabled()
    await userEvent.click(confirm)
    await expect(onDelete).toHaveBeenCalledOnce()
    await waitFor(() => expect(body.queryByRole('alertdialog')).not.toBeInTheDocument(), { timeout: 3000 })
  },
}

/** A one-row danger zone without a card header, for when the page section above already reads "Danger zone". */
export const DangerZoneSingleRow: Story = {
  args: { title: undefined, description: undefined, asDiv: true, tone: 'destructive' },
  render: (args) => (
    <div className="flex flex-col gap-3">
      <h2 className="text-base font-medium text-foreground">Danger zone</h2>
      <FormCard {...args}>
        <ActionRow
          title="Delete this workspace"
          description="Removes every project, member, invoice and API key of Northwind. This cannot be undone."
          action={
            <Button variant="destructive" icon={<Trash2 />}>
              Delete workspace
            </Button>
          }
        />
      </FormCard>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[data-slot="action-row"]')).toHaveAttribute('data-tone', 'destructive')
  },
}

/** Callbacks of the action-row demos, exposed as story args so the Actions panel logs them. */
type DemoActions = {
  onTransfer: () => void
  onArchive: () => void
  onDelete: () => unknown
  onExport: () => void
  onSignOut: () => void
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

function DangerZoneDemo({
  onTransfer,
  onArchive,
  onDelete,
  ...props
}: FormCardProps & Partial<Pick<DemoActions, 'onTransfer' | 'onArchive' | 'onDelete'>>) {
  const [confirmDelete, setConfirmDelete] = React.useState(false)
  return (
    <>
      <FormCard {...props}>
        <ActionRow
          title="Transfer project"
          description="Move acme-web, its members and its API keys to another workspace you own."
          action={
            <Button icon={<ArrowRightLeft />} onClick={onTransfer}>
              Transfer project
            </Button>
          }
        />
        <ActionRow
          title="Archive project"
          description="Make it read-only and hide it from the project list. You can restore it at any time."
          action={
            <Button icon={<Archive />} onClick={onArchive}>
              Archive project
            </Button>
          }
        />
        <ActionRow
          title="Delete project"
          description="Permanently removes acme-web with its members, invoices and API keys. This cannot be undone."
          action={
            <Button variant="destructive" icon={<Trash2 />} onClick={() => setConfirmDelete(true)}>
              Delete project
            </Button>
          }
        />
      </FormCard>
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete project “acme-web”?"
        description={
          <p>
            Its members lose access, and its invoices and API keys are deleted. Requests signed with those keys start
            failing immediately.
          </p>
        }
        confirmText="acme-web"
        confirmLabel="Delete project"
        onConfirm={() => onDelete?.()}
      />
    </>
  )
}

function ProfileDemo(props: React.ComponentProps<typeof FormCard>) {
  const [name, setName] = React.useState('Jane Doe')
  return (
    <FormCard {...props} footer={<FormActions dirty={name !== 'Jane Doe'} onReset={() => setName('Jane Doe')} />}>
      <FormRow label="Display name" htmlFor="profile-name">
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </FormRow>
    </FormCard>
  )
}

type Settings = { name: string; visibility: string; description: string; notify: boolean; email: string }

const SAVED: Settings = {
  name: 'acme-web',
  visibility: 'team',
  description: 'Marketing site and customer portal.',
  notify: false,
  email: '',
}

function validate(v: Settings): Partial<Record<keyof Settings, string>> {
  const errors: Partial<Record<keyof Settings, string>> = {}
  if (!v.name.trim()) errors.name = 'Enter a project name.'
  else if (!/^[a-z0-9-]{3,40}$/.test(v.name)) errors.name = 'Use 3–40 lowercase letters, digits or dashes.'
  if (v.description.length > 160) errors.description = `Keep it under 160 characters (${v.description.length} now).`
  if (v.notify && !v.email.trim()) errors.email = 'Enter an email to receive notifications.'
  else if (v.notify && !/^\S+@\S+\.\S+$/.test(v.email)) errors.email = 'Enter a valid email address.'
  return errors
}

function ProjectSettingsDemo({ onSubmit, ...props }: React.ComponentProps<typeof FormCard>) {
  const [saved, setSaved] = React.useState(SAVED)
  const [values, setValues] = React.useState(SAVED)
  const [submitted, setSubmitted] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const errors = submitted ? validate(values) : {}
  const invalid = Object.keys(errors).length > 0
  const dirty = (Object.keys(values) as (keyof Settings)[]).some((k) => values[k] !== saved[k])
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => setValues((v) => ({ ...v, [key]: value }))

  return (
    <FormCard
      {...props}
      onSubmit={(e) => {
        e.preventDefault()
        setSubmitted(true)
        if (Object.keys(validate(values)).length > 0) return
        onSubmit?.(e)
        setSaving(true)
        setTimeout(() => {
          setSaved(values)
          setSaving(false)
          setSubmitted(false)
        }, 300)
      }}
      footer={
        <FormActions
          dirty={dirty}
          saving={saving}
          invalid={invalid}
          hint="Saved changes apply right away"
          onReset={() => {
            setValues(saved)
            setSubmitted(false)
          }}
        />
      }
    >
      <FormRow
        label="Project name"
        htmlFor="settings-name"
        description="Used in URLs and the API. Lowercase letters, digits and dashes."
        error={errors.name}
      >
        <Input mono value={values.name} onChange={(e) => set('name', e.target.value)} />
      </FormRow>
      <FormRow label="Visibility" htmlFor="settings-visibility" description="Who can open this project.">
        {/* Composite control: spread the wiring onto the focusable trigger. */}
        {(control) => (
          <Select value={values.visibility} onValueChange={(v) => set('visibility', v)}>
            <SelectTrigger {...control} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">Private — only you</SelectItem>
              <SelectItem value="team">Team — every workspace member</SelectItem>
              <SelectItem value="public">Public — anyone with the link</SelectItem>
            </SelectContent>
          </Select>
        )}
      </FormRow>
      <FormRow
        label="Description"
        htmlFor="settings-description"
        description="Shown on the project overview. Up to 160 characters."
        error={errors.description}
      >
        {/* Two nodes in the control column: the render function says which one is the control. */}
        {(control) => (
          <>
            <Textarea {...control} value={values.description} onChange={(e) => set('description', e.target.value)} />
            <span className="self-end font-mono text-[11.5px] text-foreground-lighter tabular">
              {values.description.length}/160
            </span>
          </>
        )}
      </FormRow>
      <FormRow
        label="Email notifications"
        htmlFor="settings-notify"
        description="Get an email when someone comments on this project."
      >
        <Switch checked={values.notify} onCheckedChange={(on) => set('notify', on)} />
      </FormRow>
      {values.notify && (
        <FormRow label="Notification email" htmlFor="settings-email" error={errors.email}>
          <Input
            type="email"
            placeholder="you@company.com"
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
          />
        </FormRow>
      )}
    </FormCard>
  )
}
