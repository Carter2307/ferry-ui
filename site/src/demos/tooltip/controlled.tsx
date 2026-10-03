import * as React from 'react'
import { Button, Tooltip, TooltipContent, TooltipTrigger } from 'libui-kit'
import { Archive } from 'lucide-react'

export default function TooltipControlled() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <Button size="icon" icon={<Archive />} aria-label="Archive project" />
        </TooltipTrigger>
        <TooltipContent>Archive project</TooltipContent>
      </Tooltip>
      <span className="text-[13px] text-foreground-light">The tooltip is {open ? 'open' : 'closed'}.</span>
    </>
  )
}
