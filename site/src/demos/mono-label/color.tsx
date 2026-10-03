import { MonoLabel } from 'ferry-ui'

export default function MonoLabelColor() {
  return (
    <>
      <MonoLabel>Due date</MonoLabel>
      <MonoLabel className="text-destructive">Overdue</MonoLabel>
      <MonoLabel className="text-foreground">Total</MonoLabel>
    </>
  )
}
