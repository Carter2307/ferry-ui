import type * as React from 'react'
import { CircleCheck, Info, Loader2, OctagonX, TriangleAlert } from 'lucide-react'
import { Toaster as Sonner, toast as sonnerToast, type ToasterProps as SonnerToasterProps } from 'sonner'

import { cn } from '../../lib/utils'
import { useTheme } from '../../theme/theme-provider'

/**
 * Props of {@link Toaster}: every sonner `ToasterProps` option (position, duration, expand,
 * visibleToasts, closeButton, richColors, offset, hotkey…). `className`, `style`, `icons` and
 * `toastOptions` (including `toastOptions.classNames`) are merged with the design-system defaults
 * instead of replacing them; every other prop simply overrides its default.
 */
type ToasterProps = SonnerToasterProps

const defaultIcons = {
  success: <CircleCheck className="size-4 text-success" />,
  info: <Info className="size-4 text-info" />,
  warning: <TriangleAlert className="size-4 text-warning" />,
  error: <OctagonX className="size-4 text-destructive" />,
  loading: <Loader2 className="size-4 animate-spin text-foreground-lighter" />,
}

const defaultClassNames = {
  toast: '!items-start !gap-2.5 !font-sans !text-[13px] !shadow-overlay',
  title: '!font-medium !text-foreground',
  description: '!text-foreground-light !text-[13px]',
  icon: '!mt-px',
  closeButton: '!border-border-strong !bg-popover !text-foreground-lighter hover:!text-foreground',
  actionButton: '!bg-primary-solid !text-primary-foreground !rounded-md !font-medium',
  cancelButton: '!bg-surface-200 !text-foreground !rounded-md',
}

/**
 * Toast outlet (sonner) styled for the design system: raised popover surface, strong 1px border,
 * 8px radius, colored status icon, close button, bottom-right. Mount it once near the app root,
 * then call `toast()` / `toast.success|error|warning|info|loading|promise()` anywhere; import
 * `toast` from this library (re-exported from sonner) so it always talks to the same sonner copy
 * as this Toaster. Follows the current light / dark theme through `useTheme()` (a ThemeProvider
 * is optional). Use toasts for brief, non-blocking feedback about something that just happened;
 * do NOT use them for errors that need a decision (use an alert dialog) or for persistent status
 * (use an inline alert). Do not mount more than one Toaster unless you give each an `id`.
 */
function Toaster({ className, style, icons, toastOptions, ...props }: ToasterProps) {
  const { resolvedTheme } = useTheme()
  const classNames = toastOptions?.classNames
  return (
    <Sonner
      theme={resolvedTheme}
      position="bottom-right"
      closeButton
      {...props}
      className={cn('toaster group', className)}
      icons={{ ...defaultIcons, ...icons }}
      toastOptions={{
        ...toastOptions,
        classNames: {
          ...classNames,
          toast: cn(defaultClassNames.toast, classNames?.toast),
          title: cn(defaultClassNames.title, classNames?.title),
          description: cn(defaultClassNames.description, classNames?.description),
          icon: cn(defaultClassNames.icon, classNames?.icon),
          closeButton: cn(defaultClassNames.closeButton, classNames?.closeButton),
          actionButton: cn(defaultClassNames.actionButton, classNames?.actionButton),
          cancelButton: cn(defaultClassNames.cancelButton, classNames?.cancelButton),
        },
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border-strong)',
          '--border-radius': '8px',
          ...style,
        } as React.CSSProperties
      }
    />
  )
}

/**
 * Fires a toast into the mounted {@link Toaster} (sonner's `toast`, re-exported so the call and the
 * outlet always share one copy of sonner). `toast(title, { description, action, cancel, id,
 * duration })` for neutral messages; `toast.success|error|warning|info(...)` for a status icon;
 * `toast.loading(...)` then `toast.success(..., { id })` to update it in place;
 * `toast.promise(promise, { loading, success, error })` to follow an async task;
 * `toast.dismiss(id?)` to close one or all. Returns the toast id. Keep titles to a short sentence.
 */
const toast: typeof sonnerToast = sonnerToast

export { Toaster, toast, type ToasterProps }
