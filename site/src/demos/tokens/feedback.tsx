import { cn } from 'ferry-ui'

const FEEDBACK = [
  { className: 'bg-success', variable: '--success' },
  { className: 'bg-success-soft', variable: '--success-soft' },
  { className: 'bg-warning', variable: '--warning' },
  { className: 'bg-warning-soft', variable: '--warning-soft' },
  { className: 'bg-warning-border', variable: '--warning-border' },
  { className: 'bg-destructive', variable: '--destructive' },
  { className: 'bg-destructive-solid', variable: '--destructive-solid' },
  { className: 'bg-destructive-soft', variable: '--destructive-soft' },
  { className: 'bg-destructive-border', variable: '--destructive-border' },
  { className: 'bg-info', variable: '--info' },
  { className: 'bg-info-soft', variable: '--info-soft' },
  { className: 'bg-info-border', variable: '--info-border' },
]

export default function FeedbackTokens() {
  return (
    <ul className="grid w-full gap-x-6 gap-y-4 sm:grid-cols-2">
      {FEEDBACK.map((token) => (
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
