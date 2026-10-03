import { IconBox, type IconBoxSize } from 'libui'
import { Receipt } from 'lucide-react'

const SIZES: IconBoxSize[] = ['xs', 'sm', 'md', 'lg', 'xl']

export default function IconBoxSizes() {
  return (
    <div className="flex flex-wrap items-end gap-6">
      {SIZES.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <IconBox size={size}>
            <Receipt />
          </IconBox>
          <span className="text-[13px] text-foreground-lighter">{size}</span>
        </div>
      ))}
    </div>
  )
}
