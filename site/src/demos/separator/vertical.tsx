import { Separator } from 'libui-kit'

export default function SeparatorVertical() {
  return (
    // The parent has a height: the lines take this height.
    <div className="flex h-5 items-center gap-3 text-sm text-foreground-light">
      <span>12 members</span>
      <Separator orientation="vertical" />
      <span>3 projects</span>
      <Separator orientation="vertical" />
      <span>Pro plan</span>
    </div>
  )
}
