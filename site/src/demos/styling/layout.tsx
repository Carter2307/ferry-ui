import { Button, Input } from '@roger.b/libui'

export default function LayoutClasses() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex items-center gap-2">
        {/* `flex-1`: the field takes the space that the button leaves. */}
        <Input type="email" aria-label="Email of the member" placeholder="maya@example.com" className="flex-1" />
        <Button size="md">Invite</Button>
      </div>
      {/* `max-w-48`: a short field for a short value. */}
      <Input mono aria-label="Project slug" defaultValue="billing-portal" className="max-w-48" />
      {/* `w-full`: the button takes the full width of the column. */}
      <Button size="md" variant="primary" className="w-full">
        Create project
      </Button>
    </div>
  )
}
