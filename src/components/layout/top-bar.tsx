import * as React from 'react'
import { ChevronsUpDown, Menu, Search, User } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '../primitives/avatar'
import { Button } from '../primitives/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from '../primitives/dropdown-menu'
import { Skeleton } from '../primitives/skeleton'
import { Hint } from '../primitives/tooltip'
import { useIsMac } from '../../hooks/use-platform'
import { useLinkComponent, type LinkComponent } from '../../lib/link'
import { cn } from '../../lib/utils'

/* -------------------------------------------------------------------------- */
/* TopBar                                                                     */
/* -------------------------------------------------------------------------- */

/** Props for {@link TopBar}. */
export interface TopBarProps extends Omit<React.ComponentProps<'header'>, 'children'> {
  /**
   * Brand mark rendered first in the trail, usually a {@link TopBarLogo}
   * linking to the app home.
   */
  logo?: React.ReactNode
  /**
   * The breadcrumb-like trail after the logo: {@link TopBarSeparator} +
   * {@link TopBarSegment} / `ResourceSwitcher` pairs, optionally followed by
   * small pills or a contextual action. Separators are explicit so a
   * separator and its segment can be hidden together on small screens
   * (wrap them in `<span className="flex min-w-0 items-center gap-0.5 max-sm:hidden">`).
   */
  children?: React.ReactNode
  /**
   * Right-aligned cluster (8px gap): {@link TopBarSearch}, links,
   * {@link TopBarIconButton}s, `ThemeMenu` and a {@link TopBarUserMenu} last.
   */
  actions?: React.ReactNode
  /**
   * Shows a hamburger button below the `md` breakpoint and calls this when it
   * is pressed. Open your mobile navigation sheet from it. Omit when the app
   * has no mobile navigation.
   */
  onOpenMobileNav?: () => void
  /** Accessible label of the hamburger button (default "Open navigation"). */
  mobileNavLabel?: string
  /** Accessible label of the trail `<nav>` (default "Breadcrumb"). */
  navLabel?: string
}

/**
 * Application top bar: a 48px header with a hairline bottom border holding
 * the logo, a slash-separated trail of segments and switchers ("Acme / Web
 * app / Settings") and a right-side cluster of actions (search trigger,
 * theme menu, avatar menu).
 *
 * Use it once, at the top of an authenticated app shell. Do NOT use it as a
 * page header (use a page title block inside the content) or for marketing
 * site navigation. It holds no state: wire search, theme and account menus
 * through the slot components.
 */
export function TopBar({
  logo,
  children,
  actions,
  onOpenMobileNav,
  mobileNavLabel = 'Open navigation',
  navLabel = 'Breadcrumb',
  className,
  ...props
}: TopBarProps) {
  return (
    <header
      data-slot="top-bar"
      className={cn('flex h-12 shrink-0 items-center gap-2 border-b bg-background pr-3 pl-2 md:pr-4 md:pl-3', className)}
      {...props}
    >
      {onOpenMobileNav && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          icon={<Menu />}
          aria-label={mobileNavLabel}
          onClick={onOpenMobileNav}
        />
      )}
      <nav aria-label={navLabel} data-slot="top-bar-trail" className="flex min-w-0 flex-1 items-center gap-0.5">
        {logo}
        {children}
      </nav>
      {actions && (
        <div data-slot="top-bar-actions" className="flex shrink-0 items-center gap-2">
          {actions}
        </div>
      )}
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/* Logo                                                                       */
/* -------------------------------------------------------------------------- */

/** Props for {@link TopBarLogo}. */
export interface TopBarLogoProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** Destination (usually the app home). Without it the logo renders as a static image. */
  href?: string
  /** Accessible name, e.g. "Acme home". Required: the logo itself is decorative. */
  label: string
  /** The brand mark (an inline SVG or `<img>`); SVGs without a size class get 20px. */
  children: React.ReactNode
  /** Link component override (defaults to the nearest `LinkProvider`, then `<a>`). */
  linkComponent?: LinkComponent
}

/**
 * The brand mark at the start of a {@link TopBar} trail: a 32px focusable
 * square that links home. Pass the logo as children and an accessible `label`.
 */
export function TopBarLogo({ href, label, linkComponent, className, children, ...props }: TopBarLogoProps) {
  const Link = useLinkComponent(linkComponent)
  const cls = cn(
    'flex size-8 shrink-0 items-center justify-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring',
    '[&>img]:size-5 [&>svg:not([class*=size-])]:size-5',
    className,
  )
  if (!href) {
    return (
      <span data-slot="top-bar-logo" role="img" aria-label={label} className={cls} {...props}>
        {children}
      </span>
    )
  }
  return (
    // `Link` comes from props/context (useLinkComponent): stable, not created during render.
    // eslint-disable-next-line react-hooks/static-components
    <Link data-slot="top-bar-logo" href={href} aria-label={label} className={cls} {...props}>
      {children}
    </Link>
  )
}

/* -------------------------------------------------------------------------- */
/* Separator                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * The thin slanted slash between trail items of a {@link TopBar}. Place one
 * before every segment (after the logo). Decorative (hidden from assistive tech).
 */
export function TopBarSeparator({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      data-slot="top-bar-separator"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      className={cn('size-5 shrink-0 text-border-stronger', className)}
      {...props}
    >
      <path d="M16 3.5 8 20.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Segment                                                                    */
/* -------------------------------------------------------------------------- */

const segmentClassName = cn(
  // overflow-hidden: a segment squeezed by a narrow bar clips its own icon / chevron instead of
  // painting over its neighbours (the focus ring is the segment's own box-shadow, so it still shows)
  'group inline-flex h-8 min-w-0 cursor-pointer items-center gap-1.5 overflow-hidden rounded-md px-1.5 text-sm text-foreground outline-none transition-colors',
  'hover:bg-surface-200 focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-surface-200',
  'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
)

/** Props for {@link TopBarSegment}. */
export interface TopBarSegmentProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  /** Leading 16px icon (muted), e.g. the entity's type icon. */
  icon?: React.ReactNode
  /**
   * Segment text, truncated past 180px. Keep it to text (or inline content): it is
   * wrapped in a truncating block, so put an icon or avatar in `icon` instead.
   */
  children?: React.ReactNode
  /**
   * Trailing adornment after the text (version or plan badge…), inside the hit area.
   * Hidden below the `sm` breakpoint, where the trail has no room for it.
   */
  badge?: React.ReactNode
  /**
   * Shows the ⇕ chevron that signals a switcher. Defaults to `true` for a
   * button and `false` for a link segment.
   */
  chevron?: boolean
  /** Replaces the text with a skeleton while the segment's data loads (sets `aria-busy`). */
  loading?: boolean
  /**
   * Dims the segment and blocks interaction. On a link segment it sets
   * `aria-disabled` and removes it from the tab order.
   */
  disabled?: boolean
  /** Renders the segment as a link (through the link component) instead of a button. */
  href?: string
  /** Marks a link segment as the current page (`aria-current="page"`). */
  current?: boolean
  /** Link component override for `href` segments. */
  linkComponent?: LinkComponent
}

/**
 * One item of the {@link TopBar} trail: icon + truncated text (+ badge) +
 * optional ⇕ chevron, with a subtle hover and an "open" state.
 *
 * Use it as the trigger of a `DropdownMenu` or `Popover` (via `asChild`) for a
 * scope menu (workspace, organization), or with `href` for a plain crumb.
 * To switch between many entities with search use `ResourceSwitcher`, which
 * renders this same trigger.
 */
export function TopBarSegment({
  icon,
  children,
  badge,
  chevron,
  loading = false,
  href,
  current = false,
  linkComponent,
  className,
  type,
  ...props
}: TopBarSegmentProps) {
  const Link = useLinkComponent(linkComponent)
  const showChevron = chevron ?? !href
  const content = (
    <>
      {icon && (
        <span aria-hidden="true" className="flex shrink-0 text-foreground-lighter [&_svg:not([class*=size-])]:size-4">
          {icon}
        </span>
      )}
      {loading ? (
        <Skeleton className="h-4 w-20" />
      ) : (
        children != null && <span className="max-w-[180px] min-w-0 truncate">{children}</span>
      )}
      {badge != null && (
        // `contents` from `sm` up: the badge stays a direct flex item of the segment
        <span data-slot="top-bar-segment-badge" className="max-sm:hidden sm:contents">
          {badge}
        </span>
      )}
      {showChevron && (
        <ChevronsUpDown
          className="size-3.5 shrink-0 text-foreground-lighter group-hover:text-foreground-light"
          aria-hidden="true"
        />
      )}
    </>
  )
  if (href) {
    // `disabled` is not a valid anchor attribute: it becomes aria-disabled + tabIndex -1.
    const { onClick, disabled, ...rest } = props
    return (
      // `Link` comes from props/context (useLinkComponent): stable, not created during render.
      // eslint-disable-next-line react-hooks/static-components
      <Link
        data-slot="top-bar-segment"
        href={href}
        aria-current={current ? 'page' : undefined}
        aria-disabled={disabled || undefined}
        aria-busy={loading || undefined}
        tabIndex={disabled ? -1 : undefined}
        className={cn(segmentClassName, className)}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </Link>
    )
  }
  return (
    <button
      data-slot="top-bar-segment"
      type={type ?? 'button'}
      aria-busy={loading || undefined}
      className={cn(segmentClassName, className)}
      {...props}
    >
      {content}
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/* Search trigger                                                             */
/* -------------------------------------------------------------------------- */

/** Props for {@link TopBarSearch}. */
export interface TopBarSearchProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  /** Accessible name (default "Search"); the shortcut is appended to it. */
  label?: string
  /** Visible text of the wide trigger (default "Search…"). */
  placeholder?: string
  /**
   * Keyboard hint shown on the right. Defaults to "⌘K" on Apple platforms and
   * "Ctrl K" elsewhere ("Ctrl K" during server rendering and hydration, then
   * updated, so SSR markup always matches); `false` hides it. Display only:
   * bind the key yourself.
   */
  shortcut?: string | false
  /**
   * `aria-keyshortcuts` value. Defaults to "Meta+K" / "Control+K" when
   * `shortcut` is left at its default.
   */
  keyShortcuts?: string
  /** Collapse into a round icon-only button below the `sm` breakpoint (default `true`). */
  compactOnMobile?: boolean
}

/**
 * The search / command palette trigger of a {@link TopBar}: a 176px rounded
 * field-like button with a search icon, placeholder and keyboard hint. It only
 * calls `onClick`; open your `CommandMenu` from it and bind the shortcut
 * (usually mod+K) yourself. Do NOT use it as a real text input: it has no value.
 */
export function TopBarSearch({
  label = 'Search',
  placeholder = 'Search…',
  shortcut,
  keyShortcuts,
  compactOnMobile = true,
  className,
  type,
  ...props
}: TopBarSearchProps) {
  // Hook, not the `isMac` constant: the server cannot know the platform (hydration-safe).
  const mac = useIsMac()
  const usesDefaultShortcut = shortcut === undefined
  const hint = usesDefaultShortcut ? (mac ? '⌘K' : 'Ctrl K') : shortcut
  const ariaKeys = keyShortcuts ?? (usesDefaultShortcut ? (mac ? 'Meta+K' : 'Control+K') : undefined)
  const wide = compactOnMobile ? 'max-sm:hidden' : undefined
  return (
    <button
      data-slot="top-bar-search"
      type={type ?? 'button'}
      aria-label={hint ? `${label} (${hint})` : label}
      aria-keyshortcuts={ariaKeys}
      className={cn(
        'flex h-8 shrink-0 cursor-pointer items-center rounded-full border border-border-strong text-[13px] text-foreground-lighter outline-none transition-colors hover:border-border-stronger focus-visible:ring-2 focus-visible:ring-ring',
        compactOnMobile
          ? 'w-8 justify-center bg-transparent hover:text-foreground max-sm:hover:bg-surface-200 sm:w-44 sm:justify-start sm:gap-2 sm:bg-surface-100 sm:pr-1.5 sm:pl-3 sm:hover:text-foreground-light sm:dark:bg-surface-200'
          : 'w-44 gap-2 bg-surface-100 pr-1.5 pl-3 hover:text-foreground-light dark:bg-surface-200',
        className,
      )}
      {...props}
    >
      <Search className={cn('size-3.5 shrink-0', compactOnMobile && 'max-sm:size-4')} aria-hidden="true" />
      <span className={cn('flex-1 truncate text-left', wide)}>{placeholder}</span>
      {hint && (
        <kbd
          className={cn(
            'inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full border border-border-strong bg-surface-200 px-1.5 font-mono text-[10.5px] leading-none text-foreground-lighter',
            wide,
          )}
        >
          {hint}
        </kbd>
      )}
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/* Icon button                                                                */
/* -------------------------------------------------------------------------- */

const iconButtonClassName =
  'size-8 rounded-full border-border-strong bg-transparent text-foreground-lighter hover:text-foreground [&_svg:not([class*=size-])]:size-4'

/** Props for {@link TopBarIconButton}. */
export interface TopBarIconButtonProps
  extends Omit<React.ComponentProps<typeof Button>, 'variant' | 'size' | 'shape' | 'asChild' | 'icon' | 'iconRight' | 'children'> {
  /** The 16px icon. */
  icon: React.ReactNode
  /** Accessible name, also shown as a tooltip. */
  label: string
  /** Show `label` in a tooltip on hover / focus (default `true`; needs a `TooltipProvider`). */
  tooltip?: boolean
  /** Renders a link instead of a button (help, docs, changelog…). */
  href?: string
  /** Opens `href` in a new tab (`target="_blank"` + `rel="noreferrer"`). */
  external?: boolean
  /** Link component override for internal `href`s. */
  linkComponent?: LinkComponent
}

/**
 * Round 32px outline icon button for the {@link TopBar} action cluster (help,
 * notifications, sign out…), with its label as tooltip and accessible name.
 * Works as a `DropdownMenuTrigger` / `PopoverTrigger` child via `asChild`.
 * Keep the cluster short: move secondary actions into the `TopBarUserMenu`.
 */
export function TopBarIconButton({
  icon,
  label,
  tooltip = true,
  href,
  external = false,
  linkComponent,
  className,
  ...props
}: TopBarIconButtonProps) {
  const Link = useLinkComponent(linkComponent)
  const cls = cn(iconButtonClassName, className)
  let button: React.ReactNode
  if (href) {
    // `disabled` / `loading` are not anchor attributes: `Button asChild` maps them to ARIA
    // (`aria-disabled`, `aria-busy`, `tabIndex={-1}`) and swaps the icon for the spinner.
    const { onClick, disabled, loading, ...rest } = props
    const linkProps = {
      href,
      'aria-label': label,
      onClick: onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined,
      ...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>),
    }
    button = (
      <Button
        asChild
        data-slot="top-bar-icon-button"
        variant="outline"
        size="icon"
        className={cls}
        icon={icon}
        disabled={disabled}
        loading={loading}
      >
        {external ? (
          <a target="_blank" rel="noreferrer" {...linkProps} />
        ) : (
          // `Link` comes from props/context (useLinkComponent): stable, not created during render.
          // eslint-disable-next-line react-hooks/static-components
          <Link {...linkProps} />
        )}
      </Button>
    )
  } else {
    button = (
      <Button
        data-slot="top-bar-icon-button"
        variant="outline"
        size="icon"
        className={cls}
        icon={icon}
        aria-label={label}
        {...props}
      />
    )
  }
  return tooltip ? <Hint label={label}>{button}</Hint> : button
}

/* -------------------------------------------------------------------------- */
/* User menu                                                                  */
/* -------------------------------------------------------------------------- */

function initialsOf(name: string | undefined): string | undefined {
  if (!name) return undefined
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts[0]
  const last = parts[parts.length - 1]
  if (!first || !last) return undefined
  const letters = parts.length === 1 ? first.slice(0, 2) : `${first.charAt(0)}${last.charAt(0)}`
  return letters.toUpperCase()
}

/** Props for {@link TopBarUserMenu}. */
export interface TopBarUserMenuProps {
  /** Display name, shown in the menu header and used for the initials fallback. */
  name?: string
  /** Secondary header line, typically the email address or the current role. */
  description?: React.ReactNode
  /** Avatar picture URL. Without it (or while it loads) the fallback shows. */
  avatarSrc?: string
  /** Fallback inside the round trigger; defaults to the initials of `name`, then a user icon. */
  fallback?: React.ReactNode
  /** Replaces the default name / description header. */
  header?: React.ReactNode
  /** Accessible name of the trigger (default "Account"). */
  label?: string
  /** Menu items (`DropdownMenuItem`, `DropdownMenuSeparator`…) under the header. */
  children?: React.ReactNode
  /** Controlled open state (pair with `onOpenChange`). */
  open?: boolean
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Called with the next open state. */
  onOpenChange?: (open: boolean) => void
  /** Radix modal mode (default `true`): set `false` to keep the page interactive while open. */
  modal?: boolean
  /** Alignment of the menu against the trigger (default "end"). */
  align?: 'start' | 'center' | 'end'
  /** Classes for the round trigger. */
  className?: string
  /** Classes for the menu panel (default width 240px). */
  contentClassName?: string
}

/**
 * The avatar-triggered account menu at the far right of a {@link TopBar}: a
 * 32px round trigger (picture, initials or icon on a primary-tinted disc)
 * opening a 240px menu with a name / description header and your items
 * (profile, settings, documentation, sign out).
 *
 * Use it for the signed-in user's menu. For app-wide actions that deserve
 * one click, use a {@link TopBarIconButton} instead.
 */
export function TopBarUserMenu({
  name,
  description,
  avatarSrc,
  fallback,
  header,
  label = 'Account',
  children,
  open,
  defaultOpen,
  onOpenChange,
  modal,
  align = 'end',
  className,
  contentClassName,
}: TopBarUserMenuProps) {
  const fallbackContent = fallback ?? initialsOf(name) ?? <User className="size-3.5" aria-hidden="true" />
  const hasHeader = header != null || name != null || description != null
  return (
    <DropdownMenu open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          data-slot="top-bar-user-menu-trigger"
          aria-label={label}
          className={cn(
            'flex size-8 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-primary/30 bg-primary-soft text-[11px] font-medium text-primary outline-none transition-colors hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring',
            className,
          )}
        >
          {avatarSrc ? (
            <Avatar className="size-full">
              <AvatarImage src={avatarSrc} alt="" />
              <AvatarFallback className="bg-transparent text-[11px] font-medium text-primary">
                {fallbackContent}
              </AvatarFallback>
            </Avatar>
          ) : (
            <span aria-hidden="true" className="flex items-center justify-center">
              {fallbackContent}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={cn('w-60', contentClassName)}>
        {hasHeader &&
          (header ?? (
            <div className="flex min-w-0 flex-col gap-0.5 px-2 py-2">
              {name && <span className="truncate text-[13px] font-medium text-foreground">{name}</span>}
              {description && <span className="truncate text-[12px] text-foreground-lighter">{description}</span>}
            </div>
          ))}
        {hasHeader && children != null && <DropdownMenuSeparator />}
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
