import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'ferry-ui'

export default function SelectPopper() {
  return (
    <Select defaultValue="fr">
      <SelectTrigger className="w-48" aria-label="Language">
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="fr">French</SelectItem>
        <SelectItem value="de">German</SelectItem>
        <SelectItem value="es">Spanish</SelectItem>
        <SelectItem value="ja">Japanese</SelectItem>
      </SelectContent>
    </Select>
  )
}
