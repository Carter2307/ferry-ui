import * as React from 'react'

import { cn } from '../../lib/utils'
import { Button } from '../primitives/button'
import { Card } from '../primitives/card'

import type { FieldControlProps, FieldRenderMeta } from './field'

/**
 * Tone of a {@link FormCard} and of its {@link ActionRow}s:
 * - `neutral` (default) — plain card and rows.
 * - `destructive` — red-tinted border on the card and a faint red wash on its action rows: the "Danger zone"
 *   card at the bottom of a settings page (transfer, archive, delete).
 *
 * `default` is a deprecated alias of `neutral` (the tone vocabulary of the library is
 * `neutral` / `destructive`).
 */
export type FormCardTone = 'neutral' | 'destructive' | 'default'

/** A {@link FormCardTone} without its deprecated alias: what `data-tone` reports. */
type ResolvedFormCardTone = Exclude<FormCardTone, 'default'>

const resolveTone = (tone: FormCardTone): ResolvedFormCardTone => (tone === 'default' ? 'neutral' : tone)

/** Tone of the enclosing {@link FormCard}, inherited by {@link ActionRow}s that do not set their own. */
const FormCardToneContext = React.createContext<ResolvedFormCardTone>('neutral')

/**
 * Props of {@link FormCard}: every native `<form>` prop (onSubmit, aria-label…) plus the ones below.
 * The remaining props go to the `<form>`, or to the card `<div>` with `asDiv`; `className` always
 * goes to the card.
 */
export interface FormCardProps extends Omit<React.ComponentProps<'form'>, 'title'> {
  /**
   * Optional header title (14px medium `<h3>`). It also names the form (or, with `asDiv`, the card
   * as a `role="group"`) for assistive tech through `aria-labelledby`, unless you pass `aria-label` /
   * `aria-labelledby` yourself.
   */
  title?: React.ReactNode
  /** Secondary line under the title (13px, lighter). */
  description?: React.ReactNode
  /** Compact controls at the right of the header row (a docs link, a small button, a badge). */
  headerActions?: React.ReactNode
  /** Footer row, right-aligned on a tinted strip — usually {@link FormActions}. */
  footer?: React.ReactNode
  /**
   * Render a `<div>` instead of a `<form>`: for read-only cards (values, copy fields, toggles saved
   * instantly) and cards of {@link ActionRow}s. The remaining props (`id`, `ref`, `style`, `data-*`,
   * `aria-*`, event handlers) then go to the card element, so `ref` receives a `<div>`. Form-only
   * props (`onSubmit`, `action`, `noValidate`…) have no effect on a `<div>`: do not pass them.
   */
  asDiv?: boolean
  /**
   * `default` (neutral) or `destructive`: red-tinted border for the "Danger zone" card. {@link ActionRow}s
   * inside inherit the tone (faint red wash) unless they set their own `tone`. See {@link FormCardTone}.
   */
  tone?: FormCardTone
}

/**
 * Settings-style "form item layout" card: an optional header, then rows of label + help text on the
 * left and a control on the right, separated by hairlines, then an optional footer with the
 * Cancel / Save actions. Renders a `<form noValidate>` (you validate) unless `asDiv`.
 *
 * Use it for settings and edit forms made of independent fields, one card per topic, with
 * {@link FormRow} children and {@link FormActions} in `footer`. Put non-row content (a banner, an
 * error message) directly inside with its own `px-5 md:px-6` padding. Do NOT use it for short
 * dialogs or sign-in forms (use `Field` instead) or for data display without labels.
 *
 * For one-click actions (export, transfer, archive, delete) use {@link ActionRow} rows in an `asDiv` card;
 * group the irreversible ones in a single `tone="destructive"` "Danger zone" card at the bottom of the page.
 */
export function FormCard({
  title,
  description,
  headerActions,
  footer,
  asDiv = false,
  tone: toneProp = 'neutral',
  className,
  children,
  ...props
}: FormCardProps) {
  const tone = resolveTone(toneProp)
  const titleId = React.useId()
  const labelled = title && !props['aria-label'] && !props['aria-labelledby'] ? titleId : undefined
  const body = (
    <>
      {(title || description || headerActions) && (
        <div className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <div className="flex min-w-0 flex-col gap-0.5">
            {title && (
              <h3 id={titleId} className="text-sm font-medium text-foreground">
                {title}
              </h3>
            )}
            {description && <p className="text-[13px] text-foreground-light">{description}</p>}
          </div>
          {headerActions && <div className="flex shrink-0 items-center gap-2">{headerActions}</div>}
        </div>
      )}
      <div className="divide-y">{children}</div>
      {footer && (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t bg-surface-75 px-5 py-3 md:px-6 dark:bg-transparent">
          {footer}
        </div>
      )}
    </>
  )
  // A `<div>` card has no inner `<form>` to take the rest props: they go to the card itself.
  const divProps = asDiv
    ? ({
        // A name on a plain `<div>` is only announced when the element has a role.
        role: labelled || props['aria-label'] || props['aria-labelledby'] ? 'group' : undefined,
        ...props,
        'aria-labelledby': props['aria-labelledby'] ?? labelled,
      } as React.ComponentProps<'div'>)
    : undefined
  return (
    <Card
      {...divProps}
      data-slot="form-card"
      data-tone={tone}
      className={cn('gap-0', tone === 'destructive' && 'border-destructive-border', className)}
    >
      <FormCardToneContext.Provider value={tone}>
        {asDiv ? (
          body
        ) : (
          <form noValidate aria-labelledby={labelled} {...props}>
            {body}
          </form>
        )}
      </FormCardToneContext.Provider>
    </Card>
  )
}

/** Props of {@link FormRow}. Extra `<div>` props go to the row element. */
export interface FormRowProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /**
   * Field name (14px medium). Rendered as a `<label>` tied to the control when `htmlFor` is set, else
   * as plain text. With `htmlFor` it gets the id `<htmlFor>-label`.
   */
  label: React.ReactNode
  /**
   * Help text under the label (13px, lighter). With `htmlFor`, it gets the id `<htmlFor>-description`
   * and the control references it through `aria-describedby`.
   */
  description?: React.ReactNode
  /**
   * Id of the control this row labels (becomes the label's `for`). Set it whenever the control is
   * focusable: the row then gives the control its `id`, `aria-describedby` and `aria-invalid` (see
   * `children`). Omit it for read-only content and for groups with no single focus target.
   */
  htmlFor?: string
  /**
   * Validation error under the control (13px destructive, `role="alert"`). With `htmlFor`, it gets the id
   * `<htmlFor>-error`, is added to the control's `aria-describedby`, and the control gets `aria-invalid`.
   */
  error?: React.ReactNode
  /**
   * `horizontal` (default): label column left, control column right from the `md` breakpoint (stacked below).
   * `vertical`: always stacked — for wide controls (tables, code, editors).
   */
  layout?: 'horizontal' | 'vertical'
  /** Classes for the control column (e.g. `max-w-xs` to narrow a short field). */
  controlClassName?: string
  /**
   * The control(s): Input, Select, Switch, Textarea, CopyField, custom widgets.
   *
   * - A single control element (a component such as `Input`, or a native `<input>`, `<select>`,
   *   `<textarea>`, `<button>`) with `htmlFor` set: the row injects `id` (unless the control has its
   *   own), `aria-describedby` (the description and error ids, merged with any the control already
   *   has) and, while `error` is set, `aria-invalid`.
   * - A render function `(control, { labelId }) => node` for composite controls: spread `control`
   *   onto the focusable element (`<SelectTrigger {...control}>`, the input of an input + button
   *   row). Without `htmlFor` the ids are generated and `control` also carries `aria-labelledby`:
   *   use that for groups (`RadioGroup`, `ToggleGroup`, `RadioCardGroup`).
   * - Anything else (several nodes, a wrapper `<div>`, plain text) is rendered as is: wire the
   *   control inside by hand, or use the render function.
   */
  children: React.ReactNode | ((control: FieldControlProps, meta: FieldRenderMeta) => React.ReactNode)
}

type ControlElementProps = {
  id?: string
  'aria-describedby'?: string
}

const NATIVE_CONTROLS = new Set(['input', 'select', 'textarea', 'button'])

/**
 * A single element FormRow can wire by itself: a component, or a native form control. Wrappers
 * (`<div>`, `<span>`, fragments) are left alone: the real control sits somewhere inside them and
 * already carries the id.
 */
function isControlElement(node: unknown): node is React.ReactElement<ControlElementProps> {
  if (!React.isValidElement(node) || node.type === React.Fragment) return false
  return typeof node.type !== 'string' || NATIVE_CONTROLS.has(node.type)
}

/** Joins space-separated id lists, dropping empty values and duplicates. */
function joinIds(...lists: (string | false | undefined)[]) {
  const ids = lists.flatMap((list) => (list ? list.split(/\s+/) : [])).filter(Boolean)
  return Array.from(new Set(ids)).join(' ') || undefined
}

/**
 * One row of a {@link FormCard}: label + description on the left, control + error on the right.
 *
 * Use one row per setting. Set `htmlFor` and pass the control as the single child: the row links
 * label, description, error and control by id for you (`id`, `aria-describedby`, `aria-invalid`),
 * like `Field` does. Use the render-function form for composite controls (`Select`) and groups. Do
 * NOT nest rows or put several unrelated settings in one row. For stacked fields outside a settings
 * card (dialogs, sign-in) use `Field`.
 *
 * @example
 * <FormRow label="Name" description="Shown in the project switcher." htmlFor="project-name" error={nameError}>
 *   <Input value={name} onChange={(e) => setName(e.target.value)} />
 * </FormRow>
 */
export function FormRow({
  label,
  description,
  htmlFor,
  error,
  layout = 'horizontal',
  className,
  controlClassName,
  children,
  ...props
}: FormRowProps) {
  const generatedId = React.useId()
  // Id of the control: `htmlFor`, or a generated one for a render function used without `htmlFor`.
  const controlId = htmlFor ?? (typeof children === 'function' ? generatedId : undefined)
  const labelId = controlId ? `${controlId}-label` : undefined
  const descriptionId = controlId && description ? `${controlId}-description` : undefined
  const errorId = controlId && error ? `${controlId}-error` : undefined
  const describedBy = joinIds(descriptionId, errorId)

  let content: React.ReactNode
  if (typeof children === 'function') {
    content = children(
      {
        id: controlId ?? generatedId,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
        // Without `htmlFor` the label is plain text: name the control (a group) through its id.
        'aria-labelledby': htmlFor ? undefined : labelId,
      },
      { labelId: labelId ?? `${generatedId}-label` },
    )
  } else if (htmlFor && isControlElement(children)) {
    // cloneElement (not Slot): the control keeps its own id, and existing describedby ids are merged.
    content = React.cloneElement(children, {
      id: children.props.id ?? htmlFor,
      'aria-describedby': joinIds(describedBy, children.props['aria-describedby']),
      ...(error ? { 'aria-invalid': true } : null),
    } as ControlElementProps)
  } else {
    content = children
  }

  const LabelTag = htmlFor ? 'label' : 'div'
  return (
    <div
      data-slot="form-row"
      data-invalid={error ? true : undefined}
      className={cn(
        'grid gap-3 px-5 py-5 md:px-6',
        layout === 'horizontal' ? 'md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-8' : '',
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <LabelTag id={labelId} htmlFor={htmlFor} className="text-sm font-medium text-foreground">
          {label}
        </LabelTag>
        {description && (
          <div id={descriptionId} className="text-[13px] leading-relaxed text-foreground-light">
            {description}
          </div>
        )}
      </div>
      <div className={cn('flex min-w-0 flex-col gap-1.5', controlClassName)}>
        {content}
        {error && (
          <p id={errorId} role="alert" className="text-[13px] text-destructive">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

/** Props of {@link ActionRow}. Extra `<div>` props go to the row element. */
export interface ActionRowProps extends Omit<React.ComponentProps<'div'>, 'title' | 'children'> {
  /** What the action does, as a short name (14px medium): "Delete project", "Transfer ownership". */
  title: React.ReactNode
  /** Consequences, under the title (13px, lighter): what changes, what is kept, whether it can be undone. */
  description?: React.ReactNode
  /**
   * The control on the right, usually one `Button` (`variant="destructive"` for destructive actions) that runs
   * the action or opens a `ConfirmDialog`. Kept at its natural width; below `sm` it wraps under the text.
   */
  action: React.ReactNode
  /**
   * `destructive` adds a faint red wash to the row. Defaults to the tone of the enclosing {@link FormCard}
   * (so every row of a `tone="destructive"` card is tinted); set it to override per row.
   */
  tone?: FormCardTone
}

/**
 * One action of a {@link FormCard}: title + description on the left, a single action (a button) on the
 * right; stacked below the `sm` breakpoint. Unlike {@link FormRow} it edits no value: the action runs on
 * click (or after a confirmation dialog).
 *
 * Use it for account / project actions such as export, pause, transfer, archive or delete, one row per
 * action in an `asDiv` card; put the destructive ones in a `tone="destructive"` "Danger zone" card and
 * confirm them with a `ConfirmDialog`. Do NOT use it for settings with a value to save (use
 * {@link FormRow}) or for several actions in one row.
 */
export function ActionRow({ title, description, action, tone, className, ...props }: ActionRowProps) {
  const cardTone = React.useContext(FormCardToneContext)
  const resolvedTone = tone ? resolveTone(tone) : cardTone
  return (
    <div
      data-slot="action-row"
      data-tone={resolvedTone}
      className={cn(
        'flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6',
        resolvedTone === 'destructive' && 'bg-destructive-soft/60',
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && <div className="text-[13px] text-foreground-light">{description}</div>}
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  )
}

/** Props of {@link FormActions}. */
export interface FormActionsProps {
  /** The form differs from its saved state: enables Save and Cancel and shows the "unsaved changes" status. */
  dirty: boolean
  /** A save is in flight: spinner on Save, Cancel disabled. */
  saving?: boolean
  /**
   * The last submit failed validation: appends `invalidMessage` to the unsaved status. Save stays
   * enabled, so the user can fix the fields and submit again (validation runs on submit). `SaveBar`
   * differs on purpose: its `invalid` reflects live validation and disables Save.
   */
  invalid?: boolean
  /** Shows a Cancel button that restores the saved values. Omit it to hide Cancel. */
  onReset?: () => void
  /**
   * Called by the Save button instead of submitting the form. Only needed when the card is not a
   * `<form>` (`asDiv`); by default Save is a `type="submit"` button and the form's `onSubmit` runs.
   */
  onSave?: () => void
  /** Save button text (default "Save changes"). Name the outcome when it helps ("Apply limits", "Update plan"). */
  saveLabel?: React.ReactNode
  /** Cancel button text (default "Cancel"). */
  cancelLabel?: React.ReactNode
  /** Status shown on the left while `dirty` (default "Unsaved changes", with an amber dot). Pass `null` to hide it. */
  unsavedLabel?: React.ReactNode
  /** Appended to the unsaved status when `invalid` (default "fix the highlighted fields"). */
  invalidMessage?: React.ReactNode
  /** Neutral note shown on the left while pristine, from `sm` up ("Changes apply to new invoices only"). */
  hint?: React.ReactNode
  /** Extra content on the left, after the status (e.g. an "Also notify the team" checkbox). */
  children?: React.ReactNode
}

/**
 * Footer content for a {@link FormCard}: status / hint on the left, then Cancel and Save on the right.
 * Save stays disabled until the form is `dirty`; Cancel appears only with `onReset`.
 *
 * Use it as the card's `footer` for any editable form. Do NOT use it for single instant toggles
 * (save on change instead) or for destructive confirmations (use a confirm dialog).
 */
export function FormActions({
  dirty,
  saving = false,
  invalid = false,
  onReset,
  onSave,
  saveLabel = 'Save changes',
  cancelLabel = 'Cancel',
  unsavedLabel = 'Unsaved changes',
  invalidMessage = 'fix the highlighted fields',
  hint,
  children,
}: FormActionsProps) {
  const showUnsaved = dirty && unsavedLabel != null && unsavedLabel !== false
  const showHint = !dirty && hint
  return (
    <>
      {(showUnsaved || showHint || children) && (
        <div
          data-slot="form-actions-status"
          className="mr-auto flex min-w-0 items-center gap-2 text-[13px] text-foreground-light"
        >
          {showUnsaved && (
            <>
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-warning" />
              <span>
                {unsavedLabel}
                {invalid && <span className="text-destructive"> · {invalidMessage}</span>}
              </span>
            </>
          )}
          {showHint && <span className="hidden sm:inline">{hint}</span>}
          {children}
        </div>
      )}
      {onReset && (
        <Button type="button" variant="default" disabled={!dirty || saving} onClick={onReset}>
          {cancelLabel}
        </Button>
      )}
      <Button
        type={onSave ? 'button' : 'submit'}
        variant="primary"
        disabled={!dirty}
        loading={saving}
        onClick={onSave}
      >
        {saveLabel}
      </Button>
    </>
  )
}
