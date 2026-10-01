import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Archive,
  Bold,
  Code,
  Eye,
  EyeOff,
  Italic,
  Link2,
  List,
  Pin,
  Rows3,
  Star,
  Strikethrough,
  Underline,
} from 'lucide-react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Badge } from './badge'
import { Button } from './button'
import { Separator } from './separator'
import { Toggle, toggleVariants } from './toggle'
import { Hint } from './tooltip'

const meta = {
  title: 'Primitives/Toggle',
  component: Toggle,
  parameters: {
    docs: {
      description: {
        component:
          'Two-state button that stays pressed until clicked again (`aria-pressed`). Use `default` (transparent) inside toolbars and `outline` when the toggle stands alone next to other controls. For one choice among several use `ToggleGroup`; for settings that apply immediately use `Switch`.',
      },
    },
  },
  args: {
    'aria-label': 'Toggle bold',
    children: <Bold />,
    onPressedChange: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'outline'] },
    size: { control: 'inline-radio', options: ['tiny', 'sm', 'md'] },
    pressed: { control: 'boolean' },
    defaultPressed: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: false },
    asChild: { control: false },
  },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Outline: Story = {
  args: { variant: 'outline' },
}

export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Toggle {...args} variant="default" aria-label="Bold (default)" />
        <Toggle {...args} variant="default" defaultPressed aria-label="Bold (default, pressed)" />
      </div>
      <div className="flex items-center gap-2">
        <Toggle {...args} variant="outline" aria-label="Bold (outline)" />
        <Toggle {...args} variant="outline" defaultPressed aria-label="Bold (outline, pressed)" />
      </div>
    </div>
  ),
}

/**
 * Sizes follow the `Button` scale, so a toggle lines up with a button of the same `size`:
 * `tiny` 26px, `sm` 30px (default), `md` 34px.
 */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      {(['default', 'outline'] as const).map((variant) => (
        <div key={variant} className="flex items-center gap-2">
          <Toggle {...args} variant={variant} size="tiny" aria-label={`Italic tiny ${variant}`}>
            <Italic />
          </Toggle>
          <Toggle {...args} variant={variant} size="sm" aria-label={`Italic small ${variant}`}>
            <Italic />
          </Toggle>
          <Toggle {...args} variant={variant} size="md" aria-label={`Italic medium ${variant}`}>
            <Italic />
          </Toggle>
        </div>
      ))}
    </div>
  ),
}

export const WithText: Story = {
  args: { variant: 'outline', 'aria-label': undefined },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Toggle {...args}>
        <Star /> Starred
      </Toggle>
      <Toggle {...args} defaultPressed>
        <Pin /> Pinned
      </Toggle>
      <Toggle {...args} size="tiny">
        Show archived
      </Toggle>
    </div>
  ),
}

export const Pressed: Story = {
  args: { defaultPressed: true },
}

export const Disabled: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Toggle {...args} disabled aria-label="Bold (disabled)" />
      <Toggle {...args} disabled defaultPressed aria-label="Bold (disabled, pressed)" />
      <Toggle {...args} variant="outline" disabled aria-label="Bold (outline, disabled)" />
    </div>
  ),
}

function ControlledToggleExample({ onPressedChange }: { onPressedChange?: (pressed: boolean) => void }) {
  const [visible, setVisible] = React.useState(false)
  return (
    <div className="flex items-center gap-3">
      <Toggle
        variant="outline"
        pressed={visible}
        onPressedChange={(next) => {
          setVisible(next)
          onPressedChange?.(next)
        }}
      >
        {visible ? <Eye /> : <EyeOff />}
        {visible ? 'Hide key' : 'Reveal key'}
      </Toggle>
      <code className="rounded-sm border bg-code px-2 py-1 font-mono text-xs text-foreground-light">
        {visible ? 'pk_demo_4f9a…c21e' : '••••••••••••••••'}
      </code>
    </div>
  )
}

/** Controlled with `pressed` + `onPressedChange`: the label and icon follow the state. */
export const Controlled: Story = {
  render: (args) => <ControlledToggleExample onPressedChange={args.onPressedChange} />,
}

/** A text-formatting toolbar for a comment editor: default-variant toggles grouped by separators. */
export const EditorToolbar: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="w-full max-w-lg overflow-hidden rounded-lg border bg-card shadow-card">
      <div role="toolbar" aria-label="Formatting" className="flex h-10 items-center gap-0.5 border-b px-1.5">
        <Toggle size="tiny" aria-label="Bold" defaultPressed>
          <Bold />
        </Toggle>
        <Toggle size="tiny" aria-label="Italic">
          <Italic />
        </Toggle>
        <Toggle size="tiny" aria-label="Underline">
          <Underline />
        </Toggle>
        <Toggle size="tiny" aria-label="Strikethrough">
          <Strikethrough />
        </Toggle>
        <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-4" />
        <Toggle size="tiny" aria-label="Inline code">
          <Code />
        </Toggle>
        <Toggle size="tiny" aria-label="Bulleted list">
          <List />
        </Toggle>
        <Toggle size="tiny" aria-label="Link" disabled>
          <Link2 />
        </Toggle>
      </div>
      <div className="min-h-24 px-3 py-2.5 text-[13px] text-foreground-light">
        <strong className="font-medium text-foreground">Invoice INV-2041</strong> was paid on time — closing this
        thread.
      </div>
      <div className="flex justify-end gap-2 border-t px-3 py-2">
        <Button size="tiny" variant="ghost">
          Cancel
        </Button>
        <Button size="tiny" variant="primary">
          Comment
        </Button>
      </div>
    </div>
  ),
}

const projects = [
  { name: 'Customer portal', owner: 'Maya Chen', favorite: false, archived: false },
  { name: 'Marketing site', owner: 'Liam Novak', favorite: true, archived: false },
  { name: 'Legacy intranet', owner: 'Tom Becker', favorite: false, archived: true },
  { name: 'Mobile app', owner: 'Sara Ortiz', favorite: true, archived: false },
]

function ListOptionsExample() {
  const [showArchived, setShowArchived] = React.useState(false)
  const [compact, setCompact] = React.useState(false)
  const [pinFavorites, setPinFavorites] = React.useState(true)
  const visible = projects.filter((project) => showArchived || !project.archived)
  const rows = pinFavorites ? [...visible].sort((a, b) => Number(b.favorite) - Number(a.favorite)) : visible
  return (
    <div className="w-full max-w-lg overflow-hidden rounded-lg border bg-surface-100 shadow-card">
      <div className="flex h-10 items-center gap-2 border-b pr-1.5 pl-3">
        <span className="text-[13px] font-medium text-foreground">Projects</span>
        <div role="group" aria-label="View options" className="ml-auto flex items-center gap-0.5">
          <Hint label="Show archived">
            <Toggle aria-label="Show archived" pressed={showArchived} onPressedChange={setShowArchived}>
              <Archive />
            </Toggle>
          </Hint>
          <Hint label="Compact rows">
            <Toggle aria-label="Compact rows" pressed={compact} onPressedChange={setCompact}>
              <Rows3 />
            </Toggle>
          </Hint>
          <Hint label="Pin favorites">
            <Toggle aria-label="Pin favorites" pressed={pinFavorites} onPressedChange={setPinFavorites}>
              <Pin />
            </Toggle>
          </Hint>
        </div>
      </div>
      <ul aria-label="Projects" className="divide-y">
        {rows.map((project) => (
          <li key={project.name} className={`flex items-center gap-2 px-3 text-[13px] ${compact ? 'py-1.5' : 'py-2.5'}`}>
            <span className="truncate text-foreground">{project.name}</span>
            {project.favorite && <Star role="img" aria-label="Favorite" className="size-3.5 shrink-0 text-foreground-lighter" />}
            {project.archived && <Badge>Archived</Badge>}
            <span className="ml-auto shrink-0 text-foreground-lighter">{project.owner}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Icon-only view options with tooltips: wrap each `Toggle` in `Hint` and keep an `aria-label` on the toggle.
 * The toggles are controlled and change how the list below renders.
 */
export const WithTooltip: Story = {
  parameters: { layout: 'padded' },
  render: () => <ListOptionsExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByText('Legacy intranet')).not.toBeInTheDocument()

    const showArchived = canvas.getByRole('button', { name: 'Show archived' })
    await expect(showArchived).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(showArchived)
    await expect(showArchived).toHaveAttribute('aria-pressed', 'true')
    await expect(canvas.getByText('Legacy intranet')).toBeInTheDocument()
    await expect(canvas.getByText('Archived')).toBeInTheDocument()
  },
}

export const PressInteraction: Story = {
  args: { 'aria-label': 'Bold' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole('button', { name: 'Bold' })
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')

    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
    await expect(toggle).toHaveAttribute('data-state', 'on')
    await expect(args.onPressedChange).toHaveBeenLastCalledWith(true)

    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await expect(args.onPressedChange).toHaveBeenLastCalledWith(false)
  },
}

/** A native `aria-pressed` button styled with `toggleVariants()` (the demo of {@link ClassHelper}). */
function NativeToggle() {
  const [on, setOn] = React.useState(false)
  return (
    <button
      type="button"
      aria-pressed={on}
      data-state={on ? 'on' : 'off'}
      onClick={() => setOn((value) => !value)}
      className={toggleVariants({ variant: 'outline', size: 'sm' })}
    >
      Show archived
    </button>
  )
}

/**
 * `toggleVariants()` returns the toggle classes for an element you render yourself: here a native
 * `aria-pressed` button driven by `data-state`. Prefer `<Toggle>`, which manages both for you.
 */
export const ClassHelper: Story = {
  render: () => <NativeToggle />,
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Show archived' })
    await expect(button).toHaveClass('h-[30px]', 'border-border-strong', 'rounded-md')
    await userEvent.click(button)
    await expect(button).toHaveAttribute('data-state', 'on')
    await expect(button).toHaveAttribute('aria-pressed', 'true')
  },
}
