import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Button } from './button'
import { Checkbox } from './checkbox'
import { Label } from './label'

const meta = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component:
          'Square 16px checkbox for independent choices confirmed by a Save / Submit button (terms, multi-select lists, row selection). Wrap it in a `Label` so the text is clickable, or give it an `aria-label` when it stands alone. Use `checked="indeterminate"` for a "select all" whose items are only partly selected. For settings that apply immediately use `Switch`; for one choice among several use `RadioGroup`.',
      },
    },
  },
  args: {
    'aria-label': 'Accept',
    onCheckedChange: fn(),
  },
  argTypes: {
    checked: { control: 'inline-radio', options: [false, true, 'indeterminate'] },
    defaultChecked: { control: 'inline-radio', options: [false, true, 'indeterminate'] },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    'aria-invalid': { control: 'boolean' },
    asChild: { control: false },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  args: { defaultChecked: true },
}

/** Partly selected: solid fill with a dash. Clicking it calls `onCheckedChange(true)`. */
export const Indeterminate: Story = {
  args: { defaultChecked: 'indeterminate', 'aria-label': 'Select all' },
}

export const States: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Label>
        <Checkbox {...args} aria-label={undefined} />
        Unchecked
      </Label>
      <Label>
        <Checkbox {...args} aria-label={undefined} defaultChecked />
        Checked
      </Label>
      <Label>
        <Checkbox {...args} aria-label={undefined} defaultChecked="indeterminate" />
        Indeterminate
      </Label>
      <Label>
        <Checkbox {...args} aria-label={undefined} disabled />
        Disabled
      </Label>
      <Label>
        <Checkbox {...args} aria-label={undefined} disabled defaultChecked />
        Disabled checked
      </Label>
      <Label>
        <Checkbox {...args} aria-label={undefined} aria-invalid />
        Invalid
      </Label>
    </div>
  ),
}

/** Label on the right plus a description line under it. */
export const WithDescription: Story = {
  render: (args) => (
    <div className="flex max-w-sm items-start gap-2.5">
      <Checkbox {...args} id="weekly-report" aria-label={undefined} aria-describedby="weekly-report-hint" className="mt-0.5" />
      <div className="flex flex-col gap-0.5">
        <Label htmlFor="weekly-report" className="text-[13px]">
          Email me a weekly usage report
        </Label>
        <p id="weekly-report-hint" className="text-[12.5px] text-foreground-lighter">
          Sent every Monday to all workspace admins.
        </p>
      </div>
    </div>
  ),
}

const PERMISSIONS = [
  { id: 'read', label: 'Read projects' },
  { id: 'write', label: 'Create and edit projects' },
  { id: 'billing', label: 'Manage billing' },
  { id: 'members', label: 'Invite members' },
] as const

/** Multi-select list: each permission is independent. */
export const Group: Story = {
  render: (args) => (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="mb-2 mono-label">API key permissions</legend>
      {PERMISSIONS.map((perm, i) => (
        <Label key={perm.id} className="text-[13px] font-normal text-foreground-light">
          <Checkbox {...args} aria-label={undefined} name="permissions" value={perm.id} defaultChecked={i === 0} />
          {perm.label}
        </Label>
      ))}
    </fieldset>
  ),
}

const MEMBERS = [
  { id: 'jane', name: 'Jane Cooper', email: 'jane@acme.com' },
  { id: 'wade', name: 'Wade Warren', email: 'wade@acme.com' },
  { id: 'esther', name: 'Esther Howard', email: 'esther@acme.com' },
] as const

function SelectAllList() {
  const [selected, setSelected] = React.useState<string[]>(['jane'])
  const all = selected.length === MEMBERS.length
  const some = selected.length > 0 && !all

  return (
    <div className="flex w-80 flex-col rounded-lg border bg-card shadow-card">
      <div className="flex items-center gap-2.5 border-b px-4 py-2.5">
        <Checkbox
          aria-label="Select all members"
          checked={all ? true : some ? 'indeterminate' : false}
          onCheckedChange={(value) => setSelected(value === true ? MEMBERS.map((m) => m.id) : [])}
        />
        <span className="mono-label">{selected.length ? `${selected.length} selected` : 'Members'}</span>
      </div>
      <ul className="divide-y">
        {MEMBERS.map((member) => (
          <li key={member.id}>
            <Label className="px-4 py-2.5 font-normal">
              <Checkbox
                checked={selected.includes(member.id)}
                onCheckedChange={(value) =>
                  setSelected((prev) => (value === true ? [...prev, member.id] : prev.filter((id) => id !== member.id)))
                }
              />
              <span className="flex min-w-0 flex-col">
                <span className="text-[13px] text-foreground">{member.name}</span>
                <span className="truncate text-[12px] text-foreground-lighter">{member.email}</span>
              </span>
            </Label>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** "Select all" header driving a list: `indeterminate` while only some rows are selected. */
export const SelectAll: Story = {
  render: () => <SelectAllList />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const selectAll = canvas.getByRole('checkbox', { name: 'Select all members' })
    await expect(selectAll).toHaveAttribute('aria-checked', 'mixed')

    await userEvent.click(selectAll)
    await expect(selectAll).toBeChecked()
    for (const checkbox of canvas.getAllByRole('checkbox')) await expect(checkbox).toBeChecked()

    await userEvent.click(canvas.getByRole('checkbox', { name: /Wade Warren/ }))
    await expect(selectAll).toHaveAttribute('aria-checked', 'mixed')

    await userEvent.click(selectAll)
    await expect(selectAll).toBeChecked()
    await userEvent.click(selectAll)
    for (const checkbox of canvas.getAllByRole('checkbox')) await expect(checkbox).not.toBeChecked()

    await userEvent.click(canvas.getByRole('checkbox', { name: /Jane Cooper/ }))
    await expect(selectAll).toHaveAttribute('aria-checked', 'mixed')
    await expect(canvas.getByText('1 selected')).toBeInTheDocument()
  },
}

function TermsForm() {
  const [accepted, setAccepted] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [submitted, setSubmitted] = React.useState(false)

  return (
    <form
      noValidate
      className="flex w-96 flex-col gap-4 rounded-lg border bg-card p-5 shadow-card"
      onSubmit={(event) => {
        event.preventDefault()
        setError(accepted ? null : 'You must accept the terms to continue.')
        setSubmitted(accepted)
      }}
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-2.5">
          <Checkbox
            id="terms"
            className="mt-0.5"
            checked={accepted}
            onCheckedChange={(value) => {
              setAccepted(value === true)
              if (value === true) setError(null)
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'terms-error' : 'terms-hint'}
          />
          <div className="flex flex-col gap-0.5">
            <Label htmlFor="terms" className="text-[13px]">
              I accept the terms of service
            </Label>
            <p id="terms-hint" className="text-[12.5px] text-foreground-lighter">
              Including the data processing agreement.
            </p>
          </div>
        </div>
        {error && (
          <p id="terms-error" role="alert" className="text-[12.5px] text-destructive">
            {error}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between gap-3">
        <p role="status" className="text-[12.5px] text-success">
          {submitted && 'Workspace created.'}
        </p>
        <Button type="submit" variant="primary">
          Create workspace
        </Button>
      </div>
    </form>
  )
}

/** Realistic form: a required checkbox with helper text and an error shown on submit. */
export const RequiredInForm: Story = {
  render: () => <TermsForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const submit = canvas.getByRole('button', { name: 'Create workspace' })

    await userEvent.click(submit)
    await expect(await canvas.findByRole('alert')).toHaveTextContent('You must accept the terms')

    // The accessible name comes from the linked <Label htmlFor>.
    const checkbox = canvas.getByRole('checkbox', { name: 'I accept the terms of service' })
    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()
    await expect(canvas.queryByRole('alert')).toBeNull()

    await userEvent.click(submit)
    await expect(canvas.getByRole('status')).toHaveTextContent('Workspace created.')
  },
}

export const ToggleInteraction: Story = {
  args: { 'aria-label': 'Subscribe to product updates' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', { name: 'Subscribe to product updates' })
    await expect(checkbox).not.toBeChecked()
    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true)
  },
}
