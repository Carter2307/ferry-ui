import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { KeyRound, Plus } from 'lucide-react'

import { Button } from '../primitives/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../primitives/card'

import { CodeBlock, CodeBlockPrompt } from './code-block'
import { EmptyState } from './empty-state'
import { MonoLabel } from './mono-label'

/**
 * Replaces the clipboard with a spy for the duration of a story, so copy interactions are
 * deterministic in the browser (no permission prompt) and in jsdom (which has no clipboard).
 */
function mockClipboard() {
  const writeText = fn(async (_text: string) => {}).mockName('clipboard.writeText')
  const nav = window.navigator
  const ownSecure = Object.getOwnPropertyDescriptor(window, 'isSecureContext')
  const forceSecure = !window.isSecureContext
  Object.defineProperty(nav, 'clipboard', { configurable: true, value: { writeText } })
  if (forceSecure) Object.defineProperty(window, 'isSecureContext', { configurable: true, value: true })
  return () => {
    Reflect.deleteProperty(nav, 'clipboard')
    if (!forceSecure) return
    if (ownSecure) Object.defineProperty(window, 'isSecureContext', ownSecure)
    else Reflect.deleteProperty(window, 'isSecureContext')
  }
}

/** The clipboard spy installed by {@link mockClipboard}. */
const clipboardSpy = () => window.navigator.clipboard.writeText as ReturnType<typeof fn>

const meta = {
  title: 'Patterns/Code Block',
  component: CodeBlock,
  subcomponents: { CodeBlockPrompt },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Monospace snippet with a copy button, for commands, config snippets and API examples the user copies. Use `block` (default) for commands and snippets, `inline` for a short one-line token inside a list or help text, and `terminal` for decorative illustrations. `copyValue` lets the displayed text differ from what is copied (masked secrets); `prompt` adds a non-copied `$` to every line. No syntax highlighting; for one short value in a form use `CopyField`, for secrets the user reveals use `SecretField`.',
      },
    },
  },
  args: {
    code: 'npm install @acme/sdk',
    variant: 'block',
    copyPlacement: 'overlay',
    prompt: false,
    wrap: false,
    onCopy: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['block', 'inline', 'terminal'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    copyPlacement: { control: 'inline-radio', options: ['overlay', 'side'] },
    prompt: { control: 'boolean' },
    children: { control: false },
    labels: { control: false },
    ref: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
  beforeEach: mockClipboard,
} satisfies Meta<typeof CodeBlock>

export default meta
type Story = StoryObj<typeof meta>

/** Plain snippet driven by the controls: copy button floating in the top-right corner. */
export const Default: Story = {}

/** `prompt` prefixes the line with a muted `$` that cannot be selected and is never copied. */
export const WithPrompt: Story = {
  args: { code: 'npx acme login', prompt: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Copy command' }))
    await waitFor(() => expect(clipboardSpy()).toHaveBeenCalledWith('npx acme login'))
    await waitFor(() => expect(args.onCopy).toHaveBeenCalledWith('npx acme login'))
  },
}

/**
 * With `prompt`, every non-empty line of `code` gets its own prompt: use it for a sequence of
 * commands. Blank lines separate groups and get no prompt.
 */
export const MultiLinePrompt: Story = {
  args: {
    code: 'git clone https://github.com/acme/web-app.git\ncd web-app\n\nnpm install\nnpm run dev',
    prompt: true,
    what: 'setup commands',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const block = canvasElement.querySelector('[data-slot="code-block-content"]')
    await expect(block?.querySelectorAll('[data-slot="code-block-prompt"]')).toHaveLength(4)
    await userEvent.click(canvas.getByRole('button', { name: 'Copy setup commands' }))
    await waitFor(() =>
      expect(clipboardSpy()).toHaveBeenCalledWith(
        'git clone https://github.com/acme/web-app.git\ncd web-app\n\nnpm install\nnpm run dev',
      ),
    )
  },
}

/** A string `prompt` replaces `$` (PowerShell, REPLs, SQL consoles). */
export const CustomPrompt: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <CodeBlock {...args} code="Get-ChildItem -Path .\reports" prompt="PS>" />
      <CodeBlock {...args} code={'SELECT id, total FROM invoices\nWHERE status = \'overdue\';'} prompt="sql>" what="query" />
    </div>
  ),
}

/**
 * `copyValue` differs from the displayed `code`: the block shows a masked key while Copy writes
 * the real one to the clipboard.
 */
export const MaskedCopy: Story = {
  args: {
    code: 'export ACME_API_KEY=sk_demo_••••3f6a',
    copyValue: 'export ACME_API_KEY=sk_demo_4f9a2c7e1b8d3f6a',
    prompt: true,
    what: 'command (includes your API key)',
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByText(/4f9a2c7e1b8d3f6a/)).not.toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Copy command (includes your API key)' }))
    await waitFor(() =>
      expect(clipboardSpy()).toHaveBeenCalledWith('export ACME_API_KEY=sk_demo_4f9a2c7e1b8d3f6a'),
    )
    await expect(clipboardSpy()).not.toHaveBeenCalledWith('export ACME_API_KEY=sk_demo_••••3f6a')
    await waitFor(() => expect(args.onCopy).toHaveBeenCalledWith('export ACME_API_KEY=sk_demo_4f9a2c7e1b8d3f6a'))
  },
}

/**
 * `copyPlacement="side"` puts the button in its own column, so a long command never scrolls
 * under it. Paired here with `size="sm"` as in a compact popover.
 */
export const SideCopy: Story = {
  args: {
    code: 'acme login --workspace northwind-trading --profile billing-admin --token ak_••••••••7f3a',
    copyValue: 'acme login --workspace northwind-trading --profile billing-admin --token ak_demo_2c9e4b7a1d8f7f3a',
    prompt: true,
    size: 'sm',
    copyPlacement: 'side',
    what: 'login command (includes your token)',
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvasElement.querySelector('[data-slot="code-block"]')).toHaveAttribute('data-copy-placement', 'side')
    await userEvent.click(canvas.getByRole('button', { name: 'Copy login command (includes your token)' }))
    await waitFor(() => expect(clipboardSpy()).toHaveBeenCalledWith(args.copyValue))
    await expect(clipboardSpy()).not.toHaveBeenCalledWith(args.code)
  },
}

/** `wrap` breaks long lines instead of scrolling: the whole request stays visible in a narrow column. */
export const Wrap: Story = {
  args: {
    code: 'curl -X POST https://api.example.com/v2/invoices -H "Authorization: Bearer $ACME_API_KEY" -d customer=cus_4QbX2 -d amount=4280 -d currency=usd',
    wrap: true,
    what: 'request',
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
}

/**
 * Without `wrap`, a long line scrolls horizontally. The overlay button stays pinned to the corner
 * and the scroll area ends left of it, so the text never slides under the button.
 */
export const LongLineScroll: Story = {
  args: {
    code: 'curl -X POST https://api.example.com/v2/invoices -H "Authorization: Bearer $ACME_API_KEY" -H "Content-Type: application/json" -d \'{"customer":"cus_4QbX2","amount":4280,"currency":"usd","description":"Annual plan, 12 seats"}\'',
    what: 'request',
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
}

/** `sm` (12px) for popovers and dense panels, `md` (12.5px, default) elsewhere. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <CodeBlock {...args} size="sm" code="npm install @acme/sdk  # sm, 12px" />
      <CodeBlock {...args} size="md" code="npm install @acme/sdk  # md, 12.5px" />
    </div>
  ),
}

/** `copyable={false}` hides the button: for read-only examples the user should not paste as-is. */
export const NotCopyable: Story = {
  args: {
    code: 'Invoice INV-2026-0142 was paid on Sep 12, 2026.\nAmount: $4,280.00 USD',
    copyable: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument()
  },
}

/** `inline`: compact one-line chips with a ghost copy button, here listing email template merge tags. */
export const Inline: Story = {
  args: { variant: 'inline', what: 'merge tag' },
  render: (args) => (
    <ul className="flex flex-col divide-y rounded-lg border">
      {[
        { code: '{{customer.first_name}}', help: 'First name of the recipient.' },
        { code: '{{invoice.total | currency}}', help: 'Invoice total, formatted in the invoice currency.' },
        { code: '{{workspace.billing_portal_url}}', help: 'Link to the self-service billing portal of the workspace.' },
      ].map((tag) => (
        <li key={tag.code} className="flex flex-col gap-1.5 px-5 py-3.5">
          <CodeBlock {...args} code={tag.code} />
          <p className="text-[12.5px] leading-relaxed text-foreground-light">{tag.help}</p>
        </li>
      ))}
    </ul>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // `inline` defaults to the compact 12px size.
    for (const content of canvasElement.querySelectorAll('[data-slot="code-block-content"]')) {
      await expect(content).toHaveClass('text-[12px]')
    }
    const buttons = canvas.getAllByRole('button', { name: 'Copy merge tag' })
    await expect(buttons).toHaveLength(3)
    await userEvent.click(buttons[1]!)
    await waitFor(() => expect(clipboardSpy()).toHaveBeenCalledWith('{{invoice.total | currency}}'))
  },
}

/**
 * `terminal`: decorative window for onboarding and marketing panels. Rich `children` tint the
 * output lines; `CodeBlockPrompt` renders the muted prompt. Not copyable by default.
 */
export const Terminal: Story = {
  args: { variant: 'terminal', code: undefined },
  render: (args) => (
    <CodeBlock {...args}>
      <CodeBlockPrompt />
      npm run test
      {'\n'}
      <span className="text-success">✓ invoices.test.ts (12 tests)</span>
      {'\n'}
      <span className="text-success">✓ customers.test.ts (8 tests)</span>
      {'\n'}
      <span className="text-warning">! 1 snapshot obsolete</span>
      {'\n'}
      <span className="text-foreground">Test files 2 passed (2)</span>
    </CodeBlock>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument()
  },
}

/** A terminal with `copyable` shows a ghost copy button at the right end of its title bar. */
export const TerminalCopyable: Story = {
  args: {
    variant: 'terminal',
    code: 'npx create-acme-app@latest my-store\ncd my-store\nnpm run dev',
    prompt: true,
    copyable: true,
    what: 'setup commands',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const header = canvasElement.querySelector('[data-slot="code-block-header"]')
    const button = canvas.getByRole('button', { name: 'Copy setup commands' })
    await expect(header).toContainElement(button)
    await userEvent.click(button)
    await waitFor(() =>
      expect(clipboardSpy()).toHaveBeenCalledWith('npx create-acme-app@latest my-store\ncd my-store\nnpm run dev'),
    )
  },
}

/**
 * Rich `children` in a `block`: tinted parts and a {@link CodeBlockPrompt}. Copy needs an explicit
 * `copyValue`; without it (second block) no copy button is rendered.
 */
export const RichContent: Story = {
  args: { code: undefined },
  render: (args) => (
    <div className="flex flex-col gap-3">
      <CodeBlock {...args} copyValue="acme invoices list --status overdue" what="command">
        <CodeBlockPrompt />
        acme invoices list <span className="text-primary">--status</span> overdue
      </CodeBlock>
      <CodeBlock {...args}>
        <span className="text-foreground-muted"># 3 invoices overdue, $12,940.00 total</span>
      </CodeBlock>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const buttons = canvas.getAllByRole('button')
    await expect(buttons).toHaveLength(1)
    await userEvent.click(buttons[0]!)
    await waitFor(() => expect(clipboardSpy()).toHaveBeenCalledWith('acme invoices list --status overdue'))
  },
}

/** Composition: an empty list that offers the CLI as an alternative to the main action. */
export const InEmptyState: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <EmptyState
      icon={<KeyRound />}
      title="No API keys yet"
      description="Create a key to call the API from your backend or CI."
      actions={
        <Button variant="primary" icon={<Plus />}>
          Create API key
        </Button>
      }
    >
      <div className="mt-4 flex w-full max-w-md flex-col gap-2 text-left">
        <MonoLabel>Or from the CLI</MonoLabel>
        <CodeBlock code="acme keys create --name backend" prompt onCopy={args.onCopy} />
      </div>
    </EmptyState>
  ),
}

/** Composition: an onboarding card walking through installing an SDK. */
export const InstallTheSdk: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Install the SDK</CardTitle>
          <CardDescription>Send your first request to the Invoices API in a couple of minutes.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="text-[13px] font-medium text-foreground">Add the package</p>
          <CodeBlock code="npm install @acme/sdk" prompt onCopy={args.onCopy} />
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-[13px] font-medium text-foreground">Set your API key</p>
          <CodeBlock
            code="ACME_API_KEY=sk_demo_••••3f6a"
            copyValue="ACME_API_KEY=sk_demo_4f9a2c7e1b8d3f6a"
            what="environment variable"
            onCopy={args.onCopy}
          />
          <p className="text-[12.5px] text-foreground-light">Add it to your .env file. Never commit it.</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-[13px] font-medium text-foreground">Create an invoice</p>
          <CodeBlock
            what="code sample"
            onCopy={args.onCopy}
            code={`import { Acme } from '@acme/sdk'

const acme = new Acme(process.env.ACME_API_KEY)
const invoice = await acme.invoices.create({ customer: 'cus_4QbX2', amount: 4280, currency: 'usd' })`}
          />
        </div>
      </CardContent>
    </Card>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Copy environment variable' }))
    await waitFor(() => expect(args.onCopy).toHaveBeenCalledWith('ACME_API_KEY=sk_demo_4f9a2c7e1b8d3f6a'))
  },
}

/** `labels` translates the built-in texts of the copy button ("Copy <what>", "Copied"). */
export const TranslatedLabels: Story = {
  args: {
    what: 'la commande',
    labels: { copyWhat: (what) => `Copier ${what}`, copied: 'Copié' },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Copier la commande' }))
    await waitFor(() => expect(args.onCopy).toHaveBeenCalledWith('npm install @acme/sdk'))
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Copié'))
  },
}
