import * as React from 'react'
import { ExternalLink, Menu, Monitor, Moon, Sun } from 'lucide-react'

import { MonoLabel } from '../patterns/mono-label'
import { Button, type ButtonProps } from '../primitives/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../primitives/sheet'
import { ToggleGroup, ToggleGroupItem } from '../primitives/toggle-group'
import { useLinkComponent, type LinkComponent, type LinkComponentProps } from '../../lib/link'
import { cn } from '../../lib/utils'
import { useTheme, type ThemePreference } from '../../theme/theme-provider'

import { useAppShell } from './app-shell'
import type { NavGroup, NavItem } from './types'

/* -------------------------------------------------------------------------------------------------
 * MobileNavSection
 * -----------------------------------------------------------------------------------------------*/

/** Props of {@link MobileNavSection}. */
export interface MobileNavSectionProps extends React.ComponentProps<'div'> {
  /** Mono heading of the section (1–3 words). */
  label?: React.ReactNode
}

/**
 * A bordered block inside a {@link MobileNav}, below the navigation groups: a mono heading and
 * free content (a workspace switcher, a plan summary, a language picker…).
 *
 * Pass it as a child of `MobileNav`. Do NOT use it for navigation links (put them in `groups`) or
 * for the sign-out action (use the `footer` slot).
 */
export function MobileNavSection({ label, className, children, ...props }: MobileNavSectionProps) {
  return (
    <div
      data-slot="mobile-nav-section"
      className={cn('flex flex-col gap-2 border-t pt-4 first:border-t-0 first:pt-0', className)}
      {...props}
    >
      {label != null && <MonoLabel className="px-1">{label}</MonoLabel>}
      {children}
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * MobileNavTrigger
 * -----------------------------------------------------------------------------------------------*/

/**
 * `true` below the `trigger` slot of a {@link MobileNav}: that drawer's `SheetTrigger` already opens
 * it on click (and, when it follows an `AppShell`, the shell's state with it), so a
 * `MobileNavTrigger` placed there must not open the shell drawer a second time.
 */
const MobileNavTriggerSlotContext = React.createContext(false)

/** Props of {@link MobileNavTrigger}. */
export type MobileNavTriggerProps = Omit<ButtonProps, 'children'> & {
  /** Accessible name of the icon button. Defaults to `"Open navigation"`. */
  'aria-label'?: string
}

/**
 * The hamburger button that opens the phone navigation: a ghost icon button, hidden from the `md`
 * breakpoint where the desktop rail takes over (override with `className="md:inline-flex"`).
 *
 * Inside an `AppShell` it opens the shell's `MobileNav` on its own; put it at the start of the top
 * bar. Outside a shell, pass it as the `trigger` of a `MobileNav`, or handle `onClick` yourself.
 * As a `trigger` it opens only that `MobileNav` (once), inside a shell or not. Call
 * `event.preventDefault()` in `onClick` to keep the shell drawer closed.
 * Do NOT use it to open other drawers (use `SheetTrigger` with a labelled Button).
 */
export function MobileNavTrigger({
  className,
  onClick,
  'aria-label': ariaLabel = 'Open navigation',
  ...props
}: MobileNavTriggerProps) {
  const shell = useAppShell()
  const inTriggerSlot = React.useContext(MobileNavTriggerSlotContext)
  return (
    <Button
      data-slot="mobile-nav-trigger"
      variant="ghost"
      size="icon"
      icon={<Menu />}
      aria-label={ariaLabel}
      className={cn('md:hidden', className)}
      onClick={(event) => {
        // As a MobileNav `trigger`, `onClick` is that drawer's SheetTrigger handler, which opens it
        // (and the shell state it follows): opening the shell here too would report it twice.
        onClick?.(event)
        if (!event.defaultPrevented && !inTriggerSlot) shell?.setMobileNavOpen(true)
      }}
      {...props}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * MobileNav
 * -----------------------------------------------------------------------------------------------*/

const itemClassName = cn(
  'flex h-10 w-full cursor-pointer items-center gap-3 rounded-md px-3 text-left text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring',
  'disabled:pointer-events-none disabled:opacity-50',
  '[&>[data-icon]]:flex [&>[data-icon]]:size-[18px] [&>[data-icon]]:shrink-0 [&>[data-icon]]:items-center [&>[data-icon]]:justify-center',
  '[&>[data-icon]_svg]:[stroke-width:1.6] [&>[data-icon]_svg:not([class*=size-])]:size-[18px]',
)

const DEFAULT_EXTERNAL_LABEL = '(opens in a new tab)'

interface MobileNavLinkProps {
  item: NavItem
  Link: LinkComponent
  externalLabel: string
  onNavigate: () => void
}

/**
 * One 40px row: a router link when the item has an `href` (a plain new-tab `<a>` when it is
 * `external`), else a button.
 */
function MobileNavLink({ item, Link, externalLabel, onNavigate }: MobileNavLinkProps) {
  const className = cn(
    itemClassName,
    item.active ? 'bg-selection font-medium text-foreground' : 'text-foreground-light hover:bg-surface-200',
  )
  const content = (
    <>
      {item.icon != null && (
        <span data-icon="" aria-hidden="true">
          {item.icon}
        </span>
      )}
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.badge != null && <span className="flex shrink-0 items-center">{item.badge}</span>}
      {item.external && (
        <>
          <ExternalLink aria-hidden="true" className="size-3.5 shrink-0 text-foreground-muted" />
          <span className="sr-only">{` ${externalLabel}`}</span>
        </>
      )}
    </>
  )
  const onClick = () => {
    item.onSelect?.()
    onNavigate()
  }

  if (item.href && !item.disabled) {
    const props: LinkComponentProps = {
      href: item.href,
      className,
      onClick,
      'aria-current': item.active ? 'page' : undefined,
    }
    // External destinations skip the router adapter: a plain anchor that opens a new tab.
    if (item.external) {
      return (
        <a data-slot="mobile-nav-item" target="_blank" rel="noreferrer" {...props}>
          {content}
        </a>
      )
    }
    return (
      <Link data-slot="mobile-nav-item" {...props}>
        {content}
      </Link>
    )
  }
  return (
    <button
      type="button"
      data-slot="mobile-nav-item"
      className={className}
      onClick={onClick}
      disabled={item.disabled}
      aria-current={item.active ? 'page' : undefined}
    >
      {content}
    </button>
  )
}

/** Texts of {@link MobileNav} (override them to translate). */
export interface MobileNavLabels {
  /** Accessible name of the `<nav>` landmark. Defaults to `"Main"`. */
  navigation?: string
  /** Heading of the theme section. Defaults to `"Theme"`. */
  theme?: string
  /** Light theme option. Defaults to `"Light"`. */
  light?: string
  /** Dark theme option. Defaults to `"Dark"`. */
  dark?: string
  /** System theme option. Defaults to `"System"`. */
  system?: string
  /** Accessible name of the close (X) button of the drawer. Defaults to `"Close"`. */
  close?: string
  /** Screen-reader text appended to the name of `external` items. Defaults to `"(opens in a new tab)"`. */
  external?: string
}

/** Props of {@link MobileNav}. */
export interface MobileNavProps {
  /** Navigation groups, separated by borders; a group `label` shows as a mono heading. Takes precedence over `items`. */
  groups?: NavGroup[]
  /** Shorthand for a single group of items. Ignored when `groups` is set. */
  items?: NavItem[]
  /**
   * Controlled open state. Pair with `onOpenChange`. When omitted inside an `AppShell`, the drawer
   * follows the shell's mobile navigation state; to control it there, use the shell's
   * `mobileNavOpen` instead so `MobileNavTrigger` keeps working.
   */
  open?: boolean
  /** Initial open state when uncontrolled and outside an `AppShell`. Defaults to `false`. */
  defaultOpen?: boolean
  /** Called when the drawer opens or closes (including after an item is chosen). */
  onOpenChange?: (open: boolean) => void
  /** Element that opens the drawer on click, usually a `MobileNavTrigger`. Not needed inside an `AppShell`. */
  trigger?: React.ReactNode
  /** Brand mark shown before the title (about 20px). It sits inside the accessible title, so mark it `aria-hidden`. */
  logo?: React.ReactNode
  /** Drawer title, also its accessible name (usually the app or workspace name). Defaults to `"Menu"`. */
  title?: React.ReactNode
  /** Short line under the title (workspace, plan, version…). */
  description?: React.ReactNode
  /** Extra blocks below the groups, usually `MobileNavSection`s. */
  children?: React.ReactNode
  /** Bottom slot pinned under the scrolling content, usually a full-width sign-out `Button`. */
  footer?: React.ReactNode
  /**
   * Shows a Light / Dark / System segmented control. By default it reads and writes the nearest
   * `ThemeProvider` through `useTheme()` (without a provider and without `theme`, choosing has no
   * effect). Defaults to `false`.
   */
  showThemeToggle?: boolean
  /** Controlled theme preference of the theme control. Omit it to follow the nearest `ThemeProvider`. */
  theme?: ThemePreference
  /** Called with the chosen theme preference (the `ThemeProvider` is updated too when `theme` is omitted). */
  onThemeChange?: (theme: ThemePreference) => void
  /** Closes the drawer when an item is chosen. Defaults to `true`. */
  closeOnSelect?: boolean
  /** Edge the drawer slides in from. Defaults to `"left"`. */
  side?: 'left' | 'right'
  /**
   * Router-aware link used by every item. Defaults to the nearest `LinkProvider` component, else a
   * plain `<a>`. Not used for `external` items (they render a plain `<a target="_blank">`).
   */
  linkComponent?: LinkComponent
  /** Built-in texts: the landmark, the theme control, the close button and the suffix of external items. */
  labels?: MobileNavLabels
  /** Extra classes for the drawer panel (default width 280px, at most 85% of the viewport). */
  className?: string
}

/**
 * Phone navigation: a drawer sliding from the left with a header (logo, title, description), the
 * navigation groups as 40px rows with labels, optional extra sections and theme control, and a
 * footer slot. Choosing an item closes it. On open, focus moves to the current destination (the
 * `active` item), else to the first item: never to the `footer` action.
 *
 * Use it as the `mobileNav` of an `AppShell`, with the same groups as the desktop `IconRail` and a
 * `MobileNavTrigger` in the top bar; inside a shell it needs no `open` prop. Standalone, control it
 * with `open` + `onOpenChange` or pass a `trigger`. Do NOT use it as a general side panel (use
 * `Sheet`) or as the only navigation on desktop (use `IconRail`).
 */
export function MobileNav({
  groups,
  items,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  trigger,
  logo,
  title = 'Menu',
  description,
  children,
  footer,
  showThemeToggle = false,
  theme: themeProp,
  onThemeChange,
  closeOnSelect = true,
  side = 'left',
  linkComponent,
  labels,
  className,
}: MobileNavProps) {
  const shell = useAppShell()
  const Link = useLinkComponent(linkComponent)
  const themeContext = useTheme()
  const theme = themeProp ?? themeContext.theme
  const setTheme = (next: ThemePreference) => {
    if (themeProp === undefined) themeContext.setTheme(next)
    onThemeChange?.(next)
  }
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen)

  const isControlled = openProp !== undefined
  const boundToShell = !isControlled && shell !== null
  const open = isControlled ? openProp : boundToShell ? shell.mobileNavOpen : uncontrolled
  const setOpen = (next: boolean) => {
    if (boundToShell) shell.setMobileNavOpen(next)
    else if (!isControlled) setUncontrolled(next)
    onOpenChange?.(next)
  }

  const resolvedGroups: NavGroup[] = groups ?? (items ? [{ id: 'items', items }] : [])
  const baseId = React.useId()

  // Radix skips links when it picks the element to focus on open, which would land on the first
  // button: the `footer` action (sign out). Focus the current destination instead, else the first
  // item, else the panel itself.
  const focusCurrentItem = (event: Event) => {
    const panel = event.currentTarget
    if (!(panel instanceof HTMLElement)) return
    event.preventDefault()
    const target =
      panel.querySelector<HTMLElement>('nav [aria-current="page"]:not([disabled])') ??
      panel.querySelector<HTMLElement>('nav a[href], nav button:not([disabled])') ??
      panel
    target.focus()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger != null && (
        <MobileNavTriggerSlotContext.Provider value>
          <SheetTrigger asChild>{trigger}</SheetTrigger>
        </MobileNavTriggerSlotContext.Provider>
      )}
      <SheetContent
        side={side}
        data-slot="mobile-nav"
        // Focusable from script only: the fallback target of `focusCurrentItem`.
        tabIndex={-1}
        onOpenAutoFocus={focusCurrentItem}
        closeLabel={labels?.close}
        className={cn('w-[280px] max-w-[85vw] p-0', className)}
        {...(description == null ? { 'aria-describedby': undefined } : {})}
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {logo}
            {title}
          </SheetTitle>
          {description != null && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <nav
          aria-label={labels?.navigation ?? 'Main'}
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 py-4"
        >
          {resolvedGroups.map((group, gi) => (
            <div key={group.id} className={cn('flex flex-col gap-1', gi > 0 && 'border-t pt-4')}>
              {group.label && (
                <MonoLabel as="div" id={`${baseId}-${group.id}`} className="px-3 pb-1">
                  {group.label}
                </MonoLabel>
              )}
              <ul className="flex flex-col gap-0.5" aria-labelledby={group.label ? `${baseId}-${group.id}` : undefined}>
                {group.items.map((item) => (
                  <li key={item.id}>
                    <MobileNavLink
                      item={item}
                      Link={Link}
                      externalLabel={labels?.external ?? DEFAULT_EXTERNAL_LABEL}
                      onNavigate={() => closeOnSelect && setOpen(false)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {children}
          {showThemeToggle && (
            <MobileNavSection label={labels?.theme ?? 'Theme'}>
              <ToggleGroup
                type="single"
                variant="outline"
                value={theme}
                onValueChange={(value) => value && setTheme(value as ThemePreference)}
                aria-label={labels?.theme ?? 'Theme'}
              >
                <ToggleGroupItem value="light">
                  <Sun /> {labels?.light ?? 'Light'}
                </ToggleGroupItem>
                <ToggleGroupItem value="dark">
                  <Moon /> {labels?.dark ?? 'Dark'}
                </ToggleGroupItem>
                <ToggleGroupItem value="system">
                  <Monitor /> {labels?.system ?? 'System'}
                </ToggleGroupItem>
              </ToggleGroup>
            </MobileNavSection>
          )}
        </nav>
        {footer != null && (
          <div data-slot="mobile-nav-footer" className="border-t p-3">
            {footer}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
