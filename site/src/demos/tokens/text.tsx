import { cn } from '@roger.b/libui'

const TEXT = [
  { className: 'text-foreground', variable: '--foreground', sample: 'Invoice INV-2041' },
  { className: 'text-foreground-light', variable: '--foreground-light', sample: 'Sent to Acme on October 1' },
  { className: 'text-foreground-lighter', variable: '--foreground-lighter', sample: 'Due in 14 days' },
  { className: 'text-foreground-muted', variable: '--foreground-muted', sample: '/  ·  $' },
]

export default function TextTokens() {
  return (
    <ul className="flex w-full flex-col divide-y">
      {TEXT.map((token) => (
        <li key={token.variable} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3">
          <span className={cn('text-sm', token.className)}>{token.sample}</span>
          <span className="flex gap-4 font-mono">
            <span className="text-[13px] text-foreground">{token.className}</span>
            <span className="text-xs text-foreground-lighter">{token.variable}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
