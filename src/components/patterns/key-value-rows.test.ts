import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  formatKeyValueText,
  isIdentifierKey,
  mergeRows,
  pairsFromRows,
  parseKeyValueText,
  useKeyValueRows,
  validateIdentifierKey,
  validateRows,
  type KeyValueRow,
} from './key-value-rows'

describe('parseKeyValueText', () => {
  it('parses plain, exported, quoted and commented lines', () => {
    const { pairs, invalid } = parseKeyValueText(
      [
        '# comment',
        'A=1',
        'export B = two',
        'C="quoted # not a comment"',
        "D='single $x'",
        'E=value # trailing comment',
        'F=',
        'G="line\\nbreak"',
        '',
      ].join('\n'),
    )
    expect(invalid).toEqual([])
    expect(pairs).toEqual([
      { key: 'A', value: '1' },
      { key: 'B', value: 'two' },
      { key: 'C', value: 'quoted # not a comment' },
      { key: 'D', value: 'single $x' },
      { key: 'E', value: 'value' },
      { key: 'F', value: '' },
      { key: 'G', value: 'line\nbreak' },
    ])
  })

  it('supports multi-line double-quoted values and CRLF', () => {
    const { pairs } = parseKeyValueText('KEY="-----BEGIN\r\nabc\r\n-----END"\r\nNEXT=1')
    expect(pairs).toEqual([
      { key: 'KEY', value: '-----BEGIN\nabc\n-----END' },
      { key: 'NEXT', value: '1' },
    ])
  })

  it('reports invalid lines (with a key rule) and keeps the last duplicate', () => {
    const { pairs, invalid } = parseKeyValueText('1BAD=x\nnovalue\nA=1\nA=2', { isValidKey: isIdentifierKey })
    expect(invalid).toEqual(['1BAD=x', 'novalue'])
    expect(pairs).toEqual([{ key: 'A', value: '2' }])
  })

  it('accepts any key without whitespace by default', () => {
    const { pairs, invalid } = parseKeyValueText('app.example.com/tier=pro\nX-Request-Id=42\n=orphan\nhas space=1')
    expect(pairs).toEqual([
      { key: 'app.example.com/tier', value: 'pro' },
      { key: 'X-Request-Id', value: '42' },
    ])
    expect(invalid).toEqual(['=orphan', 'has space=1'])
  })

  it('keeps template placeholders like ${{project.api.url}} intact', () => {
    const { pairs } = parseKeyValueText('API_URL=${{project.api.url}}')
    expect(pairs[0]?.value).toBe('${{project.api.url}}')
  })

  it('reports an unterminated quote', () => {
    const { pairs, invalid } = parseKeyValueText('A="never closed\nB=1')
    expect(pairs).toEqual([])
    expect(invalid).toEqual(['A="never closed'])
  })
})

describe('formatKeyValueText / key validators', () => {
  it('round-trips values that need quoting', () => {
    const pairs = [
      { key: 'A', value: 'simple' },
      { key: 'B', value: 'has space "and quotes"' },
      { key: 'C', value: 'multi\nline' },
      { key: 'D', value: 'back\\slash # hash' },
    ]
    expect(parseKeyValueText(formatKeyValueText(pairs)).pairs).toEqual(pairs)
  })

  it('validates identifier keys', () => {
    expect(isIdentifierKey('DATABASE_URL')).toBe(true)
    expect(isIdentifierKey('app.tier-name')).toBe(true)
    expect(isIdentifierKey('9LIVES')).toBe(false)
    expect(isIdentifierKey('has space')).toBe(false)
    expect(validateIdentifierKey('OK_KEY')).toBeNull()
    expect(validateIdentifierKey('9LIVES')).toMatch(/letters, digits/)
  })
})

describe('row helpers', () => {
  const rows: KeyValueRow[] = [
    { id: 'r1', key: ' API_URL ', value: 'https://api.example.com' },
    { id: 'r2', key: '', value: '' },
    { id: 'r3', key: 'TOKEN', value: 'abc', secret: true },
  ]

  it('pairsFromRows drops blank rows, trims keys and keeps the secret flag', () => {
    expect(pairsFromRows(rows)).toEqual([
      { key: 'API_URL', value: 'https://api.example.com' },
      { key: 'TOKEN', value: 'abc', secret: true },
    ])
  })

  it('validateRows flags missing, invalid and duplicate keys', () => {
    const errors = validateRows(
      [
        { id: 'a', key: 'NAME', value: '1' },
        { id: 'b', key: '', value: 'orphan' },
        { id: 'c', key: 'NAME', value: '2' },
        { id: 'd', key: '9BAD', value: '3' },
        { id: 'e', key: '', value: '' },
      ],
      { validateKey: validateIdentifierKey },
    )
    expect([...errors.keys()]).toEqual(['b', 'c', 'd'])
    expect(errors.get('b')).toBe('Key is required')
    expect(errors.get('c')).toBe('Duplicate key NAME')
  })

  it('validateRows accepts custom messages', () => {
    const errors = validateRows([{ id: 'x', key: '', value: 'v' }], { messages: { required: 'Name it' } })
    expect(errors.get('x')).toBe('Name it')
  })

  it('mergeRows upserts by key, keeps positions and drops blank rows', () => {
    const merged = mergeRows(rows, [
      { key: 'TOKEN', value: 'new' },
      { key: 'LOCALE', value: 'fr-FR' },
    ])
    expect(merged.map((r) => [r.id, r.key.trim(), r.value, r.secret])).toEqual([
      ['r1', 'API_URL', 'https://api.example.com', undefined],
      ['r3', 'TOKEN', 'new', true],
      [merged[2]?.id, 'LOCALE', 'fr-FR', undefined],
    ])
    expect(merged[2]?.id).toMatch(/^kv-/)
    // inputs are not mutated
    expect(rows[2]?.value).toBe('abc')
  })

  it('mergeRows matches and stores incoming keys trimmed', () => {
    const merged = mergeRows(rows, [
      { key: ' API_URL', value: 'https://eu.example.com' },
      { key: ' ZONE ', value: 'b' },
    ])
    expect(merged.map((r) => [r.key.trim(), r.value])).toEqual([
      ['API_URL', 'https://eu.example.com'],
      ['TOKEN', 'abc'],
      ['ZONE', 'b'],
    ])
    expect(merged[2]?.key).toBe('ZONE')
  })

  it('pairsFromRows also normalizes plain pairs', () => {
    expect(pairsFromRows([{ key: ' a ', value: '1' }, { key: '', value: '' }])).toEqual([{ key: 'a', value: '1' }])
  })
})

describe('useKeyValueRows', () => {
  it('is not dirty when the saved data has untrimmed keys or blank pairs', () => {
    const { result } = renderHook(() =>
      useKeyValueRows([
        { key: ' region ', value: 'eu' },
        { key: '', value: '' },
      ]),
    )
    expect(result.current.dirty).toBe(false)
    expect(result.current.pairs).toEqual([{ key: 'region', value: 'eu' }])
  })

  it('tracks dirty / valid and resets to a new baseline', () => {
    const { result } = renderHook(() => useKeyValueRows([{ key: 'A', value: '1' }], { validateKey: validateIdentifierKey }))
    act(() => result.current.setRows((rows) => [...rows, { id: 'new', key: '9BAD', value: 'x' }]))
    expect(result.current.dirty).toBe(true)
    expect(result.current.valid).toBe(false)
    act(() => result.current.reset([{ key: 'B', value: '2', secret: true }]))
    expect(result.current.dirty).toBe(false)
    expect(result.current.valid).toBe(true)
    expect(result.current.rows).toEqual([expect.objectContaining({ key: 'B', value: '2', secret: true })])
    act(() => result.current.setRows((rows) => rows.map((r) => ({ ...r, secret: false }))))
    expect(result.current.dirty).toBe(true)
  })
})
