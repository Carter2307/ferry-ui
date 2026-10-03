import { cn } from 'libui'

const CHARTS = [
  { className: 'bg-chart-1', variable: '--chart-1' },
  { className: 'bg-chart-2', variable: '--chart-2' },
  { className: 'bg-chart-3', variable: '--chart-3' },
  { className: 'bg-chart-4', variable: '--chart-4' },
  { className: 'bg-chart-5', variable: '--chart-5' },
]

export default function ChartTokens() {
  return (
    <ul className="grid w-full gap-x-6 gap-y-4 sm:grid-cols-2">
      {CHARTS.map((token) => (
        <li key={token.variable} className="flex items-center gap-3">
          <span aria-hidden="true" className={cn('size-10 shrink-0 rounded-md', token.className)} />
          <span className="flex min-w-0 flex-col font-mono">
            <span className="truncate text-[13px] text-foreground">{token.className}</span>
            <span className="truncate text-xs text-foreground-lighter">{token.variable}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
