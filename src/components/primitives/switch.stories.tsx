import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Label } from './label'
import { Switch } from './switch'

const meta = {
  title: 'Primitives/Switch',
  component: Switch,
  parameters: {
    docs: {
      description: {
        component:
          'On/off toggle for settings that apply immediately. Use `md` (34×20px, the default) in forms and settings rows, `sm` (28×16px) in dense lists, tables and menus. For a choice confirmed by a Save button use `Checkbox`. Always give it a name via `Label htmlFor` or `aria-label`.',
      },
    },
  },
  args: {
    'aria-label': 'Enable feature',
    onCheckedChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    checked: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    asChild: { control: false },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  args: { defaultChecked: true },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Switch {...args} size="md" defaultChecked aria-label="Medium size" />
        <Switch {...args} size="md" aria-label="Medium size, off" />
        <span className="text-[13px] text-foreground-light">md · 34×20 (default)</span>
      </div>
      <div className="flex items-center gap-3">
        <Switch {...args} size="sm" defaultChecked aria-label="Small size" />
        <Switch {...args} size="sm" aria-label="Small size, off" />
        <span className="text-[13px] text-foreground-light">sm · 28×16</span>
      </div>
    </div>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Switch {...args} disabled aria-label="Disabled off" />
      <Switch {...args} disabled defaultChecked aria-label="Disabled on" />
    </div>
  ),
}

/** Label beside the switch; clicking the text toggles it. */
export const WithLabel: Story = {
  render: (args) => (
    <div className="flex items-center gap-2.5">
      <Switch {...args} id="compact-sidebar" aria-label={undefined} />
      <Label htmlFor="compact-sidebar" className="text-[13px]">
        Compact sidebar
      </Label>
    </div>
  ),
}

const SETTINGS = [
  {
    id: 'product-updates',
    label: 'Product updates',
    description: 'Monthly email about new features and improvements.',
    defaultChecked: true,
  },
  {
    id: 'invoice-emails',
    label: 'Invoice emails',
    description: 'Send a copy of every invoice to the billing contact.',
    defaultChecked: true,
  },
  {
    id: 'weekly-digest',
    label: 'Weekly digest',
    description: 'A summary of activity across all your projects.',
    defaultChecked: false,
  },
  {
    id: 'sso-enforced',
    label: 'Require single sign-on',
    description: 'Available on the Team plan. Contact your admin to upgrade.',
    defaultChecked: false,
    disabled: true,
  },
] as const

/** Realistic settings card: label + description on the left, switch on the right, hairline separators. */
export const SettingsList: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="max-w-xl rounded-lg border bg-card shadow-card">
      <div className="border-b px-5 py-4">
        <h3 className="text-sm font-medium text-foreground">Notifications</h3>
        <p className="text-[13px] text-foreground-light">Choose what the workspace emails you about.</p>
      </div>
      <div className="divide-y">
        {SETTINGS.map((setting) => (
          <div key={setting.id} className="flex items-center justify-between gap-6 px-5 py-4">
            <div className="flex min-w-0 flex-col gap-0.5">
              <Label htmlFor={setting.id} className="text-[13px]">
                {setting.label}
              </Label>
              <p id={`${setting.id}-hint`} className="text-[12.5px] text-foreground-lighter">
                {setting.description}
              </p>
            </div>
            <Switch
              {...args}
              id={setting.id}
              aria-label={undefined}
              aria-describedby={`${setting.id}-hint`}
              defaultChecked={setting.defaultChecked}
              disabled={'disabled' in setting ? setting.disabled : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  ),
}

function ControlledSwitch() {
  const [enabled, setEnabled] = React.useState(false)
  return (
    <div className="flex items-center gap-2.5">
      <Switch id="maintenance" checked={enabled} onCheckedChange={setEnabled} />
      <Label htmlFor="maintenance" className="text-[13px]">
        Maintenance mode
      </Label>
      <span role="status" className="mono-label">
        {enabled ? 'On' : 'Off'}
      </span>
    </div>
  )
}

/** Controlled with `checked` + `onCheckedChange`. */
export const Controlled: Story = {
  render: () => <ControlledSwitch />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole('switch', { name: 'Maintenance mode' })
    await userEvent.click(toggle)
    await expect(toggle).toBeChecked()
    await expect(canvas.getByRole('status')).toHaveTextContent('On')
  },
}

export const ToggleInteraction: Story = {
  args: { 'aria-label': 'Email notifications' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole('switch', { name: 'Email notifications' })
    await expect(toggle).not.toBeChecked()
    await userEvent.click(toggle)
    await expect(toggle).toBeChecked()
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true)
    await userEvent.keyboard(' ')
    await expect(toggle).not.toBeChecked()
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(false)
  },
}
