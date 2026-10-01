import type { Meta, StoryObj } from '@storybook/react-vite'
import { Building2, Check, Plus, User } from 'lucide-react'
import { expect, within } from 'storybook/test'

import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from './avatar'

// Local placeholder portraits served by Storybook (`.storybook/public/avatars`), no third-party host.
// In unit tests (jsdom) images never load, so the fallback initials render instead.
const portrait = (n: 1 | 2 | 3 | 4 | 5) => `/avatars/portrait-${n}.svg`

const meta = {
  title: 'Primitives/Avatar',
  component: Avatar,
  subcomponents: { AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount },
  parameters: {
    docs: {
      description: {
        component:
          'Circular picture for a person, team or organization. Always pair `AvatarImage` with an `AvatarFallback` (initials or an icon): the fallback shows while loading and when the image fails. Use `AvatarBadge` for presence and `AvatarGroup` + `AvatarGroupCount` to show a capped list of members.',
      },
    },
  },
  args: {
    size: 'md',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    children: { control: false },
    asChild: { control: false },
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src={portrait(1)} alt="Maya Chen" />
      <AvatarFallback>MC</AvatarFallback>
    </Avatar>
  ),
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Avatar {...args} key={size} size={size}>
          <AvatarImage src={portrait(2)} alt="Jordan Reyes" />
          <AvatarFallback>JR</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
}

export const Fallbacks: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Without an image (or when it fails to load) the fallback renders: initials by default, an icon for anonymous users or organizations. For an organization, put `rounded-md` on the `Avatar`: the image and fallback inherit its radius.',
      },
    },
  },
  render: (args) => (
    <div className="flex items-center gap-3">
      <Avatar {...args}>
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
      <Avatar {...args}>
        {/* An undecodable data URI fails like a broken link, without a network request (no 404 in the console). */}
        <AvatarImage src="data:image/png;base64,AA==" alt="Sam Patel" />
        <AvatarFallback>SP</AvatarFallback>
      </Avatar>
      <Avatar {...args}>
        <AvatarFallback>
          <User className="size-4" />
        </AvatarFallback>
      </Avatar>
      <Avatar {...args} className="rounded-md">
        <AvatarFallback className="bg-primary-soft text-primary">
          <Building2 className="size-4" />
        </AvatarFallback>
      </Avatar>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The broken image never loads, so its initials stay visible.
    await expect(canvas.getByText('SP')).toBeVisible()
    await expect(canvas.getByText('AL')).toBeVisible()
  },
}

export const WithBadge: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Presence or status dot. Recolor it with a tone class and give it `role="img"` + `aria-label` so the state is announced. Icons inside the badge are hidden at size `sm`.',
      },
    },
  },
  render: (args) => (
    <div className="flex items-center gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Avatar {...args} key={size} size={size}>
          <AvatarImage src={portrait(3)} alt="Priya Nair" />
          <AvatarFallback>PN</AvatarFallback>
          <AvatarBadge role="img" aria-label="Online" className="bg-success" />
        </Avatar>
      ))}
      <Avatar {...args} size="lg">
        <AvatarFallback>DK</AvatarFallback>
        <AvatarBadge role="img" aria-label="Verified">
          <Check />
        </AvatarBadge>
      </Avatar>
      <Avatar {...args} size="lg">
        <AvatarFallback>AW</AvatarFallback>
        <AvatarBadge role="img" aria-label="Away" className="bg-warning" />
      </Avatar>
      <Avatar {...args} size="lg">
        <AvatarFallback>OB</AvatarFallback>
        <AvatarBadge role="img" aria-label="Offline" className="bg-foreground-muted" />
      </Avatar>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('img', { name: 'Online' })).toHaveLength(3)
    await expect(canvas.getByRole('img', { name: 'Verified' })).toHaveAttribute('data-slot', 'avatar-badge')
  },
}

const members = [
  { name: 'Maya Chen', initials: 'MC', img: 1 },
  { name: 'Jordan Reyes', initials: 'JR', img: 2 },
  { name: 'Priya Nair', initials: 'PN', img: 3 },
  { name: 'Lucas Martin', initials: 'LM', img: 5 },
] as const

export const Group: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <AvatarGroup key={size}>
          {members.map((m) => (
            <Avatar {...args} key={m.name} size={size}>
              <AvatarImage src={portrait(m.img)} alt={m.name} />
              <AvatarFallback>{m.initials}</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount>+5</AvatarGroupCount>
        </AvatarGroup>
      ))}
    </div>
  ),
}

export const GroupWithIconCount: Story = {
  render: (args) => (
    <AvatarGroup>
      {members.slice(0, 3).map((m) => (
        <Avatar {...args} key={m.name}>
          <AvatarFallback>{m.initials}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>
        <Plus aria-hidden="true" />
        <span className="sr-only">12 more members</span>
      </AvatarGroupCount>
    </AvatarGroup>
  ),
}

export const TeamMemberRow: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="max-w-md divide-y rounded-lg border bg-card">
      {members.map((m, i) => (
        <div key={m.name} className="flex items-center gap-3 px-4 py-3">
          <Avatar {...args}>
            <AvatarImage src={portrait(m.img)} alt={m.name} />
            <AvatarFallback>{m.initials}</AvatarFallback>
            {i < 2 && <AvatarBadge role="img" aria-label="Online" className="bg-success" />}
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-foreground">{m.name}</div>
            <div className="truncate text-[13px] text-foreground-light">
              {m.name.toLowerCase().replace(' ', '.')}@example.com
            </div>
          </div>
          <span className="text-xs text-foreground-lighter">{i === 0 ? 'Owner' : 'Member'}</span>
        </div>
      ))}
    </div>
  ),
}
