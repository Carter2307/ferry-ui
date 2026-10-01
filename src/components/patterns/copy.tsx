import * as React from 'react'
import { Check, Copy, Eye, EyeOff } from 'lucide-react'

import { useCopy } from '../../hooks/use-copy'
import { cn } from '../../lib/utils'
import { Button, type ButtonProps } from '../primitives/button'
import { Input } from '../primitives/input'
import { Hint } from '../primitives/tooltip'

/**
 * Built-in texts of {@link CopyButton}, {@link CopyField} and {@link SecretField} (override them
 * through `labels` to translate or reword). Defaults are English; `what` is the component's `what`
 * prop. `CopyButton` reads `copy`, `copyWhat` and `copied`; `CopyField` and `SecretField` read all
 * of them.
 */
export interface CopyLabels {
  /**
   * Visible text of the Copy button of a `CopyField` / `SecretField`, and accessible name of an
   * icon-only `CopyButton` that has no `what`. Default "Copy".
   */
  copy: string
  /**
   * Confirmation of a successful copy: replaces the button text (or the tooltip of an icon-only
   * button) for 1.5s and is announced to screen readers. Default "Copied".
   */
  copied: string
  /** Accessible name and tooltip of an icon-only `CopyButton`, from its `what`. Default "Copy API key". */
  copyWhat: (what: string) => string
  /** Tooltip of the `SecretField` toggle while the value is masked. Default "Reveal". */
  reveal: string
  /** Tooltip of the `SecretField` toggle while the value is shown. Default "Hide". */
  hide: string
  /**
   * Accessible name of the `SecretField` toggle while masked; `what` is `undefined` when the field
   * has none. Default "Reveal API key" ("Reveal value" without `what`).
   */
  revealWhat: (what?: string) => string
  /**
   * Accessible name of the `SecretField` toggle while shown; `what` is `undefined` when the field
   * has none. Default "Hide API key" ("Hide value" without `what`).
   */
  hideWhat: (what?: string) => string
}

/** English defaults of {@link CopyLabels}. */
const defaultLabels: CopyLabels = {
  copy: 'Copy',
  copied: 'Copied',
  copyWhat: (what) => `Copy ${what}`,
  reveal: 'Reveal',
  hide: 'Hide',
  revealWhat: (what) => `Reveal ${what ?? 'value'}`,
  hideWhat: (what) => `Hide ${what ?? 'value'}`,
}

/** Fills the unset (or `undefined`) entries of `overrides` with the English defaults. */
function withDefaultLabels(overrides: Partial<CopyLabels> | undefined): CopyLabels {
  if (!overrides) return defaultLabels
  const defined = Object.entries(overrides).filter(([, text]) => text !== undefined)
  return { ...defaultLabels, ...Object.fromEntries(defined) }
}

/** Props of {@link CopyButton}: every Button prop except `onClick` / `children` / the native `onCopy`, plus the ones below. */
export interface CopyButtonProps extends Omit<ButtonProps, 'onClick' | 'onCopy' | 'children' | 'value'> {
  /** The exact text written to the clipboard. */
  value: string
  /**
   * Visible label (e.g. "Copy"). When set, the button shows the label and flips to "Copied"
   * (`labels.copied`) for 1.5s. When omitted, the button is icon-only, gets
   * `aria-label="Copy <what>"` (`labels.copyWhat`) and a tooltip.
   */
  label?: string
  /**
   * What is being copied ("URL", "invoice number", "API key"). Icon-only: the accessible name and
   * tooltip become "Copy API key" — always set it there. Labelled: it is appended to the accessible
   * name ("Copy" → "Copy API key") so several Copy buttons on one screen stay distinguishable for
   * screen readers; omit it when the label already says what is copied ("Copy link").
   */
  what?: string
  /**
   * Called with `value` after each click, once the clipboard write has been attempted. It also fires
   * when the write failed (the user then sees an error toast), so use it for analytics, not to confirm
   * success. Replaces the native clipboard-event `onCopy`.
   */
  onCopy?: (value: string) => void
  /**
   * Overrides of the built-in texts (`Copy <what>`, `Copied`), to translate or reword them. See
   * {@link CopyLabels}; unset entries keep their English default.
   */
  labels?: Partial<CopyLabels>
}

/**
 * Small outlined button that copies a string to the clipboard and confirms with a check icon
 * (and "Copied" when labelled) for 1.5s; failures raise an error toast (mount `<Toaster />`).
 * The confirmation is also announced to screen readers through a visually hidden live region
 * rendered next to the button.
 *
 * Use it next to identifiers, URLs, keys and snippets the user will paste elsewhere. Icon-only by
 * default (`icon-tiny`, with a tooltip); pass `label="Copy"` for a text button (`tiny`). Use
 * `variant="ghost"` inside dense rows or tables. For a whole read-only value box prefer
 * {@link CopyField}; for secrets use {@link SecretField}; for commands and snippets use `CodeBlock`
 * (patterns/code-block).
 * The click does not propagate, so it is safe inside clickable rows and links.
 */
export function CopyButton({
  value,
  label,
  what,
  onCopy,
  labels: labelOverrides,
  size,
  variant,
  className,
  ...props
}: CopyButtonProps) {
  const [copied, copy] = useCopy()
  const labels = withDefaultLabels(labelOverrides)
  const icon = copied ? <Check className="text-primary" /> : <Copy />
  const accessible = what ? labels.copyWhat(what) : labels.copy
  // Labelled: keep the visible text first in the name (WCAG "label in name") and add `what`.
  const labelledName = label && what && !copied ? `${label} ${what}` : undefined
  const btn = (
    <Button
      data-slot="copy-button"
      data-copied={copied || undefined}
      size={size ?? (label ? 'tiny' : 'icon-tiny')}
      variant={variant ?? 'default'}
      icon={icon}
      aria-label={label ? labelledName : accessible}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void copy(value).then(() => onCopy?.(value))
      }}
      className={className}
      {...props}
    >
      {label && (copied ? labels.copied : label)}
    </Button>
  )
  return (
    <>
      {label ? btn : <Hint label={copied ? labels.copied : accessible}>{btn}</Hint>}
      {/* Announces the confirmation: the focused button's new name / icon is not read out by itself. */}
      <span data-slot="copy-button-status" role="status" aria-live="polite" className="sr-only">
        {copied ? labels.copied : ''}
      </span>
    </>
  )
}

/** Props shared by {@link CopyField} and {@link SecretField}. */
export interface CopyFieldProps {
  /** The value shown in the field and written to the clipboard. */
  value: string
  /** Id of the input, so a `<label htmlFor>` (or a FormRow `htmlFor`) can point at it. */
  id?: string
  /** Monospace value (default `true`): identifiers, URLs, keys. Set `false` for plain words. */
  mono?: boolean
  /** What is being copied, used in the copy button's accessible name ("Copy project ID"). */
  what?: string
  /** Field height: `sm` 30px (dense cards, toolbars) or `md` 34px (default, form rows). */
  size?: 'sm' | 'md'
  /** Merged onto the wrapper element. */
  className?: string
  /** Accessible name of the input when no `<label htmlFor>` points at it. */
  'aria-label'?: string
  /** Id(s) of the helper text describing the field. */
  'aria-describedby'?: string
  /** Called with `value` each time the user clicks Copy (see {@link CopyButtonProps.onCopy}). */
  onCopy?: (value: string) => void
  /**
   * Overrides of the built-in texts ("Copy", "Copied", and for a `SecretField` "Reveal" / "Hide"),
   * to translate or reword them. See {@link CopyLabels}; unset entries keep their English default.
   */
  labels?: Partial<CopyLabels>
}

/**
 * Read-only input showing a value with an inline "Copy" button at its right end. Focusing the
 * input selects its text, so manual copy works too; long values are truncated with an ellipsis.
 *
 * Use it for values the user needs to copy verbatim: IDs, URLs, webhook endpoints, usernames.
 * Do NOT use it for secrets (use {@link SecretField}, which masks the value) or for editable
 * values (use a regular Input).
 */
export function CopyField({
  value,
  id,
  mono = true,
  what,
  className,
  size = 'md',
  onCopy,
  labels: labelOverrides,
  ...aria
}: CopyFieldProps) {
  const labels = withDefaultLabels(labelOverrides)
  return (
    <div data-slot="copy-field" className={cn('relative flex w-full items-center', className)}>
      <Input
        id={id}
        readOnly
        value={value}
        mono={mono}
        size={size}
        onFocus={(e) => e.currentTarget.select()}
        className="pr-[76px] text-ellipsis"
        {...aria}
      />
      <CopyButton
        value={value}
        label={labels.copy}
        what={what}
        onCopy={onCopy}
        labels={labelOverrides}
        className="absolute right-1.5"
      />
    </div>
  )
}

/** Props of {@link SecretField}: the {@link CopyFieldProps} plus the reveal state. */
export interface SecretFieldProps extends CopyFieldProps {
  /** Text shown while hidden. Defaults to bullets roughly as long as the value (12–32). */
  mask?: string
  /** Controlled reveal state. Pair with `onRevealedChange`. */
  revealed?: boolean
  /** Initial reveal state when uncontrolled (default `false`). */
  defaultRevealed?: boolean
  /** Called when the user toggles Reveal / Hide. */
  onRevealedChange?: (revealed: boolean) => void
}

/**
 * Read-only secret (API key, password, signing secret, recovery code):
 * masked by default, with a Reveal/Hide toggle and a Copy button that copies the real value
 * without revealing it. The secret is never rendered in the DOM until revealed.
 *
 * Use it wherever a credential is displayed. Do NOT use it for non-sensitive values (use
 * {@link CopyField}) or for a secret the user types (use an Input with `type="password"`).
 */
export function SecretField({
  value,
  id,
  mono = true,
  what,
  className,
  size = 'md',
  mask,
  revealed,
  defaultRevealed = false,
  onRevealedChange,
  onCopy,
  labels: labelOverrides,
  ...aria
}: SecretFieldProps) {
  const labels = withDefaultLabels(labelOverrides)
  const [innerShown, setInnerShown] = React.useState(defaultRevealed)
  const shown = revealed ?? innerShown
  const toggle = () => {
    const next = !shown
    if (revealed === undefined) setInnerShown(next)
    onRevealedChange?.(next)
  }
  return (
    <div
      data-slot="secret-field"
      data-revealed={shown || undefined}
      className={cn('relative flex w-full items-center', className)}
    >
      <Input
        id={id}
        readOnly
        value={shown ? value : (mask ?? '•'.repeat(Math.min(Math.max(value.length, 12), 32)))}
        mono={mono}
        size={size}
        onFocus={(e) => shown && e.currentTarget.select()}
        className="pr-[108px] text-ellipsis"
        {...aria}
      />
      <div className="absolute right-1.5 flex items-center gap-1">
        {/* The name flips between Reveal and Hide, so no `aria-pressed`: the state is exposed once. */}
        <Hint label={shown ? labels.hide : labels.reveal}>
          <Button
            data-slot="secret-field-toggle"
            size="icon-tiny"
            icon={shown ? <EyeOff /> : <Eye />}
            aria-label={shown ? labels.hideWhat(what) : labels.revealWhat(what)}
            onClick={toggle}
          />
        </Hint>
        <CopyButton value={value} label={labels.copy} what={what} onCopy={onCopy} labels={labelOverrides} />
      </div>
    </div>
  )
}
