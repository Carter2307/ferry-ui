import { TopBarIconButton, toast } from 'libui-kit'
import { Bell, CircleHelp, LogOut, RefreshCw } from 'lucide-react'

export default function TopBarIconButtons() {
  return (
    <>
      <TopBarIconButton icon={<Bell />} label="Notifications" onClick={() => toast('No new notifications')} />
      <TopBarIconButton icon={<CircleHelp />} label="Help" onClick={() => toast('Help opens here')} />
      <TopBarIconButton icon={<RefreshCw />} label="Refresh" loading />
      <TopBarIconButton icon={<LogOut />} label="Sign out" tooltip={false} disabled />
    </>
  )
}
