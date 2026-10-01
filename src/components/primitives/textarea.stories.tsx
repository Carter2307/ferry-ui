import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Button } from './button'
import { Label } from './label'
import { Textarea } from './textarea'

const meta = {
  title: 'Primitives/Textarea',
  component: Textarea,
  parameters: {
    docs: {
      description: {
        component:
          'Multi-line text field with the same states as `Input`; it grows with its content from an 80px minimum. Use `mono` for code-like content (JSON, lists of keys, certificates). Cap the height with `max-h-*` for long pastes, and pair it with a `Label` plus helper / error text.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  args: {
    placeholder: 'Describe the issue…',
    onChange: fn(),
  },
  argTypes: {
    mono: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    'aria-invalid': { control: 'boolean' },
    rows: { control: 'number' },
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { 'aria-label': 'Issue description' },
}

export const Mono: Story = {
  args: {
    mono: true,
    'aria-label': 'Payload',
    defaultValue: '{\n  "event": "invoice.paid",\n  "invoice_id": "inv_2026_000184",\n  "amount": 4900,\n  "currency": "usd"\n}',
  },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Archived projects cannot be edited.', 'aria-label': 'Notes' },
}

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    mono: true,
    'aria-label': 'Webhook payload',
    defaultValue: '{\n  "event": "invoice.paid",\n  "invoice": "INV-2041",\n  "amount": 1280,\n  "currency": "eur"\n}',
  },
}

export const Invalid: Story = {
  args: { 'aria-invalid': true, defaultValue: 'Too short', 'aria-label': 'Description' },
}

/** Auto-growth stops at `max-h-40`; the rest scrolls. */
export const LongContentCapped: Story = {
  args: {
    className: 'max-h-40',
    'aria-label': 'Release notes',
    defaultValue: Array.from(
      { length: 14 },
      (_, i) => `- Item ${i + 1}: improved performance of the invoices list and fixed pagination edge cases.`,
    ).join('\n'),
  },
}

/** Opt out of auto-growth with `field-sizing-fixed`; `rows` then sets the height. */
export const FixedRows: Story = {
  args: { className: 'field-sizing-fixed', rows: 3, 'aria-label': 'Short note', placeholder: 'Three rows, no auto-growth' },
}

const MAX_LENGTH = 280

function FeedbackForm() {
  const [message, setMessage] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const id = React.useId()
  const remaining = MAX_LENGTH - message.length

  return (
    <form
      noValidate
      className="flex flex-col gap-4 rounded-lg border bg-card p-5 shadow-card"
      onSubmit={(event) => {
        event.preventDefault()
        setError(message.trim().length < 10 ? 'Tell us a bit more (at least 10 characters).' : null)
      }}
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <Label htmlFor={`${id}-message`} className="text-[13px]">
            Feedback
          </Label>
          <span data-testid="counter" className="tabular text-[12px] text-foreground-lighter">
            {remaining} left
          </span>
        </div>
        <Textarea
          id={`${id}-message`}
          placeholder="What could we improve in the billing dashboard?"
          maxLength={MAX_LENGTH}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-${error ? 'error' : 'hint'}`}
        />
        {error ? (
          <p id={`${id}-error`} role="alert" className="text-[12.5px] text-destructive">
            {error}
          </p>
        ) : (
          <p id={`${id}-hint`} className="text-[12.5px] text-foreground-lighter">
            Visible to the product team only.
          </p>
        )}
      </div>
      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Send feedback
        </Button>
      </div>
    </form>
  )
}

/** Realistic form: label with a live character counter, helper text and validation on submit. */
export const FeedbackFormComposition: Story = {
  name: 'Feedback form',
  render: () => <FeedbackForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByLabelText('Feedback')

    await userEvent.type(field, 'Slow')
    await expect(canvas.getByTestId('counter')).toHaveTextContent(`${MAX_LENGTH - 4} left`)
    await userEvent.click(canvas.getByRole('button', { name: 'Send feedback' }))
    await expect(await canvas.findByRole('alert')).toHaveTextContent('at least 10 characters')
    await expect(field).toHaveAttribute('aria-invalid', 'true')
  },
}

export const TypingInteraction: Story = {
  args: { 'aria-label': 'Notes', placeholder: 'Notes' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByRole('textbox', { name: 'Notes' })
    await userEvent.type(field, 'First line{enter}Second line')
    await expect(field).toHaveValue('First line\nSecond line')
    await expect(args.onChange).toHaveBeenCalled()
  },
}
