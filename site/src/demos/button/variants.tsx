import { Button } from '@roger.b/libui'

export default function ButtonVariants() {
  return (
    <>
      <Button>Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="destructive-solid">Destructive solid</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="link">Link</Button>
      <Button variant="dashed">Dashed</Button>
    </>
  )
}
