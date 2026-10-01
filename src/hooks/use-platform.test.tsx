import { act } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { TopBarSearch } from '../components/layout/top-bar'

import { useIsMac, useModKey } from './use-platform'

// Simulate an Apple client: the server render must still say "Ctrl" (it cannot know the platform).
vi.mock('../lib/platform', () => ({ isMac: true, modKey: '⌘' }))

function ModKeyProbe() {
  const modKey = useModKey()
  const mac = useIsMac()
  return <span>{`${modKey}|${String(mac)}`}</span>
}

/** Server-renders `element`, hydrates it on an Apple client and reports recoverable (mismatch) errors. */
async function hydrate(element: React.ReactElement) {
  const html = renderToString(element)
  const container = document.createElement('div')
  container.innerHTML = html
  document.body.appendChild(container)
  const onRecoverableError = vi.fn()
  await act(async () => {
    hydrateRoot(container, element, { onRecoverableError })
  })
  return { html, container, onRecoverableError }
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('useIsMac / useModKey', () => {
  it('render the non-Apple variant on the server, then the real platform after hydration', async () => {
    const { html, container, onRecoverableError } = await hydrate(<ModKeyProbe />)
    expect(html).toContain('<span>Ctrl|false</span>')
    expect(container.textContent).toBe('⌘|true')
    expect(onRecoverableError).not.toHaveBeenCalled()
  })
})

describe('TopBarSearch', () => {
  it('hydrates without mismatch and then shows the Apple shortcut', async () => {
    const { html, container, onRecoverableError } = await hydrate(<TopBarSearch />)
    expect(html).toContain('Ctrl K')
    expect(onRecoverableError).not.toHaveBeenCalled()
    const button = container.querySelector('button')
    expect(button?.getAttribute('aria-label')).toBe('Search (⌘K)')
    expect(button?.getAttribute('aria-keyshortcuts')).toBe('Meta+K')
    expect(container.querySelector('kbd')?.textContent).toBe('⌘K')
  })
})
