import { describe, expect, it } from 'vitest'

import * as barrel from './index'

// Every public module of the library (stories, tests and foundations excluded).
const modules = import.meta.glob<Record<string, unknown>>(
  ['./{lib,hooks,theme}/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', '!./**/*.stories.tsx', '!./**/*.test.{ts,tsx}'],
  { eager: true },
)

describe('public barrel (src/index.ts)', () => {
  it('covers the component, hook, lib and theme folders', () => {
    expect(Object.keys(modules).length).toBeGreaterThan(60)
  })

  it.each(Object.entries(modules))('re-exports every runtime export of %s', (path, mod) => {
    for (const [name, value] of Object.entries(mod)) {
      expect(barrel, `${path} exports "${name}" but src/index.ts does not`).toHaveProperty(name, value)
    }
  })
})
