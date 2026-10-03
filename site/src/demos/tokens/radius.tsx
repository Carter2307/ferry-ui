import { cn } from 'ferry-ui'

const RADII = [
  { className: 'rounded-sm', variable: '--libui-radius-sm', size: '4px' },
  { className: 'rounded-md', variable: '--libui-radius-md', size: '6px' },
  { className: 'rounded-lg', variable: '--libui-radius-lg', size: '8px' },
  { className: 'rounded-xl', variable: '--libui-radius-xl', size: '12px' },
  { className: 'rounded-full', variable: 'No variable', size: 'Full' },
]

export default function RadiusTokens() {
  return (
    <ul className="grid w-full gap-x-6 gap-y-4 sm:grid-cols-2">
      {RADII.map((token) => (
        <li key={token.className} className="flex items-center gap-3">
          <span
            className={cn('grid size-12 shrink-0 place-items-center border border-border-strong bg-surface-100 text-xs text-foreground-light', token.className)}
          >
            {token.size}
          </span>
          <span className="flex min-w-0 flex-col font-mono">
            <span className="truncate text-[13px] text-foreground">{token.className}</span>
            <span className="truncate text-xs text-foreground-lighter">{token.variable}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
