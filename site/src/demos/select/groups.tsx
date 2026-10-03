import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from 'ferry-ui'

export default function SelectGroups() {
  return (
    <Select defaultValue="europe-paris">
      <SelectTrigger className="w-64" aria-label="Time zone">
        <SelectValue placeholder="Select a time zone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Americas</SelectLabel>
          <SelectItem value="america-new-york">New York (UTC−05:00)</SelectItem>
          <SelectItem value="america-chicago">Chicago (UTC−06:00)</SelectItem>
          <SelectItem value="america-los-angeles">Los Angeles (UTC−08:00)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="europe-london">London (UTC+00:00)</SelectItem>
          <SelectItem value="europe-paris">Paris (UTC+01:00)</SelectItem>
          <SelectItem value="europe-berlin">Berlin (UTC+01:00)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Asia Pacific</SelectLabel>
          <SelectItem value="asia-tokyo">Tokyo (UTC+09:00)</SelectItem>
          <SelectItem value="australia-sydney">Sydney (UTC+10:00)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
