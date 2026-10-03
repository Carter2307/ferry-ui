import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger, Field, Input } from 'libui-kit'
import { ChevronRight } from 'lucide-react'

export default function CollapsibleHero() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Field label="Project name">
        <Input defaultValue="Website redesign" />
      </Field>
      <Collapsible className="flex flex-col gap-4">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="group w-fit"
            icon={<ChevronRight className="transition-transform group-data-[state=open]:rotate-90" />}
          >
            Advanced options
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex flex-col gap-4">
          <Field label="URL slug">
            <Input mono defaultValue="website-redesign" />
          </Field>
          <Field label="Task prefix">
            <Input mono defaultValue="WEB" />
          </Field>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
