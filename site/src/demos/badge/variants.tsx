import { Badge } from 'libui'

export default function BadgeVariants() {
  return (
    <>
      <Badge>Default</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Stable</Badge>
      <Badge variant="warning">Beta</Badge>
      <Badge variant="destructive">Deprecated</Badge>
      <Badge variant="info">Preview</Badge>
      <Badge variant="primary">New</Badge>
    </>
  )
}
