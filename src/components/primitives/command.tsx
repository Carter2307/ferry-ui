import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { cn } from "../../lib/utils"
import { SearchIcon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog"

/**
 * Root of a command menu (cmdk): a search field over a filtered, keyboard-navigable list.
 * Use it inline for searchable pickers (inside a Popover or a panel) and through CommandDialog for
 * an app-wide command palette. Items are fuzzy-filtered by their text / `value` / `keywords`; pass
 * `shouldFilter={false}` to filter yourself (e.g. server-side search). Do NOT use it for a short
 * action list without search (use DropdownMenu) or for a form value (use Select).
 */
function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-lg bg-popover text-popover-foreground",
        className
      )}
      {...props}
    />
  )
}

/** Props of {@link CommandDialog}: the Dialog root props plus the options below. */
type CommandDialogProps = React.ComponentProps<typeof Dialog> & {
  /** Accessible dialog title, visually hidden (default "Command Palette"). */
  title?: string
  /** Accessible dialog description, visually hidden (default "Search for a command to run..."). */
  description?: string
  /** Classes merged onto the dialog panel (e.g. `sm:max-w-2xl` to widen it). */
  className?: string
  /** Show the top-right close button (default true). */
  showCloseButton?: boolean
  /** Accessible name of the close button (default "Close"); pass a translation in localized apps. */
  closeLabel?: string
  /**
   * `data-slot` of the dialog panel (default `dialog-content`). Components built on CommandDialog
   * set their own name here (`CommandMenu` uses `command-menu`).
   */
  "data-slot"?: string
  /**
   * Props for the inner Command root, e.g. `shouldFilter={false}` for server-side search,
   * `filter`, a controlled `value` / `onValueChange` for the highlighted item, or `loop={false}`.
   */
  commandProps?: Omit<React.ComponentProps<typeof CommandPrimitive>, "children">
}

/**
 * A Command inside a modal Dialog, pinned near the top of the viewport: the classic command
 * palette. Control it with `open` + `onOpenChange` (or `defaultOpen`) and bind the keyboard
 * shortcut yourself (usually mod+K). Arrow navigation wraps around. Children are the Command
 * parts (CommandInput, CommandList, CommandGroup, CommandItem…); options of the Command root go
 * through `commandProps`. For a searchable picker anchored to a field, put an inline Command in
 * a Popover instead.
 */
function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = true,
  closeLabel,
  commandProps,
  "data-slot": dataSlot = "dialog-content",
  ...props
}: CommandDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent
        data-slot={dataSlot}
        size="lg"
        className={cn("top-[12vh] translate-y-0 overflow-hidden p-0 sm:max-w-xl", className)}
        showCloseButton={showCloseButton}
        closeLabel={closeLabel}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Command
          loop
          {...commandProps}
          className={cn(
            "**:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group]]:px-1.5 [&_[cmdk-item]]:py-2",
            commandProps?.className
          )}
        >
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Search field with a leading search icon, separated from the list by a bottom border. Use
 * `value` + `onValueChange` when you need the query (e.g. async results).
 */
function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-11 items-center gap-2.5 border-b px-4"
    >
      <SearchIcon className="size-4 shrink-0 text-foreground-lighter" aria-hidden="true" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "flex h-10 w-full rounded-md bg-transparent py-3 text-sm text-foreground outline-hidden placeholder:text-foreground-lighter disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
}

/** Scrollable container for groups and items (max 420px or 60% of the viewport height). */
function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[min(420px,60dvh)] scroll-py-1.5 overflow-x-hidden overflow-y-auto py-1",
        className
      )}
      {...props}
    />
  )
}

/**
 * Message rendered automatically when no item matches the query (built-in filtering only; with
 * `shouldFilter={false}` it shows whenever the list renders no item).
 */
function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn("py-8 text-center text-sm text-foreground-light", className)}
      {...props}
    />
  )
}

/**
 * Section of items; `heading` renders in the mono uppercase label style. Hidden automatically when
 * none of its items match the query.
 */
function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:tracking-[0.06em] [&_[cmdk-group-heading]]:text-foreground-lighter [&_[cmdk-group-heading]]:uppercase",
        className
      )}
      {...props}
    />
  )
}

/** Hairline divider between groups. */
function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

/**
 * A selectable row: run the action in `onSelect` (fires on click and Enter). Set `value` when the
 * visible text is not what should be matched, `keywords` for extra search terms and `disabled` to
 * make it unselectable. Icons are auto-sized to 16px and muted.
 */
function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-[5px] px-2 py-1.5 text-[13px] text-foreground-light outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-surface-200 data-[selected=true]:text-foreground cursor-pointer [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

/** Right-aligned keyboard hint inside a CommandItem (display only: it does not bind the key). */
function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ml-auto font-mono text-[11px] tracking-widest text-foreground-lighter",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  type CommandDialogProps,
}
