import { Button, Hint } from '@roger.b/libui'
import { Download, RefreshCw, Settings } from 'lucide-react'

export default function TooltipHero() {
  return (
    <>
      <Hint label="Refresh">
        <Button size="icon" icon={<RefreshCw />} aria-label="Refresh" />
      </Hint>
      <Hint label="Download CSV">
        <Button size="icon" icon={<Download />} aria-label="Download CSV" />
      </Hint>
      <Hint label="Settings">
        <Button size="icon" icon={<Settings />} aria-label="Settings" />
      </Hint>
    </>
  )
}
