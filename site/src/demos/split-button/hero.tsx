import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, SplitButton, toast } from 'ferry-ui'
import { CalendarClock, Download, FileSpreadsheet, FileText } from 'lucide-react'

export default function SplitButtonHero() {
  return (
    <SplitButton
      icon={<Download />}
      onClick={() => toast.success('CSV export started')}
      menuLabel="More export options"
      menu={
        <>
          <DropdownMenuLabel>Export as</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => toast.success('Excel export started')}>
            <FileSpreadsheet /> Excel (.xlsx)
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => toast.success('PDF export started')}>
            <FileText /> PDF
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => toast('Schedule an export')}>
            <CalendarClock /> Schedule an export…
          </DropdownMenuItem>
        </>
      }
    >
      Export CSV
    </SplitButton>
  )
}
