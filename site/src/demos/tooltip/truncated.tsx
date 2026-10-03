import { Hint } from 'ferry-ui'

const INVOICES = [
  { id: 'INV-2041', customer: 'Acme International Trading Company', amount: '$4,200.00' },
  { id: 'INV-2042', customer: 'Example Logistics and Supply Partners', amount: '$860.00' },
  { id: 'INV-2043', customer: 'Sample Health and Insurance Services', amount: '$12,940.50' },
]

export default function TooltipOnTruncatedText() {
  return (
    <ul className="w-80 max-w-full divide-y rounded-lg border bg-surface-100 text-[13px]">
      {INVOICES.map((invoice) => (
        <li key={invoice.id} className="flex items-center gap-3 px-3 py-2">
          <span className="shrink-0 font-mono text-xs text-foreground-lighter">{invoice.id}</span>
          <Hint label={invoice.customer}>
            {/* `tabIndex={0}` lets keyboard users get the tooltip. */}
            <span
              tabIndex={0}
              className="min-w-0 flex-1 truncate rounded-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {invoice.customer}
            </span>
          </Hint>
          <span className="tabular shrink-0 text-foreground-light">{invoice.amount}</span>
        </li>
      ))}
    </ul>
  )
}
