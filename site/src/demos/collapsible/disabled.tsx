import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from 'libui-kit'
import { ChevronRight } from 'lucide-react'

export default function CollapsibleDisabled() {
  return (
    <Collapsible disabled className="flex flex-col gap-2">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" icon={<ChevronRight />}>
          Advanced options
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="text-[13px] text-foreground-light">
        The options of the project.
      </CollapsibleContent>
    </Collapsible>
  )
}
