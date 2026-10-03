import { IconBox } from 'ferry-ui'
import { FolderKanban } from 'lucide-react'

export default function IconBoxElevated() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <IconBox size="lg">
          <FolderKanban />
        </IconBox>
        <span className="text-2xl font-medium text-foreground">Billing portal</span>
      </div>
      <div className="flex items-center gap-3 text-[13px] text-foreground-light">
        <IconBox>
          <FolderKanban />
        </IconBox>
        <IconBox elevated>
          <FolderKanban />
        </IconBox>
        The md size, flat and with the shadow
      </div>
    </div>
  )
}
