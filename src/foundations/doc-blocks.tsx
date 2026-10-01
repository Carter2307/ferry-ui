import * as React from 'react'

import { cn } from '../lib/utils'

/*
 * Small building blocks shared by the Foundations stories (not part of the public API and not
 * exported from the package). They only use design tokens, so the docs pages themselves follow
 * the light / dark toggle.
 */

const SEPARATOR = '\u001f'

function subscribeTo(element: HTMLElement | null | undefined) {
  return (onChange: () => void) => {
    const observer = new MutationObserver(onChange)
    const options = { attributes: true, attributeFilter: ['class', 'style'] }
    observer.observe(document.documentElement, options)
    if (element) observer.observe(element, options)
    return () => observer.disconnect()
  }
}

/**
 * Reads the computed value of CSS custom properties (e.g. `--primary`) and re-reads them whenever
 * the `class` or `style` of <html> (theme toggle) or of `element` (local overrides) changes, and on
 * every render of the caller. Pass a stable (module-level) `names` array.
 * Values are empty strings where no stylesheet is loaded (tests, server rendering).
 */
export function useCssVariables(names: readonly string[], element?: HTMLElement | null): Record<string, string> {
  const subscribe = React.useMemo(() => subscribeTo(element), [element])
  const getSnapshot = React.useCallback(() => {
    const style = window.getComputedStyle(element ?? document.documentElement)
    return names.map((name) => style.getPropertyValue(name).trim()).join(SEPARATOR)
  }, [names, element])
  const snapshot = React.useSyncExternalStore(subscribe, getSnapshot, () => '')
  return React.useMemo(() => {
    const values = snapshot.split(SEPARATOR)
    return Object.fromEntries(names.map((name, i) => [name, values[i] ?? '']))
  }, [names, snapshot])
}

/** Renders `backticked` segments of a plain string as {@link Code} chips. */
export function withInlineCode(text: React.ReactNode): React.ReactNode {
  if (typeof text !== 'string' || !text.includes('`')) return text
  return text.split('`').map((part, i) => (i % 2 === 1 ? <Code key={i}>{part}</Code> : part))
}

/** A titled block of a Foundations page. A string description may use `backticks` for code. */
export function DocSection({
  title,
  description,
  className,
  children,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  className?: string
  children?: React.ReactNode
}) {
  return (
    <section className={cn('flex flex-col gap-4', className)}>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-medium text-foreground">{title}</h2>
        {description && <p className="max-w-2xl text-[13px] text-foreground-light">{withInlineCode(description)}</p>}
      </div>
      {children}
    </section>
  )
}

/** Inline code chip for class names, variables and values. */
export function Code({ className, ...props }: React.ComponentProps<'code'>) {
  return (
    <code
      className={cn(
        'rounded-sm border bg-surface-200 px-1 py-px font-mono text-[11.5px] break-all text-foreground-light',
        className,
      )}
      {...props}
    />
  )
}

/** Code block for snippets shown next to live demos. */
export function Snippet({ children, className }: { children: string; className?: string }) {
  return (
    <pre
      className={cn(
        'overflow-x-auto rounded-lg border bg-code px-3 py-2.5 font-mono text-[12.5px] leading-relaxed text-foreground',
        className,
      )}
    >
      <code>{children}</code>
    </pre>
  )
}

/** Computed value of a token, or a dash when no stylesheet is loaded. */
export function TokenValue({ value, className }: { value: string | undefined; className?: string }) {
  return (
    <span
      className={cn('font-mono text-[11.5px] break-all text-foreground-lighter', className)}
      title={value ? undefined : 'Computed in the browser'}
    >
      {value || '—'}
    </span>
  )
}
