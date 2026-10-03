import { cn } from 'ferry-ui'

const PRIMARY = [
  { className: 'bg-primary', variable: '--primary' },
  { className: 'bg-primary-solid', variable: '--primary-solid' },
  { className: 'bg-primary-solid-border', variable: '--primary-solid-border' },
  { className: 'bg-primary-bright', variable: '--primary-bright' },
  { className: 'bg-primary-soft', variable: '--primary-soft' },
  { className: 'bg-primary-foreground', variable: '--primary-foreground' },
  { className: 'bg-ring', variable: '--ring' },
  { className: 'bg-brand', variable: '--brand' },
]

export default function PrimaryTokens() {
  return (
    <ul className="grid w-full gap-x-6 gap-y-4 sm:grid-cols-2">
      {PRIMARY.map((token) => (
        <li key={token.variable} className="flex items-center gap-3">
          <span aria-hidden="true" className={cn('size-10 shrink-0 rounded-md border', token.className)} />
          <span className="flex min-w-0 flex-col font-mono">
            <span className="truncate text-[13px] text-foreground">{token.className}</span>
            <span className="truncate text-xs text-foreground-lighter">{token.variable}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
