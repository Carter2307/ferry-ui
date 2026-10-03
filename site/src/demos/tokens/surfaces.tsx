import { cn } from 'libui'

const SURFACES = [
  { className: 'bg-background', variable: '--background' },
  { className: 'bg-surface-75', variable: '--surface-75' },
  { className: 'bg-surface-100', variable: '--surface-100' },
  { className: 'bg-surface-200', variable: '--surface-200' },
  { className: 'bg-surface-300', variable: '--surface-300' },
  { className: 'bg-selection', variable: '--selection' },
  { className: 'bg-overlay', variable: '--overlay' },
  { className: 'bg-code', variable: '--code-bg' },
]

export default function SurfaceTokens() {
  return (
    <ul className="grid w-full gap-x-6 gap-y-4 sm:grid-cols-2">
      {SURFACES.map((token) => (
        <li key={token.variable} className="flex items-center gap-3">
          <span aria-hidden="true" className={cn('size-10 shrink-0 rounded-md border border-border-strong', token.className)} />
          <span className="flex min-w-0 flex-col font-mono">
            <span className="truncate text-[13px] text-foreground">{token.className}</span>
            <span className="truncate text-xs text-foreground-lighter">{token.variable}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
