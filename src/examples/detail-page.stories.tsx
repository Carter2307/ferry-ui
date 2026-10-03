import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

import { API_KEY, DetailPageExample, KEY_STATUS } from './detail-page-example'
import { exampleParameters } from './example-app'

/* ---------------------------------------------------------------------------------------------- */
/* Meta                                                                                            */
/* ---------------------------------------------------------------------------------------------- */

const meta = {
  title: 'Examples/Detail Page',
  component: DetailPageExample,
  parameters: exampleParameters(
    [
      'The page of one record (here: an API key), built only from the public `ferry-ui` exports.',
      '',
      '- **Header** — `PageHeader` at `size="lg"` with a `PageBackLink` to the parent list in `eyebrow`, a small `StatusBadge` next to the title and the record actions on the right (the destructive one last). Both actions open a controlled `ConfirmDialog` rendered once at the end of the page. The top-bar trail repeats the hierarchy.',
      '- **What needs attention** — a `Callout` stays on the page while the condition holds (`warning` with an action at the `end`, `destructive` once revoked). Results of an action are `toast`s instead.',
      '- **Views** — `Tabs` (underline) switch between sibling views of the same record; a nested `pills` list switches the language of the snippet.',
      '- **Facts** — a `DescriptionList` grid of `DescriptionItem`s (`mono` for the id, a muted “—” for a missing value, `Badge`s for the scopes).',
      '- **Credentials** — `CopyField` for values copied verbatim and `SecretField` for the secret (masked, never in the DOM until revealed), as rows of a read-only `asDiv` `FormCard`.',
      '- **Usage** — `CodeBlock` for the snippet people copy; `MetricCard`s with `MetricTrend` / `UsageBar` on the Usage tab; a plain `Table` for the activity log.',
    ].join('\n'),
  ),
  args: {
    status: 'expiring',
    defaultTab: 'overview',
    onNavigate: fn(),
    onRotate: fn(),
    onRevoke: fn(),
  },
  argTypes: {
    status: { control: 'inline-radio', options: Object.keys(KEY_STATUS) },
    defaultTab: { control: 'inline-radio', options: ['overview', 'usage', 'activity'] },
  },
  // `defaultTab` is read on mount: remount when the control changes it.
  render: (args) => <DetailPageExample key={args.defaultTab} {...args} />,
} satisfies Meta<typeof DetailPageExample>

export default meta
type Story = StoryObj<typeof meta>

/** A key about to expire: warning badge and callout, facts, credentials and the quick-start snippet. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const main = within(within(canvasElement).getByRole('main'))
    await expect(main.getByRole('heading', { level: 1, name: 'Production server' })).toBeInTheDocument()
    await expect(main.getByRole('note')).toHaveTextContent('This key expires in 12 days')
    await userEvent.click(main.getByRole('link', { name: 'API keys' }))
    await expect(args.onNavigate).toHaveBeenLastCalledWith('/api-keys')
  },
}

/** A healthy key: no callout, the page starts with the tabs. */
export const Active: Story = {
  args: { status: 'active' },
}

/** A revoked key: destructive badge and callout, no secret, and the only action left is to create a new key. */
export const Revoked: Story = {
  args: { status: 'revoked' },
  play: async ({ canvasElement }) => {
    const main = within(within(canvasElement).getByRole('main'))
    await expect(main.getByRole('alert')).toHaveTextContent('This key was revoked')
    await expect(main.queryByLabelText('Secret')).not.toBeInTheDocument()
    await expect(main.queryByRole('button', { name: 'Revoke key' })).not.toBeInTheDocument()
  },
}

/** The `SecretField` hides the value until "Reveal" is pressed; the DOM never holds it before that. */
export const RevealSecret: Story = {
  play: async ({ canvasElement }) => {
    const main = within(within(canvasElement).getByRole('main'))
    const secret = main.getByLabelText('Secret')
    await expect(secret).not.toHaveValue(API_KEY.secret)
    await userEvent.click(main.getByRole('button', { name: 'Reveal secret' }))
    await expect(secret).toHaveValue(API_KEY.secret)
    await userEvent.click(main.getByRole('button', { name: 'Hide secret' }))
    await expect(secret).not.toHaveValue(API_KEY.secret)
  },
}

/** The tabs switch between the views of the record; the nested pills switch the snippet's language. */
export const SwitchTabs: Story = {
  play: async ({ canvasElement }) => {
    const main = within(within(canvasElement).getByRole('main'))
    await userEvent.click(main.getByRole('tab', { name: 'Node.js' }))
    await expect(main.getByText(/await fetch/)).toBeInTheDocument()

    await userEvent.click(main.getByRole('tab', { name: 'Usage' }))
    await expect(main.getByText('184,302')).toBeInTheDocument()
    await userEvent.click(main.getByRole('tab', { name: /Activity/ }))
    await expect(main.getByRole('table', { name: 'Key activity' })).toBeInTheDocument()
    await expect(main.queryByText('184,302')).not.toBeInTheDocument()
  },
}

/** The Usage tab: three `MetricCard`s. */
export const UsageTab: Story = {
  args: { defaultTab: 'usage' },
}

/** The Activity tab: the log of changes as a `Table`. */
export const ActivityTab: Story = {
  args: { defaultTab: 'activity' },
}

/** "Rotate now" in the callout opens the shared warning `ConfirmDialog`; confirming clears the warning and shows a toast. */
export const RotateKey: Story = {
  play: async ({ args, canvasElement }) => {
    const main = within(within(canvasElement).getByRole('main'))
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(main.getByRole('button', { name: 'Rotate now' }))
    const dialog = await body.findByRole('alertdialog', { name: 'Rotate “Production server”?' })
    await userEvent.click(within(dialog).getByRole('button', { name: 'Rotate key' }))
    await expect(args.onRotate).toHaveBeenCalledOnce()
    // Checked through the attribute: the dialog stays mounted until its exit animation ends.
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'closed'))
    await expect(await screen.findByText('API key rotated')).toBeInTheDocument()
    await waitFor(() => expect(within(canvasElement).queryByText('This key expires in 12 days')).not.toBeInTheDocument())
  },
}

/** "Revoke key" asks for a confirmation, then the page switches to its revoked state. */
export const RevokeKey: Story = {
  play: async ({ args, canvasElement }) => {
    const main = within(within(canvasElement).getByRole('main'))
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(main.getByRole('button', { name: 'Revoke key' }))
    const dialog = await body.findByRole('alertdialog', { name: 'Revoke “Production server”?' })
    await userEvent.click(within(dialog).getByRole('button', { name: 'Revoke key' }))
    await expect(args.onRevoke).toHaveBeenCalledOnce()
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'closed'))
    await waitFor(() => expect(within(canvasElement).getByText('This key was revoked')).toBeInTheDocument())
  },
}
