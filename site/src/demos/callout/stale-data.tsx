import * as React from 'react'
import { StaleDataCallout } from 'libui-kit'

const ORDERS = [
  { id: 'ORD-1042', customer: 'Northwind Traders', total: '$1,250.00' },
  { id: 'ORD-1043', customer: 'Acme', total: '$348.00' },
  { id: 'ORD-1044', customer: 'Globex', total: '$92.50' },
]

export default function CalloutStaleData() {
  const [retrying, setRetrying] = React.useState(false)

  function retry() {
    setRetrying(true)
    window.setTimeout(() => setRetrying(false), 1500)
  }

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <StaleDataCallout error={new Error('The orders service did not answer in time.')} onRetry={retry} retrying={retrying} />
      <ul className="divide-y rounded-lg border bg-surface-100 text-[13px]">
        {ORDERS.map((order) => (
          <li key={order.id} className="flex items-center justify-between gap-4 px-4 py-2.5">
            <span className="text-foreground">
              <span className="font-mono">{order.id}</span> · {order.customer}
            </span>
            <span className="text-foreground-light tabular">{order.total}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
