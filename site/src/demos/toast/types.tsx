import { Button, toast } from 'ferry-ui'

export default function ToastTypes() {
  return (
    <>
      <Button onClick={() => toast('Project archived')}>Neutral</Button>
      <Button onClick={() => toast.success('Invoice sent')}>Success</Button>
      <Button onClick={() => toast.error('Payment failed')}>Error</Button>
      <Button onClick={() => toast.warning('Your trial ends in 3 days')}>Warning</Button>
      <Button onClick={() => toast.info('A new version is available')}>Info</Button>
    </>
  )
}
