import * as React from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '../primitives/dropdown-menu'
import { Hint } from '../primitives/tooltip'
import { cn } from '../../lib/utils'
import { useTheme, type ThemePreference } from '../../theme/theme-provider'
import { TopBarIconButton } from './top-bar'

const THEME_ICON: Record<ThemePreference, React.ComponentType<{ className?: string }>> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
}

const THEME_ORDER: ThemePreference[] = ['light', 'dark', 'system']

const DEFAULT_LABELS: Record<ThemePreference, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
}

/** Props for {@link ThemeMenu}. */
export interface ThemeMenuProps {
  /**
   * Controlled theme preference. When omitted the menu reads and writes the
   * nearest `ThemeProvider` through `useTheme()`.
   */
  value?: ThemePreference
  /**
   * Called with the chosen preference. In uncontrolled mode the `ThemeProvider`
   * is updated too, so use this to observe (analytics, persisting to a profile).
   */
  onValueChange?: (value: ThemePreference) => void
  /** Heading of the menu, tooltip and accessible name prefix (default "Theme"). */
  label?: string
  /** Translated option names, e.g. `{ light: 'Clair', dark: 'Sombre', system: 'Système' }`. */
  labels?: Partial<Record<ThemePreference, string>>
  /** Show the label as a tooltip on the trigger (default `true`; needs a `TooltipProvider`). */
  tooltip?: boolean
  /** Controlled open state of the menu (pair with `onOpenChange`). */
  open?: boolean
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Called with the next open state. */
  onOpenChange?: (open: boolean) => void
  /** Radix modal mode (default `true`): set `false` to keep the page interactive while open. */
  modal?: boolean
  /** Alignment of the menu against the trigger (default "end"). */
  align?: 'start' | 'center' | 'end'
  /** Classes for the round trigger button (e.g. `max-sm:hidden`). */
  className?: string
  /** Classes for the menu panel (default width 160px). */
  contentClassName?: string
}

/**
 * Light / dark / system theme picker: a round 32px icon button showing the
 * current preference (sun, moon or monitor) that opens a small radio menu.
 *
 * Drop it in the `TopBar` actions or on a signed-out page (login). By default
 * it drives the nearest `ThemeProvider`; pass `value` + `onValueChange` to
 * control it yourself. Without either (no provider and no `value`) it shows
 * "System" and choosing an option only calls `onValueChange`. Do NOT use it
 * inside a settings form (use a `RadioGroup` or `ToggleGroup` bound to the
 * same preference instead).
 *
 * Target it in tests and CSS with `data-slot="theme-menu-trigger"` (the button)
 * and `data-slot="theme-menu"` (the menu panel).
 */
export function ThemeMenu({
  value,
  onValueChange,
  label = 'Theme',
  labels,
  tooltip = true,
  open,
  defaultOpen,
  onOpenChange,
  modal,
  align = 'end',
  className,
  contentClassName,
}: ThemeMenuProps) {
  const ctx = useTheme()
  const current = value ?? ctx.theme
  const names = { ...DEFAULT_LABELS, ...labels }
  const Icon = THEME_ICON[current]

  const change = (next: string) => {
    const pref = next as ThemePreference
    if (value === undefined) ctx.setTheme(pref)
    onValueChange?.(pref)
  }

  const trigger = (
    <DropdownMenuTrigger asChild>
      <TopBarIconButton
        data-slot="theme-menu-trigger"
        icon={<Icon />}
        label={`${label}: ${names[current]}`}
        tooltip={false}
        className={className}
      />
    </DropdownMenuTrigger>
  )

  return (
    <DropdownMenu open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
      {tooltip ? <Hint label={label}>{trigger}</Hint> : trigger}
      <DropdownMenuContent data-slot="theme-menu" align={align} className={cn('w-40', contentClassName)}>
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={current} onValueChange={change}>
          {THEME_ORDER.map((pref) => {
            const ItemIcon = THEME_ICON[pref]
            return (
              <DropdownMenuRadioItem key={pref} value={pref}>
                <ItemIcon /> {names[pref]}
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
