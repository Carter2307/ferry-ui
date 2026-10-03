import { Button, Separator } from 'libui-kit'
import { Bold, Italic, Link2, List, ListOrdered, Underline } from 'lucide-react'

export default function SeparatorToolbar() {
  return (
    <div
      role="toolbar"
      aria-label="Text format"
      className="flex h-9 items-center gap-1 rounded-md border bg-surface-100 px-1"
    >
      <Button variant="ghost" size="icon-tiny" icon={<Bold />} aria-label="Bold" />
      <Button variant="ghost" size="icon-tiny" icon={<Italic />} aria-label="Italic" />
      <Button variant="ghost" size="icon-tiny" icon={<Underline />} aria-label="Underline" />
      {/* decorative={false}: screen readers get the split between the groups. */}
      <Separator orientation="vertical" decorative={false} className="mx-1 h-4" />
      <Button variant="ghost" size="icon-tiny" icon={<List />} aria-label="Bulleted list" />
      <Button variant="ghost" size="icon-tiny" icon={<ListOrdered />} aria-label="Numbered list" />
      <Separator orientation="vertical" decorative={false} className="mx-1 h-4" />
      <Button variant="ghost" size="icon-tiny" icon={<Link2 />} aria-label="Insert link" />
    </div>
  )
}
