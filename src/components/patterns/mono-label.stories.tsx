import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { Card, CardContent, CardHeader } from '../primitives/card'
import { Checkbox } from '../primitives/checkbox'
import { Input } from '../primitives/input'
import { Label } from '../primitives/label'

import { MonoLabel } from './mono-label'

const meta = {
  title: 'Patterns/Mono Label',
  component: MonoLabel,
  parameters: {
    docs: {
      description: {
        component:
          'The signature caption: small UPPERCASE monospace text in the muted foreground. Use it for card titles, metric labels, column headers and menu-group headings (1–4 words). Set `as` to keep the semantics right (`h3` for a group heading, `dt` in a description list, `label` for a field) — never for body copy or page titles.',
      },
    },
  },
  args: {
    children: 'Monthly revenue',
    as: 'span',
  },
  argTypes: {
    as: {
      control: 'select',
      options: ['span', 'div', 'p', 'h2', 'h3', 'h4', 'dt', 'th', 'legend', 'label'],
    },
    children: { control: 'text' },
    ref: { control: false },
  },
} satisfies Meta<typeof MonoLabel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Elements: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <MonoLabel {...args} as="h2">
        Section heading (h2)
      </MonoLabel>
      <MonoLabel {...args} as="h3">
        Menu group (h3)
      </MonoLabel>
      <MonoLabel {...args} as="p">
        Paragraph caption (p)
      </MonoLabel>
      <MonoLabel {...args} as="div">
        Block caption (div)
      </MonoLabel>
      <MonoLabel {...args} as="span">
        Inline caption (span)
      </MonoLabel>
    </div>
  ),
}

/** Captions are meant to be 1–4 words; in narrow spaces add `truncate` (and a `title`) rather than wrapping. */
export const Truncated: Story = {
  args: {
    as: 'div',
    className: 'w-40 truncate',
    title: 'Pending invitations from other workspaces',
    children: 'Pending invitations from other workspaces',
  },
}

export const CustomColor: Story = {
  args: { children: 'Overdue', className: 'text-destructive' },
}

export const CardTitle: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <Card className="max-w-sm">
      <CardHeader>
        <MonoLabel {...args} as="h3">
          Team members
        </MonoLabel>
      </CardHeader>
      <CardContent className="text-[13px] text-foreground-light">
        8 of 10 seats used on the Pro plan. Invite more people from the members page.
      </CardContent>
    </Card>
  ),
}

export const DescriptionList: Story = {
  render: () => (
    <dl className="grid w-80 grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2.5 text-[13px]">
      <MonoLabel as="dt">Invoice</MonoLabel>
      <dd className="font-mono text-foreground">INV-2026-0142</dd>
      <MonoLabel as="dt">Customer</MonoLabel>
      <dd className="text-foreground">Northwind Traders</dd>
      <MonoLabel as="dt">Amount</MonoLabel>
      <dd className="text-foreground tabular">$4,280.00</dd>
      <MonoLabel as="dt">Due</MonoLabel>
      <dd className="text-foreground">Oct 14, 2026</dd>
    </dl>
  ),
}

/** Header cells of a hand-built table. With the Table primitive, `TableHead` already has this look. */
export const TableHeader: Story = {
  render: () => (
    <table className="w-96 text-left text-[13px]">
      <thead>
        <tr className="border-b">
          <MonoLabel as="th" scope="col" className="py-2 font-normal">
            Order
          </MonoLabel>
          <MonoLabel as="th" scope="col" className="py-2 font-normal">
            Status
          </MonoLabel>
          <MonoLabel as="th" scope="col" className="py-2 text-right font-normal">
            Total
          </MonoLabel>
        </tr>
      </thead>
      <tbody className="text-foreground">
        <tr className="border-b">
          <td className="py-2 font-mono">#10482</td>
          <td className="py-2">Shipped</td>
          <td className="py-2 text-right tabular">$129.00</td>
        </tr>
        <tr>
          <td className="py-2 font-mono">#10481</td>
          <td className="py-2">Pending</td>
          <td className="py-2 text-right tabular">$58.40</td>
        </tr>
      </tbody>
    </table>
  ),
}

/** `legend` names a group of related controls inside a `fieldset`. */
export const FieldsetLegend: Story = {
  render: () => (
    <fieldset className="flex w-72 flex-col gap-2.5">
      <MonoLabel as="legend" className="mb-2">
        Email notifications
      </MonoLabel>
      <Label className="text-[13px] font-normal text-foreground-light">
        <Checkbox name="notifications" value="invoices" defaultChecked />
        New invoices
      </Label>
      <Label className="text-[13px] font-normal text-foreground-light">
        <Checkbox name="notifications" value="summary" />
        Weekly summary
      </Label>
    </fieldset>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('group', { name: 'Email notifications' })).toBeInTheDocument()
  },
}

export const FormLabel: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-1.5">
      <MonoLabel as="label" htmlFor="workspace-name">
        Workspace name
      </MonoLabel>
      <Input id="workspace-name" placeholder="Acme Inc." />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Workspace name')
    await expect(input).toHaveAttribute('id', 'workspace-name')
    await expect(canvas.getByText('Workspace name')).toHaveAttribute('data-slot', 'mono-label')
  },
}
