import { Button, toast } from 'libui-kit'

export default function ToastHero() {
  return (
    <Button variant="primary" onClick={() => toast.success('Settings saved')}>
      Save changes
    </Button>
  )
}
