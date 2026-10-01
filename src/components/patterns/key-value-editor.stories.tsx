import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Check, Copy, Eye, EyeOff } from 'lucide-react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

import { useCopy } from '../../hooks/use-copy'
import { Button } from '../primitives/button'
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '../primitives/card'

import { KeyValueEditor, type KeyValueEditorLabels } from './key-value-editor'
import {
  formatKeyValueText,
  useKeyValueRows,
  validateIdentifierKey,
  type KeyValidator,
  type KeyValuePair,
  type KeyValueRow,
} from './key-value-rows'
import { SaveBar } from './save-bar'

const METADATA: KeyValueRow[] = [
  { id: 'm1', key: 'team', value: 'growth' },
  { id: 'm2', key: 'cost-center', value: 'CC-4102' },
  { id: 'm3', key: 'owner', value: 'maya.chen@example.com' },
]

/** Request headers of an integration: two plain values and two `secret` ones. */
const HEADERS: KeyValueRow[] = [
  { id: 'h1', key: 'Accept', value: 'application/json' },
  { id: 'h2', key: 'Authorization', value: 'Bearer tok_demo_8f2a91c4', secret: true },
  { id: 'h3', key: 'X-Signature', value: 'sig_demo_31b9e0a4c2', secret: true },
  { id: 'h4', key: 'X-Api-Version', value: '2026-01' },
]

/** RFC 7230 header-name token. */
const validateHeaderName: KeyValidator = (key) =>
  /^[A-Za-z0-9!#$%&'*+.^_`|~-]+$/.test(key) ? null : 'Header names cannot contain spaces or separators'

/**
 * Resolves once `dialog` is closed. Checks `data-state` rather than removal: a closing dialog stays
 * mounted (and keeps the page aria-hidden) during its exit animation, indefinitely in a background
 * tab where animations pause, so assertions after it query fields by label, not by role.
 */
const waitForClosed = (dialog: HTMLElement) => waitFor(() => expect(dialog).toHaveAttribute('data-state', 'closed'))

const meta = {
  title: 'Patterns/Key Value Editor',
  component: KeyValueEditor,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Editable list of key/value pairs (headers, metadata, labels, variables) with add / remove, per-row validation, secret masking and bulk entry: paste `key=value` lines into a key field or use the Import dialog. Control it with `useKeyValueRows` (rows, `pairs` for the request body, `errors`, `dirty`) and pair it with `SaveBar`; pass `validateKey` for a key format and mark sensitive rows `secret` (or set `maskValues` for all rows). Captions and buttons have their own props (`keyLabel`, `addLabel`…); every other built-in text (accessible names, tooltips, paste tip, import dialog) is overridable through `labels`, e.g. to translate.',
      },
    },
  },
  args: {
    defaultValue: METADATA,
    onValueChange: fn(),
    readOnly: false,
    disabled: false,
    maskValues: false,
    revealAll: false,
    allowImport: true,
    keyLabel: 'Key',
    valueLabel: 'Value',
    keyPlaceholder: 'key',
    valuePlaceholder: 'value',
    addLabel: 'Add row',
  },
  argTypes: {
    value: { control: false },
    defaultValue: { control: false },
    errors: { control: false },
    validateKey: { control: false },
    emptyMessage: { control: 'text' },
    // ReactNode props: a text control instead of the inferred object editor (an object is not renderable).
    addLabel: { control: 'text' },
    importLabel: { control: 'text' },
    itemNoun: { control: 'object' },
    labels: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof KeyValueEditor>

export default meta
type Story = StoryObj<typeof meta>

/** Uncontrolled editor seeded with `defaultValue`; every change is reported through `onValueChange`. */
export const Default: Story = {}

/** No rows yet: `emptyMessage` replaces the list and the add / import actions stay available. */
export const Empty: Story = {
  args: {
    defaultValue: [],
    emptyMessage: 'No labels yet. Add one, or paste key=value lines into a key field.',
    itemNoun: { one: 'label', other: 'labels' },
    addLabel: 'Add label',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(/No labels yet/)).toBeInTheDocument()
    await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Add label' })).toBeEnabled()
    await expect(canvas.getByRole('button', { name: 'Import' })).toBeEnabled()
  },
}

/** Adding the first row replaces `emptyMessage` with the list and moves focus to the new key field. */
export const AddFirstRow: Story = {
  args: { ...Empty.args },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Add label' }))
    await expect(canvas.queryByText(/No labels yet/)).not.toBeInTheDocument()
    await waitFor(() => expect(canvas.getByRole('textbox', { name: 'Key 1' })).toHaveFocus())
  },
}

/** Rows marked `secret` show a fixed-length mask and a reveal toggle; other rows stay aligned. */
export const SecretValues: Story = {
  args: {
    defaultValue: HEADERS,
    keyLabel: 'Header',
    keyPlaceholder: 'X-Header-Name',
    itemNoun: { one: 'header', other: 'headers' },
    addLabel: 'Add header',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const token = canvas.getByRole('textbox', { name: /Value of Authorization \(hidden/ })
    await expect(token).toHaveValue('••••••••••••')
    await userEvent.click(canvas.getByRole('button', { name: 'Reveal value of Authorization' }))
    await expect(canvas.getByRole('textbox', { name: 'Value of Authorization' })).toHaveValue('Bearer tok_demo_8f2a91c4')
    // The state is carried by the name alone (Reveal → Hide): no `aria-pressed` on top of it.
    await expect(canvas.getByRole('button', { name: 'Hide value of Authorization' })).not.toHaveAttribute('aria-pressed')
  },
}

/** `maskValues` treats every row as secret (every value is sensitive, e.g. credentials). */
export const MaskAllValues: Story = {
  args: { defaultValue: HEADERS.map(({ secret: _secret, ...r }) => r), maskValues: true },
}

/** `revealAll` shows every value in clear and hides the per-row toggles. */
export const RevealAll: Story = {
  args: { defaultValue: HEADERS, revealAll: true },
}

/** Read-only: no add / remove / import; reveal toggles still work on masked rows. */
export const ReadOnly: Story = {
  args: { defaultValue: HEADERS, readOnly: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('button', { name: 'Add row' })).not.toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: /^Remove/ })).not.toBeInTheDocument()
    await expect(canvas.getByRole('textbox', { name: 'Key 1' })).toHaveAttribute('readonly')
    await userEvent.click(canvas.getByRole('button', { name: 'Reveal value of X-Signature' }))
    await expect(canvas.getByRole('textbox', { name: 'Value of X-Signature' })).toHaveValue('sig_demo_31b9e0a4c2')
  },
}

/** `disabled` locks every field and button (e.g. while saving) but keeps the layout, unlike `readOnly`. */
export const Disabled: Story = {
  args: { defaultValue: HEADERS, disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('textbox', { name: 'Key 1' })).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Add row' })).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Import' })).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Remove Accept' })).toBeDisabled()
  },
}

/** `allowImport={false}` hides the Import button; custom labels and noun rename captions and generated copy. */
export const WithoutImport: Story = {
  args: {
    allowImport: false,
    keyLabel: 'Tag',
    valueLabel: 'Value',
    keyPlaceholder: 'tag',
    addLabel: 'Add tag',
    itemNoun: { one: 'tag', other: 'tags' },
    listLabel: 'Invoice tags',
    defaultValue: [
      { id: 't1', key: 'plan', value: 'enterprise' },
      { id: 't2', key: 'region', value: 'emea' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('button', { name: 'Import' })).not.toBeInTheDocument()
    await expect(canvas.getByRole('list', { name: 'Invoice tags' })).toBeInTheDocument()
    await expect(canvas.getByRole('textbox', { name: 'Tag 2' })).toHaveValue('region')
  },
}

/** Default validation (non-empty, unique keys) plus a `validateKey` format check: messages show under each row. */
export const Invalid: Story = {
  args: {
    validateKey: validateIdentifierKey,
    defaultValue: [
      { id: 'i1', key: 'MAX_RETRIES', value: '5' },
      { id: 'i2', key: '', value: 'orphan value' },
      { id: 'i3', key: 'MAX_RETRIES', value: '3' },
      { id: 'i4', key: '2FA_REQUIRED', value: 'true' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const alerts = canvas.getAllByRole('alert')
    await expect(alerts.map((a) => a.textContent)).toEqual([
      'Key is required',
      'Duplicate key MAX_RETRIES',
      'Use letters, digits, _, . or - (not starting with a digit)',
    ])
    await expect(canvas.getByRole('textbox', { name: 'Key 3' })).toHaveAttribute('aria-invalid', 'true')
  },
}

/** Long keys and values truncate inside their fields; the grid stacks to one column on phones. */
export const LongContent: Story = {
  args: {
    defaultValue: [
      { id: 'l1', key: 'callback-url-for-the-billing-reconciliation-job', value: 'https://hooks.example.com/billing/reconcile?account=acme-industries&retry=exponential&timeout=30000' },
      { id: 'l2', key: 'note', value: 'Owned by the finance platform team; ping #billing-oncall before changing anything here.' },
    ],
  },
}

/** Add a row (its key field takes focus), type into it, then remove it. */
export const AddAndRemove: Story = {
  args: { defaultValue: METADATA.slice(0, 1) },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Add row' }))
    const key = canvas.getByRole('textbox', { name: 'Key 2' })
    await waitFor(() => expect(key).toHaveFocus())
    await userEvent.type(key, 'region')
    await userEvent.type(canvas.getByRole('textbox', { name: 'Value of region' }), 'eu')
    await expect(args.onValueChange).toHaveBeenLastCalledWith([
      METADATA[0],
      expect.objectContaining({ key: 'region', value: 'eu' }),
    ])
    await userEvent.click(canvas.getByRole('button', { name: 'Remove region' }))
    await expect(canvas.queryByRole('textbox', { name: 'Key 2' })).not.toBeInTheDocument()
  },
}

/** Removing a row with the keyboard moves focus to the next row's remove button, then to Add row. */
export const KeyboardRemoval: Story = {
  args: { defaultValue: METADATA.slice(0, 2) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    canvas.getByRole('button', { name: 'Remove team' }).focus()
    await userEvent.keyboard('{Enter}')
    await expect(canvas.queryByRole('textbox', { name: 'Value of team' })).not.toBeInTheDocument()
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Remove cost-center' })).toHaveFocus())
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Add row' })).toHaveFocus())
  },
}

/** Pasting `key=value` lines into an empty key field replaces that row with the parsed pairs. */
export const PasteLines: Story = {
  args: { defaultValue: [...METADATA, { id: 'blank', key: '', value: '' }] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('textbox', { name: 'Key 4' }))
    await userEvent.paste('segment=enterprise\nowner=finance\n# ignored')
    await expect(canvas.getByRole('textbox', { name: 'Value of owner' })).toHaveValue('finance')
    await expect(canvas.getByRole('textbox', { name: 'Key 4' })).toHaveValue('segment')
    await expect(canvas.getByRole('textbox', { name: 'Value of segment' })).toHaveValue('enterprise')
  },
}

/**
 * The Import dialog parses pasted text or a file, counts pairs and skipped lines, and merges on confirm.
 * `importAccept` sets the file types its "Choose file…" picker offers.
 */
export const ImportDialog: Story = {
  args: { itemNoun: { one: 'label', other: 'labels' }, importAccept: '.txt,.csv,text/plain' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Import' }))
    const dialog = await body.findByRole('dialog', { name: 'Import labels' })
    await expect(dialog.querySelector('input[type="file"]')).toHaveAttribute('accept', '.txt,.csv,text/plain')
    const textarea = within(dialog).getByRole('textbox', { name: 'Lines to import' })
    await userEvent.type(textarea, 'tier=enterprise{enter}not a pair{enter}team=design')
    await expect(await body.findByText(/2 labels detected/)).toBeInTheDocument()
    await expect(body.getByText(/1 line skipped/)).toBeInTheDocument()
    await userEvent.click(body.getByRole('button', { name: 'Import 2 labels' }))
    await waitForClosed(dialog)
    await expect(canvas.getByLabelText('Value of team')).toHaveValue('design')
    await expect(canvas.getByLabelText('Value of tier')).toHaveValue('enterprise')
  },
}

function RequestHeadersExample() {
  const initial = React.useMemo<KeyValuePair[]>(
    () => [
      { key: 'Accept', value: 'application/json' },
      { key: 'X-Api-Version', value: '2024-06-01' },
      { key: 'Authorization', value: 'Bearer sk_test_51Hx0a9', secret: true },
    ],
    [],
  )
  const kv = useKeyValueRows(initial, { validateKey: validateHeaderName })
  const [saving, setSaving] = React.useState(false)
  const [revealAll, setRevealAll] = React.useState(false)
  const [copied, copy] = useCopy()

  const save = () => {
    setSaving(true)
    setTimeout(() => {
      kv.reset(kv.pairs)
      setSaving(false)
    }, 600)
  }

  return (
    <Card className="gap-0">
      <CardHeader>
        <div>
          <CardTitle>Webhook headers</CardTitle>
          <CardDescription>Sent with every delivery to https://hooks.acme.dev/orders.</CardDescription>
        </div>
        <CardAction>
          <Button
            size="tiny"
            variant="ghost"
            icon={revealAll ? <EyeOff /> : <Eye />}
            aria-pressed={revealAll}
            onClick={() => setRevealAll((v) => !v)}
          >
            {revealAll ? 'Hide' : 'Reveal'}
          </Button>
          <Button
            size="tiny"
            icon={copied ? <Check className="text-primary" /> : <Copy />}
            disabled={kv.pairs.length === 0}
            onClick={() => void copy(formatKeyValueText(kv.pairs))}
          >
            {copied ? 'Copied' : 'Copy as text'}
          </Button>
        </CardAction>
      </CardHeader>
      <div className="px-5 py-5 md:px-6">
        <KeyValueEditor
          value={kv.rows}
          onValueChange={kv.setRows}
          errors={kv.errors}
          validateKey={validateHeaderName}
          disabled={saving}
          keyLabel="Header"
          keyPlaceholder="X-Header-Name"
          addLabel="Add header"
          itemNoun={{ one: 'header', other: 'headers' }}
          listLabel="Webhook headers"
          revealAll={revealAll}
          emptyMessage="No custom headers. Deliveries only carry the default headers."
        />
      </div>
      <SaveBar
        dirty={kv.dirty}
        invalid={!kv.valid}
        saving={saving}
        hint={`${kv.pairs.length} header${kv.pairs.length === 1 ? '' : 's'}`}
        onReset={() => kv.reset(initial)}
        onSave={save}
      />
    </Card>
  )
}

/**
 * Realistic composition: `useKeyValueRows` + a header-name validator + a card header with "Reveal" and
 * "Copy as text" (`formatKeyValueText`) + a `SaveBar` that tracks dirty / valid state.
 */
export const WithSaveBar: Story = {
  render: () => <RequestHeadersExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Save changes' })).toBeDisabled()
    await userEvent.click(canvas.getByRole('button', { name: 'Add header' }))
    await userEvent.type(canvas.getByRole('textbox', { name: 'Header 4' }), 'bad header')
    await expect(canvas.getByText('Header names cannot contain spaces or separators')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Save changes' })).toBeDisabled()
    await userEvent.clear(canvas.getByRole('textbox', { name: 'Header 4' }))
    await userEvent.type(canvas.getByRole('textbox', { name: 'Header 4' }), 'X-Request-Source')
    await expect(canvas.getByText('Unsaved changes')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Save changes' })).toBeEnabled()
  },
}

/** French copy for {@link Translated}: every entry of `labels` replaced. */
const FRENCH_LABELS: KeyValueEditorLabels = {
  keyField: (position) => `Clé ${position}`,
  valueField: (name) => `Valeur de ${name}`,
  hiddenValueField: (name, editable) => `Valeur de ${name} (masquée${editable ? ', sélectionnez pour modifier' : ''})`,
  unnamedRow: (position) => `étiquette ${position}`,
  remove: 'Supprimer',
  removeRow: (name) => `Supprimer ${name}`,
  reveal: 'Afficher la valeur',
  hide: 'Masquer la valeur',
  revealRow: (name) => `Afficher la valeur de ${name}`,
  hideRow: (name) => `Masquer la valeur de ${name}`,
  pasteTip: (
    <>
      Astuce : collez des lignes <code className="font-mono">clé=valeur</code> dans un champ clé.
    </>
  ),
  importTitle: 'Importer des étiquettes',
  importDescription: 'Collez des lignes clé=valeur, une par ligne. Les clés existantes sont remplacées.',
  importTextarea: 'Lignes à importer',
  importPlaceholder: 'segment=entreprise\nequipe=croissance',
  importDetected: (count) => `${count} étiquette${count > 1 ? 's' : ''} détectée${count > 1 ? 's' : ''}`,
  importSkipped: (count) => `${count} ligne${count > 1 ? 's' : ''} ignorée${count > 1 ? 's' : ''}`,
  importChooseFile: 'Choisir un fichier…',
  importCancel: 'Annuler',
  importClose: 'Fermer',
  importConfirm: (count) => (count > 0 ? `Importer ${count} étiquette${count > 1 ? 's' : ''}` : 'Importer'),
}

/**
 * Translated: the caption / button props (`keyLabel`, `addLabel`, `importLabel`…) plus `labels` for
 * every other built-in text. `labels` is partial: unset entries keep their English default.
 */
export const Translated: Story = {
  args: {
    defaultValue: [
      { id: 't1', key: 'team', value: 'growth' },
      { id: 't2', key: 'api-token', value: 'tok_test_4c1e9b', secret: true },
    ],
    keyLabel: 'Clé',
    valueLabel: 'Valeur',
    keyPlaceholder: 'clé',
    valuePlaceholder: 'valeur',
    addLabel: 'Ajouter une étiquette',
    importLabel: 'Importer',
    listLabel: 'Étiquettes',
    itemNoun: { one: 'étiquette', other: 'étiquettes' },
    labels: FRENCH_LABELS,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await expect(canvas.getByRole('textbox', { name: 'Clé 1' })).toHaveValue('team')
    await expect(canvas.getByText(/Astuce : collez des lignes/)).toBeInTheDocument()

    // Remove button: translated accessible name and tooltip.
    const remove = canvas.getByRole('button', { name: 'Supprimer team' })
    remove.focus()
    await expect(await screen.findByRole('tooltip')).toHaveTextContent('Supprimer')

    // Masked value and its reveal toggle.
    await expect(canvas.getByRole('textbox', { name: /Valeur de api-token \(masquée/ })).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Afficher la valeur de api-token' }))
    await expect(canvas.getByRole('textbox', { name: 'Valeur de api-token' })).toHaveValue('tok_test_4c1e9b')
    await expect(canvas.getByRole('button', { name: 'Masquer la valeur de api-token' })).toBeInTheDocument()

    // Import dialog.
    await userEvent.click(canvas.getByRole('button', { name: 'Importer' }))
    const dialog = await body.findByRole('dialog', { name: 'Importer des étiquettes' })
    await userEvent.type(within(dialog).getByRole('textbox', { name: 'Lignes à importer' }), 'region=eu{enter}pas une paire')
    await expect(await within(dialog).findByText(/1 étiquette détectée/)).toBeInTheDocument()
    await expect(within(dialog).getByText(/1 ligne ignorée/)).toBeInTheDocument()
    await expect(within(dialog).getByRole('button', { name: 'Annuler' })).toBeInTheDocument()
    await userEvent.click(within(dialog).getByRole('button', { name: 'Importer 1 étiquette' }))
    await waitForClosed(dialog)
    await expect(canvas.getByLabelText('Valeur de region')).toHaveValue('eu')
  },
}

/** `labels` is partial: here only the remove tooltip / name and the paste tip change (the tip is hidden with `null`). */
export const PartialLabels: Story = {
  args: {
    defaultValue: METADATA.slice(0, 2),
    labels: { remove: 'Delete', removeRow: (name) => `Delete ${name}`, pasteTip: null },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Delete team' })).toBeInTheDocument()
    await expect(canvas.queryByText(/Tip: paste/)).not.toBeInTheDocument()
    // Unset entries keep their defaults.
    await expect(canvas.getByRole('textbox', { name: 'Key 1' })).toHaveValue('team')
    await expect(canvas.getByRole('textbox', { name: 'Value of cost-center' })).toHaveValue('CC-4102')
  },
}
