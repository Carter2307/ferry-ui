import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { Skeleton } from './skeleton'

const meta = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
  parameters: {
    docs: {
      description: {
        component:
          'Pulsing placeholder for content that is loading. It has no size of its own: mirror the dimensions of the real content (`h-4 w-32` for a text line, `size-8 rounded-full` for an avatar) so nothing shifts when data arrives. Use it for initial page/list loads, not for button spinners or background work.',
      },
    },
  },
  args: {
    className: 'h-4 w-48',
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const block = canvasElement.querySelector('[data-slot="skeleton"]')
    await expect(block).toHaveAttribute('aria-hidden', 'true')
    // The pulse stops for users who prefer reduced motion.
    await expect(block).toHaveClass('animate-pulse', 'motion-reduce:animate-none')
  },
}

export const Shapes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Skeleton className="size-8 rounded-full" />
      <Skeleton className="size-10 rounded-md" />
      <Skeleton className="h-5 w-12 rounded-full" />
      <Skeleton className="h-[34px] w-28" />
      <div className="flex w-40 flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>
    </div>
  ),
}

export const TextBlock: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-2">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-3/4" />
    </div>
  ),
}

export const ProfileCardLoading: Story = {
  render: () => (
    <div aria-busy="true" aria-label="Loading profile" className="flex w-80 items-center gap-3 rounded-lg border bg-card p-4">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3.5 w-44" />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByLabelText('Loading profile')
    await expect(region).toHaveAttribute('aria-busy', 'true')
  },
}

export const ListLoading: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div aria-busy="true" className="max-w-xl overflow-hidden rounded-lg border bg-card">
      <div className="flex h-10 items-center gap-6 border-b bg-surface-75 px-4">
        <span className="mono-label w-40">Order</span>
        <span className="mono-label w-24">Status</span>
        <span className="mono-label ml-auto">Total</span>
      </div>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex h-12 items-center gap-6 border-b px-4 last:border-b-0">
          <div className="flex w-40 flex-col gap-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="ml-auto h-4 w-14" />
        </div>
      ))}
    </div>
  ),
}

export const StatTilesLoading: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
      {['Revenue', 'Active users', 'Churn'].map((label) => (
        <div key={label} className="flex flex-col gap-2 rounded-lg border bg-card p-4">
          <span className="mono-label">{label}</span>
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  ),
}
