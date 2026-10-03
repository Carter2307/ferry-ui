import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'ferry-ui'

export default function SelectLabelFor() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="member-role">Role</Label>
      <Select defaultValue="member">
        <SelectTrigger id="member-role" className="w-full">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="viewer">Viewer</SelectItem>
          <SelectItem value="member">Member</SelectItem>
          <SelectItem value="billing">Billing manager</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
