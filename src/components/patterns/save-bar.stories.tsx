import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Send } from 'lucide-react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../primitives/card'
import { Input } from '../primitives/input'
import { Label } from '../primitives/label'
import { Textarea } from '../primitives/textarea'

import { SaveBar } from './save-bar'

const meta = {
  title: 'Patterns/Save Bar',
  component: SaveBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Save footer for editors and long forms: unsaved / invalid status, last save error or a neutral summary on the left, then Cancel, Save and an optional `extraAction` ("Save & publish") on the right. Use the default `bar` variant at the bottom of a card or section (add `sticky` for long forms) and `inline` inside a container that already draws the footer strip. For a simple form card footer without error or extra action, `FormActions` is enough.',
      },
    },
  },
  args: {
    dirty: true,
    invalid: false,
    saving: false,
    hint: '8 fields',
    saveLabel: 'Save changes',
    cancelLabel: 'Cancel',
    variant: 'bar',
    sticky: false,
    onReset: fn(),
    onSave: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['bar', 'inline'] },
    error: { control: 'text' },
    hint: { control: 'text' },
    saveLabel: { control: 'text' },
    cancelLabel: { control: 'text' },
    unsavedLabel: { control: 'text' },
    invalidMessage: { control: 'text' },
    extraAction: { control: false },
    onReset: { control: false },
    onSave: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl overflow-hidden rounded-lg border bg-card">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SaveBar>

export default meta
type Story = StoryObj<typeof meta>

/** Unsaved edits: amber status dot, Cancel and Save enabled. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }))
    await expect(args.onSave).toHaveBeenCalledOnce()
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }))
    await expect(args.onReset).toHaveBeenCalledOnce()
  },
}

/** Nothing to save: the neutral `hint` shows and both buttons are disabled. */
export const Pristine: Story = {
  args: { dirty: false, hint: 'All changes saved' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('All changes saved')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Save changes' })).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Cancel' })).toBeDisabled()
  },
}

/** `invalid` keeps Save disabled and appends `invalidMessage` to the status. */
export const Invalid: Story = {
  args: { invalid: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(/fix the highlighted fields/)).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Save changes' })).toBeDisabled()
  },
}

/** A save in flight: spinner on Save, Cancel disabled. */
export const Saving: Story = {
  args: { saving: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Save changes' })).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Cancel' })).toBeDisabled()
  },
}

/** The last save failed: the error replaces the status and is announced as an alert. */
export const WithError: Story = {
  args: { error: 'Could not save: the billing email is already used by another workspace.' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toHaveTextContent('already used by another workspace')
  },
}

/** Long errors wrap instead of pushing the buttons out. */
export const LongError: Story = {
  args: {
    error:
      'Request failed with status 422: the discount code SPRING-LAUNCH-2026-EARLY-ADOPTERS expired on March 31 and can no longer be attached to new invoices or subscriptions.',
  },
}

/** Without `onReset` there is no Cancel button. */
export const WithoutCancel: Story = {
  args: { onReset: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Save changes' })).toBeEnabled()
  },
}

/** `extraAction` adds a primary "save and …" flavour; Save is demoted and can be renamed. */
export const WithExtraAction: Story = {
  args: {
    saveLabel: 'Save draft',
    hint: 'Draft · last edited 2 min ago',
    extraAction: {
      label: 'Save & publish',
      icon: <Send />,
      hint: 'Saves, then emails the post to 1,204 subscribers',
      onClick: fn(),
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Save & publish' }))
    await expect(args.extraAction?.onClick).toHaveBeenCalledOnce()
  },
}

/** The extra action is running: spinner on it, Save and Cancel disabled. */
export const ExtraActionLoading: Story = {
  args: {
    saveLabel: 'Save draft',
    extraAction: { label: 'Save & publish', icon: <Send />, onClick: fn(), loading: true },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Save draft' })).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Cancel' })).toBeDisabled()
  },
}

/** `inline` renders only the row: here inside a `CardFooter`, which draws the border and padding. */
export const Inline: Story = {
  args: { variant: 'inline' },
  render: (args) => (
    <Card className="gap-0 rounded-none border-0 shadow-none">
      <CardHeader>
        <CardTitle>Notification settings</CardTitle>
      </CardHeader>
      <CardContent className="text-[13px] text-foreground-light">Weekly digest, mentions and invoice reminders.</CardContent>
      <CardFooter>
        <SaveBar {...args} />
      </CardFooter>
    </Card>
  ),
}

const PROFILE = { name: 'Acme Industries', email: 'billing@acme.example', vat: 'FR40303265045', address: '12 rue de la Paix\n75002 Paris' }

function BillingProfileForm({ onSaved }: { onSaved: (values: typeof PROFILE) => void }) {
  const [saved, setSaved] = React.useState(PROFILE)
  const [values, setValues] = React.useState(PROFILE)
  const [saving, setSaving] = React.useState(false)
  const dirty = (Object.keys(PROFILE) as (keyof typeof PROFILE)[]).some((k) => values[k] !== saved[k])
  const emailInvalid = !/^\S+@\S+\.\S+$/.test(values.email)
  const field = (k: keyof typeof PROFILE) => ({
    value: values[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValues((v) => ({ ...v, [k]: e.target.value })),
  })

  return (
    <form
      noValidate
      className="flex max-h-80 flex-col overflow-y-auto"
      onSubmit={(e) => {
        e.preventDefault()
        if (!dirty || emailInvalid) return
        setSaving(true)
        setTimeout(() => {
          setSaved(values)
          setSaving(false)
          onSaved(values)
        }, 400)
      }}
    >
      <div className="flex flex-col gap-4 px-5 py-5 md:px-6">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bp-name">Company name</Label>
          <Input id="bp-name" {...field('name')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bp-email">Billing email</Label>
          <Input id="bp-email" type="email" aria-invalid={emailInvalid || undefined} {...field('email')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bp-vat">VAT number</Label>
          <Input id="bp-vat" mono {...field('vat')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bp-address">Billing address</Label>
          <Textarea id="bp-address" {...field('address')} />
        </div>
      </div>
      <SaveBar
        sticky
        dirty={dirty}
        invalid={emailInvalid}
        saving={saving}
        hint="Shown on every invoice"
        onReset={() => setValues(saved)}
      />
    </form>
  )
}

/**
 * Realistic composition: a scrolling billing form with a `sticky` bar. Save is the form's submit button
 * (no `onSave`), so Enter in a field saves too.
 */
export const StickyInForm: Story = {
  args: { onSave: fn() },
  render: (args) => <BillingProfileForm onSaved={() => args.onSave?.()} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Shown on every invoice')).toBeInTheDocument()
    const name = canvas.getByLabelText('Company name')
    await userEvent.type(name, ' Ltd')
    await expect(canvas.getByText('Unsaved changes')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }))
    await expect(await canvas.findByText('Shown on every invoice', {}, { timeout: 2000 })).toBeInTheDocument()
    await expect(args.onSave).toHaveBeenCalledOnce()
  },
}
