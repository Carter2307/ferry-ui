import * as React from 'react'
import { toast } from 'sonner'

/**
 * Copies with a hidden, off-screen textarea and `document.execCommand('copy')`, for contexts where
 * the async Clipboard API is missing or refused. The textarea is always removed and the previously
 * focused element (plus the user's text selection) restored, even when `execCommand` throws.
 */
function copyWithTextarea(text: string): boolean {
  const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  const selection = document.getSelection()
  const previousRanges: Range[] = []
  if (selection) for (let i = 0; i < selection.rangeCount; i++) previousRanges.push(selection.getRangeAt(i))

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.setAttribute('aria-hidden', 'true')
  textarea.style.position = 'fixed'
  textarea.style.top = '0'
  textarea.style.left = '0'
  textarea.style.opacity = '0'
  textarea.style.pointerEvents = 'none'
  document.body.appendChild(textarea)
  try {
    textarea.select()
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    textarea.remove()
    if (selection && previousRanges.length > 0) {
      selection.removeAllRanges()
      for (const range of previousRanges) selection.addRange(range)
    }
    previousFocus?.focus({ preventScroll: true })
  }
}

/**
 * Copies text to the clipboard and resolves to `true` on success, `false` otherwise
 * (never throws). Uses the async Clipboard API and falls back to a hidden textarea
 * in non-secure contexts (plain http); the fallback never leaves the textarea in the
 * page and gives focus back to the element that had it. Use it outside React or when
 * you handle the feedback yourself; in components prefer {@link useCopy}.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* permission refused or document not focused: try the fallback */
  }
  if (typeof document === 'undefined') return false
  return copyWithTextarea(text)
}

/** Options of {@link useCopy}. */
export interface UseCopyOptions {
  /** How long `copied` stays `true` after a successful copy, in milliseconds. Defaults to `1500`. */
  timeout?: number
  /**
   * Called when copying fails, instead of the default `toast.error`. Use it to report the failure
   * your own way (inline message, analytics). Receives the text that could not be copied.
   */
  onError?: (text: string) => void
  /**
   * Message of the default failure toast (ignored when `onError` is set). Defaults to
   * `"Could not copy to the clipboard"`; override it to translate.
   */
  errorMessage?: string
}

/**
 * Clipboard state for a copy button: returns `[copied, copy]`, where `copy(text)` copies
 * and `copied` flips to `true` for 1.5s (`timeout`) after a success (swap the icon / label
 * for a check). Failures show a `toast.error` (mount a <Toaster /> once in the app); change
 * its text with `errorMessage`, or handle failures yourself with `onError`.
 * `copy` keeps the same identity across renders, even when the options change.
 * For standard UI prefer the ready-made patterns, which already use it: `CopyButton`,
 * `CopyField`, `SecretField` and `CodeBlock`.
 */
export function useCopy(options: UseCopyOptions = {}): [boolean, (text: string) => Promise<void>] {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const optionsRef = React.useRef(options)
  React.useEffect(() => {
    optionsRef.current = options
  })
  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )
  const copy = React.useCallback(async (text: string) => {
    const ok = await copyText(text)
    const { timeout = 1500, onError, errorMessage = 'Could not copy to the clipboard' } = optionsRef.current
    if (!ok) {
      if (onError) onError(text)
      else toast.error(errorMessage)
      return
    }
    setCopied(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), timeout)
  }, [])
  return [copied, copy]
}
