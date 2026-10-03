import { Button, getErrorMessage, toast } from 'libui-kit'

// A request that fails with a value that has no message.
function exportOrders(): Promise<void> {
  return Promise.reject({ status: 503 })
}

export default function GetErrorMessageToast() {
  return (
    <Button
      onClick={() => {
        exportOrders().catch((err: unknown) => {
          // The second argument replaces the default text "Something went wrong."
          toast.error(getErrorMessage(err, 'Could not export the orders.'))
        })
      }}
    >
      Export orders
    </Button>
  )
}
