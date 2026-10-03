import { CopyField } from 'libui-kit'

export default function CopyFieldSizes() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3">
      <CopyField value="https://api.example.com/v2" what="API URL" aria-label="API URL, medium" />
      <CopyField value="https://api.example.com/v2" what="API URL" size="sm" aria-label="API URL, small" />
      <CopyField value="billing@example.com" what="billing email" mono={false} aria-label="Billing email" />
      <CopyField
        value="https://hooks.example.com/incoming/workspace-acme/channel-announcements/a8f3e21c9b7d4e6f"
        what="webhook URL"
        aria-label="Webhook URL"
      />
    </div>
  )
}
