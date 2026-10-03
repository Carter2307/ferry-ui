import { StatusDot } from 'libui'

export default function StatusDots() {
  return (
    <ul className="flex flex-col gap-2 text-[13px] text-foreground-light">
      <li className="flex items-center gap-2">
        <StatusDot tone="success" /> 3 endpoints online
      </li>
      <li className="flex items-center gap-2">
        <StatusDot tone="info" pulse /> Live updates on
      </li>
      <li className="flex items-center gap-2">
        {/* No text names the state: the dot needs a label. */}
        <StatusDot tone="destructive" label="Offline" />
        <span className="font-mono">orders-webhook</span>
      </li>
    </ul>
  )
}
