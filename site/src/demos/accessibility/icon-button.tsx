import { Button, Hint } from '@roger.b/libui'
import { Download, RefreshCw } from 'lucide-react'

export default function IconButtonNames() {
  return (
    <>
      <Hint label="Refresh">
        <Button variant="ghost" size="icon" icon={<RefreshCw />} aria-label="Refresh" />
      </Hint>
      <Hint label="Download CSV">
        <Button size="icon" icon={<Download />} aria-label="Download CSV" />
      </Hint>
    </>
  )
}
