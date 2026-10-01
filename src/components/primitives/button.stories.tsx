import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArrowRight, Plus, Trash2 } from 'lucide-react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Button, buttonVariants } from './button'

const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          'Compact action button: medium weight, 6px radius, 1px control border. Use `primary` for the single main action of a view, `default` for everything else, `destructive` for an action that deletes or revokes and `destructive-solid` only to confirm destructive dialogs. Pass icons through `icon` / `iconRight` (sized automatically) and use `asChild` to style a link.',
      },
    },
  },
  args: {
    children: 'Button',
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'outline', 'ghost', 'destructive', 'destructive-solid', 'warning', 'link', 'dashed'],
    },
    size: { control: 'select', options: ['tiny', 'sm', 'md', 'lg', 'icon-tiny', 'icon', 'icon-md', 'icon-lg'] },
    shape: { control: 'inline-radio', options: ['default', 'pill'] },
    icon: { control: false },
    iconRight: { control: false },
    asChild: { control: false },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Primary: Story = {
  args: { variant: 'primary', children: 'Save changes' },
}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button {...args} variant="default">
        Default
      </Button>
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="outline">
        Outline
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="dashed">
        Dashed
      </Button>
      <Button {...args} variant="warning">
        Warning
      </Button>
      <Button {...args} variant="destructive">
        Destructive
      </Button>
      <Button {...args} variant="destructive-solid">
        Destructive solid
      </Button>
      <Button {...args} variant="link">
        Link
      </Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button {...args} size="tiny">
        Tiny
      </Button>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
}

export const WithIcons: Story = {
  args: { icon: <Plus />, children: 'New project' },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button {...args} variant="primary" />
      <Button {...args} icon={undefined} iconRight={<ArrowRight />}>
        Continue
      </Button>
      <Button {...args} variant="destructive" icon={<Trash2 />}>
        Delete
      </Button>
    </div>
  ),
}

/** The four square sizes (26, 30, 34 and 38px, matching `tiny` / `sm` / `md` / `lg`), then a ghost one. Icon-only buttons need an `aria-label`. */
export const IconOnly: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Button {...args} size="icon-tiny" aria-label="Add" icon={<Plus />} children={undefined} />
      <Button {...args} size="icon" aria-label="Add" icon={<Plus />} children={undefined} />
      <Button {...args} size="icon-md" aria-label="Add" icon={<Plus />} children={undefined} />
      <Button {...args} size="icon-lg" aria-label="Add" icon={<Plus />} children={undefined} />
      <Button {...args} variant="ghost" size="icon" aria-label="Delete" icon={<Trash2 />} children={undefined} />
    </div>
  ),
}

export const Pill: Story = {
  args: { shape: 'pill', children: 'Connect' },
}

export const Loading: Story = {
  args: { variant: 'primary', loading: true, children: 'Saving…' },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const AsLink: Story = {
  args: { asChild: true, iconRight: <ArrowRight /> },
  render: (args) => (
    <Button {...args}>
      <a href="#docs">Read the docs</a>
    </Button>
  ),
}

/**
 * A link has no `disabled` attribute: with `asChild`, `disabled` (and `loading`) become `aria-disabled`
 * on the child, which is dimmed, ignores the pointer and leaves the tab order.
 */
export const AsLinkDisabled: Story = {
  args: { asChild: true, disabled: true, variant: 'primary' },
  render: (args) => (
    <Button {...args}>
      <a href="#upgrade">Upgrade plan</a>
    </Button>
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Upgrade plan' })
    await expect(link).toHaveAttribute('aria-disabled', 'true')
    await expect(link).toHaveAttribute('tabindex', '-1')
    await expect(link).toHaveAttribute('data-variant', 'primary')
    await expect(link).not.toHaveAttribute('disabled')
  },
}

/**
 * `buttonVariants()` returns the button classes for an element you render yourself (here a plain link).
 * Prefer `asChild`, which also sets `data-slot` and maps `disabled` / `loading`.
 */
export const ClassHelper: Story = {
  render: () => (
    <a href="#docs" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
      Read the docs
    </a>
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Read the docs' })
    await expect(link).toHaveClass('h-[30px]', 'bg-transparent', 'rounded-md')
  },
}

/** `danger` and `danger-solid` are deprecated aliases: they render the `destructive` variants. */
export const DeprecatedAliases: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button {...args} variant="danger">
        Delete
      </Button>
      <Button {...args} variant="danger-solid">
        Delete project
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Delete' })).toHaveAttribute('data-variant', 'destructive')
    await expect(canvas.getByRole('button', { name: 'Delete project' })).toHaveAttribute(
      'data-variant',
      'destructive-solid',
    )
  },
}

export const ClickInteraction: Story = {
  args: { children: 'Click me' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Click me' }))
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}
