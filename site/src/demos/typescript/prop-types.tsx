import { Button, type ButtonProps } from 'libui-kit'
import { Download } from 'lucide-react'

// Each prop of Button, but this component sets the icon and the text.
type ExportButtonProps = Omit<ButtonProps, 'icon' | 'children'> & {
  format: 'CSV' | 'PDF'
}

function ExportButton({ format, ...props }: ExportButtonProps) {
  return (
    <Button icon={<Download />} {...props}>
      Export {format}
    </Button>
  )
}

export default function PropTypes() {
  return (
    <>
      <ExportButton format="CSV" />
      <ExportButton format="PDF" variant="outline" />
    </>
  )
}
