import { fireEvent, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCommandShortcut } from './use-command-shortcut'

const press = (init: KeyboardEventInit) => fireEvent.keyDown(window, init)

describe('useCommandShortcut', () => {
  it('fires on ⌘K and Ctrl+K and prevents the browser default', () => {
    const handler = vi.fn()
    renderHook(() => useCommandShortcut(handler))
    const notPrevented = press({ key: 'k', metaKey: true })
    press({ key: 'K', ctrlKey: true })
    expect(notPrevented).toBe(false)
    expect(handler).toHaveBeenCalledTimes(2)
    expect(handler.mock.calls[0]?.[0]).toBeInstanceOf(KeyboardEvent)
  })

  it('ignores other letters, plain presses and Alt / Shift combinations', () => {
    const handler = vi.fn()
    renderHook(() => useCommandShortcut(handler))
    press({ key: 'j', ctrlKey: true })
    press({ key: 'k' })
    press({ key: 'k', ctrlKey: true, altKey: true })
    press({ key: 'k', metaKey: true, shiftKey: true })
    expect(handler).not.toHaveBeenCalled()
  })

  it('accepts the letter as a string or in options', () => {
    const fromString = vi.fn()
    const fromOptions = vi.fn()
    renderHook(() => useCommandShortcut(fromString, 'j'))
    renderHook(() => useCommandShortcut(fromOptions, { key: 'p' }))
    press({ key: 'j', ctrlKey: true })
    press({ key: 'p', metaKey: true })
    press({ key: 'k', ctrlKey: true })
    expect(fromString).toHaveBeenCalledOnce()
    expect(fromOptions).toHaveBeenCalledOnce()
  })

  it('stops listening while disabled and after unmount', () => {
    const handler = vi.fn()
    const { rerender, unmount } = renderHook(({ enabled }) => useCommandShortcut(handler, { enabled }), {
      initialProps: { enabled: false },
    })
    press({ key: 'k', ctrlKey: true })
    expect(handler).not.toHaveBeenCalled()
    rerender({ enabled: true })
    press({ key: 'k', ctrlKey: true })
    expect(handler).toHaveBeenCalledOnce()
    unmount()
    press({ key: 'k', ctrlKey: true })
    expect(handler).toHaveBeenCalledOnce()
  })

  it('always calls the latest handler', () => {
    const first = vi.fn()
    const second = vi.fn()
    const { rerender } = renderHook(({ handler }) => useCommandShortcut(handler), { initialProps: { handler: first } })
    rerender({ handler: second })
    press({ key: 'k', ctrlKey: true })
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledOnce()
  })
})
