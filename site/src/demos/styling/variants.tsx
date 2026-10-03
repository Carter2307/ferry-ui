import { Badge, Button, StatusBadge } from 'libui'

export default function LookFromProps() {
  return (
    <>
      <Button variant="primary">Save changes</Button>
      <Button variant="destructive">Delete project</Button>
      <Badge variant="outline" font="mono" shape="square">
        v2.4.1
      </Badge>
      <StatusBadge tone="success" label="Paid" />
      <StatusBadge tone="warning" label="Expires soon" />
    </>
  )
}
