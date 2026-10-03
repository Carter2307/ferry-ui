import { Input, MonoLabel } from 'libui-kit'

export default function MonoLabelForField() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-1.5">
      <MonoLabel as="label" htmlFor="workspace-id">
        Workspace ID
      </MonoLabel>
      <Input id="workspace-id" mono readOnly defaultValue="ws_8f3a9c1e" />
    </div>
  )
}
