import * as React from 'react'
import { DropdownMenuItem, SplitButton, toast } from 'libui-kit'
import { CalendarClock, Save, Send } from 'lucide-react'

export default function SplitButtonLoading() {
  const [publishing, setPublishing] = React.useState(false)

  function publish() {
    setPublishing(true)
    // Stands for a request to the server.
    window.setTimeout(() => {
      setPublishing(false)
      toast.success('Page published')
    }, 1500)
  }

  return (
    <SplitButton
      variant="primary"
      icon={<Send />}
      loading={publishing}
      onClick={publish}
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
      {publishing ? 'Publishing…' : 'Publish'}
    </SplitButton>
  )
}
