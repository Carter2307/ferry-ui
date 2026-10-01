import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Search } from 'lucide-react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Button } from './button'
import { Input, inputVariants } from './input'
import { Label } from './label'

const meta = {
  title: 'Primitives/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component:
          'Single-line text field with the same heights as `Button` (`tiny` 26 · `sm` 30 · `md` 34 · `lg` 38px), so a field and its action line up. Use `mono` for machine values (IDs, slugs, URLs, keys), `readOnly` for copyable values and `aria-invalid` plus an error line for validation. Always pair it with a `Label` and link helper / error text via `aria-describedby`.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  args: {
    placeholder: 'Acme Inc.',
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['tiny', 'sm', 'md', 'lg'] },
    mono: { control: 'boolean' },
    type: { control: 'select', options: ['text', 'email', 'password', 'number', 'search', 'url', 'tel', 'file'] },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    'aria-invalid': { control: 'boolean' },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { 'aria-label': 'Organization name' },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Input {...args} size="tiny" placeholder="Tiny · 26px" aria-label="Tiny input" />
      <Input {...args} size="sm" placeholder="Small · 30px" aria-label="Small input" />
      <Input {...args} size="md" placeholder="Medium · 34px (default)" aria-label="Medium input" />
      <Input {...args} size="lg" placeholder="Large · 38px" aria-label="Large input" />
    </div>
  ),
}

export const Mono: Story = {
  args: { mono: true, defaultValue: 'inv_2026_000184', 'aria-label': 'Invoice ID' },
}

export const Types: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Input {...args} type="email" placeholder="jane@acme.com" aria-label="Email" />
      <Input {...args} type="password" defaultValue="correct-horse-battery" aria-label="Password" />
      <Input {...args} type="number" defaultValue={12} min={1} max={50} aria-label="Seats" />
      <Input {...args} type="url" mono placeholder="https://acme.com/webhooks" aria-label="Webhook URL" />
      <Input {...args} type="file" aria-label="Logo" />
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Acme Inc.', 'aria-label': 'Organization name' },
}

export const ReadOnly: Story = {
  args: { readOnly: true, mono: true, defaultValue: 'org_8f2k1m9x', 'aria-label': 'Organization ID' },
}

export const Invalid: Story = {
  args: { 'aria-invalid': true, defaultValue: 'jane@', type: 'email', 'aria-label': 'Email' },
}

/** A focused invalid field keeps a clearly visible ring, in the destructive colour instead of the primary one. */
export const InvalidFocused: Story = {
  args: { 'aria-invalid': true, defaultValue: 'jane@', type: 'email', 'aria-label': 'Email' },
  play: async ({ canvasElement }) => {
    const field = within(canvasElement).getByRole('textbox', { name: 'Email' })
    await userEvent.tab()
    await expect(field).toHaveFocus()
    await expect(field).toHaveAttribute('aria-invalid', 'true')
    await expect(field).toHaveClass('aria-invalid:focus-visible:ring-destructive/80')
  },
}

export const LongValue: Story = {
  args: {
    mono: true,
    'aria-label': 'Callback URL',
    defaultValue: 'https://billing.acme.com/api/v2/callbacks/invoices/paid?source=checkout&retry=3&signature=required',
  },
}

/** Label on top, helper text below, linked with `htmlFor` / `aria-describedby`. */
export const WithLabelAndHelper: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="project-name" className="text-[13px]">
        Project name
      </Label>
      <Input {...args} id="project-name" placeholder="marketing-site" mono aria-describedby="project-name-hint" />
      <p id="project-name-hint" className="text-[12.5px] text-foreground-lighter">
        Lowercase letters, digits and dashes. Shown in URLs.
      </p>
    </div>
  ),
}

/** Invalid field: `aria-invalid` paints the border, the error line replaces the helper and is announced. */
export const WithError: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="billing-email" className="text-[13px]">
        Billing email
      </Label>
      <Input
        {...args}
        id="billing-email"
        type="email"
        defaultValue="finance@acme"
        aria-invalid
        aria-describedby="billing-email-error"
      />
      <p id="billing-email-error" role="alert" className="text-[12.5px] text-destructive">
        Enter a valid email address, like finance@acme.com.
      </p>
    </div>
  ),
}

/** Leading icon: position it absolutely and pad the field. */
export const WithLeadingIcon: Story = {
  render: (args) => (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-foreground-lighter" />
      <Input {...args} type="search" size="sm" className="pl-8" placeholder="Search invoices…" aria-label="Search invoices" />
    </div>
  ),
}

/** Same `size` on field and button keeps the row aligned. */
export const WithButton: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Input {...args} size="sm" type="email" placeholder="teammate@acme.com" aria-label="Email" />
        <Button size="sm" variant="primary">
          Invite
        </Button>
      </div>
      <div className="flex gap-2">
        <Input {...args} size="md" type="email" placeholder="teammate@acme.com" aria-label="Email" />
        <Button size="md" variant="primary">
          Invite
        </Button>
      </div>
    </div>
  ),
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function InviteMemberForm() {
  const [email, setEmail] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [sentTo, setSentTo] = React.useState<string | null>(null)
  const id = React.useId()

  return (
    <form
      noValidate
      className="flex flex-col gap-4 rounded-lg border bg-card p-5 shadow-card"
      onSubmit={(event) => {
        event.preventDefault()
        if (!EMAIL_RE.test(email)) {
          setError('Enter a valid email address.')
          setSentTo(null)
          return
        }
        setError(null)
        setSentTo(email)
        setEmail('')
      }}
    >
      <div className="flex flex-col gap-0.5">
        <h3 className="text-sm font-medium text-foreground">Invite a team member</h3>
        <p className="text-[13px] text-foreground-light">They will get an email with a link to join Acme.</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${id}-email`} className="text-[13px]">
          Email address
        </Label>
        <Input
          id={`${id}-email`}
          type="email"
          placeholder="jane@acme.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-${error ? 'error' : 'hint'}`}
        />
        {error ? (
          <p id={`${id}-error`} role="alert" className="text-[12.5px] text-destructive">
            {error}
          </p>
        ) : (
          <p id={`${id}-hint`} className="text-[12.5px] text-foreground-lighter">
            Use their work address.
          </p>
        )}
      </div>
      <div className="flex items-center justify-between gap-3">
        <p role="status" className="min-w-0 truncate text-[12.5px] text-success">
          {sentTo && `Invitation sent to ${sentTo}`}
        </p>
        <Button type="submit" variant="primary">
          Send invite
        </Button>
      </div>
    </form>
  )
}

/** Realistic form: validation on submit swaps the helper for an announced error. */
export const InviteForm: Story = {
  render: () => <InviteMemberForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByLabelText('Email address')
    const submit = canvas.getByRole('button', { name: 'Send invite' })

    await userEvent.type(field, 'jane@acme')
    await userEvent.click(submit)
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Enter a valid email address.')
    await expect(field).toHaveAttribute('aria-invalid', 'true')

    await userEvent.type(field, '.com')
    await userEvent.click(submit)
    await expect(canvas.getByRole('status')).toHaveTextContent('Invitation sent to jane@acme.com')
    await expect(canvas.queryByRole('alert')).toBeNull()
    await expect(field).toHaveValue('')
  },
}

export const TypingInteraction: Story = {
  args: { 'aria-label': 'Company name', placeholder: 'Company name' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByRole('textbox', { name: 'Company name' })
    await userEvent.type(field, 'Globex')
    await expect(field).toHaveValue('Globex')
    await expect(args.onChange).toHaveBeenCalled()
  },
}

/**
 * `inputVariants()` returns the field classes for a non-input element: here a read-only value box
 * (an `<output>`) that lines up with the `Input` next to it. A non-input element gets the read-only
 * tint. Prefer `<Input>` (with `readOnly`) whenever the element can be an `<input>`.
 */
export const ClassHelper: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="class-helper-seats">Seats</Label>
      <div className="flex gap-2">
        <Input id="class-helper-seats" type="number" size="sm" defaultValue={12} className="w-24" />
        <output
          htmlFor="class-helper-seats"
          aria-label="Monthly total"
          className={inputVariants({ size: 'sm', mono: true, className: 'flex items-center' })}
        >
          $240.00 / month
        </output>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const total = within(canvasElement).getByRole('status', { name: 'Monthly total' })
    await expect(total).toHaveClass('h-[30px]', 'font-mono', 'rounded-md', 'border-border-strong')
    await expect(total).toHaveTextContent('$240.00 / month')
  },
}
