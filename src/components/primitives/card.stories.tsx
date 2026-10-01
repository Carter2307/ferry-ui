import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArrowUpRight, FolderPlus, MoreHorizontal, Plus } from 'lucide-react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Avatar, AvatarFallback } from './avatar'
import { Badge } from './badge'
import { Button } from './button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'
import { Input } from './input'
import { Label } from './label'
import { Skeleton } from './skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'

const meta = {
  title: 'Primitives/Card',
  component: Card,
  subcomponents: { CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Bordered panel (8px radius, hairline border) that groups one topic of a page. Compose `CardHeader` (title block + `CardAction`), `CardContent` and `CardFooter` — each brings its own padding and dividers. Put edge-to-edge content such as a table directly in the card, and avoid nesting cards.',
      },
    },
  },
  args: {
    className: 'max-w-md',
  },
  argTypes: {
    children: { control: false },
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <div>
          <CardTitle>Project details</CardTitle>
          <CardDescription>Basic information about this project.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground-light">
          Cards group related content and actions. Use the header for context, the content for the body and the footer
          for actions.
        </p>
      </CardContent>
      <CardFooter>
        <Button>Cancel</Button>
        <Button variant="primary">Save</Button>
      </CardFooter>
    </Card>
  ),
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ContentOnly: Story = {
  render: (args) => (
    <Card {...args}>
      <CardContent>
        <p className="text-sm text-foreground-light">A card can be a plain padded panel with no header or footer.</p>
      </CardContent>
    </Card>
  ),
}

export const WithAction: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>API keys</CardTitle>
        <CardAction>
          <Button size="tiny" icon={<Plus />}>
            New key
          </Button>
          <Button variant="ghost" size="icon-tiny" aria-label="More actions" icon={<MoreHorizontal />} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground-light">Keys grant programmatic access to your workspace.</p>
      </CardContent>
    </Card>
  ),
}

export const FooterWithHelperText: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <div>
          <CardTitle>Usage this month</CardTitle>
          <CardDescription>Resets on October 1.</CardDescription>
        </div>
        <CardAction>
          <Badge variant="warning">82%</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <span className="tabular text-2xl font-medium text-foreground">8,214</span>
          <span className="text-sm text-foreground-lighter">/ 10,000 requests</span>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <span className="text-[13px] text-foreground-lighter">Upgrade for higher limits.</span>
        <Button size="sm" iconRight={<ArrowUpRight />}>
          View plans
        </Button>
      </CardFooter>
    </Card>
  ),
}

export const LongContent: Story = {
  render: (args) => (
    <Card {...args} className="max-w-xs">
      <CardHeader>
        <div className="min-w-0">
          <CardTitle className="truncate">Quarterly planning notes for the customer success and onboarding teams</CardTitle>
          <CardDescription className="truncate">Last edited by Maya Chen, three days ago, from the shared workspace</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm break-words text-foreground-light">
          Long titles truncate when their wrapper has <code className="font-mono text-[13px]">min-w-0</code>; body
          text wraps normally. A-very-long-identifier-without-spaces-also-breaks-cleanly.
        </p>
      </CardContent>
    </Card>
  ),
}

export const Loading: Story = {
  render: (args) => (
    <Card {...args} aria-busy="true">
      <CardHeader>
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3.5 w-48" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-2/3" />
      </CardContent>
    </Card>
  ),
}

export const Empty: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
        <FolderPlus className="size-6 text-foreground-lighter" />
        <div>
          <div className="text-sm font-medium text-foreground">No projects yet</div>
          <p className="text-[13px] text-foreground-light">Create your first project to get started.</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus />}>
          New project
        </Button>
      </CardContent>
    </Card>
  ),
}

const orders = [
  { id: '#1042', customer: 'Northwind Traders', total: '$1,240.00', status: 'Paid' },
  { id: '#1043', customer: 'Acme Corporation', total: '$860.50', status: 'Pending' },
  { id: '#1044', customer: 'Globex Inc.', total: '$3,105.00', status: 'Refunded' },
] as const

const orderTone = { Paid: 'success', Pending: 'warning', Refunded: 'default' } as const

export const WithTable: Story = {
  parameters: {
    docs: {
      description: { story: 'Edge-to-edge content (a table) goes straight into the card, without `CardContent`.' },
    },
  },
  args: { className: 'max-w-xl' },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <div>
          <CardTitle>Recent orders</CardTitle>
          <CardDescription>Last 7 days</CardDescription>
        </div>
        <CardAction>
          <Button size="tiny" variant="ghost" iconRight={<ArrowUpRight />}>
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((o) => (
            <TableRow key={o.id}>
              <TableCell className="font-mono text-[13px]">{o.id}</TableCell>
              <TableCell>{o.customer}</TableCell>
              <TableCell>
                <Badge variant={orderTone[o.status]}>{o.status}</Badge>
              </TableCell>
              <TableCell className="tabular text-right">{o.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  ),
}

const team = [
  { name: 'Maya Chen', email: 'maya@example.com', role: 'Owner' },
  { name: 'Jordan Reyes', email: 'jordan@example.com', role: 'Admin' },
  { name: 'Priya Nair', email: 'priya@example.com', role: 'Member' },
]

export const TeamMembers: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <div>
          <CardTitle>Team members</CardTitle>
          <CardDescription>3 of 5 seats used</CardDescription>
        </div>
        <CardAction>
          <Button size="tiny" icon={<Plus />}>
            Invite
          </Button>
        </CardAction>
      </CardHeader>
      <div className="divide-y">
        {team.map((m) => (
          <div key={m.email} className="flex items-center gap-3 px-5 py-3 md:px-6">
            <Avatar size="sm">
              <AvatarFallback>
                {m.name
                  .split(' ')
                  .map((p) => p[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm text-foreground">{m.name}</div>
              <div className="truncate text-[13px] text-foreground-lighter">{m.email}</div>
            </div>
            <Badge variant="outline" case="normal">
              {m.role}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  ),
}

export const SettingsForm: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A form card: wrap the sections in a `<form className="contents">` so the card layout is untouched. Submit events bubble to the card, so `onSubmit` can live on either element.',
      },
    },
  },
  args: { onSubmit: fn() },
  argTypes: { onSubmit: { control: false } },
  render: (args) => (
    <Card {...args}>
      <form className="contents" onSubmit={(e) => e.preventDefault()}>
        <CardHeader>
          <div>
            <CardTitle>Workspace name</CardTitle>
            <CardDescription>Shown in invitations and emails.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Label htmlFor="card-workspace-name">Name</Label>
          <Input id="card-workspace-name" defaultValue="Acme Design" />
        </CardContent>
        <CardFooter className="justify-between">
          <span className="text-[13px] text-foreground-lighter">Max. 32 characters.</span>
          <Button type="submit" variant="primary" size="sm">
            Save
          </Button>
        </CardFooter>
      </form>
    </Card>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Name')
    await userEvent.clear(input)
    await userEvent.type(input, 'Acme Product Team')
    await expect(input).toHaveValue('Acme Product Team')
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
    await expect(args.onSubmit).toHaveBeenCalledOnce()
  },
}
