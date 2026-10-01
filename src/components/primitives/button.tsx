import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { Slot } from 'radix-ui'

import { cn } from "../../lib/utils"

/** Outlined red ink (`destructive`, and its deprecated alias `danger`). */
const destructiveClasses =
  'border-destructive-border bg-destructive-soft text-destructive hover:border-destructive hover:bg-destructive/10'

/** Solid red (`destructive-solid`, and its deprecated alias `danger-solid`). */
const destructiveSolidClasses =
  'border-destructive-solid bg-destructive-solid text-white hover:brightness-110 focus-visible:ring-destructive/80'

/**
 * Class generator behind {@link Button}. Use it to give a non-`button` element (or a
 * third-party component) the exact button look; prefer `<Button asChild>` when you can.
 *
 * Variants:
 * - `variant` — `default`, `primary`, `outline`, `ghost`, `destructive`, `destructive-solid`,
 *   `warning`, `link`, `dashed` (`danger` / `danger-solid` are deprecated aliases of the two
 *   destructive variants).
 * - `size` — `tiny` (26px), `sm` (30px, default), `md` (34px), `lg` (38px) and the square
 *   `icon-tiny`, `icon`, `icon-md`, `icon-lg` of the same heights.
 * - `shape` — `default` (6px radius) or `pill` (fully rounded: top-bar actions, search triggers).
 */
const buttonVariants = cva(
  [
    'relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md border font-medium whitespace-nowrap select-none',
    'transition-[color,background-color,border-color,box-shadow,opacity] duration-150 outline-none',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
    'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        /** Outlined neutral button on surface-100. */
        default:
          'border-border-strong bg-surface-100 text-foreground hover:border-border-stronger hover:bg-surface-200 data-[state=open]:bg-surface-200',
        /** Solid primary color — the main action of a view (one per view). */
        primary:
          'border-primary-solid-border bg-primary-solid text-primary-foreground hover:brightness-110 dark:hover:brightness-115 disabled:opacity-45',
        /** Transparent with a border (secondary actions on tinted surfaces). */
        outline:
          'border-border-strong bg-transparent text-foreground hover:border-border-stronger hover:bg-surface-200 data-[state=open]:bg-surface-200',
        /** Borderless, subtle hover. */
        ghost:
          'border-transparent bg-transparent text-foreground-light hover:bg-surface-200 hover:text-foreground data-[state=open]:bg-surface-200',
        /** Outlined red ink — the button that starts a destructive action. */
        destructive: destructiveClasses,
        /** Solid red — confirm buttons of destructive dialogs. */
        'destructive-solid': destructiveSolidClasses,
        /** @deprecated Alias of `destructive`. */
        danger: destructiveClasses,
        /** @deprecated Alias of `destructive-solid`. */
        'danger-solid': destructiveSolidClasses,
        /** Amber outlined. */
        warning:
          'border-warning-border bg-warning-soft text-warning hover:border-warning hover:brightness-105',
        /** Text link look. */
        link: 'h-auto border-transparent bg-transparent px-0 text-primary underline-offset-4 hover:underline',
        /** Dashed border (filter buttons in toolbars). */
        dashed:
          'border-dashed border-border-stronger bg-transparent text-foreground-light hover:border-foreground-muted hover:text-foreground data-[state=open]:bg-surface-200',
      },
      size: {
        tiny: 'h-[26px] gap-1 px-2 text-xs [&_svg:not([class*=size-])]:size-3.5',
        sm: 'h-[30px] px-2.5 text-[13px] [&_svg:not([class*=size-])]:size-4',
        md: 'h-[34px] px-3 text-sm [&_svg:not([class*=size-])]:size-4',
        lg: 'h-[38px] px-4 text-sm [&_svg:not([class*=size-])]:size-4',
        'icon-tiny': 'size-[26px] px-0 [&_svg:not([class*=size-])]:size-3.5',
        icon: 'size-[30px] px-0 [&_svg:not([class*=size-])]:size-4',
        'icon-md': 'size-[34px] px-0 [&_svg:not([class*=size-])]:size-4',
        'icon-lg': 'size-[38px] px-0 [&_svg:not([class*=size-])]:size-4',
      },
      shape: {
        default: '',
        pill: 'rounded-full',
      },
    },
    compoundVariants: [{ variant: 'link', className: 'h-auto px-0' }],
    defaultVariants: { variant: 'default', size: 'sm', shape: 'default' },
  },
)

type ButtonVariantProps = VariantProps<typeof buttonVariants>

/** Deprecated variant names and the variant they stand for (reported in `data-variant`). */
const variantAliases: Partial<Record<NonNullable<ButtonVariantProps['variant']>, string>> = {
  danger: 'destructive',
  'danger-solid': 'destructive-solid',
}

/** Props for {@link Button}: every `<button>` prop plus the {@link buttonVariants} options. */
type ButtonProps = React.ComponentProps<'button'> & {
  /**
   * Look. `default` (outlined neutral, the default), `primary` (solid: the one main action of a
   * view), `outline` (transparent with a border, on tinted surfaces), `ghost` (borderless, dense
   * rows and toolbars), `destructive` (red outline: starts a destructive action),
   * `destructive-solid` (solid red: the confirm button of a destructive dialog only), `warning`
   * (amber outline), `link` (text link look), `dashed` (filter buttons).
   *
   * `danger` and `danger-solid` are deprecated aliases of `destructive` and `destructive-solid`.
   */
  variant?: ButtonVariantProps['variant']
  /**
   * Height. `tiny` 26px (dense inline actions), `sm` 30px (default: toolbars, table rows), `md`
   * 34px (next to form fields), `lg` 38px. Square, icon-only sizes of the same heights:
   * `icon-tiny` 26px, `icon` 30px, `icon-md` 34px, `icon-lg` 38px (they need an `aria-label`).
   */
  size?: ButtonVariantProps['size']
  /** Corners: `default` (6px radius) or `pill` (fully rounded: top-bar actions, search triggers). */
  shape?: ButtonVariantProps['shape']
  /**
   * Style the single child element (usually an `<a>` or a router link) as the button instead of
   * rendering a `<button>`. `icon` / `iconRight` are rendered inside the child. A link has no
   * native disabled state, so `disabled` and `loading` map to ARIA on the child: `aria-disabled`
   * (dimmed, pointer events off), `tabIndex={-1}` and, for `loading`, `aria-busy` plus the
   * spinner. `type` is ignored.
   */
  asChild?: boolean
  /**
   * Shows a spinner in place of `icon`, disables the button and sets `aria-busy`. Use it while
   * the action triggered by this button is in flight.
   */
  loading?: boolean
  /** Leading icon (rendered before children). Pass a bare lucide icon: it is sized for you. */
  icon?: React.ReactNode
  /** Trailing icon (rendered after children). Pass a bare lucide icon: it is sized for you. */
  iconRight?: React.ReactNode
}

/**
 * Compact action button: medium weight, 6px radius, 1px control border.
 *
 * Use `primary` for the single main action of a view, `default` for everything else,
 * `destructive` for an action that deletes or revokes (confirmed by a dialog whose confirm
 * button is `destructive-solid`). Pass icons through `icon` / `iconRight`; icon-only buttons
 * use an `icon*` size and need an `aria-label`. `type` defaults to `button`: set
 * `type="submit"` on the submit button of a form.
 *
 * Do NOT use it for navigation that should look like text (use a link, or `variant="link"`
 * with `asChild`), for on/off state (use `Toggle` or `Switch`) or for a static label (use
 * `Badge`).
 */
function Button({
  className,
  variant,
  size,
  shape,
  asChild = false,
  loading = false,
  icon,
  iconRight,
  disabled,
  children,
  type,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, shape }), className)
  const dataVariant = (variant ? variantAliases[variant] : undefined) ?? variant ?? 'default'
  const leading = loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : icon
  if (asChild) {
    // The child is usually a link, which has no `disabled` attribute: express the state with ARIA.
    const inert = disabled || loading
    const slotProps = {
      'data-slot': 'button',
      'data-variant': dataVariant,
      'aria-disabled': inert || undefined,
      'aria-busy': loading || undefined,
      tabIndex: inert ? -1 : undefined,
      className: classes,
    }
    if (!leading && !iconRight) {
      return (
        <Slot.Root {...slotProps} {...props}>
          {children}
        </Slot.Root>
      )
    }
    // Slottable lets the icons render inside the child element (e.g. an <a>).
    return (
      <Slot.Root {...slotProps} {...props}>
        {leading}
        <Slot.Slottable>{children}</Slot.Slottable>
        {iconRight}
      </Slot.Root>
    )
  }
  return (
    <button
      data-slot="button"
      data-variant={dataVariant}
      type={type ?? 'button'}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {leading}
      {children}
      {iconRight}
    </button>
  )
}

export { Button, buttonVariants, type ButtonProps }
