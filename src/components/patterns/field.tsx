import * as React from 'react'

import { cn } from '../../lib/utils'
import { Label } from '../primitives/label'

/**
 * Accessibility props a {@link Field} gives its control. Spread them onto the focusable element
 * (`<SelectTrigger {...control}>`, `<Input {...control}>`) when you use the render-function form.
 */
export interface FieldControlProps {
  /** Id of the control: the label's `for` target. The hint and error ids are derived from it. */
  id: string
  /** `true` while the field shows an `error`, so the control paints its error border. */
  'aria-invalid'?: true
  /** Space-separated ids of the visible hint and/or error lines (`<id>-hint`, `<id>-error`). */
  'aria-describedby'?: string
  /** The label's id (`<id>-label`), set only with `labelAs="span"` (groups that need `aria-labelledby`). */
  'aria-labelledby'?: string
}

/** Extra context passed as the second argument of a {@link Field} render function. */
export interface FieldRenderMeta {
  /** Id of the label element (`<id>-label`), for `aria-labelledby` on custom widgets. */
  labelId: string
}

/** Props of {@link Field}. Extra `<div>` props go to the root element. */
export interface FieldProps extends Omit<React.ComponentProps<'div'>, 'children' | 'id'> {
  /** Field name shown above the control. Keep it short (1–4 words); put guidance in `hint`. */
  label: React.ReactNode
  /**
   * Id of the control. Defaults to the child control's own `id`, else a generated one. The label
   * gets `<id>-label`, the hint `<id>-hint` and the error `<id>-error`.
   */
  id?: string
  /** Help text under the control (format rules, what the value is used for). */
  hint?: React.ReactNode
  /**
   * Validation message under the control, rendered as `<p role="alert">`. While set, the control
   * gets `aria-invalid` and its `aria-describedby` points at the error line.
   */
  error?: React.ReactNode
  /**
   * Appends a muted marker to the label: `true` shows "(optional)", a string or node replaces that
   * text (e.g. `"(facultatif)"` in a French UI). Use it when most fields of the form are required;
   * do not mark every field of a mostly optional form.
   */
  optional?: boolean | React.ReactNode
  /**
   * `true` (default): the error takes the hint's place while shown, so the field keeps its height.
   * `false`: both lines stay visible (hint first) and `aria-describedby` lists both; use it when the
   * hint remains useful to fix the error (syntax help, allowed range).
   */
  errorReplacesHint?: boolean
  /**
   * Type scale. `md` (default, page and auth forms): 14px label, 13px hint/error, 8px gaps.
   * `sm` (dialogs, popovers, dense multi-column forms): 13px label, 12.5px hint/error, 6px gaps.
   */
  size?: 'sm' | 'md'
  /**
   * Label style. `default`: medium weight, full foreground. `subtle`: normal weight, lighter color, for
   * sign-in forms and secondary inputs (a confirmation box). `mono`: the small UPPERCASE monospace
   * caption (with a 12px hint), for read-only values in popovers and panels; pair it with `size="sm"`.
   * Do not use `mono` for editable form fields: it reads as a caption, not a prompt.
   */
  labelVariant?: 'default' | 'subtle' | 'mono'
  /**
   * Label element. `label` (default) is tied to the control with `for`, so clicking it focuses the
   * control. Use `span` when there is no single focus target (a radio group, toggle group, card
   * picker, or a read-only block such as a code snippet): the span gets the id `<id>-label` and the
   * control receives `aria-labelledby`.
   */
  labelAs?: 'label' | 'span'
  /**
   * The control. Either a single element (Input, Textarea, RadioGroup…): Field injects `id`,
   * `aria-invalid` and `aria-describedby` into it, merging any `aria-describedby` already set on it.
   * Or a render function `(control, { labelId }) => node` for composite controls: spread `control`
   * onto the focusable element (a `SelectTrigger`, the input of an input + button row).
   */
  children: React.ReactElement | ((control: FieldControlProps, meta: FieldRenderMeta) => React.ReactNode)
}

const rootClasses = { sm: 'gap-1.5', md: 'gap-2' } as const

const labelClasses = {
  default: { sm: 'text-[13px] font-medium text-foreground', md: 'text-sm font-medium text-foreground' },
  subtle: { sm: 'text-[13px] font-normal text-foreground-light', md: 'text-sm font-normal text-foreground-light' },
  // The explicit size and color let tailwind-merge drop the Label primitive's own ones; `mono-label`
  // sets the same values.
  mono: { sm: 'mono-label text-[11.5px] font-normal text-foreground-lighter', md: 'mono-label text-[11.5px] font-normal text-foreground-lighter' },
} as const

const messageSize = { sm: 'text-[12.5px]', md: 'text-[13px]', mono: 'text-[12px]' } as const
const hintColor = { sm: 'text-foreground-lighter', md: 'text-foreground-light', mono: 'text-foreground-lighter' } as const

type ControlElementProps = {
  id?: string
  'aria-describedby'?: string
  'aria-labelledby'?: string
}

function isShown(node: React.ReactNode) {
  return node !== undefined && node !== null && node !== false && node !== ''
}

function joinIds(...ids: (string | false | undefined)[]) {
  return ids.filter(Boolean).join(' ') || undefined
}

/**
 * Stacked form field: label on top, then the control, then a hint or an error line, with the
 * `id`, `for`, `aria-invalid` and `aria-describedby` wiring done for you.
 *
 * Use it for stacked fields in dialogs (`size="sm"`), popovers, sign-in and other standalone forms.
 * Pass one control element as the child, or a render function for composite controls (Select,
 * input + button rows, custom widgets). Do NOT use it for label-left / control-right rows inside a
 * settings card (use `FormRow`), nor for a checkbox or switch with an inline label (use `Label`
 * directly).
 *
 * @example
 * <Field label="Email" hint="We send the invite here." error={emailError}>
 *   <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
 * </Field>
 */
export function Field({
  label,
  id: idProp,
  hint,
  error,
  optional = false,
  errorReplacesHint = true,
  size = 'md',
  labelVariant = 'default',
  labelAs = 'label',
  className,
  children,
  ...props
}: FieldProps) {
  const generatedId = React.useId()
  const child = typeof children === 'function' ? null : React.isValidElement<ControlElementProps>(children) ? children : null
  const id = idProp ?? child?.props.id ?? generatedId
  const labelId = `${id}-label`
  const hintId = `${id}-hint`
  const errorId = `${id}-error`

  const hasError = isShown(error)
  const showHint = isShown(hint) && (!hasError || !errorReplacesHint)
  const messageKey = labelVariant === 'mono' ? 'mono' : size

  const control: FieldControlProps = {
    id,
    'aria-invalid': hasError ? true : undefined,
    'aria-describedby': joinIds(showHint && hintId, hasError && errorId),
    'aria-labelledby': labelAs === 'span' ? labelId : undefined,
  }

  let content: React.ReactNode
  if (typeof children === 'function') {
    content = children(control, { labelId })
  } else if (child) {
    // cloneElement (not Slot) so Field's ids win over the child's and existing ids are merged, not replaced.
    content = React.cloneElement(child, {
      id,
      'aria-describedby': joinIds(control['aria-describedby'], child.props['aria-describedby']),
      ...(labelAs === 'span' && { 'aria-labelledby': joinIds(labelId, child.props['aria-labelledby']) }),
      ...(hasError && { 'aria-invalid': true }),
    } as ControlElementProps)
  } else {
    content = children
  }

  const labelContent = (
    <>
      {label}
      {isShown(optional) && (
        <span data-slot="field-optional" className="font-normal text-foreground-lighter">
          {' '}
          {optional === true ? '(optional)' : optional}
        </span>
      )}
    </>
  )
  // `block` replaces the primitive's flex row so inline markers keep their natural spacing.
  const labelClassName = cn('block', labelClasses[labelVariant][size])

  return (
    <div
      data-slot="field"
      data-invalid={hasError || undefined}
      className={cn('flex flex-col', rootClasses[size], className)}
      {...props}
    >
      {labelAs === 'span' ? (
        <Label asChild data-slot="field-label" className={labelClassName}>
          <span id={labelId}>{labelContent}</span>
        </Label>
      ) : (
        <Label data-slot="field-label" id={labelId} htmlFor={id} className={labelClassName}>
          {labelContent}
        </Label>
      )}
      {content}
      {showHint && (
        <p id={hintId} data-slot="field-hint" className={cn(messageSize[messageKey], hintColor[messageKey])}>
          {hint}
        </p>
      )}
      {hasError && (
        <p id={errorId} role="alert" data-slot="field-error" className={cn(messageSize[messageKey], 'text-destructive')}>
          {error}
        </p>
      )}
    </div>
  )
}
