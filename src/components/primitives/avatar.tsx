import * as React from "react"
import { cn } from "../../lib/utils"
import { Avatar as AvatarPrimitive } from "radix-ui"

/** Props of {@link Avatar}: every Radix `Avatar.Root` prop plus `size`. */
type AvatarProps = React.ComponentProps<typeof AvatarPrimitive.Root> & {
  /**
   * Diameter: `sm` 24px, `md` 32px (default), `lg` 40px. Children (fallback text, badge) scale
   * with it. `default` is a deprecated alias of `md`.
   */
  size?: "sm" | "md" | "lg" | "default"
}

/**
 * Circular user or entity picture with an automatic fallback. Compose it from
 * `AvatarImage` + `AvatarFallback` (initials or an icon); the fallback shows while the
 * image loads and whenever it fails. Sizes: `sm` (24px), `md` (32px, the default), `lg` (40px).
 * Round by default; pass a radius class (`rounded-md`) for organization avatars — the image
 * and fallback inherit the radius. The root does not clip, so an `AvatarBadge` can overhang it.
 * Use it for people, teams or organizations; for app or file icons use a plain icon instead.
 */
function Avatar({ className, size = "md", ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size === "default" ? "md" : size}
      className={cn(
        "group/avatar relative flex size-8 shrink-0 rounded-full select-none data-[size=lg]:size-10 data-[size=sm]:size-6",
        className
      )}
      {...props}
    />
  )
}

/**
 * The picture inside an `Avatar`. Rendered only once the image has loaded, so always pair
 * it with an `AvatarFallback`. Always pass a meaningful `alt` (usually the person's name).
 */
function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full rounded-[inherit] object-cover", className)}
      {...props}
    />
  )
}

/**
 * Content shown while the `AvatarImage` loads or when it fails (or when there is no image):
 * one or two initials, or a small icon. Use `delayMs` to avoid a flash on fast networks.
 */
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-[inherit] bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs",
        className
      )}
      {...props}
    />
  )
}

/**
 * Small dot pinned to the bottom-right of an `Avatar`, e.g. a presence indicator.
 * Primary-colored by default — override the background with a tone class (`bg-success`,
 * `bg-warning`, `bg-foreground-muted`) for online/away/offline. Hides icons at size `sm`.
 * It is a plain `<span>`: when the state matters to screen readers, give it `role="img"`
 * plus an `aria-label` ("Online"), or put visually hidden text inside it.
 */
function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=md]/avatar:size-2.5 group-data-[size=md]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className
      )}
      {...props}
    />
  )
}

/**
 * Horizontal stack of overlapping `Avatar`s (each ringed with, and filled over, the background
 * color, so the one underneath never shows through).
 * Use it to show members of a team or collaborators on an item; cap the visible avatars
 * and append an `AvatarGroupCount` for the rest.
 */
function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        // Stacked avatars get an opaque base (same colour as their ring) under the translucent
        // `bg-muted` fallback, so the avatar underneath does not show through.
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:bg-background *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className
      )}
      {...props}
    />
  )
}

/**
 * The trailing "+N" bubble of an `AvatarGroup`, sized to match the avatars in the group.
 * Accepts text ("+5") or an icon; with an icon, add visually hidden text ("5 more members").
 * Only meaningful as the last child of an `AvatarGroup`. It is not interactive: if the
 * overflow should open the full member list, put the whole group inside a button or link.
 */
function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        // Opaque: the translucent muted tint is layered (as an image) over the page background colour.
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-background bg-linear-to-b from-muted to-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
  type AvatarProps,
}
