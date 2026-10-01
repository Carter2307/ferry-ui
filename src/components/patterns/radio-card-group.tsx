import * as React from 'react'
import { Check } from 'lucide-react'
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui'

import { cn } from '../../lib/utils'

import { IconBox } from './icon-box'

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

/** Card size. `lg`: 16px padding and a 36px icon box (main choice of a page). `sm`: compact cards (a choice inside a form). */
export type RadioCardSize = 'sm' | 'lg'

/**
 * Selected look. `outline`: white card, selected card outlined in primary (pairs with the `check`
 * indicator). `soft`: stronger border, selected card filled with a soft primary tint (pairs with the
 * `radio` indicator); reads better inside an already-carded form.
 */
export type RadioCardAppearance = 'outline' | 'soft'

/**
 * Selection mark. `check`: round check badge in the top-right corner. `radio`: radio dot at the end
 * of the row. `none`: only the border / fill shows the selection.
 */
export type RadioCardIndicator = 'check' | 'radio' | 'none'

/** One option of the {@link RadioCardGroup} `options` shortcut. */
export interface RadioCardOption<T extends string = string> {
  /** Value reported to `onValueChange` when this card is selected. Must be unique in the group. */
  value: T
  /** Card title (14px medium). Also the accessible name of the radio. */
  label: React.ReactNode
  /** One or two lines under the title explaining the consequence of the choice. Also the radio's description. */
  description?: React.ReactNode
  /** Line icon shown in a bordered box at the start of the card (sized automatically). Decorative. */
  icon?: React.ReactNode
  /** Makes this option unselectable (dimmed, `not-allowed` cursor). */
  disabled?: boolean
}

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/

interface RadioCardContextValue {
  size: RadioCardSize
  appearance: RadioCardAppearance
  indicator: RadioCardIndicator
  /** Mirrors the group's `aria-invalid`: cards paint the destructive border. */
  invalid: boolean
}

const RadioCardContext = React.createContext<RadioCardContextValue>({
  size: 'lg',
  appearance: 'outline',
  indicator: 'check',
  invalid: false,
})

function joinIds(...ids: (string | undefined)[]) {
  return ids.filter(Boolean).join(' ') || undefined
}

/* -------------------------------------------------------------------------------------------------
 * RadioCardGroup
 * -----------------------------------------------------------------------------------------------*/

type RootProps = React.ComponentProps<typeof RadioGroupPrimitive.Root>

/** Props of {@link RadioCardGroup}. Other Radix RadioGroup root props (`name`, `required`, `loop`, `dir`…) pass through. */
export interface RadioCardGroupProps<T extends string = string>
  extends Omit<RootProps, 'value' | 'defaultValue' | 'onValueChange'> {
  /**
   * Selected value (controlled). Pair it with `onValueChange`. Pass `null` (not `undefined`) for a
   * controlled group with nothing selected yet, or to clear the selection; `undefined` makes the group
   * uncontrolled.
   */
  value?: T | null
  /** Initially selected value when uncontrolled. Omit both `value` and `defaultValue` to start with nothing selected. */
  defaultValue?: T
  /** Called with the newly selected value (click, Space, or arrow keys). */
  onValueChange?: (value: T) => void
  /**
   * Shortcut: the cards as data. Rendered before any `children`. Use `<RadioCard>` children instead
   * when a card needs extra content (a price, a badge) or a `media` preview.
   */
  options?: readonly RadioCardOption<T>[]
  /** Card size, see {@link RadioCardSize}. Defaults to `lg`. */
  size?: RadioCardSize
  /** Selected look, see {@link RadioCardAppearance}. Defaults to `outline`. */
  appearance?: RadioCardAppearance
  /** Selection mark, see {@link RadioCardIndicator}. Defaults to `check` for `outline` and `radio` for `soft`. */
  indicator?: RadioCardIndicator
  /**
   * Number of columns from the `sm` breakpoint up (always one column on phones). Defaults to 1.
   * For other layouts (e.g. `sm:grid-cols-2 lg:grid-cols-3`), leave it unset and pass grid classes in `className`.
   */
  columns?: 1 | 2 | 3
  /** Disables every card. */
  disabled?: boolean
  /** Accessible name of the group when no visible label exists. Prefer `aria-labelledby` pointing at a visible label. */
  'aria-label'?: string
  /** Id of the visible element naming the group (a field label rendered as a `<span>`, a section heading). */
  'aria-labelledby'?: string
  /**
   * Marks the choice as invalid (e.g. `required` and nothing selected after submit): the unselected
   * cards get the destructive border. `Field` sets it for you when it shows an `error`; pair it with a
   * visible error message linked through `aria-describedby`.
   */
  'aria-invalid'?: React.AriaAttributes['aria-invalid']
}

const columnsClass: Record<1 | 2 | 3, string> = {
  1: '',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
}

/**
 * Radio cards: a single-choice group whose options are large selectable cards (icon box, title,
 * description, selected border and a check or radio mark). Built on Radix RadioGroup, so arrow
 * keys move and select, Tab enters and leaves the group, and `name` / `required` join native forms.
 * Controlled (`value` + `onValueChange`, `null` for no selection) or uncontrolled (`defaultValue`).
 * Pass the cards as `options` data, or as {@link RadioCard} children. Wrap it in `Field` with
 * `labelAs="span"` to get a visible label, a hint and an error (`aria-invalid` paints the cards red).
 *
 * Use it for 2–6 mutually exclusive choices that each need a description or an icon to be understood
 * (a plan, a project type, a visibility, a data source, a layout with `media` previews).
 * Do NOT use it for long lists (use `Select`), an on/off setting (`Switch`), several selections
 * (`Checkbox`), bare options without explanation (`RadioGroup`) or compact toolbar view toggles
 * (`ToggleGroup`).
 */
export function RadioCardGroup<T extends string = string>({
  value,
  defaultValue,
  onValueChange,
  options,
  size = 'lg',
  appearance = 'outline',
  indicator,
  columns,
  className,
  children,
  ...props
}: RadioCardGroupProps<T>) {
  const ariaInvalid = props['aria-invalid']
  const invalid = ariaInvalid === true || ariaInvalid === 'true'
  const context = React.useMemo<RadioCardContextValue>(
    () => ({ size, appearance, indicator: indicator ?? (appearance === 'soft' ? 'radio' : 'check'), invalid }),
    [size, appearance, indicator, invalid],
  )
  return (
    <RadioCardContext.Provider value={context}>
      <RadioGroupPrimitive.Root
        data-slot="radio-card-group"
        data-size={size}
        data-appearance={appearance}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange ? (v) => onValueChange(v as T) : undefined}
        className={cn(
          'grid',
          appearance === 'soft' && size === 'sm' ? 'gap-2' : 'gap-3',
          columns ? columnsClass[columns] : '',
          className,
        )}
        {...props}
      >
        {options?.map((option) => (
          <RadioCard
            key={option.value}
            value={option.value}
            label={option.label}
            description={option.description}
            icon={option.icon}
            disabled={option.disabled}
          />
        ))}
        {children}
      </RadioGroupPrimitive.Root>
    </RadioCardContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * RadioCard
 * -----------------------------------------------------------------------------------------------*/

/**
 * Props of {@link RadioCard}. Other Radix RadioGroup item props (`id`, `disabled`, `aria-*`…) pass
 * through to the `<button role="radio">`.
 */
export interface RadioCardProps extends Omit<React.ComponentProps<typeof RadioGroupPrimitive.Item>, 'children'> {
  /** Value reported to the group's `onValueChange` when this card is selected. */
  value: string
  /** Card title. Also the accessible name of the radio (via `aria-labelledby`). */
  label: React.ReactNode
  /** Text under the title. Also the radio's accessible description (via `aria-describedby`). */
  description?: React.ReactNode
  /** Line icon shown in a bordered box at the start of the card (sized automatically). Ignored with `media`. Decorative. */
  icon?: React.ReactNode
  /**
   * Visual preview (a mini screenshot, an illustration) shown full-width above the label instead of
   * the card layout: the preview frame gets the selected ring and the label sits beneath with the
   * group's indicator. Use it for appearance / layout pickers. Decorative: the label names the option.
   */
  media?: React.ReactNode
  /**
   * Extra non-interactive content under the description (a price, a `Badge`). Never put buttons or
   * links here: the whole card is already a button.
   */
  children?: React.ReactNode
  /** Makes this card unselectable (dimmed, `not-allowed` cursor). The group's `disabled` disables every card. */
  disabled?: boolean
  /** Ids of extra describing elements (e.g. a note outside the card). Merged after the card's own `description`. */
  'aria-describedby'?: string
}

/**
 * One selectable card of a {@link RadioCardGroup} (a Radix RadioGroup item). Size, appearance and
 * indicator come from the group. Must be rendered inside a `RadioCardGroup`.
 *
 * Use it instead of the `options` shortcut when a card needs extra content (`children`) or a
 * `media` preview. Do NOT nest interactive elements in it.
 */
export function RadioCard({
  value,
  label,
  description,
  icon,
  media,
  className,
  children,
  'aria-describedby': ariaDescribedBy,
  ...props
}: RadioCardProps) {
  const { size, appearance, indicator, invalid } = React.useContext(RadioCardContext)
  const id = React.useId()
  const titleId = `${id}-title`
  const descriptionId = description ? `${id}-description` : undefined
  const describedBy = joinIds(descriptionId, ariaDescribedBy)

  if (media !== undefined) {
    return (
      <RadioGroupPrimitive.Item
        data-slot="radio-card"
        data-layout="media"
        value={value}
        aria-labelledby={titleId}
        aria-describedby={describedBy}
        className={cn(
          'group flex cursor-pointer flex-col gap-2 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60',
          className,
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            'overflow-hidden rounded-md border border-border-strong transition-[border-color,box-shadow] group-hover:border-border-stronger group-data-[state=checked]:border-primary-bright group-data-[state=checked]:ring-2 group-data-[state=checked]:ring-ring',
            invalid && 'border-destructive group-hover:border-destructive',
          )}
        >
          {media}
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="flex items-center gap-2 text-[13px] text-foreground-light group-data-[state=checked]:font-medium group-data-[state=checked]:text-foreground">
            {indicator !== 'none' && (
              <span
                aria-hidden="true"
                className="flex size-3.5 shrink-0 items-center justify-center rounded-full border border-border-stronger group-data-[state=checked]:border-primary-solid-border group-data-[state=checked]:bg-primary-solid"
              >
                {indicator === 'check' ? (
                  <Check
                    className="size-2 text-primary-foreground opacity-0 group-data-[state=checked]:opacity-100"
                    strokeWidth={4}
                  />
                ) : (
                  <span className="size-1.5 rounded-full bg-primary-foreground opacity-0 group-data-[state=checked]:opacity-100" />
                )}
              </span>
            )}
            <span id={titleId}>{label}</span>
          </span>
          {description && (
            <span id={descriptionId} className="text-[12.5px] leading-snug text-foreground-lighter">
              {description}
            </span>
          )}
          {children}
        </span>
      </RadioGroupPrimitive.Item>
    )
  }

  const soft = appearance === 'soft'
  const compactSoft = soft && size === 'sm'
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-card"
      value={value}
      aria-labelledby={titleId}
      aria-describedby={describedBy}
      className={cn(
        'group relative flex cursor-pointer items-start gap-3 rounded-lg border bg-surface-100 text-left transition-[border-color,background-color,box-shadow] outline-none',
        'hover:border-border-stronger focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60',
        soft
          ? 'border-border-strong dark:bg-surface-200 data-[state=checked]:border-primary-bright/70 data-[state=checked]:bg-primary-soft/60 data-[state=checked]:ring-1 data-[state=checked]:ring-primary-bright/40'
          : 'shadow-card data-[state=checked]:border-primary data-[state=checked]:ring-1 data-[state=checked]:ring-primary/40',
        size === 'lg' ? 'p-4' : compactSoft ? 'p-3' : 'px-3.5 py-3',
        invalid && 'border-destructive hover:border-destructive',
        className,
      )}
      {...props}
    >
      {icon && (
        <IconBox
          size={size === 'lg' ? 'md' : 'xs'}
          data-slot="radio-card-icon"
          className={cn(
            'transition-colors group-data-[state=checked]:border-primary/40 group-data-[state=checked]:text-primary',
            !soft && 'dark:bg-surface-200',
            compactSoft ? 'mt-0.5' : size === 'sm' && '[&_svg]:size-4',
          )}
        >
          {icon}
        </IconBox>
      )}
      <span className={cn('flex min-w-0 flex-1 flex-col gap-0.5', indicator === 'check' && 'pr-5')}>
        <span id={titleId} className={cn('font-medium text-foreground', compactSoft ? 'text-[13px]' : 'text-sm')}>
          {label}
        </span>
        {description && (
          <span
            id={descriptionId}
            className={cn(
              'leading-snug text-foreground-light',
              size === 'lg' ? 'text-[13px]' : compactSoft ? 'text-[12px]' : 'text-[12.5px]',
            )}
          >
            {description}
          </span>
        )}
        {children}
      </span>
      {indicator === 'check' && (
        <span
          aria-hidden="true"
          className="absolute top-3 right-3 flex size-4 items-center justify-center rounded-full border border-border-stronger transition-colors group-data-[state=checked]:border-primary-solid-border group-data-[state=checked]:bg-primary-solid"
        >
          <Check
            className="size-2.5 text-primary-foreground opacity-0 group-data-[state=checked]:opacity-100"
            strokeWidth={3.5}
          />
        </span>
      )}
      {indicator === 'radio' && (
        <span
          aria-hidden="true"
          className="ml-auto flex size-4 shrink-0 items-center justify-center rounded-full border border-border-stronger transition-colors group-data-[state=checked]:border-primary-bright group-data-[state=checked]:bg-primary-solid"
        >
          <span className="size-1.5 rounded-full bg-primary-foreground opacity-0 group-data-[state=checked]:opacity-100" />
        </span>
      )}
    </RadioGroupPrimitive.Item>
  )
}
