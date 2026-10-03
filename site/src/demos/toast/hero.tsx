import { Button, toast } from 'ferry-ui'

export default function ToastHero() {
  return (
    <Button variant="primary" onClick={() => toast.success('Settings saved')}>
      Save changes
    </Button>
  )
}
