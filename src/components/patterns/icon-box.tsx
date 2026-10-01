import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../../lib/utils'

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/

/**
 * Size of an {@link IconBox} (box / icon):
 * - `xs` — 28px / 14px, rounded-md. Dense rows and compact choice cards.
 * - `sm` — 32px / 16px, rounded-md. List rows and strips.
 * - `md` — 36px / 18px, rounded-md (default). Choice cards, card headers.
 * - `lg` — 44px / 20px, rounded-lg, elevated by default. Next to a page or dialog title.
 * - `xl` — 56px (72px from `md` up) / 20px, rounded-lg, elevated by default. Overview tiles (`InfoTile`).
 */
export type IconBoxSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Colour of an {@link IconBox}:
 * - `neutral` (default) — outlined grey box, grey icon. The everyday look for entity / kind icons.
 * - `primary` — soft primary tint; the entity the page is about, or the selected / current item.
 * - `success`, `warning`, `destructive`, `info` — soft status tints (same vocabulary as `StatusTone`).
 */
export type IconBoxTone = 'neutral' | 'primary' | 'success' | 'warning' | 'destructive' | 'info'

const iconBoxBase = cva('flex shrink-0 items-center justify-center border', {
  variants: {
    size: {
      xs: 'size-7 rounded-md [&_svg]:size-3.5',
      sm: 'size-8 rounded-md [&_svg]:size-4',
      md: 'size-9 rounded-md [&_svg]:size-[18px]',
      lg: 'size-11 rounded-lg [&_svg]:size-5',
      xl: 'size-14 rounded-lg md:size-[72px] [&_svg]:size-5',
    },
    tone: {
      neutral: 'bg-surface-100',
      primary: 'border-primary/30 bg-primary-soft text-primary',
      success: 'border-success/30 bg-success-soft text-success',
      warning: 'border-warning-border bg-warning-soft text-warning',
      destructive: 'border-destructive-border bg-destructive-soft text-destructive',
      info: 'border-info-border bg-info-soft text-info',
    },
    elevated: {
      true: 'shadow-card',
      false: '',
    },
  },
  compoundVariants: [
    // Flat neutral boxes sit inline next to text: the icon stays subtle. Elevated ones head a page
    // or a tile: the icon reads one step stronger.
    { tone: 'neutral', elevated: false, className: 'text-foreground-lighter' },
    { tone: 'neutral', elevated: true, className: 'text-foreground-light' },
  ],
  defaultVariants: { size: 'md', tone: 'neutral', elevated: false },
})

/** Variant props accepted by {@link iconBoxVariants} (`size`, `tone`, `elevated`). */
export type IconBoxVariantProps = VariantProps<typeof iconBoxBase>

/**
 * Class generator behind {@link IconBox}. Use it when you cannot render `IconBox` itself: a
 * third-party component that only takes a `className`, or a `<div>` where block content is required.
 * Mark the element `aria-hidden` when it is decorative, as `IconBox` does.
 *
 * Variants:
 * - `size` — an {@link IconBoxSize}. Defaults to `md`.
 * - `tone` — an {@link IconBoxTone}. Defaults to `neutral`.
 * - `elevated` — adds the card shadow (and a stronger neutral icon). Defaults to `true` for `lg` and
 *   `xl`, `false` otherwise.
 *
 * Merge the result with your own classes through `cn(iconBoxVariants({ size: 'sm' }), className)` so
 * overrides (`[&_svg]:size-4`) win.
 */
export function iconBoxVariants({ size = 'md', tone, elevated }: IconBoxVariantProps = {}): string {
  return iconBoxBase({ size, tone, elevated: elevated ?? (size === 'lg' || size === 'xl') })
}

/* -------------------------------------------------------------------------------------------------
 * IconBox
 * -----------------------------------------------------------------------------------------------*/

/** Props of {@link IconBox}. Extra `<span>` props (`id`, `title`, `data-*`, a custom `data-slot`) go to the root. */
export interface IconBoxProps extends React.ComponentProps<'span'> {
  /** Box and icon size, see {@link IconBoxSize}. Defaults to `md` (36px box, 18px icon). */
  size?: IconBoxSize
  /** Colour, see {@link IconBoxTone}. Defaults to `neutral`. */
  tone?: IconBoxTone
  /**
   * Adds the subtle card shadow (and, for `neutral`, a one-step stronger icon colour). Defaults to
   * `true` for `lg` and `xl` (headline icons), `false` for the inline sizes.
   */
  elevated?: boolean
  /**
   * Accessible name ("Invoice", "API key"). Without it the box is decorative (`aria-hidden`), which
   * is right when a visible name sits next to it. Set it when the icon is the only cue of what it stands for.
   */
  label?: string
  /**
   * The icon: a lucide icon or any `<svg>`, sized automatically for the box. To force another icon
   * size, pass `className="[&_svg]:size-4"` on the box (a class on the `<svg>` itself is overridden).
   */
  children?: React.ReactNode
}

/**
 * Outlined square holding one line icon: the "kind" mark in front of a name in list rows, cards,
 * page titles and overview tiles.
 *
 * Pick the `size` from where it sits (`xs`/`sm` in dense rows, `md` in cards, `lg` next to a page
 * title, `xl` in overview tiles) and keep the `neutral` tone unless the box itself carries meaning
 * (`primary` for the current / selected item, a status tone for a state). Do NOT use it for people
 * or organisations (use `Avatar`), for status alone (use `StatusDot` / `StatusBadge`), nor as a
 * button (use an `icon` `Button`).
 */
export function IconBox({ size = 'md', tone = 'neutral', elevated, label, className, children, ...props }: IconBoxProps) {
  return (
    <span
      data-slot="icon-box"
      data-size={size}
      data-tone={tone}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(iconBoxVariants({ size, tone, elevated }), className)}
      {...props}
    >
      {children}
    </span>
  )
}
