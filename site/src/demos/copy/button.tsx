import { CopyButton } from '@roger.b/libui'

const INVOICES = ['INV-2026-0142', 'INV-2026-0143']

export default function CopyButtonIcon() {
  return (
    <ul className="w-full max-w-xs divide-y rounded-lg border bg-surface-100">
      {INVOICES.map((invoice) => (
        <li key={invoice} className="flex items-center justify-between gap-3 px-4 py-2">
          <span className="font-mono text-[13px] text-foreground">{invoice}</span>
          {/* `what` gives the tooltip and the accessible name: "Copy invoice number". */}
          <CopyButton value={invoice} what="invoice number" variant="ghost" />
        </li>
      ))}
    </ul>
  )
}
