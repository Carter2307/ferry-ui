import * as React from 'react'
import { Button, Field, Input, Popover, PopoverContent, PopoverTrigger } from 'libui'

export default function PopoverControlled() {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState('Billing portal')
  const [draft, setDraft] = React.useState(name)

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setName(draft.trim() || name)
    // The form is done: close the popover from the code.
    setOpen(false)
  }

  return (
    <>
      <span className="text-sm font-medium text-foreground">{name}</span>
      <Popover
        open={open}
        onOpenChange={(next) => {
          // Start each edit from the current name.
          if (next) setDraft(name)
          setOpen(next)
        }}
      >
        <PopoverTrigger asChild>
          <Button variant="ghost" size="tiny">
            Rename
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" aria-label="Rename project">
          <form className="flex flex-col gap-3" onSubmit={save}>
            <Field label="Project name" size="sm" hint="The URL of the project does not change.">
              <Input size="sm" value={draft} onChange={(event) => setDraft(event.target.value)} />
            </Field>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">
                Save
              </Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    </>
  )
}
