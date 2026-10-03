import { Button, Hint } from '@roger.b/libui'
import { Trash2 } from 'lucide-react'

export default function TooltipOnDisabledButton() {
  return (
    <Hint label="Only an admin of the workspace can delete a project">
      {/* A disabled button gets no hover and no focus: the span is the trigger. */}
      <span tabIndex={0} className="inline-flex rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Button variant="destructive" icon={<Trash2 />} disabled>
          Delete project
        </Button>
      </span>
    </Hint>
  )
}
