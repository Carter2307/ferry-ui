import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Plus, UserPlus } from 'lucide-react'
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test'

import { Button } from '../primitives/button'
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../primitives/dialog'
import { Input } from '../primitives/input'
import { Label } from '../primitives/label'
import { RadioGroup, RadioGroupItem } from '../primitives/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../primitives/select'
import { Textarea } from '../primitives/textarea'
import { CopyButton, CopyField, SecretField } from './copy'
import { Field } from './field'

/** Open-by-default stories render in their own iframe so the modal does not cover the docs page. */
const openInDocs = { docs: { story: { inline: false, iframeHeight: 520 } } }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const meta = {
  title: 'Patterns/Field',
  component: Field,
  parameters: {
    docs: {
      description: {
        component:
          'Stacked form field: label, control, then a hint or an error, with the `id` / `for` / `aria-invalid` / `aria-describedby` wiring done for you. Use `size="sm"` inside dialogs and popovers, `md` in page and sign-in forms; pass a render function for composite controls such as `Select`. For label-left settings rows use `FormRow`; for a checkbox or switch with an inline label use `Label` directly.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Project name',
    hint: 'Lowercase letters, digits and dashes.',
    size: 'md',
    labelVariant: 'default',
    labelAs: 'label',
    optional: false,
    errorReplacesHint: true,
    children: <Input placeholder="marketing-site" />,
  },
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    labelVariant: { control: 'inline-radio', options: ['default', 'subtle', 'mono'] },
    labelAs: { control: 'inline-radio', options: ['label', 'span'] },
    optional: { control: 'boolean' },
    children: { control: false },
  },
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** `sm` for dialogs and popovers (13px label, 12.5px hint), `md` for page and sign-in forms (14px label, 13px hint). */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <Field {...args} size="sm" label="Small (dialogs)">
        <Input placeholder="marketing-site" />
      </Field>
      <Field {...args} size="md" label="Medium (page forms)">
        <Input placeholder="marketing-site" />
      </Field>
    </div>
  ),
}

export const WithHint: Story = {
  args: {
    label: 'Billing email',
    hint: 'Invoices and payment receipts are sent to this address.',
    children: <Input type="email" placeholder="billing@example.com" />,
  },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Billing email')
    await expect(input).toHaveAccessibleDescription('Invoices and payment receipts are sent to this address.')
    await expect(input).not.toHaveAttribute('aria-invalid')
  },
}

/** The error replaces the hint, is announced (`role="alert"`) and paints the control's error border. */
export const WithError: Story = {
  args: {
    error: 'A project named “marketing-site” already exists.',
    children: <Input defaultValue="marketing-site" />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Project name')
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toHaveAttribute('aria-describedby', `${input.id}-error`)
    await expect(canvas.queryByText('Lowercase letters, digits and dashes.')).toBeNull()
  },
}

/** `errorReplacesHint={false}` keeps the hint visible under the control; `aria-describedby` lists hint then error. */
export const ErrorAndHint: Story = {
  args: {
    label: 'Seats',
    hint: 'Between 1 and 50. You are billed per seat.',
    error: 'Enter a whole number between 1 and 50.',
    errorReplacesHint: false,
    children: <Input type="number" defaultValue="80" className="w-24 tabular" />,
  },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Seats')
    await expect(input).toHaveAttribute('aria-describedby', `${input.id}-hint ${input.id}-error`)
  },
}

/** `optional` appends a muted marker; pass text instead of `true` to localize it. */
export const Optional: Story = {
  args: {
    label: 'Company',
    optional: true,
    hint: 'Shown on your invoices.',
    children: <Input placeholder="Acme Inc." />,
  },
  render: (args) => (
    <div className="flex flex-col gap-6">
      <Field {...args} />
      <Field {...args} label="Société" optional="(facultatif)" hint="Affichée sur vos factures.">
        <Input placeholder="Acme SAS" />
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Company (optional)')).toBeInTheDocument()
    await expect(canvas.getByLabelText('Société (facultatif)')).toBeInTheDocument()
  },
}

/**
 * The UPPERCASE monospace caption with a 12px hint, for read-only values in popovers and side panels.
 * Here it labels copyable values; use `labelAs="span"` when the value has no input (a code block).
 */
export const MonoLabel: Story = {
  args: { labelVariant: 'mono', size: 'sm' },
  render: (args) => (
    <div className="flex flex-col gap-4 rounded-lg border bg-popover p-4 shadow-overlay">
      <Field {...args} label="API base URL" hint="Every endpoint lives under this path.">
        <CopyField size="sm" value="https://api.example.com/v1" what="API base URL" />
      </Field>
      <Field {...args} label="Webhook signing secret" hint="Verify the signature header with it.">
        <SecretField size="sm" value="whsec_9b1d4c7e2a8f3f9a" what="signing secret" />
      </Field>
      <Field {...args} labelAs="span" label="Install" hint="Requires Node.js 20 or later.">
        <div role="group" className="flex items-start rounded-md border bg-surface-200">
          <pre className="min-w-0 flex-1 overflow-x-auto py-2.5 pl-3 font-mono text-[12px] leading-relaxed text-foreground">
            npm install @acme/sdk
          </pre>
          <div className="shrink-0 p-1.5">
            <CopyButton value="npm install @acme/sdk" what="install command" />
          </div>
        </div>
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const url = canvas.getByLabelText('API base URL')
    await expect(url).toHaveValue('https://api.example.com/v1')
    await expect(url).toHaveAccessibleDescription('Every endpoint lives under this path.')
    await expect(canvas.getByLabelText('Webhook signing secret')).not.toHaveValue('whsec_9b1d4c7e2a8f3f9a')
    await expect(canvas.getByRole('group', { name: 'Install' })).toHaveAccessibleDescription(
      'Requires Node.js 20 or later.',
    )
  },
}

/** Normal-weight, lighter label for sign-in style forms and secondary inputs. */
export const SubtleLabel: Story = {
  args: { labelVariant: 'subtle' },
  render: (args) => (
    <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()} noValidate>
      <Field {...args} label="Email" hint={undefined}>
        <Input type="email" size="lg" autoComplete="email" placeholder="you@example.com" />
      </Field>
      <Field {...args} label="Password" hint={undefined}>
        <Input type="password" size="lg" autoComplete="current-password" placeholder="Your password" />
      </Field>
      <Button type="submit" variant="primary" size="lg" className="w-full">
        Sign in
      </Button>
    </form>
  ),
}

/**
 * Labels can hold rich content. The confirmation-box pattern: a `subtle` `sm` label quoting the exact
 * text to type (selectable in one click), in front of a monospace input.
 */
export const RichLabel: Story = {
  args: {
    size: 'sm',
    labelVariant: 'subtle',
    hint: undefined,
    label: (
      <>
        Type <span className="font-mono font-medium text-foreground select-all">acme-billing</span> to confirm.
      </>
    ),
    children: <Input mono autoComplete="off" spellCheck={false} placeholder="acme-billing" />,
  },
  argTypes: { label: { control: false } },
}

/** Render-function form: spread the control props onto the `SelectTrigger`, the element that takes focus. */
export const WithSelect: Story = {
  args: { label: 'Currency', hint: 'Used for new invoices. Existing invoices keep theirs.', size: 'sm' },
  render: (args) => (
    <Field {...args}>
      {(control) => (
        <Select defaultValue="eur">
          <SelectTrigger {...control} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="eur">Euro (EUR)</SelectItem>
            <SelectItem value="usd">US dollar (USD)</SelectItem>
            <SelectItem value="gbp">Pound sterling (GBP)</SelectItem>
          </SelectContent>
        </Select>
      )}
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', { name: 'Currency' })
    await expect(trigger).toHaveAccessibleDescription('Used for new invoices. Existing invoices keep theirs.')
  },
}

export const WithTextarea: Story = {
  args: {
    label: 'Description',
    optional: true,
    hint: 'Markdown is supported. Max 500 characters.',
    children: <Textarea rows={3} placeholder="What is this project about?" />,
  },
}

/** Render-function form for an input + button row: the input gets the wiring, the button stays outside it. */
export const InputWithButton: Story = {
  args: { label: 'Invite by email', hint: 'They get an email with a link to join the workspace.' },
  render: (args) => (
    <Field {...args}>
      {(control) => (
        <div className="flex gap-2">
          <Input {...control} type="email" placeholder="name@example.com" />
          <Button icon={<Plus />} size="md" className="shrink-0">
            Add
          </Button>
        </div>
      )}
    </Field>
  ),
}

/**
 * `labelAs="span"` for a group without a single focus target: the label becomes a span with an id and
 * the group gets `aria-labelledby`, so it is announced as "Billing plan".
 */
export const LabelledGroup: Story = {
  args: { label: 'Billing plan', labelAs: 'span', hint: 'You can change plans at any time.' },
  render: (args) => (
    <Field {...args}>
      <RadioGroup defaultValue="pro">
        {[
          { value: 'free', label: 'Free', detail: 'Up to 3 members' },
          { value: 'pro', label: 'Pro', detail: '$12 per member / month' },
          { value: 'enterprise', label: 'Enterprise', detail: 'SSO, audit logs, SLA' },
        ].map((plan) => (
          <div key={plan.value} className="flex items-center gap-2">
            <RadioGroupItem value={plan.value} id={`plan-${plan.value}`} />
            <Label htmlFor={`plan-${plan.value}`} className="font-normal">
              {plan.label}
              <span className="text-foreground-lighter">{plan.detail}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('radiogroup', { name: 'Billing plan' })
    await expect(group).toHaveAccessibleDescription('You can change plans at any time.')
  },
}

export const Disabled: Story = {
  args: {
    label: 'Workspace URL',
    hint: 'Contact an owner to change it.',
    children: <Input mono disabled defaultValue="acme.example.com" />,
  },
}

export const LongContent: Story = {
  args: {
    label: 'Default reply-to address for every notification sent to your customers',
    hint: 'When left empty, replies go to the address of the team member who triggered the notification. Use a shared inbox if several people answer customer questions.',
    error: undefined,
    children: <Input type="email" placeholder="support@example.com" />,
  },
}

function ValidatedEmailField(props: React.ComponentProps<typeof Field>) {
  const [value, setValue] = React.useState('')
  const error = value && !EMAIL_RE.test(value) ? 'Enter a valid email address, like name@example.com.' : undefined
  return (
    <Field {...props} label="Work email" hint="We send the sign-in link here." error={error}>
      <Input type="email" value={value} onChange={(e) => setValue(e.target.value)} placeholder="name@example.com" />
    </Field>
  )
}

/** Live validation: the error line appears while the value is invalid and the control's ARIA state follows it. */
export const Validation: Story = {
  render: (args) => <ValidatedEmailField {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Work email')
    await expect(input).toHaveAttribute('aria-describedby', `${input.id}-hint`)

    await userEvent.type(input, 'ada@')
    const alert = await canvas.findByRole('alert')
    await expect(alert).toHaveAttribute('id', `${input.id}-error`)
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toHaveAttribute('aria-describedby', `${input.id}-error`)
    await expect(input).toHaveAccessibleDescription('Enter a valid email address, like name@example.com.')

    await userEvent.type(input, 'example.com')
    await waitFor(() => expect(canvas.queryByRole('alert')).toBeNull())
    await expect(input).not.toHaveAttribute('aria-invalid')
    await expect(input).toHaveAttribute('aria-describedby', `${input.id}-hint`)

    // Clicking the label forwards the click to the control and focuses it. `fireEvent` rather than
    // `userEvent`: user-event's label forwarding crashes in jsdom, which also skips the focus step.
    input.blur()
    await expect(input).not.toHaveFocus()
    const label = canvas.getByText('Work email')
    await expect(label).toHaveAttribute('for', input.id)
    const forwarded = fn()
    input.addEventListener('click', forwarded)
    fireEvent.click(label)
    await expect(forwarded).toHaveBeenCalled()
    if (!navigator.userAgent.includes('jsdom')) await waitFor(() => expect(input).toHaveFocus())
  },
}

const ROLES = [
  { value: 'member', label: 'Member' },
  { value: 'admin', label: 'Admin' },
  { value: 'billing', label: 'Billing manager' },
]

function InviteMemberDialog(props: { defaultOpen?: boolean }) {
  const [email, setEmail] = React.useState('')
  const [role, setRole] = React.useState('member')
  const [submitted, setSubmitted] = React.useState(false)
  const emailError = !submitted
    ? undefined
    : !email.trim()
      ? 'Enter an email address.'
      : !EMAIL_RE.test(email.trim())
        ? 'Enter a valid email address, like name@example.com.'
        : undefined

  return (
    <Dialog defaultOpen={props.defaultOpen}>
      <DialogTrigger asChild>
        <Button icon={<UserPlus />}>Invite member</Button>
      </DialogTrigger>
      <DialogContent>
        <form
          noValidate
          className="flex min-h-0 flex-col"
          onSubmit={(e) => {
            e.preventDefault()
            setSubmitted(true)
          }}
        >
          <DialogHeader>
            <DialogTitle>Invite team member</DialogTitle>
            <DialogDescription>They get an email with a link to join the workspace.</DialogDescription>
          </DialogHeader>
          <DialogBody className="gap-5">
            <Field size="sm" label="Email" hint="Use their work address." error={emailError}>
              <Input
                type="email"
                autoComplete="off"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field size="sm" label="Role" hint="Admins can manage members and billing.">
              {(control) => (
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger {...control} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {ROLES.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="primary">
              Send invite
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/** Realistic dialog form: two `sm` fields (an input and a select) validated on submit. */
export const DialogForm: Story = {
  parameters: { layout: 'padded', ...openInDocs },
  render: () => <InviteMemberDialog defaultOpen />,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const dialog = await body.findByRole('dialog', { name: 'Invite team member' })
    const inDialog = within(dialog)

    await userEvent.click(inDialog.getByRole('button', { name: 'Send invite' }))
    const email = inDialog.getByLabelText('Email')
    await expect(await inDialog.findByRole('alert')).toHaveTextContent('Enter an email address.')
    await expect(email).toHaveAttribute('aria-invalid', 'true')
    await expect(email).toHaveAttribute('aria-describedby', `${email.id}-error`)

    await userEvent.type(email, 'ada@example.com')
    await waitFor(() => expect(inDialog.queryByRole('alert')).toBeNull())
    await expect(email).toHaveAttribute('aria-describedby', `${email.id}-hint`)

    const role = inDialog.getByRole('combobox', { name: 'Role' })
    await expect(role).toHaveAccessibleDescription('Admins can manage members and billing.')
    await expect(role).toHaveTextContent('Member')
  },
}
