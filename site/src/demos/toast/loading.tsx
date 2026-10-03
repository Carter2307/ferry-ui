import { Button, toast } from '@roger.b/libui'

export default function ToastLoading() {
  function exportMembers() {
    const id = toast.loading('Exporting the members…')
    // The same id replaces the toast in place.
    window.setTimeout(() => toast.success('Export ready', { id, description: '128 rows are in the file.' }), 2000)
  }

  return <Button onClick={exportMembers}>Export members</Button>
}
