import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Badge } from './badge'
import { Button } from './button'
import { Label } from './label'
import { RadioGroup, RadioGroupItem } from './radio-group'

const meta = {
  title: 'Primitives/Radio Group',
  component: RadioGroup,
  subcomponents: { RadioGroupItem },
  parameters: {
    docs: {
      description: {
        component:
          'Single choice among 2–5 options that should all stay visible; arrow keys move and select. Stack items (default) or lay them out in a row with `className="flex gap-4"`; wrap an item and its text in a bordered `<label>` for choice cards. Use `Select` for longer lists and `Switch` / `Checkbox` for on/off.',
      },
    },
  },
  args: {
    defaultValue: 'monthly',
    'aria-label': 'Billing cycle',
    onValueChange: fn(),
  },
  argTypes: {
    // `value` is `string | null`: the inferred object control cannot produce a valid value, and a
    // controlled value set from the panel would freeze the selection. See `InForm` for controlled use.
    value: { control: false },
    defaultValue: { control: 'inline-radio', options: ['monthly', 'yearly', 'custom'] },
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    loop: { control: 'boolean' },
    asChild: { control: false },
  },
  render: (args) => (
    // `defaultValue` is only read on mount: the key remounts the group when the control changes it.
    <RadioGroup key={args.defaultValue} {...args}>
      <Label className="text-[13px] font-normal">
        <RadioGroupItem value="monthly" />
        Monthly
      </Label>
      <Label className="text-[13px] font-normal">
        <RadioGroupItem value="yearly" />
        Yearly
      </Label>
      <Label className="text-[13px] font-normal">
        <RadioGroupItem value="custom" />
        Custom contract
      </Label>
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Horizontal: Story = {
  args: { orientation: 'horizontal', className: 'flex gap-5' },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const DisabledItem: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <Label className="text-[13px] font-normal">
        <RadioGroupItem value="monthly" />
        Monthly
      </Label>
      <Label className="text-[13px] font-normal">
        <RadioGroupItem value="yearly" />
        Yearly
      </Label>
      <Label className="text-[13px] font-normal">
        <RadioGroupItem value="custom" disabled />
        Custom contract (Enterprise only)
      </Label>
    </RadioGroup>
  ),
}

/** Items with `aria-invalid` plus an announced error line. */
export const Invalid: Story = {
  args: { defaultValue: undefined, 'aria-describedby': 'billing-error' },
  render: (args) => (
    <div className="flex flex-col gap-2">
      <RadioGroup {...args}>
        <Label className="text-[13px] font-normal">
          <RadioGroupItem value="monthly" aria-invalid />
          Monthly
        </Label>
        <Label className="text-[13px] font-normal">
          <RadioGroupItem value="yearly" aria-invalid />
          Yearly
        </Label>
      </RadioGroup>
      <p id="billing-error" role="alert" className="text-[12.5px] text-destructive">
        Choose a billing cycle.
      </p>
    </div>
  ),
}

const ROLES = [
  { value: 'viewer', label: 'Viewer', description: 'Can see projects and reports, cannot change anything.' },
  { value: 'member', label: 'Member', description: 'Can create and edit projects in the workspace.' },
  { value: 'admin', label: 'Admin', description: 'Full access, including billing and member management.' },
] as const

/** Each option with a description line; the item aligns to the first line. */
export const WithDescriptions: Story = {
  args: { defaultValue: 'member', 'aria-label': 'Role' },
  render: (args) => (
    <RadioGroup {...args} className="max-w-sm gap-4">
      {ROLES.map((role) => (
        <div key={role.value} className="flex items-start gap-2.5">
          <RadioGroupItem value={role.value} id={`role-${role.value}`} className="mt-0.5" aria-describedby={`role-${role.value}-hint`} />
          <div className="flex flex-col gap-0.5">
            <Label htmlFor={`role-${role.value}`} className="text-[13px]">
              {role.label}
            </Label>
            <p id={`role-${role.value}-hint`} className="text-[12.5px] text-foreground-lighter">
              {role.description}
            </p>
          </div>
        </div>
      ))}
    </RadioGroup>
  ),
}

const PLANS = [
  { value: 'starter', name: 'Starter', price: '$0', detail: 'Up to 3 projects' },
  { value: 'pro', name: 'Pro', price: '$29', detail: 'Unlimited projects', badge: 'Popular' },
  { value: 'team', name: 'Team', price: '$99', detail: 'SSO and audit log' },
] as const

/** Hand-built choice cards: a `<label>` card wraps each item; `has-data-[state=checked]` highlights the selected one. For a ready-made version use the `RadioCardGroup` pattern. */
export const ChoiceCards: Story = {
  args: { defaultValue: 'pro', 'aria-label': 'Plan' },
  parameters: { layout: 'padded' },
  render: (args) => (
    <RadioGroup {...args} className="grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
      {PLANS.map((plan) => (
        <label
          key={plan.value}
          className="flex cursor-pointer flex-col gap-3 rounded-lg border bg-card p-4 transition-colors hover:border-border-stronger has-data-[state=checked]:border-primary-bright/70 has-data-[state=checked]:bg-primary-soft"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-sm font-medium text-foreground">
              <RadioGroupItem value={plan.value} />
              {plan.name}
            </span>
            {'badge' in plan && <Badge variant="info">{plan.badge}</Badge>}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="tabular text-lg font-medium text-foreground">
              {plan.price}
              <span className="text-[13px] font-normal text-foreground-lighter"> / month</span>
            </span>
            <span className="text-[12.5px] text-foreground-lighter">{plan.detail}</span>
          </div>
        </label>
      ))}
    </RadioGroup>
  ),
}

function ExportForm() {
  const [format, setFormat] = React.useState<string>('')
  const [error, setError] = React.useState<string | null>(null)
  const [exported, setExported] = React.useState<string | null>(null)
  const id = React.useId()

  return (
    <form
      noValidate
      className="flex w-96 flex-col gap-4 rounded-lg border bg-card p-5 shadow-card"
      onSubmit={(event) => {
        event.preventDefault()
        if (!format) {
          setError('Pick an export format.')
          return
        }
        setError(null)
        setExported(format)
      }}
    >
      <div className="flex flex-col gap-1.5">
        <span id={`${id}-label`} className="text-[13px] font-medium text-foreground">
          Export invoices as
        </span>
        <RadioGroup
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-${error ? 'error' : 'hint'}`}
          value={format}
          onValueChange={(value) => {
            setFormat(value)
            setError(null)
          }}
          className="mt-1 flex gap-5"
        >
          {['CSV', 'PDF', 'JSON'].map((f) => (
            <Label key={f} className="text-[13px] font-normal">
              <RadioGroupItem value={f.toLowerCase()} aria-invalid={error ? true : undefined} />
              {f}
            </Label>
          ))}
        </RadioGroup>
        {error ? (
          <p id={`${id}-error`} role="alert" className="text-[12.5px] text-destructive">
            {error}
          </p>
        ) : (
          <p id={`${id}-hint`} className="text-[12.5px] text-foreground-lighter">
            Includes every invoice of the current year.
          </p>
        )}
      </div>
      <div className="flex items-center justify-between gap-3">
        <p role="status" className="text-[12.5px] text-success">
          {exported && `Export started (${exported.toUpperCase()}).`}
        </p>
        <Button type="submit" variant="primary">
          Export
        </Button>
      </div>
    </form>
  )
}

/** Realistic form: labelled group, helper text, and an error when nothing is picked. */
export const InForm: Story = {
  render: () => <ExportForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Export' }))
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Pick an export format.')

    await userEvent.click(canvas.getByRole('radio', { name: 'PDF' }))
    await expect(canvas.getByRole('radio', { name: 'PDF' })).toBeChecked()
    await userEvent.click(canvas.getByRole('button', { name: 'Export' }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Export started (PDF).')
  },
}

export const SelectInteraction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('radio', { name: 'Monthly' })).toBeChecked()

    await userEvent.click(canvas.getByRole('radio', { name: 'Yearly' }))
    await expect(canvas.getByRole('radio', { name: 'Yearly' })).toBeChecked()
    await expect(args.onValueChange).toHaveBeenLastCalledWith('yearly')

    // Arrow keys move focus and selection together (hold the key until focus has moved).
    await userEvent.keyboard('{ArrowDown>}')
    await waitFor(() => expect(canvas.getByRole('radio', { name: 'Custom contract' })).toBeChecked())
    await userEvent.keyboard('{/ArrowDown}')
    await expect(args.onValueChange).toHaveBeenLastCalledWith('custom')
  },
}
