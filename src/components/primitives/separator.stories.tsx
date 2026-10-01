import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bold, Italic, Link2, List, ListOrdered, Underline } from 'lucide-react'
import { expect, within } from 'storybook/test'

import { Button } from './button'
import { Separator } from './separator'

const meta = {
  title: 'Primitives/Separator',
  component: Separator,
  parameters: {
    docs: {
      description: {
        component:
          'A 1px hairline in the border color. Horizontal separators fill the width; vertical ones fill the height of their flex parent, so give that parent a height. Keep `decorative` (the default) for purely visual lines and set `decorative={false}` only when the split carries meaning, e.g. between groups of toolbar actions.',
      },
    },
  },
  args: {
    orientation: 'horizontal',
    decorative: true,
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    asChild: { control: false },
  },
  render: (args) => (
    <div className={args.orientation === 'vertical' ? 'flex h-8 items-center gap-3 text-sm' : 'w-72 text-sm'}>
      <span className="text-foreground">Account</span>
      <Separator {...args} className={args.orientation === 'vertical' ? undefined : 'my-3'} />
      <span className="text-foreground-light">Billing</span>
    </div>
  ),
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Horizontal: Story = {
  render: (args) => (
    <div className="w-80">
      <div className="text-sm font-medium text-foreground">Workspace settings</div>
      <p className="text-[13px] text-foreground-light">Manage your workspace name, members and plan.</p>
      <Separator {...args} orientation="horizontal" className="my-4" />
      <div className="flex gap-4 text-sm text-foreground-light">
        <span>General</span>
        <span>Members</span>
        <span>Billing</span>
      </div>
    </div>
  ),
}

export const Vertical: Story = {
  render: (args) => (
    <div className="flex h-5 items-center gap-3 text-sm text-foreground-light">
      <a href="#docs" className="hover:text-foreground">
        Docs
      </a>
      <Separator {...args} orientation="vertical" />
      <a href="#changelog" className="hover:text-foreground">
        Changelog
      </a>
      <Separator {...args} orientation="vertical" />
      <a href="#support" className="hover:text-foreground">
        Support
      </a>
    </div>
  ),
}

export const Semantic: Story = {
  args: { decorative: false },
  parameters: {
    docs: {
      description: {
        story:
          'With `decorative={false}` the separator is exposed to assistive technology (`role="separator"`), which helps screen-reader users understand groups of related controls.',
      },
    },
  },
  render: (args) => (
    <div role="toolbar" aria-label="Formatting" className="flex h-8 items-center gap-1 rounded-md border bg-card px-1">
      <Button variant="ghost" size="icon" aria-label="Bold" icon={<Bold />} />
      <Button variant="ghost" size="icon" aria-label="Italic" icon={<Italic />} />
      <Button variant="ghost" size="icon" aria-label="Underline" icon={<Underline />} />
      <Separator {...args} orientation="vertical" className="mx-1 h-4" />
      <Button variant="ghost" size="icon" aria-label="Bulleted list" icon={<List />} />
      <Button variant="ghost" size="icon" aria-label="Numbered list" icon={<ListOrdered />} />
      <Separator {...args} orientation="vertical" className="mx-1 h-4" />
      <Button variant="ghost" size="icon" aria-label="Insert link" icon={<Link2 />} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const separators = within(canvasElement).getAllByRole('separator')
    await expect(separators).toHaveLength(2)
    await expect(separators[0]).toHaveAttribute('aria-orientation', 'vertical')
  },
}

export const InMenuLikeList: Story = {
  render: (args) => (
    <div className="w-56 rounded-lg border bg-popover p-1 text-sm shadow-overlay">
      <div className="px-2 py-1.5 text-foreground">Profile</div>
      <div className="px-2 py-1.5 text-foreground">Preferences</div>
      <Separator {...args} className="-mx-1 my-1 w-auto" />
      <div className="px-2 py-1.5 text-foreground">Invite teammates</div>
      <Separator {...args} className="-mx-1 my-1 w-auto" />
      <div className="px-2 py-1.5 text-destructive">Sign out</div>
    </div>
  ),
}
