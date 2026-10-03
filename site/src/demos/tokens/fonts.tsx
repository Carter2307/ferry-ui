import { cn } from 'libui'

const FONTS = [
  { className: 'font-sans', variable: '--libui-font-sans', sample: 'Invoices of October 2026' },
  { className: 'font-mono', variable: '--libui-font-mono', sample: 'inv_2041 · 4,280.00 USD' },
]

export default function FontTokens() {
  return (
    <ul className="flex w-full flex-col divide-y">
      {FONTS.map((token) => (
        <li key={token.variable} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3">
          <span className={cn('text-lg text-foreground', token.className)}>{token.sample}</span>
          <span className="flex gap-4 font-mono">
            <span className="text-[13px] text-foreground">{token.className}</span>
            <span className="text-xs text-foreground-lighter">{token.variable}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
