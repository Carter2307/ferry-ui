import { Button, getErrorMessage, toast } from 'ferry-ui'

// A request that takes 1.5 seconds. Replace it with your own request.
function saveReport() {
  return new Promise<{ name: string }>((resolve) => {
    window.setTimeout(() => resolve({ name: 'Q3 report' }), 1500)
  })
}

export default function ToastPromise() {
  return (
    <Button
      onClick={() => {
        toast.promise(saveReport(), {
          loading: 'Saving the report…',
          success: (report) => `${report.name} saved`,
          error: (error: unknown) => getErrorMessage(error),
        })
      }}
    >
      Save report
    </Button>
  )
}
