import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'libui'

const CHANGES = [
  'Invoices show the tax for each line.',
  'Members can have more than one role.',
  'API keys can expire on a date.',
  'The audit log keeps 90 days of events.',
  'Projects can move to another workspace.',
  'Exports include the archived orders.',
  'The search finds customers by email.',
  'Webhooks send a new event for refunds.',
  'The dashboard shows the usage for each day.',
  'Notifications have a weekly summary.',
  'The billing page lists the past payments.',
  'Each order shows its delivery status.',
]

export default function DialogScroll() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Release notes</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Release notes</DialogTitle>
          <DialogDescription>The changes of this month.</DialogDescription>
        </DialogHeader>
        <DialogBody className="max-h-64">
          <ul className="flex flex-col gap-3 text-[13px] text-foreground-light">
            {CHANGES.map((change) => (
              <li key={change}>{change}</li>
            ))}
          </ul>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="primary">Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
