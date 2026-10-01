import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  LayoutGrid,
  List,
  Monitor,
  Moon,
  Plus,
  Search,
  Strikethrough,
  Sun,
  Underline,
} from 'lucide-react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Button } from './button'
import { Input } from './input'
import { ToggleGroup, ToggleGroupItem } from './toggle-group'
import { Hint } from './tooltip'

const alignmentItems = (
  <>
    <ToggleGroupItem value="left" aria-label="Align left">
      <AlignLeft />
    </ToggleGroupItem>
    <ToggleGroupItem value="center" aria-label="Align center">
      <AlignCenter />
    </ToggleGroupItem>
    <ToggleGroupItem value="right" aria-label="Align right">
      <AlignRight />
    </ToggleGroupItem>
    <ToggleGroupItem value="justify" aria-label="Justify">
      <AlignJustify />
    </ToggleGroupItem>
  </>
)

const formattingItems = (
  <>
    <ToggleGroupItem value="bold" aria-label="Bold">
      <Bold />
    </ToggleGroupItem>
    <ToggleGroupItem value="italic" aria-label="Italic">
      <Italic />
    </ToggleGroupItem>
    <ToggleGroupItem value="underline" aria-label="Underline">
      <Underline />
    </ToggleGroupItem>
    <ToggleGroupItem value="strikethrough" aria-label="Strikethrough">
      <Strikethrough />
    </ToggleGroupItem>
  </>
)

const meta = {
  title: 'Primitives/Toggle Group',
  component: ToggleGroup,
  subcomponents: { ToggleGroupItem },
  parameters: {
    docs: {
      description: {
        component:
          'A set of toggles sharing one value. Use `type="single"` as a segmented control (view mode, alignment, theme) and `type="multiple"` for independent flags. `variant="outline"` with the default `spacing={0}` joins items into one bordered control; set a positive `spacing` to separate them. To switch between panels of content, use `Tabs` instead.',
      },
    },
  },
  args: {
    type: 'single',
    variant: 'outline',
    defaultValue: 'left',
    'aria-label': 'Text alignment',
    onValueChange: fn(),
    children: alignmentItems,
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['single', 'multiple'] },
    variant: { control: 'inline-radio', options: ['default', 'outline'] },
    size: { control: 'inline-radio', options: ['tiny', 'sm', 'md'] },
    spacing: { control: { type: 'number', min: 0, max: 4, step: 0.5 } },
    disabled: { control: 'boolean' },
    children: { control: false },
    asChild: { control: false },
  },
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-3">
      <ToggleGroup {...args} variant="default" aria-label="Text alignment (default variant)" />
      <ToggleGroup {...args} variant="outline" aria-label="Text alignment (outline variant)" />
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-3">
      <ToggleGroup {...args} size="tiny" aria-label="Text alignment (tiny)" />
      <ToggleGroup {...args} size="sm" aria-label="Text alignment (small, default)" />
      <ToggleGroup {...args} size="md" aria-label="Text alignment (medium)" />
    </div>
  ),
}

/** `type="multiple"`: every item toggles independently and the value is a string array. */
export const Multiple: Story = {
  args: {
    type: 'multiple',
    defaultValue: ['bold', 'underline'],
    'aria-label': 'Text formatting',
    children: formattingItems,
  },
}

/** A positive `spacing` separates the items; each keeps its own border and radius. */
export const WithSpacing: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-3">
      <ToggleGroup {...args} spacing={0} aria-label="Text alignment (joined)" />
      <ToggleGroup {...args} spacing={1} aria-label="Text alignment (spacing 1)" />
      <ToggleGroup {...args} variant="default" spacing={1} aria-label="Text alignment (default variant, spacing 1)" />
    </div>
  ),
}

export const WithText: Story = {
  args: {
    defaultValue: 'system',
    'aria-label': 'Theme',
    children: (
      <>
        <ToggleGroupItem value="light">
          <Sun /> Light
        </ToggleGroupItem>
        <ToggleGroupItem value="dark">
          <Moon /> Dark
        </ToggleGroupItem>
        <ToggleGroupItem value="system">
          <Monitor /> Auto
        </ToggleGroupItem>
      </>
    ),
  },
}

export const Disabled: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-3">
      <ToggleGroup {...args} disabled aria-label="Text alignment (disabled)" />
      <ToggleGroup type="single" variant="outline" defaultValue="monthly" aria-label="Billing period">
        <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
        <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
        <ToggleGroupItem value="lifetime" disabled>
          Lifetime
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
}

const projects = [
  { name: 'Marketing site', owner: 'Maya Chen', updated: '2h ago' },
  { name: 'Billing portal', owner: 'Liam Novak', updated: 'Yesterday' },
  { name: 'Mobile app', owner: 'Sara Ortiz', updated: '3 days ago' },
  { name: 'Design system', owner: 'Tom Becker', updated: 'Last week' },
]

function ProjectsToolbarExample() {
  const [view, setView] = React.useState<'grid' | 'list'>('grid')
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="relative w-56">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-foreground-lighter" />
          <Input size="sm" placeholder="Search projects" aria-label="Search projects" className="pl-8" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ToggleGroup
            type="single"
            variant="outline"
            value={view}
            onValueChange={(next) => {
              // Single mode emits "" when the active item is clicked again: keep one view selected.
              if (next === 'grid' || next === 'list') setView(next)
            }}
            aria-label="Layout"
          >
            <Hint label="Grid view">
              <ToggleGroupItem value="grid" aria-label="Grid view" className="px-2">
                <LayoutGrid />
              </ToggleGroupItem>
            </Hint>
            <Hint label="List view">
              <ToggleGroupItem value="list" aria-label="List view" className="px-2">
                <List />
              </ToggleGroupItem>
            </Hint>
          </ToggleGroup>
          <Button variant="primary" icon={<Plus />}>
            New project
          </Button>
        </div>
      </div>
      {view === 'grid' ? (
        <div className="grid grid-cols-2 gap-3" data-testid="projects-grid">
          {projects.map((p) => (
            <div key={p.name} className="rounded-lg border bg-card p-4 shadow-card">
              <div className="text-sm font-medium text-foreground">{p.name}</div>
              <div className="mt-1 text-xs text-foreground-lighter">
                {p.owner} · {p.updated}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="divide-y rounded-lg border bg-card shadow-card" data-testid="projects-list">
          {projects.map((p) => (
            <li key={p.name} className="flex items-center justify-between px-4 py-2.5 text-[13px]">
              <span className="font-medium text-foreground">{p.name}</span>
              <span className="text-foreground-lighter">
                {p.owner} · {p.updated}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/**
 * A grid/list view switcher in a page toolbar: controlled, icon-only items with tooltips,
 * and an `onValueChange` guard so one view always stays selected.
 */
export const ViewSwitcher: Story = {
  parameters: { layout: 'padded' },
  render: () => <ProjectsToolbarExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByTestId('projects-grid')).toBeInTheDocument()

    await userEvent.click(canvas.getByRole('radio', { name: 'List view' }))
    await expect(canvas.getByTestId('projects-list')).toBeInTheDocument()

    // Clicking the active item again must not deselect it.
    await userEvent.click(canvas.getByRole('radio', { name: 'List view' }))
    await expect(canvas.getByRole('radio', { name: 'List view' })).toHaveAttribute('aria-checked', 'true')
  },
}

export const SingleSelection: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const center = canvas.getByRole('radio', { name: 'Align center' })

    await userEvent.click(center)
    await expect(center).toHaveAttribute('aria-checked', 'true')
    await expect(canvas.getByRole('radio', { name: 'Align left' })).toHaveAttribute('aria-checked', 'false')
    await expect(args.onValueChange).toHaveBeenLastCalledWith('center')
  },
}

export const MultipleSelection: Story = {
  args: {
    type: 'multiple',
    defaultValue: ['bold'],
    'aria-label': 'Text formatting',
    children: formattingItems,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const italic = canvas.getByRole('button', { name: 'Italic' })

    await userEvent.click(italic)
    await expect(italic).toHaveAttribute('aria-pressed', 'true')
    await expect(canvas.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true')
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['bold', 'italic'])
  },
}

/** Keyboard: arrow keys move focus between items (roving focus), Space or Enter selects the focused one. */
export const KeyboardNavigation: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const left = canvas.getByRole('radio', { name: 'Align left' })
    const center = canvas.getByRole('radio', { name: 'Align center' })

    left.focus()
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => expect(center).toHaveFocus())
    // Moving focus does not select.
    await expect(center).toHaveAttribute('aria-checked', 'false')

    await userEvent.keyboard(' ')
    await expect(center).toHaveAttribute('aria-checked', 'true')
    await expect(args.onValueChange).toHaveBeenLastCalledWith('center')
  },
}
