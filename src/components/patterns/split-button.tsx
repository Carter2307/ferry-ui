import * as React from 'react'
import { ChevronDown } from 'lucide-react'

import { cn } from '../../lib/utils'
import { Button, type ButtonProps } from '../primitives/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../primitives/dropdown-menu'

/**
 * Button styles a {@link SplitButton} supports: the bordered ones (`default`, `outline`, `destructive`,
 * `warning`) share one 1px seam; `primary` draws a translucent divider between its two halves.
 */
export type SplitButtonVariant = 'default' | 'primary' | 'outline' | 'destructive' | 'warning'

/** Heights a {@link SplitButton} supports (same scale as Button: 26, 30, 34 and 38px). */
export type SplitButtonSize = 'tiny' | 'sm' | 'md' | 'lg'

/** Square menu trigger: same height as the main button (same size variant), width matched to it. */
const triggerWidth: Record<SplitButtonSize, string> = {
  tiny: 'w-[26px]',
  sm: 'w-[30px]',
  md: 'w-[34px]',
  lg: 'w-[38px]',
}

/** Props forwarded to the main action button (`title`, `name`, `form`, `aria-describedby`, `data-*`…). */
export type SplitButtonActionProps = Omit<
  ButtonProps,
  'children' | 'onClick' | 'type' | 'variant' | 'size' | 'shape' | 'icon' | 'iconRight' | 'loading' | 'disabled' | 'asChild'
>

/** Props forwarded to the menu panel (DropdownMenuContent), minus its content. */
export type SplitButtonMenuProps = Omit<React.ComponentProps<typeof DropdownMenuContent>, 'children'>

/** Props of {@link SplitButton}. Other `div` props go to the root group. */
export interface SplitButtonProps extends Omit<React.ComponentProps<'div'>, 'children' | 'onClick'> {
  /** Label of the main action button. Name the action ("Publish", "Export CSV"). */
  children: React.ReactNode
  /** Runs the main action when the left button is clicked. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  /**
   * The menu opened by the chevron: DropdownMenuItem / Label / Separator / Group elements (run each
   * action in the item's `onSelect`). Keep it to alternatives of the main action.
   */
  menu: React.ReactNode
  /**
   * Accessible name of the icon-only chevron trigger. Default "More actions"; name the main action
   * ("More publish options") when several split buttons share a screen.
   */
  menuLabel?: string
  /** Button style of both halves. Default `default`. */
  variant?: SplitButtonVariant
  /** Height of both halves. Default `sm` (30px). */
  size?: SplitButtonSize
  /** Leading icon of the main button (replaced by a spinner while `loading`). */
  icon?: React.ReactNode
  /** The main action is in flight: spinner on the main button, both halves disabled (see `menuDisabled`). */
  loading?: boolean
  /** Disables the main button, and the menu trigger unless `menuDisabled` says otherwise. */
  disabled?: boolean
  /**
   * Disables the menu trigger on its own. Defaults to `disabled || loading`; pass `false` to keep the
   * menu reachable while the main action is disabled or running (e.g. its alternatives still apply).
   */
  menuDisabled?: boolean
  /** Native type of the main button. Default `button`; use `submit` to submit the enclosing form. */
  type?: 'button' | 'submit' | 'reset'
  /** Controlled open state of the menu. */
  open?: boolean
  /** Initial open state of the menu when uncontrolled. */
  defaultOpen?: boolean
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void
  /**
   * Props of the menu panel: `align` (default `end`, flush with the chevron), `side`, `className`
   * (set a width such as `w-60` for long items)…
   */
  menuProps?: SplitButtonMenuProps
  /** Extra props for the main button (`title`, `name`, `form`, `aria-describedby`, `className`…). */
  actionProps?: SplitButtonActionProps
}

/**
 * A main action button joined to a chevron that opens a menu of related alternatives
 * ("Publish" + Schedule / Save as draft, "Export CSV" + other formats). Both halves share the
 * variant and size; the menu opens under the chevron, right-aligned.
 *
 * Use it when one action is clearly the default and a few variants of it are occasionally needed.
 * Do NOT use it when the actions are equally important (render separate buttons), when the button
 * only opens a menu (use a Button with a trailing ChevronDown as a DropdownMenuTrigger), or for
 * unrelated actions (use a "more" icon menu). Put confirmations of destructive items in a
 * ConfirmDialog opened from the item's `onSelect`.
 */
export function SplitButton({
  children,
  onClick,
  menu,
  menuLabel = 'More actions',
  variant = 'default',
  size = 'sm',
  icon,
  loading = false,
  disabled = false,
  menuDisabled,
  type = 'button',
  open,
  defaultOpen,
  onOpenChange,
  menuProps,
  actionProps,
  className,
  ...props
}: SplitButtonProps) {
  // Solid buttons have a border the color of their fill: draw a translucent divider instead of a seam.
  const solid = variant === 'primary'
  const { align = 'end', ...contentProps } = menuProps ?? {}
  const { className: actionClassName, ...mainProps } = actionProps ?? {}

  return (
    <div
      data-slot="split-button"
      data-variant={variant}
      role="group"
      className={cn('isolate inline-flex shrink-0 items-center', className)}
      {...props}
    >
      <Button
        data-slot="split-button-action"
        {...mainProps}
        type={type}
        variant={variant}
        size={size}
        icon={icon}
        loading={loading}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'rounded-r-none focus-visible:z-10',
          // Bordered: raise the hovered half so its hover border shows on the shared seam.
          solid ? 'border-r-0' : 'hover:z-10',
          actionClassName,
        )}
      >
        {children}
      </Button>
      <DropdownMenu open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger asChild disabled={menuDisabled ?? (disabled || loading)}>
          <Button
            data-slot="split-button-trigger"
            variant={variant}
            size={size}
            icon={<ChevronDown aria-hidden="true" />}
            aria-label={menuLabel}
            className={cn(
              'rounded-l-none px-0 focus-visible:z-10 data-[state=open]:z-10',
              triggerWidth[size],
              solid ? 'border-l-primary-foreground/25' : '-ml-px hover:z-10',
            )}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align} {...contentProps}>
          {menu}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
