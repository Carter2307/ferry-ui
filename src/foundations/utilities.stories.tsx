import type { Meta, StoryObj } from '@storybook/react-vite'
import { Check, Copy, Plus } from 'lucide-react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Button } from '../components/primitives/button'
import { Checkbox } from '../components/primitives/checkbox'
import { Input } from '../components/primitives/input'
import { Label } from '../components/primitives/label'
import { Toaster } from '../components/primitives/sonner'
import { useCopy } from '../hooks/use-copy'
import { cn } from '../lib/utils'

import { Code, DocSection, Snippet } from './doc-blocks'

type UtilityName = 'mono-label' | 'bg-dot-grid' | 'tabular' | 'scrollbar-none'

const tags = [
  'All projects',
  'Marketing',
  'Billing',
  'Mobile',
  'Design system',
  'Analytics',
  'Internal tools',
  'Customer portal',
  'Archived',
]

/** Props of the utility sample. */
interface UtilitySampleProps {
  /** Custom utility registered by `theme.css` to preview. */
  utility?: UtilityName
}

/** A minimal preview of one custom utility from `theme.css`. */
function UtilitySample({ utility = 'mono-label' }: UtilitySampleProps) {
  switch (utility) {
    case 'bg-dot-grid':
      return <div data-testid="utility-sample" className="h-40 w-80 rounded-lg border bg-surface-75 bg-dot-grid" />
    case 'tabular':
      return (
        <div data-testid="utility-sample" className="flex flex-col text-right text-sm text-foreground tabular">
          <span>$11,111.11</span>
          <span>$8,090.00</span>
          <span>$407.18</span>
        </div>
      )
    case 'scrollbar-none':
      return (
        <div data-testid="utility-sample" className="flex w-80 gap-1.5 overflow-x-auto scrollbar-none">
          {tags.map((tag) => (
            <span key={tag} className="shrink-0 rounded-md border bg-surface-100 px-2.5 py-1 text-[13px] text-foreground-light">
              {tag}
            </span>
          ))}
        </div>
      )
    default:
      return (
        <span data-testid="utility-sample" className="mono-label">
          Monthly revenue
        </span>
      )
  }
}

const meta = {
  title: 'Foundations/Utilities',
  component: UtilitySample,
  parameters: {
    docs: {
      description: {
        component:
          'Custom Tailwind utilities registered by `theme.css` (`mono-label`, `bg-dot-grid`, `tabular`, `scrollbar-none`), the focus ring convention every interactive element follows, and the clipboard helpers (`useCopy`, `copyText`). Use these instead of re-creating the same styles with arbitrary values.',
      },
    },
  },
  args: {
    utility: 'mono-label',
  },
  // The demo component lives in this stories file, which docgen skips: describe its props here.
  argTypes: {
    utility: {
      description: 'Custom utility registered by `theme.css` to preview.',
      control: 'inline-radio',
      options: ['mono-label', 'bg-dot-grid', 'tabular', 'scrollbar-none'],
      table: { defaultValue: { summary: 'mono-label' } },
    },
  },
} satisfies Meta<typeof UtilitySample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByTestId('utility-sample')).toHaveClass('mono-label')
  },
}

/**
 * `mono-label`: 11.5px uppercase monospace, 0.06em tracking, `foreground-lighter`. The signature
 * caption for card titles, key/value labels, metric labels and table headers (1–4 words). Prefer the
 * `MonoLabel` component, whose `as` prop picks the right element (`dt`, `th`, `h3`, `label`…). Menu,
 * select and command group headings use a slightly smaller 11px variant built into those primitives.
 * Never use it for sentences or page titles.
 */
export const MonoLabel: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <DocSection title="mono-label" description="Captions that label a value, a column or a group.">
      <div className="grid w-full max-w-3xl gap-3 md:grid-cols-2">
        <div className="overflow-hidden rounded-lg border bg-card shadow-card">
          <div className="border-b px-4 py-2.5 mono-label">Subscription</div>
          <dl className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-2.5 px-4 py-3 text-[13px]">
            <dt className="mono-label self-center">Plan</dt>
            <dd className="text-foreground">Pro · 12 seats</dd>
            <dt className="mono-label self-center">Renews</dt>
            <dd className="text-foreground">April 1, 2026</dd>
            <dt className="mono-label self-center">Owner</dt>
            <dd className="text-foreground">maya@acme.co</dd>
          </dl>
        </div>
        <div className="overflow-hidden rounded-lg border bg-card shadow-card">
          <div className="grid h-9 grid-cols-[1fr_auto] items-center border-b bg-surface-200 px-4">
            <span className="mono-label">Customer</span>
            <span className="mono-label">Amount</span>
          </div>
          {[
            ['Acme Corp', '$1,280.00'],
            ['Globex', '$94.50'],
            ['Initech', '$407.18'],
          ].map(([name, amount]) => (
            <div key={name} className="grid grid-cols-[1fr_auto] border-b px-4 py-2 text-[13px] last:border-b-0">
              <span className="text-foreground">{name}</span>
              <span className="text-foreground tabular">{amount}</span>
            </div>
          ))}
        </div>
      </div>
    </DocSection>
  ),
}

/** `bg-dot-grid`: a 16px dotted canvas (border-stronger dots) for diagrams, empty canvases and hero panels. */
export const DotGrid: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex h-64 w-full max-w-3xl flex-col items-center justify-center gap-3 rounded-lg border bg-surface-75 bg-dot-grid">
      <div className="flex flex-col items-center gap-1 rounded-lg border bg-card px-6 py-4 text-center shadow-card">
        <span className="text-sm font-medium text-foreground">No workflow steps yet</span>
        <span className="text-[13px] text-foreground-light">Add a trigger to start building the automation.</span>
        <Button className="mt-2" icon={<Plus />}>
          Add trigger
        </Button>
      </div>
    </div>
  ),
}

/**
 * `tabular`: tabular figures (every digit the same width). Use it for amounts, counts, metrics,
 * durations and anything that updates in place or aligns in a column.
 */
export const Tabular: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6 rounded-lg border bg-card px-5 py-4 shadow-card">
      {['', 'tabular'].map((className) => (
        <div key={className || 'default'} className="flex flex-col gap-1">
          <span className="mb-1 mono-label">{className || 'default'}</span>
          {['1,111.11', '8,090.00', '407.18', '23,990.00'].map((n) => (
            <span key={n} className={cn('text-right text-[13px] text-foreground', className)}>
              {n}
            </span>
          ))}
        </div>
      ))}
    </div>
  ),
}

/**
 * `scrollbar-none`: hides the scrollbar but keeps the element scrollable (wheel, touch, keyboard).
 * Use it on horizontal strips (tabs, filter chips, breadcrumbs) that overflow on small screens. Keep
 * the default thin scrollbar on vertical content so people can see there is more.
 */
export const ScrollbarNone: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      {[
        { label: 'default (thin scrollbar)', className: '' },
        { label: 'scrollbar-none', className: 'scrollbar-none' },
      ].map((row) => (
        <div key={row.label} className="flex flex-col gap-1.5">
          <span className="mono-label">{row.label}</span>
          <div
            data-testid={row.className ? 'strip-hidden' : 'strip-default'}
            className={cn('flex gap-1.5 overflow-x-auto pb-1', row.className)}
          >
            {tags.map((tag) => (
              <span
                key={tag}
                className="shrink-0 rounded-md border bg-surface-100 px-2.5 py-1 text-[13px] text-foreground-light"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByTestId('strip-hidden')).toHaveClass('scrollbar-none', 'overflow-x-auto')
  },
}

/**
 * Focus ring convention: `outline-none focus-visible:ring-2 focus-visible:ring-ring` on every
 * interactive element (keyboard focus only, never on click). Text fields also switch their border
 * to `focus-visible:border-primary-bright/70`; destructive confirm buttons use
 * `focus-visible:ring-destructive/40`. Elements without their own focus styles fall back to the base
 * `outline-ring/50` outline set by `theme.css`. Never remove focus styles without replacing them.
 * Press Tab to walk through the controls.
 */
export const FocusRing: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex w-full max-w-xl flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <Button>Default</Button>
        <Button variant="primary">Primary</Button>
        <Button variant="destructive-solid">Delete</Button>
        <a
          href="#billing"
          className="rounded-md px-1 text-[13px] text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
        >
          Custom link
        </a>
      </div>
      <div className="flex items-center gap-3">
        <Input size="sm" placeholder="Search invoices" aria-label="Search invoices" className="w-56" />
        <div className="flex items-center gap-2">
          <Checkbox id="focus-demo-terms" />
          <Label htmlFor="focus-demo-terms">Email receipts</Label>
        </div>
      </div>
      <Snippet>{`// Any custom interactive element
className="outline-none focus-visible:ring-2 focus-visible:ring-ring"`}</Snippet>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await expect(canvas.getByRole('button', { name: 'Default' })).toHaveFocus()
    await userEvent.tab()
    await expect(canvas.getByRole('button', { name: 'Primary' })).toHaveFocus()
  },
}

/** Props of the clipboard demo. */
interface ClipboardDemoProps {
  /** Text copied by the button. */
  value: string
  /** Called with `value` when the button is clicked (before the copy). */
  onCopy?: (value: string) => void
}

function ClipboardDemo({ value, onCopy }: ClipboardDemoProps) {
  const [copied, copy] = useCopy()
  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="clipboard-demo-key">Publishable key</Label>
        <div className="flex items-center gap-2">
          <Input id="clipboard-demo-key" size="sm" mono readOnly value={value} />
          <Button
            size="sm"
            aria-label={copied ? 'Copied' : 'Copy key'}
            icon={copied ? <Check className="text-success" /> : <Copy />}
            onClick={() => {
              onCopy?.(value)
              void copy(value)
            }}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </div>
      <Snippet>{`import { useCopy, copyText } from 'libui'

const [copied, copy] = useCopy()   // copied is true for 1.5s after a successful copy
<Button onClick={() => copy(apiKey)}>{copied ? 'Copied' : 'Copy'}</Button>

const ok = await copyText(value)   // outside React: resolves to true / false`}</Snippet>
      <p className="text-xs text-foreground-light">
        <Code>useCopy</Code> reports failures with <Code>toast.error</Code>, so mount <Code>{'<Toaster />'}</Code> once in
        the app. For standard UI use the ready-made patterns instead: <Code>CopyButton</Code>, <Code>CopyField</Code>,{' '}
        <Code>SecretField</Code> and <Code>CodeBlock</Code> already wire this hook.
      </p>
      <Toaster />
    </div>
  )
}

/**
 * Clipboard helpers from `hooks/use-copy`: `useCopy()` returns `[copied, copy]` for buttons that
 * flip to a check mark; `copyText()` is the plain async function (with a fallback for non-secure
 * contexts). Use them for custom copy affordances only; `CopyButton` / `CopyField` cover the usual cases.
 */
export const Clipboard: StoryObj<ClipboardDemoProps> = {
  args: { value: 'pk_demo_4f9a2c71e8b3d605', onCopy: fn() },
  argTypes: { onCopy: { control: false } },
  parameters: { layout: 'padded', controls: { include: ['value'] } },
  render: (args) => <ClipboardDemo {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Copy key' }))
    await expect(args.onCopy).toHaveBeenCalledWith(args.value)
  },
}

/** Every custom utility at a glance, with its class name. */
export const AllUtilities: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-2">
      {(['mono-label', 'bg-dot-grid', 'tabular', 'scrollbar-none'] as const).map((utility) => (
        <div key={utility} className="flex flex-col gap-3 overflow-hidden rounded-lg border bg-card p-4 shadow-card">
          <Code className="self-start">{utility}</Code>
          <div className="[&>*]:max-w-full">
            <UtilitySample utility={utility} />
          </div>
        </div>
      ))}
    </div>
  ),
}
