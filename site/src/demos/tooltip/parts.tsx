import { Button, Tooltip, TooltipContent, TooltipTrigger } from 'libui'

export default function TooltipParts() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="tiny">
          Updated 2 hours ago
        </Button>
      </TooltipTrigger>
      {/* The parts give access to the props of the content: `side`, `align`, `sideOffset`. */}
      <TooltipContent side="bottom" align="start">
        March 3, 2026 at 14:05
      </TooltipContent>
    </Tooltip>
  )
}
