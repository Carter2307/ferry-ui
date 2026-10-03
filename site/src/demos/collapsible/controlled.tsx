import * as React from 'react'
import { Button, Card, Collapsible, CollapsibleContent, CollapsibleTrigger } from 'libui-kit'

const MEMBERS = ['Maya Chen', 'Liam Novak', 'Sara Ortiz', 'Tom Becker', 'Aiko Tanaka', 'Omar Haddad']

export default function CollapsibleControlled() {
  const [open, setOpen] = React.useState(false)
  const first = MEMBERS.slice(0, 3)
  const rest = MEMBERS.slice(3)

  return (
    <Card className="w-full max-w-sm">
      <Collapsible open={open} onOpenChange={setOpen}>
        <ul className="divide-y text-[13px] text-foreground">
          {first.map((member) => (
            <li key={member} className="px-4 py-2.5">
              {member}
            </li>
          ))}
        </ul>
        <CollapsibleContent asChild>
          <ul className="divide-y border-t text-[13px] text-foreground">
            {rest.map((member) => (
              <li key={member} className="px-4 py-2.5">
                {member}
              </li>
            ))}
          </ul>
        </CollapsibleContent>
        <div className="border-t p-1.5">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="tiny" className="w-full">
              {open ? 'Show less' : `Show ${rest.length} more`}
            </Button>
          </CollapsibleTrigger>
        </div>
      </Collapsible>
    </Card>
  )
}
