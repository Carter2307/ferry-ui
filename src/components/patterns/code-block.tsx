import * as React from 'react'

import { cn } from '../../lib/utils'

import { CopyButton, type CopyLabels } from './copy'

/** Visual style of a {@link CodeBlock}. */
export type CodeBlockVariant = 'block' | 'inline' | 'terminal'

/** Props of {@link CodeBlock}. Any other `<div>` attribute (id, aria-*, data-*) goes on the root. */
export interface CodeBlockProps extends Omit<React.ComponentProps<'div'>, 'children' | 'onCopy'> {
  /**
   * The snippet as plain text, shown verbatim (whitespace and line breaks preserved). It is also
   * what the copy button copies unless `copyValue` is set.
   */
  code?: string
  /**
   * Rich content shown instead of `code`, e.g. tinted output lines
   * (`<span className="text-success">✓ 12 passed</span>`) or a {@link CodeBlockPrompt}.
   * When only `children` are given, pass `copyValue` or no copy button is rendered.
   */
  children?: React.ReactNode
  /**
   * What the copy button writes to the clipboard. Defaults to `code`. Use it when the displayed
   * text differs from the real value, e.g. show `sk_demo_••••3f6a` but copy the full key.
   */
  copyValue?: string
  /**
   * Show a copy button. Default `true`, except for the `terminal` variant (decorative) where it
   * defaults to `false`. The button only appears when there is something to copy.
   */
  copyable?: boolean
  /**
   * What is being copied, for the copy button's accessible name and tooltip ("API key" →
   * "Copy API key"). Defaults to "command" when `prompt` is set, "code" otherwise.
   */
  what?: string
  /**
   * Shell prompt shown before every non-empty line of `code` (muted, not selectable, never
   * copied), so each line reads as its own command: do not use it for a command continued over
   * several lines with a trailing `\`. `true` renders `$`; pass a string for another prompt (`>`, `PS>`).
   * Default: no prompt. Ignored with `children`: put a {@link CodeBlockPrompt} in them instead.
   */
  prompt?: boolean | string
  /** Text size: `sm` 12px (popovers, dense panels) or `md` 12.5px. Default `md` (`sm` for `inline`). */
  size?: 'sm' | 'md'
  /**
   * Wrap long lines (breaking anywhere) instead of scrolling horizontally. Use it in narrow
   * containers where a horizontal scrollbar would hide the end of the line. Default `false`.
   * The `inline` variant always wraps, so it ignores this prop.
   */
  wrap?: boolean
  /**
   * - `block` (default): bordered sunken box for commands and snippets.
   * - `inline`: compact one-line chip with a ghost copy button, for a short token or syntax
   *   example inside a list or help text.
   * - `terminal`: decorative window with three dots and a card shadow, for marketing panels,
   *   empty states and onboarding illustrations. Not copyable unless `copyable` is set; add
   *   `aria-hidden` when it only illustrates what the surrounding text already says.
   */
  variant?: CodeBlockVariant
  /**
   * Where the copy button of a `block` sits (ignored by `inline` and `terminal`):
   * - `overlay` (default): floating in the top-right corner over the snippet.
   * - `side`: in its own column, so a long line never scrolls under the button.
   *   Prefer it for long single-line commands.
   */
  copyPlacement?: 'overlay' | 'side'
  /** Called with the copied value each time the user copies it (analytics). */
  onCopy?: (value: string) => void
  /**
   * Overrides of the copy button's built-in texts ("Copy <what>", "Copied"), to translate or reword
   * them. See {@link CopyLabels}; unset entries keep their English default.
   */
  labels?: Partial<CopyLabels>
}

const textSize = { sm: 'text-[12px]', md: 'text-[12.5px]' } as const

/** Props of {@link CodeBlockPrompt}. Any other `<span>` attribute goes on the element. */
export interface CodeBlockPromptProps extends React.ComponentProps<'span'> {
  /** Prompt text, `$` by default (`>`, `PS>`, `sql>`). A space is added after it. */
  children?: React.ReactNode
}

/**
 * Muted, non-selectable shell prompt (`$ ` by default) for rich {@link CodeBlock} content.
 * The prompt is never included when the user selects the text by hand.
 *
 * Use it only inside `CodeBlock` `children`; with the `code` prop, use `prompt` instead.
 */
export function CodeBlockPrompt({ children = '$', className, ...props }: CodeBlockPromptProps) {
  return (
    <span data-slot="code-block-prompt" className={cn('text-foreground-muted select-none', className)} {...props}>
      {children}{' '}
    </span>
  )
}

/** Splits `code` into lines and prefixes each non-empty one with the prompt. */
function renderCode(code: string, prompt: string | null) {
  if (!prompt) return code
  return code.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {i > 0 && '\n'}
      {line !== '' && <CodeBlockPrompt>{prompt}</CodeBlockPrompt>}
      {line}
    </React.Fragment>
  ))
}

/**
 * Monospace snippet with a copy button: sunken bordered box (`block`), compact one-line chip
 * (`inline`) or decorative terminal window (`terminal`). Long lines scroll horizontally unless
 * `wrap` is set. The displayed text and the copied value can differ (`copyValue`), so a masked
 * secret can be shown while the real value is copied. There is no syntax highlighting.
 *
 * Use it for commands, config snippets and API examples the user copies: install lines, `curl`
 * requests, API keys, template syntax. Do NOT use it for a single short value in a form (use
 * `CopyField`), a secret the user reveals (use `SecretField`) or editable code (use a monospace
 * Textarea).
 */
export function CodeBlock({
  code,
  children,
  copyValue,
  copyable,
  what,
  prompt = false,
  size,
  wrap = false,
  variant = 'block',
  copyPlacement = 'overlay',
  onCopy,
  labels,
  className,
  ...props
}: CodeBlockProps) {
  const promptText = prompt === true ? '$' : prompt || null
  const content = children ?? (code !== undefined ? renderCode(code, promptText) : null)
  const value = copyValue ?? code
  const showCopy = (copyable ?? variant !== 'terminal') && value !== undefined && value !== ''
  const label = what ?? (promptText ? 'command' : 'code')
  const fontSize = textSize[size ?? (variant === 'inline' ? 'sm' : 'md')]
  const overflow = wrap ? 'whitespace-pre-wrap break-all' : 'overflow-x-auto'

  if (variant === 'inline') {
    return (
      <div
        data-slot="code-block"
        data-variant="inline"
        className={cn(
          'flex min-w-0 items-center gap-1.5 rounded-md border bg-surface-200 py-1 pr-1 pl-2.5',
          !showCopy && 'pr-2.5',
          className,
        )}
        {...props}
      >
        <code
          data-slot="code-block-content"
          className={cn('min-w-0 flex-1 font-mono break-all text-foreground', fontSize)}
        >
          {content}
        </code>
        {showCopy && <CopyButton value={value} what={label} onCopy={onCopy} labels={labels} size="icon-tiny" variant="ghost" />}
      </div>
    )
  }

  if (variant === 'terminal') {
    return (
      <div
        data-slot="code-block"
        data-variant="terminal"
        className={cn('rounded-lg border bg-surface-100 p-4 shadow-card', className)}
        {...props}
      >
        <div data-slot="code-block-header" className="mb-2 flex items-center gap-2">
          <span aria-hidden="true" className="size-2 rounded-full bg-destructive-solid/70" />
          <span aria-hidden="true" className="size-2 rounded-full bg-warning/70" />
          <span aria-hidden="true" className="size-2 rounded-full bg-success/80" />
          {showCopy && (
            <CopyButton value={value} what={label} onCopy={onCopy} labels={labels} variant="ghost" className="-my-[9px] ml-auto" />
          )}
        </div>
        <pre
          data-slot="code-block-content"
          className={cn('font-mono leading-relaxed text-foreground-light', fontSize, overflow)}
        >
          {content}
        </pre>
      </div>
    )
  }

  const side = copyPlacement === 'side'
  return (
    <div
      data-slot="code-block"
      data-variant="block"
      data-copy-placement={showCopy ? copyPlacement : undefined}
      className={cn(
        'relative w-full rounded-md border bg-surface-200 text-left',
        side && 'flex items-start',
        // Overlay button: the gutter is on the non-scrolling root, so a long line scrolls beside
        // the button instead of under it.
        !side && showCopy && 'pr-10',
        className,
      )}
      {...props}
    >
      <pre
        data-slot="code-block-content"
        className={cn(
          'font-mono leading-relaxed text-foreground',
          side ? 'min-w-0 flex-1 py-2.5 pl-3' : 'px-3 py-2.5',
          side && !showCopy && 'pr-3',
          !side && showCopy && 'pr-2',
          fontSize,
          overflow,
        )}
      >
        {content}
      </pre>
      {showCopy &&
        (side ? (
          <div data-slot="code-block-actions" className="shrink-0 p-1.5">
            <CopyButton value={value} what={label} onCopy={onCopy} labels={labels} />
          </div>
        ) : (
          <CopyButton value={value} what={label} onCopy={onCopy} labels={labels} className="absolute top-1.5 right-1.5" />
        ))}
    </div>
  )
}
