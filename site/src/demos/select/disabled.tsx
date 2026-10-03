import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'libui-kit'

export default function SelectDisabled() {
  return (
    <>
      <Select disabled defaultValue="eur">
        <SelectTrigger className="w-40" aria-label="Currency">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="usd">US dollar</SelectItem>
          <SelectItem value="eur">Euro</SelectItem>
          <SelectItem value="gbp">Pound sterling</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="member">
        <SelectTrigger className="w-40" aria-label="Role">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="viewer">Viewer</SelectItem>
          <SelectItem value="member">Member</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="owner" disabled>
            Owner, by transfer only
          </SelectItem>
        </SelectContent>
      </Select>
    </>
  )
}
