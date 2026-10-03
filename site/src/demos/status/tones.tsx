import { STATUS_TONES, StatusBadge, type StatusTone } from 'ferry-ui'

const LABELS: Record<StatusTone, string> = {
  success: 'Active',
  warning: 'Past due',
  destructive: 'Failed',
  info: 'In review',
  neutral: 'Draft',
}

export default function StatusTones() {
  return (
    <>
      {STATUS_TONES.map((tone) => (
        <StatusBadge key={tone} tone={tone} label={LABELS[tone]} />
      ))}
    </>
  )
}
