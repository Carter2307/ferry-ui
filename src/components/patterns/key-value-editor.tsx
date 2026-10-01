import * as React from 'react'
import { Eye, EyeOff, FileUp, Plus, Trash2 } from 'lucide-react'

import { cn } from '../../lib/utils'
import { Button } from '../primitives/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../primitives/dialog'
import { Input } from '../primitives/input'
import { Textarea } from '../primitives/textarea'
import { Hint } from '../primitives/tooltip'

import {
  mergeRows,
  newRowId,
  parseKeyValueText,
  validateRows,
  VALUE_MASK,
  type KeyValidator,
  type KeyValuePair,
  type KeyValueRow,
} from './key-value-rows'
import { MonoLabel } from './mono-label'

/** Singular / plural noun for the edited items, used in generated copy ("Import 3 headers", "Remove header 2"). */
export interface KeyValueItemNoun {
  /** Singular form, e.g. "header". */
  one: string
  /** Plural form, e.g. "headers". */
  other: string
}

/**
 * Built-in texts of a {@link KeyValueEditor} (override them through `labels` to translate or reword).
 * Defaults are English and derive from `keyLabel`, `valueLabel` and `itemNoun`: the examples
 * below assume "Key", "Value" and entry / entries. `name` is a row's key, or `unnamedRow` while it
 * is empty. Captions, placeholders and button texts have their own props (`keyLabel`, `addLabel`…).
 */
export interface KeyValueEditorLabels {
  /** Accessible name of a row's key field, from its 1-based position. Default "Key 1". */
  keyField: (position: number) => string
  /** Accessible name of a value field shown in clear. Default "Value of team". */
  valueField: (name: string) => string
  /**
   * Accessible name of a masked value field; `editable` is `false` in read-only mode. Default
   * "Value of token (hidden, focus to edit)", or "Value of token (hidden)" when read-only.
   */
  hiddenValueField: (name: string, editable: boolean) => string
  /** Name of a row whose key is still empty, from its 1-based position. Default "entry 2". */
  unnamedRow: (position: number) => string
  /** Tooltip of the remove buttons. Default "Remove". */
  remove: string
  /** Accessible name of a row's remove button. Default "Remove team". */
  removeRow: (name: string) => string
  /** Tooltip of the reveal toggle while the value is masked. Default "Reveal value". */
  reveal: string
  /** Tooltip of the reveal toggle while the value is shown. Default "Hide value". */
  hide: string
  /** Accessible name of the reveal toggle while masked. Default "Reveal value of token". */
  revealRow: (name: string) => string
  /** Accessible name of the reveal toggle while shown. Default "Hide value of token". */
  hideRow: (name: string) => string
  /**
   * Hint next to the add / import buttons (from the `md` breakpoint); `null` hides it. Default
   * "Tip: paste `key=value` lines into a key field."
   */
  pasteTip: React.ReactNode
  /** Title of the import dialog. Default "Import entries". */
  importTitle: React.ReactNode
  /**
   * Description of the import dialog. Default "Paste `key=value` lines, one per line. Existing keys
   * are overwritten."
   */
  importDescription: React.ReactNode
  /** Accessible name of the import text area. Default "Lines to import". */
  importTextarea: string
  /** Placeholder of the import text area. Default: three sample `key=value` / comment lines. */
  importPlaceholder: string
  /** Count of valid lines found in the import text. Default "2 entries detected". */
  importDetected: (count: number) => React.ReactNode
  /** Count of ignored lines in the import text (shown only when above 0). Default "1 line skipped". */
  importSkipped: (count: number) => React.ReactNode
  /** Text of the file picker of the import dialog. Default "Choose file…". */
  importChooseFile: React.ReactNode
  /** Cancel button of the import dialog. Default "Cancel". */
  importCancel: React.ReactNode
  /** Accessible name of the close (X) button of the import dialog. Default "Close". */
  importClose: string
  /**
   * Confirm button of the import dialog, from the number of detected pairs. Default "Import 2 entries"
   * ("Import entries" while none is detected).
   */
  importConfirm: (count: number) => React.ReactNode
}

/** English defaults of {@link KeyValueEditorLabels}, built from the caption and noun props. */
function defaultLabels(keyLabel: string, valueLabel: string, noun: KeyValueItemNoun): KeyValueEditorLabels {
  const valueNoun = valueLabel.toLowerCase()
  const nounFor = (count: number) => (count === 1 ? noun.one : noun.other)
  return {
    keyField: (position) => `${keyLabel} ${position}`,
    valueField: (name) => `${valueLabel} of ${name}`,
    hiddenValueField: (name, editable) =>
      `${valueLabel} of ${name} (hidden${editable ? ', focus to edit' : ''})`,
    unnamedRow: (position) => `${noun.one} ${position}`,
    remove: 'Remove',
    removeRow: (name) => `Remove ${name}`,
    reveal: `Reveal ${valueNoun}`,
    hide: `Hide ${valueNoun}`,
    revealRow: (name) => `Reveal ${valueNoun} of ${name}`,
    hideRow: (name) => `Hide ${valueNoun} of ${name}`,
    pasteTip: (
      <>
        Tip: paste <code className="font-mono">key=value</code> lines into a {keyLabel.toLowerCase()} field.
      </>
    ),
    importTitle: `Import ${noun.other}`,
    importDescription: (
      <>
        Paste <code className="font-mono">key=value</code> lines, one per line. Existing keys are overwritten.
      </>
    ),
    importTextarea: 'Lines to import',
    importPlaceholder: 'name=value\nteam="Customer success"\n# comments are ignored',
    importDetected: (count) => `${count} ${nounFor(count)} detected`,
    importSkipped: (count) => `${count} line${count === 1 ? '' : 's'} skipped`,
    importChooseFile: 'Choose file…',
    importCancel: 'Cancel',
    importClose: 'Close',
    importConfirm: (count) => `Import ${count > 0 ? `${count} ` : ''}${nounFor(count)}`,
  }
}

/** Fills the unset (or `undefined`) entries of `overrides` with the English defaults. */
function withDefaultLabels(
  overrides: Partial<KeyValueEditorLabels> | undefined,
  keyLabel: string,
  valueLabel: string,
  noun: KeyValueItemNoun,
): KeyValueEditorLabels {
  const labels = defaultLabels(keyLabel, valueLabel, noun)
  if (!overrides) return labels
  const defined = Object.entries(overrides).filter(([, text]) => text !== undefined)
  return { ...labels, ...Object.fromEntries(defined) }
}

/** Props of {@link KeyValueEditor}. */
export interface KeyValueEditorProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'children'> {
  /** Rows to show (controlled). Pair it with `onValueChange`; `useKeyValueRows` gives you both. */
  value?: readonly KeyValueRow[]
  /** Initial rows when uncontrolled. Ignored when `value` is set. */
  defaultValue?: readonly KeyValueRow[]
  /** Called with the next rows on every edit, add, remove, paste and import. */
  onValueChange?: (rows: KeyValueRow[]) => void
  /**
   * Validation messages keyed by row id (e.g. `useKeyValueRows().errors`). When omitted, the editor
   * computes them with `validateRows` (non-empty, unique keys, plus `validateKey`).
   */
  errors?: ReadonlyMap<string, string>
  /**
   * Extra format check for keys. Typed keys only need to be non-empty and unique by default. It also
   * decides which pasted / imported lines are accepted (default for those: any key without whitespace).
   * Use `validateIdentifierKey` for identifier-style keys. Ignored for display when `errors` is set, so
   * pass the same validator to `useKeyValueRows`.
   */
  validateKey?: KeyValidator
  /** Show the rows without editing: no add / remove / import, inputs read-only (reveal toggles stay). */
  readOnly?: boolean
  /**
   * Lock every field and button, e.g. while the rows are being saved. Unlike `readOnly`, the layout
   * (actions row included) stays the same. Same effect as wrapping the editor in `<fieldset disabled>`.
   */
  disabled?: boolean
  /**
   * Treat every row as secret: values show a fixed-length mask with a per-row reveal toggle. Rows with
   * `secret: true` are masked regardless. A masked value shows in clear while its field has focus and
   * when it is empty.
   */
  maskValues?: boolean
  /** Show every masked value in clear and hide the per-row reveal toggles (bind it to a "Reveal all" switch). */
  revealAll?: boolean
  /** Column caption and accessible name prefix of key fields. Default "Key". */
  keyLabel?: string
  /** Column caption and accessible name prefix of value fields. Default "Value". */
  valueLabel?: string
  /** Placeholder of key fields. Default "key". */
  keyPlaceholder?: string
  /** Placeholder of value fields. Default "value". */
  valuePlaceholder?: string
  /** Text of the add button. Default "Add row". */
  addLabel?: React.ReactNode
  /** Show the bulk import button and dialog (paste or load `key=value` lines). Default `true`. */
  allowImport?: boolean
  /** Text of the import button. Default "Import". */
  importLabel?: React.ReactNode
  /**
   * File types offered by the "Choose file…" picker of the import dialog: the native `accept` value
   * (comma-separated extensions and MIME types). Default `.txt,.env,text/plain`. The file is read as
   * plain text whatever its type.
   */
  importAccept?: string
  /** Noun used in generated copy (import dialog, fallback row names). Default entry / entries. */
  itemNoun?: KeyValueItemNoun
  /** Accessible name of the row list. Default "Key/value pairs". */
  listLabel?: string
  /** Shown instead of the list when there are no rows (e.g. "No headers yet."). */
  emptyMessage?: React.ReactNode
  /**
   * Overrides for the other built-in texts (accessible names, tooltips, paste tip, import dialog),
   * e.g. to translate them. Unset entries keep their English default.
   */
  labels?: Partial<KeyValueEditorLabels>
}

const DEFAULT_NOUN: KeyValueItemNoun = { one: 'entry', other: 'entries' }
const DEFAULT_IMPORT_ACCEPT = '.txt,.env,text/plain'

/**
 * Editable list of key/value pairs: one KEY | VALUE row per pair, add / remove, per-row validation
 * messages, secret masking with a reveal toggle, and bulk entry — paste `key=value` lines straight into
 * a key field or use the Import dialog (existing keys are overwritten, new ones appended).
 *
 * Use it for request headers, metadata / labels, variables and other small free-form maps (up to a
 * few dozen rows). Do NOT use it for a fixed set of known fields (use a form) or for large tables
 * (use a data table). Controlled with `value` + `onValueChange` (see `useKeyValueRows`) or
 * uncontrolled with `defaultValue`. Set `disabled` to lock it while saving. Needs a `TooltipProvider`
 * above it (icon buttons have tooltips).
 */
export function KeyValueEditor({
  value,
  defaultValue,
  onValueChange,
  errors: errorsProp,
  validateKey,
  readOnly = false,
  disabled = false,
  maskValues = false,
  revealAll = false,
  keyLabel = 'Key',
  valueLabel = 'Value',
  keyPlaceholder = 'key',
  valuePlaceholder = 'value',
  addLabel = 'Add row',
  allowImport = true,
  importLabel = 'Import',
  importAccept = DEFAULT_IMPORT_ACCEPT,
  itemNoun = DEFAULT_NOUN,
  listLabel = 'Key/value pairs',
  emptyMessage,
  labels: labelsProp,
  className,
  ...props
}: KeyValueEditorProps) {
  const labels = withDefaultLabels(labelsProp, keyLabel, valueLabel, itemNoun)
  const [innerRows, setInnerRows] = React.useState<readonly KeyValueRow[]>(() => defaultValue ?? [])
  const rows = value ?? innerRows
  const setRows = (next: KeyValueRow[]) => {
    if (value === undefined) setInnerRows(next)
    onValueChange?.(next)
  }

  const errors = React.useMemo(
    () => errorsProp ?? validateRows(rows, { validateKey }),
    [errorsProp, rows, validateKey],
  )
  const [revealed, setRevealed] = React.useState<Set<string>>(() => new Set())
  const [importOpen, setImportOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  // id of a just-added row whose key input should take focus once mounted
  const focusIdRef = React.useRef<string | null>(null)
  // remove buttons by row id, and the add button: focus targets after a keyboard removal
  const removeButtons = React.useRef(new Map<string, HTMLButtonElement>())
  const addButton = React.useRef<HTMLButtonElement>(null)
  // DOM ids are scoped to this editor: row ids come from the caller and may repeat across editors
  const baseId = React.useId()

  const isMaskable = (row: KeyValueRow) => !revealAll && (maskValues || !!row.secret)
  const anyMaskable = rows.some(isMaskable)
  // without a validator, the parser's own default (no whitespace in keys) filters pasted lines
  const isValidKey = React.useMemo(
    () => (validateKey ? (key: string) => !validateKey(key) : undefined),
    [validateKey],
  )

  const update = (id: string, patch: Partial<KeyValueRow>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  const remove = (index: number, fromKeyboard: boolean) => {
    const removed = rows[index]
    if (!removed) return
    setRows(rows.filter((r) => r.id !== removed.id))
    // keyboard users keep their place: next row's remove button, else the previous one, else Add
    if (!fromKeyboard) return
    const neighbour = rows[index + 1] ?? rows[index - 1]
    const target = neighbour ? removeButtons.current.get(neighbour.id) : addButton.current
    target?.focus()
  }
  const add = () => {
    const id = newRowId()
    focusIdRef.current = id
    setRows([...rows, { id, key: '', value: '' }])
  }
  const importPairs = (pairs: KeyValuePair[]) => setRows(mergeRows(rows, pairs))
  const toggleReveal = (id: string) =>
    setRevealed((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })

  const onKeyPaste = (e: React.ClipboardEvent<HTMLInputElement>, row: KeyValueRow) => {
    if (readOnly || disabled) return
    const text = e.clipboardData.getData('text/plain')
    if (!text.includes('=') && !text.includes('\n')) return
    const { pairs } = parseKeyValueText(text, { isValidKey })
    if (pairs.length === 0) return
    e.preventDefault()
    const without = row.key === '' && row.value === '' ? rows.filter((r) => r.id !== row.id) : rows
    setRows(mergeRows(without, pairs))
  }

  return (
    <div data-slot="key-value-editor" className={cn('flex flex-col gap-2', className)} {...props}>
      {rows.length > 0 && (
        <div className="hidden gap-2 px-0.5 sm:grid sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]" aria-hidden="true">
          <MonoLabel>{keyLabel}</MonoLabel>
          <MonoLabel>{valueLabel}</MonoLabel>
        </div>
      )}
      {rows.length === 0 && emptyMessage && (
        <div data-slot="key-value-editor-empty" className="text-[13px] text-foreground-light">
          {emptyMessage}
        </div>
      )}
      {/* phones: key stacks over value, so rows sit further apart than the two fields of one pair */}
      <ul className="flex flex-col gap-4 sm:gap-2" aria-label={listLabel}>
        {rows.map((row, i) => {
          const err = errors.get(row.id)
          const maskable = isMaskable(row)
          const toggled = revealed.has(row.id)
          const shown = !maskable || toggled || row.value === '' || (!readOnly && editingId === row.id)
          const name = row.key.trim() || labels.unnamedRow(i + 1)
          const errId = `${baseId}-error-${i}`
          const revealButton = maskable ? (
            <Hint label={toggled ? labels.hide : labels.reveal}>
              <Button
                size="icon-md"
                variant="ghost"
                icon={toggled ? <EyeOff /> : <Eye />}
                // The name flips between Reveal and Hide, so no `aria-pressed`: the state is exposed once.
                aria-label={toggled ? labels.hideRow(name) : labels.revealRow(name)}
                disabled={disabled}
                onClick={() => toggleReveal(row.id)}
              />
            </Hint>
          ) : anyMaskable ? (
            // keeps value fields aligned with the masked rows
            <span aria-hidden="true" className="size-[34px] shrink-0" />
          ) : null
          return (
            <li key={row.id} data-slot="key-value-row" className="flex flex-col gap-1">
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-2">
                <Input
                  ref={(el) => {
                    if (el && focusIdRef.current === row.id) {
                      focusIdRef.current = null
                      el.focus()
                    }
                  }}
                  mono
                  value={row.key}
                  placeholder={keyPlaceholder}
                  readOnly={readOnly}
                  disabled={disabled}
                  aria-label={labels.keyField(i + 1)}
                  aria-invalid={err ? true : undefined}
                  aria-describedby={err ? errId : undefined}
                  autoComplete="off"
                  spellCheck={false}
                  onChange={(e) => update(row.id, { key: e.target.value })}
                  onPaste={(e) => onKeyPaste(e, row)}
                />
                <div className="flex gap-2">
                  <Input
                    mono
                    value={shown ? row.value : VALUE_MASK}
                    placeholder={valuePlaceholder}
                    // masked: the field shows the mask until it gets focus
                    readOnly={readOnly || !shown}
                    disabled={disabled}
                    aria-label={shown ? labels.valueField(name) : labels.hiddenValueField(name, !readOnly)}
                    autoComplete="off"
                    spellCheck={false}
                    data-1p-ignore
                    className={cn('flex-1', !shown && 'tracking-wider text-foreground-lighter')}
                    onFocus={() => setEditingId(row.id)}
                    onBlur={() => setEditingId((cur) => (cur === row.id ? null : cur))}
                    onChange={(e) => update(row.id, { value: e.target.value })}
                  />
                  {(revealButton || !readOnly) && (
                    <div className="flex shrink-0 items-center gap-1">
                      {revealButton}
                      {!readOnly && (
                        <Hint label={labels.remove}>
                          <Button
                            ref={(el: HTMLButtonElement | null) => {
                              if (el) removeButtons.current.set(row.id, el)
                              else removeButtons.current.delete(row.id)
                            }}
                            size="icon-md"
                            variant="ghost"
                            icon={<Trash2 />}
                            aria-label={labels.removeRow(name)}
                            disabled={disabled}
                            // detail 0: activated with Enter / Space rather than a pointer
                            onClick={(e) => remove(i, e.detail === 0)}
                          />
                        </Hint>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {err && (
                <p id={errId} role="alert" className="text-[12.5px] text-destructive">
                  {err}
                </p>
              )}
            </li>
          )
        })}
      </ul>
      {!readOnly && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Button ref={addButton} size="tiny" icon={<Plus />} disabled={disabled} onClick={add}>
            {addLabel}
          </Button>
          {allowImport && (
            <Button
              size="tiny"
              variant="ghost"
              icon={<FileUp />}
              disabled={disabled}
              onClick={() => setImportOpen(true)}
            >
              {importLabel}
            </Button>
          )}
          {labels.pasteTip != null && (
            <span className="hidden text-[12px] text-foreground-lighter md:inline">{labels.pasteTip}</span>
          )}
        </div>
      )}
      {allowImport && !readOnly && (
        <ImportDialog
          open={importOpen}
          onOpenChange={setImportOpen}
          onImport={importPairs}
          isValidKey={isValidKey}
          accept={importAccept}
          labels={labels}
        />
      )}
    </div>
  )
}

function ImportDialog({
  open,
  onOpenChange,
  onImport,
  isValidKey,
  accept,
  labels,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (pairs: KeyValuePair[]) => void
  isValidKey?: (key: string) => boolean
  accept: string
  labels: KeyValueEditorLabels
}) {
  const [text, setText] = React.useState('')
  const parsed = React.useMemo(() => parseKeyValueText(text, { isValidKey }), [text, isValidKey])
  const count = parsed.pairs.length
  const skipped = parsed.invalid.length
  const textareaId = React.useId()
  const readFile = async (file: File) => setText(await file.text())
  const setOpen = (o: boolean) => {
    onOpenChange(o)
    if (!o) setText('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent size="xl" closeLabel={labels.importClose}>
        <DialogHeader>
          <DialogTitle>{labels.importTitle}</DialogTitle>
          <DialogDescription>{labels.importDescription}</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <label htmlFor={textareaId} className="sr-only">
            {labels.importTextarea}
          </label>
          <Textarea
            id={textareaId}
            mono
            rows={10}
            className="max-h-[50dvh] min-h-48"
            placeholder={labels.importPlaceholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
          />
          <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] text-foreground-light">
            <span>
              {labels.importDetected(count)}
              {skipped > 0 && <span className="text-warning"> · {labels.importSkipped(skipped)}</span>}
            </span>
            <label className="cursor-pointer rounded-sm text-primary underline-offset-4 hover:underline has-[:focus-visible]:underline has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring">
              {labels.importChooseFile}
              <input
                type="file"
                accept={accept}
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  // clear the input so picking the same file again reloads it
                  e.target.value = ''
                  if (f) void readFile(f)
                }}
              />
            </label>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>{labels.importCancel}</Button>
          <Button
            variant="primary"
            disabled={count === 0}
            onClick={() => {
              onImport(parsed.pairs)
              setOpen(false)
            }}
          >
            {labels.importConfirm(count)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
