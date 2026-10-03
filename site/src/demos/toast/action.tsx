import { Button, toast } from 'libui-kit'

export default function ToastAction() {
  return (
    <Button
      onClick={() =>
        toast('Project archived', {
          description: 'The project "Website redesign" is in the archive.',
          action: { label: 'Undo', onClick: () => toast.success('Project restored') },
          cancel: { label: 'Close', onClick: () => {} },
        })
      }
    >
      Archive project
    </Button>
  )
}
