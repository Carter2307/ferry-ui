import { CopyButton } from '@roger.b/libui'

const INVITE_LINK = 'https://app.example.com/invite/8f2c41d9'

export default function CopyButtonLabel() {
  return (
    <>
      <CopyButton value={INVITE_LINK} label="Copy invite link" />
      <CopyButton value={INVITE_LINK} label="Copy" what="invite link" variant="ghost" />
      <CopyButton value={INVITE_LINK} label="Copy" what="invite link" size="sm" />
    </>
  )
}
