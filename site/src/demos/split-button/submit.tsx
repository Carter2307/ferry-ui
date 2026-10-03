import { Button, DropdownMenuItem, Field, Input, SplitButton, toast } from 'libui-kit'
import { CalendarClock, Save } from 'lucide-react'

export default function SplitButtonSubmit() {
  return (
    <form
      className="mx-auto flex w-full max-w-sm flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        toast.success('Page published')
      }}
    >
      <Field label="Title">
        <Input defaultValue="Release notes for March" />
      </Field>
      <div className="flex items-center justify-end gap-2">
        <Button type="reset">Cancel</Button>
        {/* Enter in the field submits the form: it runs the main action. */}
        <SplitButton
          type="submit"
          variant="primary"
          menuLabel="More publish options"
          menu={
            <>
              <DropdownMenuItem onSelect={() => toast('Schedule the page')}>
                <CalendarClock /> Schedule for later…
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => toast.success('Draft saved')}>
                <Save /> Save as draft
              </DropdownMenuItem>
            </>
          }
        >
          Publish
        </SplitButton>
      </div>
    </form>
  )
}
