import { act, renderHook } from '@testing-library/react'
import { toast } from 'sonner'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { copyText, useCopy } from './use-copy'

vi.mock('sonner', () => ({ toast: { error: vi.fn() } }))

type ExecCommand = typeof document.execCommand

const originalExecCommand = document.execCommand as ExecCommand | undefined

function stubExecCommand(impl: () => boolean) {
  const spy = vi.fn(impl)
  document.execCommand = spy as unknown as ExecCommand
  return spy
}

function focusedButton() {
  const button = document.createElement('button')
  button.textContent = 'Copy'
  document.body.appendChild(button)
  button.focus()
  return button
}

beforeEach(() => {
  vi.mocked(toast.error).mockClear()
})

afterEach(() => {
  document.execCommand = originalExecCommand as ExecCommand
  document.body.innerHTML = ''
  vi.useRealTimers()
})

describe('copyText (textarea fallback, no Clipboard API in jsdom)', () => {
  it('copies, removes the textarea and gives focus back', async () => {
    const button = focusedButton()
    const exec = stubExecCommand(() => true)
    await expect(copyText('tok_test_123')).resolves.toBe(true)
    expect(exec).toHaveBeenCalledWith('copy')
    expect(document.querySelector('textarea')).toBeNull()
    expect(document.activeElement).toBe(button)
  })

  it('never leaks the textarea when execCommand throws', async () => {
    const button = focusedButton()
    stubExecCommand(() => {
      throw new Error('not allowed')
    })
    await expect(copyText('tok_test_123')).resolves.toBe(false)
    expect(document.querySelector('textarea')).toBeNull()
    expect(document.activeElement).toBe(button)
  })

  it('resolves to false when execCommand refuses', async () => {
    stubExecCommand(() => false)
    await expect(copyText('x')).resolves.toBe(false)
    expect(document.querySelector('textarea')).toBeNull()
  })
})

describe('copyText (Clipboard API)', () => {
  afterEach(() => {
    Reflect.deleteProperty(navigator, 'clipboard')
    Reflect.deleteProperty(window, 'isSecureContext')
  })

  it('uses navigator.clipboard in secure contexts', async () => {
    const writeText = vi.fn(() => Promise.resolve())
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true })
    const exec = stubExecCommand(() => true)
    await expect(copyText('hello')).resolves.toBe(true)
    expect(writeText).toHaveBeenCalledWith('hello')
    expect(exec).not.toHaveBeenCalled()
  })
})

describe('useCopy', () => {
  it('flips `copied` for 1.5s by default', async () => {
    vi.useFakeTimers()
    stubExecCommand(() => true)
    const { result } = renderHook(() => useCopy())
    await act(() => result.current[1]('value'))
    expect(result.current[0]).toBe(true)
    act(() => vi.advanceTimersByTime(1499))
    expect(result.current[0]).toBe(true)
    act(() => vi.advanceTimersByTime(1))
    expect(result.current[0]).toBe(false)
  })

  it('honours `timeout`', async () => {
    vi.useFakeTimers()
    stubExecCommand(() => true)
    const { result } = renderHook(() => useCopy({ timeout: 300 }))
    await act(() => result.current[1]('value'))
    act(() => vi.advanceTimersByTime(300))
    expect(result.current[0]).toBe(false)
  })

  it('shows the default toast on failure', async () => {
    stubExecCommand(() => false)
    const { result } = renderHook(() => useCopy())
    await act(() => result.current[1]('value'))
    expect(result.current[0]).toBe(false)
    expect(toast.error).toHaveBeenCalledWith('Could not copy to the clipboard')
  })

  it('uses `errorMessage` for the toast', async () => {
    stubExecCommand(() => false)
    const { result } = renderHook(() => useCopy({ errorMessage: 'Copie impossible' }))
    await act(() => result.current[1]('value'))
    expect(toast.error).toHaveBeenCalledWith('Copie impossible')
  })

  it('calls `onError` instead of the toast', async () => {
    stubExecCommand(() => false)
    const onError = vi.fn()
    const { result } = renderHook(() => useCopy({ onError }))
    await act(() => result.current[1]('value'))
    expect(onError).toHaveBeenCalledWith('value')
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('keeps a stable `copy` across renders with new options', () => {
    const { result, rerender } = renderHook(({ timeout }) => useCopy({ timeout }), { initialProps: { timeout: 100 } })
    const first = result.current[1]
    rerender({ timeout: 200 })
    expect(result.current[1]).toBe(first)
  })
})
