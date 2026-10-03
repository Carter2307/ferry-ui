import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { cn } from '../lib/utils'

import { Code, Snippet, TokenValue, useCssVariables, withInlineCode } from './doc-blocks'

interface TypeRole {
  role: string
  /** Literal classes (the exact ones the components use). */
  className: string
  spec: string
  usage: string
}

const scale: TypeRole[] = [
  {
    role: 'Record title',
    className: 'text-[26px] leading-tight font-medium tracking-[-0.01em] md:text-[32px]',
    spec: '26 → 32px · 500 · -0.01em',
    usage: 'PageHeader `size="lg"`: the home page of a single record.',
  },
  {
    role: 'Page title',
    className: 'text-2xl leading-tight font-medium tracking-[-0.01em] md:text-[26px]',
    spec: '24 → 26px · 500 · -0.01em',
    usage: 'PageHeader: list, overview and settings pages. One per page.',
  },
  {
    role: 'Metric value',
    className: 'text-xl tabular md:text-[22px]',
    spec: '20 → 22px · 400 · tabular',
    usage: 'Big numbers of metric cards.',
  },
  {
    role: 'Section title',
    className: 'text-lg font-medium md:text-xl',
    spec: '18 → 20px · 500',
    usage: 'PageSection headings inside a page.',
  },
  {
    role: 'Dialog title',
    className: 'text-base leading-snug font-medium',
    spec: '16px · 500',
    usage: 'Dialog and alert dialog titles.',
  },
  {
    role: 'Panel title',
    className: 'text-[15px] leading-6 font-medium',
    spec: '15px · 500',
    usage: 'Sheet titles, resource card titles, inner menu titles.',
  },
  {
    role: 'Tile value',
    className: 'text-[15px] md:text-[17px]',
    spec: '15 → 17px · 400',
    usage: 'Values of info tiles (a label above, a hint below).',
  },
  {
    role: 'Body',
    className: 'text-sm',
    spec: '14px / 1.45 · 400',
    usage: 'Default text (set on <body>). Card titles use it at 500.',
  },
  {
    role: 'Secondary',
    className: 'text-[13px]',
    spec: '13px · 400',
    usage: 'The workhorse: descriptions, table cells, menu items, small buttons and inputs.',
  },
  {
    role: 'Small',
    className: 'text-[12.5px] leading-relaxed',
    spec: '12.5px · 400',
    usage: 'Code blocks, trend deltas, field errors.',
  },
  {
    role: 'Caption',
    className: 'text-xs',
    spec: '12px · 400',
    usage: 'Helper text, tooltips, tiny buttons, timestamps.',
  },
  {
    role: 'Mono label',
    className: 'mono-label',
    spec: '11.5px / 1.3 · mono · 0.06em · uppercase',
    usage: 'Card titles, table headers, metric labels, key/value captions. Prefer the `MonoLabel` component.',
  },
  {
    role: 'Mono group',
    className: 'font-mono text-[11px] tracking-[0.06em] uppercase',
    spec: '11px · mono · 0.06em · uppercase',
    usage: 'Group headings inside menus, selects and the command palette; shortcut hints.',
  },
  {
    role: 'Mono micro',
    className: 'font-mono text-[10.5px] tracking-[0.06em] uppercase',
    spec: '10.5px · mono · 0.06em',
    usage: 'Mono badges, keyboard caps, counters.',
  },
  {
    role: 'Badge',
    className: 'text-[10.5px] leading-none font-medium tracking-[0.04em] uppercase',
    spec: '10.5px · 500 · 0.04em · uppercase',
    usage: 'Badges and status badges (the default sans badge font).',
  },
]

/** Props of the type scale specimen. */
interface TypeScaleProps {
  /** Text rendered in every style. */
  sample?: string
  /** Show the classes and specs next to each specimen. */
  showSpecs?: boolean
}

/** Every text style the components use, largest first, with the exact classes to reproduce it. */
function TypeScale({ sample = 'Quarterly revenue report', showSpecs = true }: TypeScaleProps) {
  return (
    <div className="flex w-full max-w-4xl flex-col divide-y rounded-lg border bg-card shadow-card">
      {scale.map((item) => (
        <div
          key={item.role}
          data-testid="type-role"
          className={cn('grid gap-3 px-5 py-4', showSpecs && 'md:grid-cols-[240px_minmax(0,1fr)] md:gap-6')}
        >
          {showSpecs && (
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-[13px] font-medium text-foreground">{item.role}</span>
              <span className="font-mono text-[11.5px] text-foreground-lighter">{item.spec}</span>
              <span className="text-xs text-foreground-light">{withInlineCode(item.usage)}</span>
            </div>
          )}
          <div className="flex min-w-0 flex-col justify-center gap-1.5">
            <div className={cn('min-w-0 truncate text-foreground', item.className)}>{sample}</div>
            {showSpecs && (
              <div>
                <Code>{item.className}</Code>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

const meta = {
  title: 'Foundations/Typography',
  component: TypeScale,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Inter for UI text, Source Code Pro for code, identifiers and the uppercase mono labels. The scale is small and dense: 13px is the default for UI copy, 14px for body text, and hierarchy comes from size and ink (`foreground` → `foreground-muted`) rather than heavy weights — only 400 and 500 are used. Copy the classes shown here instead of inventing new sizes.',
      },
    },
  },
  args: {
    sample: 'Quarterly revenue report',
    showSpecs: true,
  },
  // The demo component lives in this stories file, which docgen skips: describe its props here.
  argTypes: {
    sample: {
      description: 'Text rendered in every style.',
      control: 'text',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'Quarterly revenue report' } },
    },
    showSpecs: {
      description: 'Show the classes and specs next to each specimen.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
  },
} satisfies Meta<typeof TypeScale>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByTestId('type-role')).toHaveLength(scale.length)
    await expect(canvas.getByText('mono-label')).toBeInTheDocument()
  },
}

/** Specimens only, for comparing sizes at a glance. */
export const SpecimensOnly: Story = { args: { showSpecs: false } }

/** Long text: titles truncate on one line (`truncate`), descriptions wrap or clamp (`line-clamp-2`). */
export const LongContent: Story = {
  args: { sample: 'Customer onboarding checklist for enterprise workspaces with single sign-on and audit logs' },
  render: (args) => (
    <div className="flex w-80 flex-col gap-3 rounded-lg border bg-card p-4 shadow-card">
      <div className="truncate text-[15px] leading-6 font-medium text-foreground" title={args.sample}>
        {args.sample}
      </div>
      <p className="line-clamp-2 text-[13px] text-foreground-light">
        Walk new enterprise customers through workspace setup, identity provider configuration, role mapping, audit
        log export and the first billing cycle review.
      </p>
      <span className="text-xs text-foreground-lighter">Updated 2 hours ago by Maya Chen</span>
    </div>
  ),
}

const fontVariables = ['--libui-font-sans', '--libui-font-mono'] as const

function FontFamiliesDemo() {
  const values = useCssVariables(fontVariables)
  const families = [
    {
      name: 'Sans — Inter',
      className: 'font-sans',
      variable: '--libui-font-sans',
      usage: 'All UI text: titles, body, buttons, inputs, menus.',
    },
    {
      name: 'Mono — Source Code Pro',
      className: 'font-mono',
      variable: '--libui-font-mono',
      usage: 'Code, IDs, keys, hashes, mono labels, keyboard caps, mono badges.',
    },
  ]
  return (
    <div className="grid w-full max-w-4xl gap-3 md:grid-cols-2">
      {families.map((family) => (
        <div key={family.variable} className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-card">
          <div className="border-b px-4 py-2.5 mono-label">{family.name}</div>
          <div className={cn('flex flex-col gap-1 px-4 py-4 text-foreground', family.className)}>
            <span className="text-[32px] leading-tight">Aa Gg Rr</span>
            <span className="text-sm text-foreground-light">ABCDEFGHIJKLMNOPQRSTUVWXYZ</span>
            <span className="text-sm text-foreground-light">abcdefghijklmnopqrstuvwxyz 0123456789</span>
          </div>
          <div className="flex flex-col gap-1.5 border-t px-4 py-3">
            <div className="flex flex-wrap gap-1">
              <Code>{family.className}</Code>
              <Code>{family.variable}</Code>
            </div>
            <TokenValue value={values[family.variable]} />
            <p className="text-xs text-foreground-light">{family.usage}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * The two families and their full fallback stacks (read live from the tokens). `ferry-ui/fonts.css` loads
 * Inter and Source Code Pro as variable webfonts; skip it to fall back to the system fonts. The body
 * also enables Inter's `cv11` (single-storey a) and `ss01` (open digits) features.
 */
export const FontFamilies: Story = {
  render: () => <FontFamiliesDemo />,
}

/**
 * Only two weights: 400 for text and 500 (medium) for titles, buttons, active items and emphasis.
 * Do not use 600/700 — size and ink carry the hierarchy.
 */
export const Weights: Story = {
  render: () => (
    <div className="grid w-full max-w-3xl gap-3 md:grid-cols-2">
      {[
        { weight: 'font-normal', label: '400 · font-normal', usage: 'Body, descriptions, table cells, mono labels.' },
        { weight: 'font-medium', label: '500 · font-medium', usage: 'Titles, buttons, card titles, active nav items.' },
      ].map((item) => (
        <div key={item.weight} className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-card">
          <span className="mono-label">{item.label}</span>
          <span className={cn('text-2xl text-foreground', item.weight)}>Team members</span>
          <span className={cn('font-mono text-sm text-foreground', item.weight)}>inv_8f2k41</span>
          <span className="text-xs text-foreground-light">{withInlineCode(item.usage)}</span>
        </div>
      ))}
    </div>
  ),
}

/** Ink carries the hierarchy: four text colors from strongest to quietest. */
export const TextHierarchy: Story = {
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-1.5 rounded-lg border bg-card p-5 shadow-card">
      <span className="mono-label">Invoice · foreground-lighter</span>
      <span className="text-[15px] leading-6 font-medium text-foreground">Acme Corp — March 2026 · foreground</span>
      <span className="text-[13px] text-foreground-light">
        Pro plan, 12 seats, billed monthly · foreground-light
      </span>
      <span className="text-xs text-foreground-muted">Last synced 4 minutes ago · foreground-muted</span>
    </div>
  ),
}

/** Code: inline `<code>` inherits the text size; blocks use 12.5px mono on the `code` surface. */
export const CodeText: Story = {
  render: () => (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <p className="text-[13px] text-foreground-light">
        Pass the key in the <code className="font-mono text-foreground">Authorization</code> header, e.g.{' '}
        <code className="font-mono text-foreground">Bearer sk_live_…</code>.
      </p>
      <Snippet>{`curl https://api.example.com/v1/invoices \\\n  -H "Authorization: Bearer $API_KEY"`}</Snippet>
    </div>
  ),
}

const amounts = ['1,280.00', '94.50', '11,111.11', '407.18', '23,990.00']

/**
 * `tabular` (font-variant-numeric: tabular-nums) gives every digit the same width, so numbers in
 * columns and counters that update in place do not jitter. Use it on amounts, metrics, counts and times.
 */
export const TabularNumbers: Story = {
  render: () => (
    <div className="grid w-full max-w-md grid-cols-2 gap-3">
      {[
        { label: 'Proportional (default)', className: '' },
        { label: 'tabular', className: 'tabular' },
      ].map((column) => (
        <div key={column.label} className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-card">
          <div className="border-b px-4 py-2 mono-label">{column.label}</div>
          <div className="flex flex-col px-4 py-2">
            {amounts.map((amount) => (
              <span
                key={amount}
                data-testid={column.className ? 'tabular-amount' : 'proportional-amount'}
                className={cn('py-0.5 text-right text-[13px] text-foreground', column.className)}
              >
                ${amount}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const el of canvas.getAllByTestId('tabular-amount')) await expect(el).toHaveClass('tabular')
  },
}

/**
 * The scale in a realistic page fragment, with the same classes as `PageHeader` (`size="lg"` for a
 * single record), `PageSection` and `MetricCard`: eyebrow 13px, title, 16px description, 18 → 20px
 * section heading, mono labels and tabular metric values.
 */
export const Composition: Story = {
  render: () => (
    <div className="flex w-full max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-1.5">
        <span className="text-[13px] text-foreground-lighter">Billing / Invoices</span>
        <h1 className="truncate text-[26px] leading-tight font-medium tracking-[-0.01em] text-foreground md:text-[32px]">
          Invoice INV-2026-0142
        </h1>
        <p className="text-base text-foreground-light">Issued to Acme Corp on March 1, 2026.</p>
      </header>
      <section aria-labelledby="typography-composition-summary" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 id="typography-composition-summary" className="text-lg font-medium text-foreground md:text-xl">
            Summary
          </h2>
          <p className="text-sm text-foreground-light">Totals include tax and prorated seat changes.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Amount due', value: '$1,280.00' },
            { label: 'Seats', value: '12' },
            { label: 'Due in', value: '14 days' },
          ].map((metric) => (
            <div key={metric.label} className="flex flex-col gap-2 rounded-lg border bg-card px-4 py-3 shadow-card">
              <span className="mono-label">{metric.label}</span>
              <span className="text-xl text-foreground tabular md:text-[22px]">{metric.value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent('Invoice INV-2026-0142')
    await expect(canvas.getByRole('region', { name: 'Summary' })).toBeInTheDocument()
  },
}
