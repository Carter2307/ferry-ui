import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Tabs as TabsPrimitive } from 'radix-ui'

import { cn } from '../../lib/utils'

/**
 * Switches between sibling panels of content inside one view (Overview /
 * Activity / Settings of a record, Preview / Code of a snippet). Pair it with
 * `TabsList` > `TabsTrigger` and one `TabsContent` per value.
 *
 * Control it with `value` + `onValueChange` (e.g. to sync with the URL) or
 * leave it uncontrolled with `defaultValue`. The styled list variants are
 * designed for the default horizontal orientation.
 *
 * Not for navigating between pages/routes (render links in your nav instead),
 * or for a compact choice that filters or reformats the same content (use
 * `ToggleGroup type="single"`).
 */
function Tabs({ className, orientation = 'horizontal', ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn('group/tabs flex gap-4 data-[orientation=horizontal]:flex-col', className)}
      {...props}
    />
  )
}

/**
 * Class recipe for `TabsList`.
 *
 * - `underline` (default): page-level tabs. Text triggers sit on a full-width
 *   bottom hairline and the active one gets a 1px foreground underline;
 *   overflowing triggers scroll horizontally with a hidden scrollbar. The
 *   hairline is an inset shadow, not a border: the list scrolls, so anything
 *   drawn outside its padding box (an underline over a border, an outer focus
 *   ring) would be clipped.
 * - `pills`: compact segmented control on a `surface-200` track; the active
 *   trigger is a raised `surface-100` chip. Use it inside cards, panels and
 *   toolbars where a full-width border would be too heavy.
 */
const tabsListVariants = cva('group/tabs-list inline-flex items-center text-foreground-lighter', {
  variants: {
    variant: {
      underline: 'h-10 w-full justify-start gap-5 overflow-x-auto shadow-[inset_0_-1px_0_0_var(--border)] scrollbar-none',
      pills: 'h-[30px] w-fit gap-0.5 rounded-md border bg-surface-200 p-0.5',
    },
  },
  defaultVariants: { variant: 'underline' },
})

/** Props of {@link TabsList}: the Radix list props (`loop`, `asChild`…) plus `variant`. */
type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List> & {
  /** `underline` = page tabs on a bottom border (default); `pills` = compact segmented control. */
  variant?: VariantProps<typeof tabsListVariants>['variant']
}

/**
 * The row of `TabsTrigger`s. Pick the look with `variant`; the triggers adapt
 * to it automatically. Give it an `aria-label` when no visible heading names
 * the tab set.
 */
function TabsList({
  className,
  variant = 'underline',
  ...props
}: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

/**
 * One tab button; its `value` matches a `TabsContent`. Accepts an icon and/or
 * a trailing count badge as children. Use `disabled` for tabs that exist but
 * are not available yet.
 */
function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'relative inline-flex cursor-pointer items-center justify-center gap-1.5 text-sm whitespace-nowrap transition-colors outline-none',
        'hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
        // underline variant
        'group-data-[variant=underline]/tabs-list:h-full group-data-[variant=underline]/tabs-list:rounded-none group-data-[variant=underline]/tabs-list:px-0.5 group-data-[variant=underline]/tabs-list:focus-visible:ring-inset',
        'group-data-[variant=underline]/tabs-list:after:absolute group-data-[variant=underline]/tabs-list:after:inset-x-0 group-data-[variant=underline]/tabs-list:after:bottom-0 group-data-[variant=underline]/tabs-list:after:h-px group-data-[variant=underline]/tabs-list:after:bg-foreground group-data-[variant=underline]/tabs-list:after:opacity-0',
        'group-data-[variant=underline]/tabs-list:data-[state=active]:text-foreground group-data-[variant=underline]/tabs-list:data-[state=active]:after:opacity-100',
        // pills variant
        'group-data-[variant=pills]/tabs-list:h-full group-data-[variant=pills]/tabs-list:rounded-[5px] group-data-[variant=pills]/tabs-list:px-2.5 group-data-[variant=pills]/tabs-list:text-[13px]',
        'group-data-[variant=pills]/tabs-list:data-[state=active]:bg-surface-100 group-data-[variant=pills]/tabs-list:data-[state=active]:text-foreground group-data-[variant=pills]/tabs-list:data-[state=active]:shadow-card dark:group-data-[variant=pills]/tabs-list:data-[state=active]:bg-surface-300',
        className,
      )}
      {...props}
    />
  )
}

/**
 * The panel shown while its `value` is the active tab. Inactive panels unmount
 * unless you pass `forceMount` (useful to keep form state alive). The panel is
 * a tab stop (Tab moves from the active trigger to it) and shows the focus
 * ring when reached from the keyboard.
 */
function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn('flex-1 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring', className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants, type TabsListProps }
