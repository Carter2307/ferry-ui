import { DropdownMenuItem, SplitButton, toast } from 'ferry-ui'
import { Download, Link2, Mail } from 'lucide-react'

export default function SplitButtonMenuAvailable() {
  return (
    <>
      <p id="send-invoice-reason" className="text-[13px] text-foreground-light">
        Add a billing email to send this invoice.
      </p>
      <SplitButton
        icon={<Mail />}
        disabled
        // The main action is not available, but its alternatives are.
        menuDisabled={false}
        menuLabel="More invoice actions"
        actionProps={{ 'aria-describedby': 'send-invoice-reason' }}
        menu={
          <>
            <DropdownMenuItem onSelect={() => toast.success('PDF download started')}>
              <Download /> Download PDF
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => toast.success('Payment link copied')}>
              <Link2 /> Copy payment link
            </DropdownMenuItem>
          </>
        }
      >
        Send invoice
      </SplitButton>
    </>
  )
}
