import {
  Button,
  Field,
  Input,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Textarea,
} from 'ferry-ui'

export default function SheetHero() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Edit member</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit member</SheetTitle>
          <SheetDescription>The changes apply to each project of the workspace.</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <Field label="Full name">
            <Input defaultValue="Maya Chen" />
          </Field>
          <Field label="Email">
            <Input type="email" defaultValue="maya@example.com" />
          </Field>
          <Field label="Note" optional hint="Only the admins of the workspace see this note.">
            <Textarea />
          </Field>
        </SheetBody>
        <SheetFooter className="flex-row justify-end">
          <SheetClose asChild>
            <Button>Cancel</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="primary">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
