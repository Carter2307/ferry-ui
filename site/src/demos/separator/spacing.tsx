import { Separator } from 'libui-kit'

export default function SeparatorSpacing() {
  return (
    <div className="w-full max-w-xs text-sm">
      <div className="flex justify-between">
        <span className="text-foreground-light">Plan</span>
        <span className="text-foreground">Pro</span>
      </div>
      <Separator className="my-3" />
      <div className="flex justify-between">
        <span className="text-foreground-light">Seats</span>
        <span className="tabular text-foreground">8 of 10</span>
      </div>
      <Separator className="my-3" />
      <div className="flex justify-between">
        <span className="text-foreground-light">Next invoice</span>
        <span className="text-foreground">Nov 1</span>
      </div>
    </div>
  )
}
