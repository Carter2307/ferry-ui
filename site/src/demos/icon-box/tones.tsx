import { IconBox, type IconBoxTone } from 'libui-kit'
import { Webhook } from 'lucide-react'

const TONES: IconBoxTone[] = ['neutral', 'primary', 'success', 'warning', 'destructive', 'info']

export default function IconBoxTones() {
  return (
    <div className="flex flex-wrap items-end gap-6">
      {TONES.map((tone) => (
        <div key={tone} className="flex flex-col items-center gap-2">
          <IconBox tone={tone}>
            <Webhook />
          </IconBox>
          <span className="text-[13px] text-foreground-lighter">{tone}</span>
        </div>
      ))}
    </div>
  )
}
