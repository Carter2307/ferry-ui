import {
  Button,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@roger.b/libui'

const MEMBERS = ['Maya Chen', 'Sam Lee', 'Ada Park']
const EVENTS = ['changed the billing address', 'invited a new member', 'renamed a project', 'exported the invoices']

const ACTIVITY = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  who: MEMBERS[index % MEMBERS.length],
  what: EVENTS[index % EVENTS.length],
  when: `${index + 2} min ago`,
}))

export default function SheetScroll() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Show activity</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Activity</SheetTitle>
          <SheetDescription>The last changes in this workspace.</SheetDescription>
        </SheetHeader>
        {/* `gap-0 p-0` lets the list touch the edges of the panel. */}
        <SheetBody className="gap-0 p-0">
          <ul className="divide-y">
            {ACTIVITY.map((item) => (
              <li key={item.id} className="flex flex-col gap-0.5 px-4 py-2.5">
                <span className="text-[13px] text-foreground">
                  <span className="font-medium">{item.who}</span> {item.what}
                </span>
                <span className="text-xs text-foreground-lighter">{item.when}</span>
              </li>
            ))}
          </ul>
        </SheetBody>
        <SheetFooter>
          <Button>Load older activity</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
