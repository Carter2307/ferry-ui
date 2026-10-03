import { Separator } from 'libui-kit'

export default function SeparatorHero() {
  return (
    <div className="w-full max-w-xs">
      <div className="text-sm font-medium text-foreground">Workspace settings</div>
      <p className="text-[13px] text-foreground-light">The name, the members and the plan.</p>
      <Separator className="my-4" />
      <div className="flex gap-4 text-sm text-foreground-light">
        <span>General</span>
        <span>Members</span>
        <span>Billing</span>
      </div>
    </div>
  )
}
