import { cn } from '@roger.b/libui'

const BORDERS = [
  { className: 'border', variable: '--border' },
  { className: 'border border-border-strong', variable: '--border-strong' },
  { className: 'border border-border-stronger', variable: '--border-stronger' },
]

export default function BorderTokens() {
  return (
    <ul className="grid w-full gap-4 sm:grid-cols-3">
      {BORDERS.map((token) => (
        <li key={token.variable} className={cn('flex flex-col gap-1 rounded-lg bg-surface-100 p-4 font-mono', token.className)}>
          <span className="text-[13px] text-foreground">{token.className}</span>
          <span className="text-xs text-foreground-lighter">{token.variable}</span>
        </li>
      ))}
    </ul>
  )
}
