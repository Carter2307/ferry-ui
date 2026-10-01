import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Building2, Globe, Lock, Rocket, Sparkles, User, Users } from 'lucide-react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Badge } from '../primitives/badge'
import { Button } from '../primitives/button'

import { Field } from './field'
import { FormActions, FormCard, FormRow } from './form-card'
import { MonoLabel } from './mono-label'
import { RadioCard, RadioCardGroup, type RadioCardOption } from './radio-card-group'

type Visibility = 'private' | 'team' | 'public'

const visibilityOptions: RadioCardOption<Visibility>[] = [
  {
    value: 'private',
    label: 'Private',
    description: 'Only you can see and edit this project.',
    icon: <Lock />,
  },
  {
    value: 'team',
    label: 'Team',
    description: 'Every member of the workspace can open it.',
    icon: <Users />,
  },
  {
    value: 'public',
    label: 'Public',
    description: 'Anyone with the link can view a read-only copy.',
    icon: <Globe />,
  },
]

const meta = {
  title: 'Patterns/Radio Card Group',
  component: RadioCardGroup,
  subcomponents: { RadioCard },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Single choice between 2–6 options shown as selectable cards with an icon, a title and a description. Use `outline` + `check` (default) for the main choice of a page, `soft` + `radio` for a choice inside a form card, `size="sm"` when space is tight, and `RadioCard` children with `media` for visual pickers (layout, appearance). For long lists use `Select`; for on/off use `Switch`.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
  args: {
    options: visibilityOptions,
    defaultValue: 'team',
    'aria-label': 'Project visibility',
    onValueChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['lg', 'sm'] },
    appearance: { control: 'inline-radio', options: ['outline', 'soft'] },
    indicator: { control: 'inline-radio', options: ['check', 'radio', 'none'] },
    columns: { control: 'inline-radio', options: [1, 2, 3] },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    'aria-invalid': { control: 'boolean' },
    defaultValue: {
      control: 'inline-radio',
      options: ['private', 'team', 'public'],
      description: 'Initial selection (uncontrolled). Changing it after the first render has no effect, as with any `defaultValue`.',
    },
    options: { control: false },
    children: { control: false },
    value: { control: false },
    onValueChange: { control: false },
    // Inherited from the Radix root. `asChild` needs a single child element (the group renders several
    // cards), and the others have no visible effect on the card grid.
    asChild: { control: false },
    dir: { table: { disable: true } },
    orientation: { table: { disable: true } },
    loop: { table: { disable: true } },
    form: { table: { disable: true } },
  },
} satisfies Meta<typeof RadioCardGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  args: { columns: 3 },
  render: (args) => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <MonoLabel>lg</MonoLabel>
        <RadioCardGroup {...args} size="lg" aria-label="Project visibility (large)" />
      </div>
      <div className="flex flex-col gap-2">
        <MonoLabel>sm</MonoLabel>
        <RadioCardGroup {...args} size="sm" aria-label="Project visibility (small)" />
      </div>
    </div>
  ),
}

export const Appearances: Story = {
  args: { columns: 3, size: 'sm' },
  render: (args) => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <MonoLabel>outline</MonoLabel>
        <RadioCardGroup {...args} appearance="outline" aria-label="Visibility (outline)" />
      </div>
      <div className="flex flex-col gap-2">
        <MonoLabel>soft</MonoLabel>
        <RadioCardGroup {...args} appearance="soft" aria-label="Visibility (soft)" />
      </div>
    </div>
  ),
}

export const Indicators: Story = {
  args: { columns: 3, size: 'sm' },
  render: (args) => (
    <div className="flex flex-col gap-6">
      {(['check', 'radio', 'none'] as const).map((indicator) => (
        <div key={indicator} className="flex flex-col gap-2">
          <MonoLabel>{indicator}</MonoLabel>
          <RadioCardGroup {...args} indicator={indicator} aria-label={`Visibility (${indicator} indicator)`} />
        </div>
      ))}
    </div>
  ),
}

export const Columns: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      {([1, 2, 3] as const).map((columns) => (
        <div key={columns} className="flex flex-col gap-2">
          <MonoLabel>columns {columns}</MonoLabel>
          <RadioCardGroup
            {...args}
            size="sm"
            columns={columns}
            options={visibilityOptions.slice(0, columns === 2 ? 2 : 3)}
            aria-label={`Visibility (${columns} columns)`}
          />
        </div>
      ))}
    </div>
  ),
}

export const Soft: Story = {
  args: { appearance: 'soft', size: 'sm', columns: 3 },
}

export const NoIcons: Story = {
  args: {
    columns: 2,
    options: [
      { value: 'monthly', label: 'Monthly', description: 'Billed every month. Cancel anytime.' },
      { value: 'yearly', label: 'Yearly', description: 'Billed once a year. Two months free.' },
    ],
    defaultValue: 'yearly',
    'aria-label': 'Billing period',
  },
}

export const Empty: Story = {
  name: 'Nothing selected',
  args: { defaultValue: undefined, columns: 3 },
}

export const DisabledOption: Story = {
  args: {
    columns: 3,
    options: visibilityOptions.map((o) =>
      o.value === 'public'
        ? { ...o, description: 'Disabled by your workspace policy.', disabled: true }
        : o,
    ),
  },
}

export const DisabledGroup: Story = {
  args: { columns: 3, disabled: true },
}

/** `aria-invalid` on the group (set by `Field` while it shows an error) paints the unselected cards red. */
export const Invalid: Story = {
  args: { columns: 3, defaultValue: undefined, required: true, 'aria-invalid': true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'true')
    for (const radio of canvas.getAllByRole('radio')) {
      await expect(radio.className).toContain('border-destructive')
    }
  },
}

function ControlledExample({ onValueChange }: { onValueChange?: (value: Visibility) => void }) {
  const [value, setValue] = React.useState<Visibility | null>(null)
  return (
    <div className="flex flex-col gap-3">
      <RadioCardGroup
        aria-label="Project visibility"
        size="sm"
        columns={3}
        options={visibilityOptions}
        value={value}
        onValueChange={(v) => {
          setValue(v)
          onValueChange?.(v)
        }}
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] text-foreground-light" data-testid="current">
          Selected: <span className="font-medium text-foreground">{value ?? 'none'}</span>
        </span>
        <Button size="sm" onClick={() => setValue(null)} disabled={value === null}>
          Clear
        </Button>
      </div>
    </div>
  )
}

/** Controlled with `value` + `onValueChange`. `null` means nothing selected and lets the owner clear the choice. */
export const Controlled: Story = {
  render: (args) => <ControlledExample onValueChange={args.onValueChange} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const current = canvas.getByTestId('current')
    await expect(current).toHaveTextContent('Selected: none')
    const pub = canvas.getByRole('radio', { name: 'Public' })
    await userEvent.click(pub)
    await waitFor(() => expect(pub).toHaveAttribute('aria-checked', 'true'))
    await expect(current).toHaveTextContent('Selected: public')
    await expect(args.onValueChange).toHaveBeenCalledWith('public')
    await userEvent.click(canvas.getByRole('button', { name: 'Clear' }))
    await waitFor(() => expect(pub).toHaveAttribute('aria-checked', 'false'))
    await expect(current).toHaveTextContent('Selected: none')
  },
}

export const LongDescription: Story = {
  args: {
    columns: 2,
    options: [
      {
        value: 'archive',
        label: 'Archive the project and keep every file, comment and version for later',
        description:
          'Archived projects are read-only and hidden from the sidebar. Members keep their access and can restore the project at any time from the workspace settings; nothing is deleted and billing for this project stops at the end of the current period.',
        icon: <Building2 />,
      },
      {
        value: 'transfer',
        label: 'Transfer',
        description: 'Move the project to another workspace you own. Integrations are disconnected.',
        icon: <Users />,
      },
    ],
    defaultValue: 'archive',
    'aria-label': 'What to do with the project',
  },
}

function LayoutPreview({ kind }: { kind: 'sidebar' | 'topbar' | 'minimal' }) {
  return (
    <span className="flex h-20 w-full gap-1.5 bg-surface-200 p-2">
      {kind === 'sidebar' && (
        <span className="flex w-1/4 flex-col gap-1 rounded-sm bg-surface-300 p-1">
          <span className="h-1 rounded-full bg-border-stronger" />
          <span className="h-1 w-2/3 rounded-full bg-border-stronger" />
          <span className="h-1 w-3/4 rounded-full bg-border-stronger" />
        </span>
      )}
      <span className="flex flex-1 flex-col gap-1.5">
        {kind === 'topbar' && <span className="h-2.5 rounded-sm bg-surface-300" />}
        <span className="flex flex-1 flex-col gap-1 rounded-sm border bg-background p-1.5">
          <span className="h-1 w-1/2 rounded-full bg-border-strong" />
          <span className="h-1 w-3/4 rounded-full bg-border" />
        </span>
      </span>
    </span>
  )
}

export const WithMedia: Story = {
  args: { indicator: 'radio', defaultValue: 'sidebar', options: undefined, 'aria-label': 'Dashboard layout', className: 'grid-cols-3' },
  render: (args) => (
    <RadioCardGroup {...args}>
      <RadioCard value="sidebar" label="Sidebar" description="Navigation on the left." media={<LayoutPreview kind="sidebar" />} />
      <RadioCard value="topbar" label="Top bar" description="Navigation above the content." media={<LayoutPreview kind="topbar" />} />
      <RadioCard
        value="minimal"
        label="Minimal"
        description="Available on the Team plan."
        media={<LayoutPreview kind="minimal" />}
        disabled
      />
    </RadioCardGroup>
  ),
}

export const SelectInteraction: Story = {
  args: { columns: 3, defaultValue: 'private' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const team = canvas.getByRole('radio', { name: 'Team' })
    await expect(team).toHaveAttribute('aria-checked', 'false')
    await expect(team).toHaveAccessibleDescription('Every member of the workspace can open it.')
    await userEvent.click(team)
    await waitFor(() => expect(team).toHaveAttribute('aria-checked', 'true'))
    await expect(args.onValueChange).toHaveBeenCalledWith('team')
    await expect(canvas.getByRole('radio', { name: 'Private' })).toHaveAttribute('aria-checked', 'false')
  },
}

export const KeyboardNavigation: Story = {
  args: { columns: 3, defaultValue: 'private' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const priv = canvas.getByRole('radio', { name: 'Private' })
    await userEvent.click(priv)
    await userEvent.keyboard('{ArrowRight}')
    const team = canvas.getByRole('radio', { name: 'Team' })
    await waitFor(() => expect(team).toHaveFocus())
    // Browsers select on arrow focus; jsdom only moves focus, so confirm with Space (a no-op when already selected).
    await userEvent.keyboard(' ')
    await waitFor(() => expect(team).toHaveAttribute('aria-checked', 'true'))
    await expect(args.onValueChange).toHaveBeenLastCalledWith('team')
  },
}

type Plan = 'free' | 'pro' | 'team'

const plans: { value: Plan; label: string; description: string; price: string; icon: React.ReactNode; popular?: boolean }[] = [
  { value: 'free', label: 'Free', description: 'For side projects. Up to 3 projects and 1 member.', price: '$0', icon: <User /> },
  {
    value: 'pro',
    label: 'Pro',
    description: 'Unlimited projects, priority support and daily backups.',
    price: '$19',
    icon: <Rocket />,
    popular: true,
  },
  { value: 'team', label: 'Team', description: 'Shared billing, roles and audit log for up to 50 members.', price: '$49', icon: <Sparkles /> },
]

function PlanPrice({ price, popular }: { price: string; popular?: boolean }) {
  return (
    <span className="mt-1.5 flex flex-wrap items-center gap-2">
      <span className="text-[13px] font-medium whitespace-nowrap text-foreground tabular">
        {price}
        <span className="font-normal text-foreground-lighter"> / month</span>
      </span>
      {popular && <Badge variant="default">Popular</Badge>}
    </span>
  )
}

function ChoosePlanStep({ onValueChange }: { onValueChange?: (plan: Plan) => void }) {
  // `null`, not `undefined`: the group stays controlled while nothing is selected.
  const [plan, setPlan] = React.useState<Plan | null>(null)
  const [submitted, setSubmitted] = React.useState(false)
  const [done, setDone] = React.useState(false)
  return (
    <form
      noValidate
      aria-label="Create workspace"
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault()
        setSubmitted(true)
        if (plan) setDone(true)
      }}
    >
      <Field
        label="Plan"
        labelAs="span"
        hint="You can upgrade or downgrade at any time from the billing page."
        error={submitted && !plan ? 'Pick a plan to continue.' : undefined}
      >
        <RadioCardGroup
          name="plan"
          required
          columns={3}
          value={plan}
          onValueChange={(v) => {
            setPlan(v)
            setDone(false)
            onValueChange?.(v)
          }}
        >
          {plans.map((p) => (
            <RadioCard key={p.value} value={p.value} label={p.label} description={p.description} icon={p.icon}>
              <PlanPrice price={p.price} popular={p.popular} />
            </RadioCard>
          ))}
        </RadioCardGroup>
      </Field>
      <div className="flex items-center justify-end gap-3">
        {done && <span className="text-[13px] text-foreground-light">Plan selected.</span>}
        <Button type="submit" variant="primary">
          Continue
        </Button>
      </div>
    </form>
  )
}

export const ChooseAPlan: Story = {
  name: 'Composition: choose a plan',
  render: (args) => <ChoosePlanStep onValueChange={args.onValueChange} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }))
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Pick a plan to continue.')
    const group = canvas.getByRole('radiogroup', { name: 'Plan' })
    await expect(group).toHaveAttribute('aria-invalid', 'true')
    const pro = within(group).getByRole('radio', { name: 'Pro' })
    await userEvent.click(pro)
    await waitFor(() => expect(pro).toHaveAttribute('aria-checked', 'true'))
    await expect(args.onValueChange).toHaveBeenCalledWith('pro')
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
  },
}

function PlanSettingsCard({ onValueChange }: { onValueChange?: (plan: Plan) => void }) {
  const [saved, setSaved] = React.useState<Plan>('free')
  const [plan, setPlan] = React.useState<Plan>('free')
  return (
    <FormCard
      title="Subscription"
      description="Changes take effect at the start of the next billing period."
      onSubmit={(e) => {
        e.preventDefault()
        setSaved(plan)
      }}
      footer={<FormActions dirty={plan !== saved} onReset={() => setPlan(saved)} saveLabel="Update plan" />}
    >
      <FormRow
        layout="vertical"
        label="Plan"
        description="Pick the plan that fits your team. You can switch at any time."
      >
        {/* No `htmlFor` (a group has no single focus target): `control` carries `aria-labelledby`. */}
        {(control) => (
          <RadioCardGroup
            {...control}
            name="plan"
            appearance="soft"
            size="sm"
            columns={3}
            value={plan}
            onValueChange={(v) => {
              setPlan(v)
              onValueChange?.(v)
            }}
          >
            {plans.map((p) => (
              <RadioCard key={p.value} value={p.value} label={p.label} description={p.description} icon={p.icon}>
                <PlanPrice price={p.price} popular={p.popular} />
              </RadioCard>
            ))}
          </RadioCardGroup>
        )}
      </FormRow>
    </FormCard>
  )
}

export const InSettingsCard: Story = {
  name: 'Composition: settings card',
  render: (args) => <PlanSettingsCard onValueChange={args.onValueChange} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole('radiogroup', { name: 'Plan' })
    const team = within(group).getByRole('radio', { name: 'Team' })
    await userEvent.click(team)
    await waitFor(() => expect(team).toHaveAttribute('aria-checked', 'true'))
    await expect(args.onValueChange).toHaveBeenCalledWith('team')
    await expect(canvas.getByRole('button', { name: 'Update plan' })).toBeEnabled()
  },
}
