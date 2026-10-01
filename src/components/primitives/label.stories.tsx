import type { Meta, StoryObj } from '@storybook/react-vite'
import { Info } from 'lucide-react'
import { expect, fireEvent, within } from 'storybook/test'

import { Checkbox } from './checkbox'
import { Input } from './input'
import { Label } from './label'
import { Switch } from './switch'

const meta = {
  title: 'Primitives/Label',
  component: Label,
  parameters: {
    docs: {
      description: {
        component:
          'Accessible label for a form control. Connect it with `htmlFor` + the control `id` (or wrap the control) so clicking it focuses or toggles the control. Put it above text inputs and to the right of checkboxes and switches; it dims automatically next to a disabled `peer` control or inside a `group` with `data-disabled="true"`.',
      },
    },
  },
  args: {
    children: 'Email address',
    htmlFor: 'label-default-input',
  },
  argTypes: {
    asChild: { control: false },
  },
  render: (args) => (
    <div className="flex w-72 flex-col gap-2">
      <Label {...args} />
      <Input id="label-default-input" type="email" placeholder="you@example.com" />
    </div>
  ),
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    // `htmlFor` ties the label to the input: it becomes the input's accessible name.
    const input = within(canvasElement).getByLabelText(String(args.children))
    await expect(input).toHaveAttribute('id', args.htmlFor)
  },
}

export const WithCheckbox: Story = {
  args: { children: 'Email me product updates', htmlFor: 'label-checkbox' },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="label-checkbox" />
      <Label {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', { name: 'Email me product updates' })
    await expect(checkbox).not.toBeChecked()
    // Clicking the label toggles its control. `fireEvent` rather than `userEvent`: user-event's
    // label-forwarding crashes in jsdom ("Failed to construct 'PointerEvent'").
    await fireEvent.click(canvas.getByText('Email me product updates'))
    await expect(checkbox).toBeChecked()
  },
}

export const WrappingControl: Story = {
  args: { htmlFor: undefined },
  parameters: {
    docs: {
      description: {
        story:
          'Without `htmlFor`, wrap the control inside the label: the label is flex with an 8px gap, so the control and its text line up.',
      },
    },
  },
  render: (args) => (
    <Label {...args}>
      <Checkbox />
      Remember this device
    </Label>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', { name: 'Remember this device' })
    await expect(checkbox).not.toBeChecked()
    await fireEvent.click(canvas.getByText('Remember this device'))
    await expect(checkbox).toBeChecked()
  },
}

export const WithSwitch: Story = {
  args: { children: 'Two-factor authentication', htmlFor: 'label-switch' },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Switch id="label-switch" defaultChecked />
      <Label {...args} />
    </div>
  ),
}

export const Disabled: Story = {
  args: { children: 'Billing email', htmlFor: 'label-disabled-input' },
  parameters: {
    docs: {
      description: {
        story:
          'Two ways to dim a label: place it after a disabled control that has the `peer` class, or put it inside a `group` element with `data-disabled="true"`.',
      },
    },
  },
  render: (args) => (
    <div className="flex w-72 flex-col gap-5">
      <div className="flex items-center gap-2">
        <Checkbox id="label-disabled-checkbox" disabled className="peer" />
        <Label htmlFor="label-disabled-checkbox">Send weekly digest (peer-disabled)</Label>
      </div>
      <div data-disabled="true" className="group flex flex-col gap-2">
        <Label {...args} />
        <Input id="label-disabled-input" disabled defaultValue="billing@example.com" />
      </div>
    </div>
  ),
}

export const WithHintAndRequired: Story = {
  args: { htmlFor: 'label-api-key-name' },
  render: (args) => (
    <div className="flex w-80 flex-col gap-2">
      <Label {...args}>
        Key name
        <span className="text-destructive" aria-hidden="true">
          *
        </span>
        <Info className="size-3.5 text-foreground-lighter" aria-hidden="true" />
      </Label>
      <Input id="label-api-key-name" required aria-describedby="label-api-key-hint" placeholder="Production server" />
      <p id="label-api-key-hint" className="text-[13px] text-foreground-lighter">
        Only used to identify the API key in your dashboard.
      </p>
    </div>
  ),
}

export const Invalid: Story = {
  args: { children: 'Coupon code', htmlFor: 'label-invalid' },
  render: (args) => (
    <div className="flex w-72 flex-col gap-2">
      <Label {...args} />
      <Input id="label-invalid" mono aria-invalid="true" aria-describedby="label-invalid-error" defaultValue="SPRING-25" />
      <p id="label-invalid-error" className="text-[13px] text-destructive">
        This code has expired.
      </p>
    </div>
  ),
}

export const LongContent: Story = {
  args: {
    htmlFor: 'label-long',
    children:
      'I agree that my usage data may be processed to improve the product, as described in the privacy policy and data processing agreement',
  },
  render: (args) => (
    <div className="flex w-80 items-start gap-2">
      <Checkbox id="label-long" className="mt-0.5" />
      <Label {...args} />
    </div>
  ),
}
