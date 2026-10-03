import * as React from 'react'
import { CodeBlock, Tabs, TabsContent, TabsList, TabsTrigger, cn } from 'libui-kit'

import { highlightCode, isCommandList, isShell } from '@/lib/highlight'

interface CodeProps {
  /** The snippet, as plain text. */
  code: string
  /** Language of the fence (`tsx`, `css`, `sh`…). JavaScript and TypeScript get token colors. */
  language?: string
  /** File name or short label shown in a bar above the snippet. */
  title?: string
  className?: string
}

/**
 * A code sample: libui's `CodeBlock` with token colors and an optional title bar. Shell commands
 * show a `$` prompt that the copy button leaves out.
 */
export function Code({ code, language, title, className }: CodeProps) {
  const text = code.replace(/\n+$/, '')
  const shell = isShell(language) && isCommandList(text)
  const block = shell ? (
    <CodeBlock code={text} prompt className={cn(title && 'rounded-t-none border-t-0')} />
  ) : (
    <CodeBlock copyValue={text} what="code" className={cn(title && 'rounded-t-none border-t-0')}>
      <code dangerouslySetInnerHTML={{ __html: highlightCode(text, language) }} />
    </CodeBlock>
  )
  if (!title) return <div className={className}>{block}</div>
  return (
    <figure className={className}>
      <figcaption className="flex h-9 items-center rounded-t-md border bg-surface-75 px-3 text-[13px] text-foreground-light">
        {title}
      </figcaption>
      {block}
    </figure>
  )
}

/** `title="app.tsx"` in the info string of a fence. */
const metaTitle = (meta?: string) => (meta ? /\btitle=(?:"([^"]*)"|'([^']*)')/.exec(meta)?.slice(1).find(Boolean) : undefined)

type PreProps = React.ComponentProps<'pre'> & { 'data-language'?: string; 'data-meta'?: string }

/** The `pre` of a Markdown fence, rendered as a {@link Code} block. */
export function Pre({ children, 'data-language': language, 'data-meta': meta }: PreProps) {
  const code = React.isValidElement<{ children?: React.ReactNode }>(children) ? children.props.children : children
  return <Code code={typeof code === 'string' ? code : String(code ?? '')} language={language} title={metaTitle(meta)} />
}

/* -------------------------------------------------------------------------------------------------
 * PackageTabs
 * -----------------------------------------------------------------------------------------------*/

const MANAGERS = [
  { id: 'npm', install: 'npm install' },
  { id: 'pnpm', install: 'pnpm add' },
  { id: 'yarn', install: 'yarn add' },
  { id: 'bun', install: 'bun add' },
] as const

type ManagerId = (typeof MANAGERS)[number]['id']

const STORAGE_KEY = 'libui-site-package-manager'
const listeners = new Set<() => void>()
let choice: ManagerId | null = null

const isManager = (value: unknown): value is ManagerId => MANAGERS.some((manager) => manager.id === value)

function readChoice(): ManagerId {
  if (choice) return choice
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isManager(stored)) choice = stored
  } catch {
    // Storage is not available (private mode): the choice lasts for this visit.
  }
  return choice ?? 'npm'
}

function writeChoice(next: ManagerId) {
  choice = next
  try {
    window.localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // See readChoice.
  }
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * The command that adds packages, for npm, pnpm, yarn and bun. The reader picks a manager once:
 * every `PackageTabs` of the site then shows it, on this visit and the next.
 */
export function PackageTabs({ packages }: { packages: string }) {
  const manager = React.useSyncExternalStore(subscribe, readChoice, () => 'npm' as ManagerId)
  return (
    <Tabs value={manager} onValueChange={(value) => isManager(value) && writeChoice(value)}>
      <TabsList variant="pills" aria-label="Package manager">
        {MANAGERS.map((entry) => (
          <TabsTrigger key={entry.id} value={entry.id}>
            {entry.id}
          </TabsTrigger>
        ))}
      </TabsList>
      {MANAGERS.map((entry) => (
        <TabsContent key={entry.id} value={entry.id}>
          <CodeBlock code={`${entry.install} ${packages}`} prompt />
        </TabsContent>
      ))}
    </Tabs>
  )
}
