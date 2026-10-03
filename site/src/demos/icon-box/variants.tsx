import { iconBoxVariants } from 'libui'
import { BellRing } from 'lucide-react'

export default function IconBoxVariants() {
  return (
    <div className="flex items-center gap-3">
      {/* A <div> with the look of the box. It is decorative: hide it from screen readers. */}
      <div aria-hidden="true" className={iconBoxVariants({ size: 'lg', tone: 'primary' })}>
        <BellRing />
      </div>
      <span className="flex flex-col">
        <span className="text-sm font-medium text-foreground">Alerts are on</span>
        <span className="text-[13px] text-foreground-lighter">You get an email for each failed payment.</span>
      </span>
    </div>
  )
}
