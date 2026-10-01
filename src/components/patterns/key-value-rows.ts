import * as React from 'react'

/** One key/value pair as your app stores it or sends it to an API (without the editor's row id). */
export interface KeyValuePair {
  /** The key (header name, label, variable name…). Trimmed by the helpers before use. */
  key: string
  /** The value, kept verbatim (not trimmed). */
  value: string
  /** Mask the value in {@link KeyValueEditor} behind a fixed-length mask with a reveal toggle (tokens, passwords). */
  secret?: boolean
}

/**
 * One row of {@link KeyValueEditor}: a {@link KeyValuePair} plus a stable `id` used as React key, focus
 * target and error-map key. Create rows with {@link newRowId} / {@link rowsFromPairs}; never reuse ids.
 */
export interface KeyValueRow extends KeyValuePair {
  /** Stable, unique row id (see {@link newRowId}). */
  id: string
}

/**
 * Checks the format of a trimmed, non-empty key. Return an error message when the key is invalid,
 * or `null` / `undefined` when it is fine. Emptiness and uniqueness are always checked separately.
 */
export type KeyValidator = (key: string) => string | null | undefined

/** Fixed-length mask shown for hidden values (one dot per character would leak the value's length). */
export const VALUE_MASK = '••••••••••••'

let rowSeq = 0
/** A fresh, unique row id for a new {@link KeyValueRow}. */
export function newRowId(): string {
  rowSeq += 1
  return `kv-${rowSeq}`
}

/** Pairs → editor rows (fresh ids). Use it to seed {@link KeyValueEditor} from server data. */
export function rowsFromPairs(pairs: readonly KeyValuePair[]): KeyValueRow[] {
  return pairs.map((p) => ({ ...p, id: newRowId() }))
}

/**
 * Editor rows → pairs for a request body: fully blank rows are dropped, keys are trimmed, values are
 * kept as typed and the `secret` flag is kept when set. Row ids are not read, so it also normalizes
 * plain pairs (e.g. server data before comparing it with the editor's output).
 */
export function pairsFromRows(rows: readonly KeyValuePair[]): KeyValuePair[] {
  return rows
    .filter((r) => r.key.trim() !== '' || r.value !== '')
    .map(({ key, value, secret }) => (secret === undefined ? { key: key.trim(), value } : { key: key.trim(), value, secret }))
}

/** Options of {@link validateRows}. */
export interface ValidateRowsOptions {
  /** Extra format check for keys (e.g. {@link validateIdentifierKey}). Default: any non-empty key is accepted. */
  validateKey?: KeyValidator
  /** Override the built-in messages (e.g. to translate them). */
  messages?: {
    /** Message for a row that has a value but no key. Default "Key is required". */
    required?: string
    /** Message for a key already used by an earlier row. Default "Duplicate key KEY". */
    duplicate?: (key: string) => string
  }
}

/**
 * Per-row validation messages keyed by row id (empty map = valid). Fully blank rows are ignored; a row
 * with a value but no key is "required", a key rejected by `validateKey` gets its message, and a key
 * already used by an earlier row is a duplicate (compared after trimming, case-sensitive).
 */
export function validateRows(rows: readonly KeyValueRow[], options: ValidateRowsOptions = {}): Map<string, string> {
  const { validateKey, messages } = options
  const errors = new Map<string, string>()
  const seen = new Set<string>()
  for (const r of rows) {
    const key = r.key.trim()
    if (key === '' && r.value === '') continue
    if (key === '') {
      errors.set(r.id, messages?.required ?? 'Key is required')
      continue
    }
    const formatError = validateKey?.(key)
    if (formatError) errors.set(r.id, formatError)
    else if (seen.has(key)) errors.set(r.id, messages?.duplicate?.(key) ?? `Duplicate key ${key}`)
    else seen.add(key)
  }
  return errors
}

/**
 * Upserts `incoming` pairs into `rows` by key (compared after trimming): existing rows keep their
 * position and id and take the new value (and `secret` flag when the pair sets one), unknown keys are
 * appended as new rows, fully blank rows are removed. Returns a new array; the inputs are not mutated.
 */
export function mergeRows(rows: readonly KeyValueRow[], incoming: readonly KeyValuePair[]): KeyValueRow[] {
  const next = rows.filter((r) => r.key.trim() !== '' || r.value !== '').map((r) => ({ ...r }))
  for (const p of incoming) {
    const key = p.key.trim()
    const existing = next.find((r) => r.key.trim() === key)
    if (existing) {
      existing.value = p.value
      if (p.secret !== undefined) existing.secret = p.secret
    } else {
      next.push({ ...p, key, id: newRowId() })
    }
  }
  return next
}

const IDENTIFIER_KEY_RE = /^[A-Za-z_][A-Za-z0-9_.-]*$/

/** True for an identifier-style key: letters, digits, `_`, `.` and `-`, not starting with a digit (`API_URL`, `app.tier`). */
export function isIdentifierKey(key: string): boolean {
  return IDENTIFIER_KEY_RE.test(key)
}

/**
 * Ready-made {@link KeyValidator} for identifier-style keys (variables, config keys, label names).
 * Do not use it for keys that legitimately contain `/`, `:` or spaces (URLs, paths, free-form labels).
 */
export const validateIdentifierKey: KeyValidator = (key) =>
  isIdentifierKey(key) ? null : 'Use letters, digits, _, . or - (not starting with a digit)'

/** Options of {@link parseKeyValueText}. */
export interface ParseKeyValueTextOptions {
  /** Accept or reject a parsed key (rejected lines go to `invalid`). Default: any key without whitespace. */
  isValidKey?: (key: string) => boolean
}

/** Result of {@link parseKeyValueText}. */
export interface ParsedKeyValueText {
  /** Parsed pairs in first-seen order; when a key repeats, the last value wins. */
  pairs: KeyValuePair[]
  /** Raw lines that could not be parsed (no `=`, empty or rejected key, unterminated quote). */
  invalid: string[]
}

/**
 * Parses pasted `KEY=value` text (the `.env` convention): one pair per line, optional `export ` prefix,
 * `#` comment lines, single / double / backtick quotes (double quotes expand `\n`, `\r`, `\t`, `\"`,
 * `\\` and `\$`), inline ` # comments` after unquoted values, multi-line quoted values and CRLF line
 * endings. Invalid lines are reported in `invalid`, never thrown. Use it for bulk import / paste; use
 * {@link formatKeyValueText} for the reverse.
 */
export function parseKeyValueText(text: string, options: ParseKeyValueTextOptions = {}): ParsedKeyValueText {
  const isValidKey = options.isValidKey ?? ((key: string) => /^\S+$/.test(key))
  const out = new Map<string, string>()
  const invalid: string[] = []
  const lines = text.replace(/\r\n?/g, '\n').split('\n')

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i] ?? ''
    const trimmed = raw.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const body = trimmed.startsWith('export ') ? trimmed.slice(7).trimStart() : trimmed
    const eq = body.indexOf('=')
    if (eq <= 0) {
      invalid.push(raw)
      continue
    }
    const key = body.slice(0, eq).trim()
    if (!key || !isValidKey(key)) {
      invalid.push(raw)
      continue
    }
    let value = body.slice(eq + 1).trimStart()

    const quote = value[0]
    if (quote === '"' || quote === "'" || quote === '`') {
      let rest = value.slice(1)
      let closing = findClosingQuote(rest, quote)
      // multi-line quoted value
      while (closing === -1 && i + 1 < lines.length) {
        i++
        rest += '\n' + (lines[i] ?? '')
        closing = findClosingQuote(rest, quote)
      }
      if (closing === -1) {
        invalid.push(raw)
        continue
      }
      value = rest.slice(0, closing)
      if (quote === '"') value = unescapeDouble(value)
    } else {
      const hash = value.search(/\s#/)
      if (hash !== -1) value = value.slice(0, hash)
      value = value.trim()
    }
    out.set(key, value)
  }
  return { pairs: [...out].map(([key, value]) => ({ key, value })), invalid }
}

function findClosingQuote(s: string, quote: string): number {
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '\\' && quote === '"') {
      i++
      continue
    }
    if (s[i] === quote) return i
  }
  return -1
}

function unescapeDouble(s: string): string {
  return s.replace(/\\([nrt"\\$])/g, (_m, c: string) => {
    switch (c) {
      case 'n':
        return '\n'
      case 'r':
        return '\r'
      case 't':
        return '\t'
      default:
        return c
    }
  })
}

/**
 * Serializes pairs to `KEY=value` lines (the `.env` convention), double-quoting and escaping values that
 * contain spaces, quotes, `#` or newlines. The output round-trips through {@link parseKeyValueText}.
 * Use it for "Copy as text" / export actions.
 */
export function formatKeyValueText(pairs: readonly KeyValuePair[]): string {
  return pairs
    .map(({ key, value }) => {
      if (/^[A-Za-z0-9_./:@%+,=-]*$/.test(value)) return `${key}=${value}`
      const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r')
      return `${key}="${escaped}"`
    })
    .join('\n')
}

function samePairs(a: readonly KeyValuePair[], b: readonly KeyValuePair[]): boolean {
  return (
    a.length === b.length &&
    a.every((p, i) => p.key === b[i]?.key && p.value === b[i]?.value && !!p.secret === !!b[i]?.secret)
  )
}

/** Return value of {@link useKeyValueRows}. */
export interface KeyValueRowsState {
  /** Current editor rows: pass to `KeyValueEditor` `value`. */
  rows: KeyValueRow[]
  /** Row setter: pass to `KeyValueEditor` `onValueChange`. */
  setRows: React.Dispatch<React.SetStateAction<KeyValueRow[]>>
  /** Replace both the saved baseline and the rows (after loading or saving). */
  reset: (pairs: readonly KeyValuePair[]) => void
  /** Rows as trimmed pairs without blank rows: the request body. */
  pairs: KeyValuePair[]
  /** Validation messages keyed by row id (see {@link validateRows}). */
  errors: Map<string, string>
  /** No validation errors. */
  valid: boolean
  /** `pairs` differ from the last baseline (initial value or last `reset`, normalized like `pairs`). */
  dirty: boolean
}

/**
 * State for a {@link KeyValueEditor} bound to saved data: rows, derived `pairs` for the request body,
 * `errors` / `valid` for the editor and `dirty` for a Save button or `SaveBar`. `initial` is read on the
 * first render only: call `reset(pairs)` when the saved data changes (after a load or a save). Pass the
 * same `validateKey` to the editor so pasted and imported lines follow the same key rule. Keep
 * `options` values stable (module-level or memoized) to avoid revalidating on every render.
 *
 * Skip it for a throwaway editor: `KeyValueEditor` with `defaultValue` keeps its own rows.
 */
export function useKeyValueRows(
  initial: readonly KeyValuePair[] | undefined,
  options: ValidateRowsOptions = {},
): KeyValueRowsState {
  // The baseline is normalized like `pairs` so untrimmed keys or blank pairs in the saved data do not
  // make a fresh editor look dirty.
  const [base, setBase] = React.useState<readonly KeyValuePair[]>(() => pairsFromRows(initial ?? []))
  const [rows, setRows] = React.useState<KeyValueRow[]>(() => rowsFromPairs(initial ?? []))
  const reset = React.useCallback((pairs: readonly KeyValuePair[]) => {
    setBase(pairsFromRows(pairs))
    setRows(rowsFromPairs(pairs))
  }, [])
  const pairs = React.useMemo(() => pairsFromRows(rows), [rows])
  const { validateKey, messages } = options
  const errors = React.useMemo(() => validateRows(rows, { validateKey, messages }), [rows, validateKey, messages])
  return {
    rows,
    setRows,
    reset,
    pairs,
    errors,
    valid: errors.size === 0,
    dirty: !samePairs(pairs, base),
  }
}
