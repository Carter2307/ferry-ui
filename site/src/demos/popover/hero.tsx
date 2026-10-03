import {
  Button,
  CopyField,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from 'ferry-ui'
import { Share2 } from 'lucide-react'

export default function PopoverHero() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button icon={<Share2 />}>Share</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Share this report" className="flex flex-col gap-3">
        <PopoverHeader>
          <PopoverTitle>Share this report</PopoverTitle>
          <PopoverDescription>Each person with the link can view it.</PopoverDescription>
        </PopoverHeader>
        <CopyField value="https://example.com/s/8f2k" what="share link" size="sm" aria-label="Share link" />
      </PopoverContent>
    </Popover>
  )
}
