import * as React from 'react'
import { TopBarSearch } from '@roger.b/libui'

export default function TopBarSearchDemo() {
  const [clicks, setClicks] = React.useState(0)
  const open = () => setClicks((count) => count + 1)

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <TopBarSearch onClick={open} />
        <TopBarSearch placeholder="Search invoices…" shortcut="/" keyShortcuts="/" onClick={open} />
        <TopBarSearch placeholder="Go to…" shortcut={false} onClick={open} />
        <TopBarSearch compactOnMobile={false} onClick={open} />
      </div>
      <p className="text-[13px] text-foreground-light">Clicks: {clicks}</p>
    </div>
  )
}
