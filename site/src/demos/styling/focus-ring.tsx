import { toast } from 'libui'
import { ImagePlus } from 'lucide-react'

export default function FocusRing() {
  return (
    <button
      type="button"
      onClick={() => toast('Choose an image for the logo')}
      className="flex w-full max-w-xs cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-border-stronger px-6 py-8 text-[13px] text-foreground-light outline-none hover:bg-surface-200 focus-visible:ring-2 focus-visible:ring-ring"
    >
      <ImagePlus className="size-5 text-foreground-lighter" aria-hidden="true" />
      Add a logo
    </button>
  )
}
