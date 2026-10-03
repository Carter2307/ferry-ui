import * as React from 'react'
import { InfoTile, Label, Switch } from 'libui-kit'
import { CalendarDays, User } from 'lucide-react'

export default function InfoTileLoading() {
  // In an app, `loading` comes from the request that loads the record.
  const [loading, setLoading] = React.useState(true)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Switch id="tiles-loading" checked={loading} onCheckedChange={setLoading} />
        <Label htmlFor="tiles-loading">Loading</Label>
      </div>
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <InfoTile icon={<User />} label="Owner" value="Maya Chen" hint="maya@example.com" loading={loading} />
        <InfoTile icon={<CalendarDays />} label="Next invoice" value="Nov 1, 2026" loading={loading} />
      </div>
    </div>
  )
}
