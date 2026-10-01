import type { Meta, StoryObj } from '@storybook/react-vite'
import { Search } from 'lucide-react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { isMac, modKey } from '../../lib/platform'

import { Kbd } from './kbd'

const meta = {
  title: 'Patterns/Kbd',
  component: Kbd,
  parameters: {
    docs: {
      description: {
        component:
          'Tiny monospace keycap for keyboard shortcuts. Render one `Kbd` per key in help text (`⌘` `↵`), or a whole chord in one cap inside compact triggers (`⌘K`). Use `modKey` from `lib/platform` so the modifier reads `⌘` on Apple platforms and `Ctrl` elsewhere.',
      },
    },
  },
  args: {
    children: 'K',
  },
  argTypes: {
    children: { control: 'text' },
  },
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Keys: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-1.5">
      {['⌘', '⇧', '⌥', 'Ctrl', 'Esc', 'Tab', '↵', '↑', '↓', '/', '?'].map((key) => (
        <Kbd {...args} key={key}>
          {key}
        </Kbd>
      ))}
    </div>
  ),
}

/** A whole chord in one cap, as in compact triggers: `⌘K` on Apple platforms, `Ctrl K` elsewhere. */
export const Chord: Story = {
  args: { children: isMac ? '⌘K' : 'Ctrl K' },
}

/** Long key names stay on one line; the cap grows with its content. */
export const LongKeyName: Story = {
  args: { children: 'Backspace' },
}

export const Shortcuts: Story = {
  render: (args) => (
    <ul className="flex w-72 flex-col gap-2 text-[13px] text-foreground-light">
      <li className="flex items-center justify-between">
        Open command palette
        <span className="flex gap-1">
          <Kbd {...args}>{modKey}</Kbd>
          <Kbd {...args}>K</Kbd>
        </span>
      </li>
      <li className="flex items-center justify-between">
        Save changes
        <span className="flex gap-1">
          <Kbd {...args}>{modKey}</Kbd>
          <Kbd {...args}>S</Kbd>
        </span>
      </li>
      <li className="flex items-center justify-between">
        New invoice
        <span className="flex gap-1">
          <Kbd {...args}>⇧</Kbd>
          <Kbd {...args}>N</Kbd>
        </span>
      </li>
      <li className="flex items-center justify-between">
        Close panel
        <Kbd {...args}>Esc</Kbd>
      </li>
    </ul>
  ),
}

export const InHelpText: Story = {
  render: (args) => (
    <p className="max-w-md text-[12.5px] text-foreground-lighter">
      <Kbd {...args}>{modKey}</Kbd> <Kbd {...args}>↵</Kbd> sends the message · <Kbd {...args}>Esc</Kbd> discards the
      draft · <Kbd {...args}>↑</Kbd> edits your last message
    </p>
  ),
}

export const InSearchTrigger: Story = {
  args: { onClick: fn() },
  render: ({ onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="flex h-8 w-64 items-center gap-2 rounded-md border border-border-strong bg-surface-100 pr-1.5 pl-2.5 text-[13px] text-foreground-lighter outline-none hover:border-border-stronger hover:text-foreground-light focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Search className="size-3.5" aria-hidden="true" />
      <span className="flex-1 text-left">Search projects…</span>
      <Kbd className="rounded-full px-1.5">{isMac ? '⌘K' : 'Ctrl K'}</Kbd>
    </button>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const kbd = canvasElement.querySelector('kbd')
    await expect(kbd).toHaveAttribute('data-slot', 'kbd')
    await userEvent.click(canvas.getByRole('button', { name: /search projects/i }))
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}
