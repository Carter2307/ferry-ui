import type { ComponentType } from 'react'
import { render } from '@testing-library/react'
import { ThemeProvider, Toaster, TooltipProvider } from 'libui'
import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

// Smoke test: every demo renders in the browser and on the server (the build writes each page as
// static HTML first), with no error on the console. Narrow the run with a comma-separated filter:
//   DEMOS=button,dialog npm run site:test
const loaders = import.meta.glob<{ default?: ComponentType }>('./demos/**/*.tsx')
const filters = (process.env.DEMOS ?? '').split(',').map((s) => s.trim()).filter(Boolean)
const selected = Object.entries(loaders).filter(
  // `button` is the folder demos/button: it does not select demos/button-group.
  ([path]) => !filters.length || filters.some((f) => path.startsWith(`./demos/${f}/`) || path === `./demos/${f}.tsx`),
)

function Frame({ Demo }: { Demo: ComponentType }) {
  return (
    <ThemeProvider storageKey={null}>
      <TooltipProvider>
        <Demo />
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  )
}

describe('demos', () => {
  it('found demo files', () => {
    expect(selected.length).toBeGreaterThan(0)
  })

  for (const [path, load] of selected) {
    it(`${path.replace('./demos/', '')} renders`, async () => {
      const Demo = (await load()).default
      expect(Demo, 'a demo file has one default export: the component').toBeTypeOf('function')
      if (!Demo) return
      const error = vi.spyOn(console, 'error').mockImplementation(() => {})
      try {
        expect(() => renderToString(<Frame Demo={Demo} />), 'the demo must render on the server').not.toThrow()
        render(<Frame Demo={Demo} />)
        expect(error.mock.calls.map((call) => call.map(String).join(' ')), 'console errors').toEqual([])
      } finally {
        error.mockRestore()
      }
    })
  }
})
