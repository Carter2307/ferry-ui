import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from 'ferry-ui'
import { ChevronRight } from 'lucide-react'

export default function CollapsibleAnimated() {
  return (
    <Collapsible className="flex w-full max-w-sm flex-col">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="group w-fit"
          icon={<ChevronRight className="transition-transform group-data-[state=open]:rotate-90" />}
        >
          Payment terms
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        {/* The padding is on an inner element: the animation changes the height of the content. */}
        <p className="px-2.5 pt-2 text-[13px] text-foreground-light">
          The customer pays each invoice in 30 days. A late payment adds a fee of 2% to the next invoice.
        </p>
      </CollapsibleContent>
    </Collapsible>
  )
}
