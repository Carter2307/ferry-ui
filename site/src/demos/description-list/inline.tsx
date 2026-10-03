import {
  Button,
  DescriptionItem,
  DescriptionList,
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from 'libui-kit'
import { Building2 } from 'lucide-react'

export default function DescriptionListInline() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button icon={<Building2 />}>Acme workspace</Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="flex w-72 flex-col gap-3">
        <PopoverHeader>
          <PopoverTitle>Acme workspace</PopoverTitle>
        </PopoverHeader>
        <DescriptionList variant="inline">
          <DescriptionItem label="Plan">Business</DescriptionItem>
          <DescriptionItem label="Currency" mono>
            EUR
          </DescriptionItem>
          <DescriptionItem label="Domain" mono>
            acme.example.com
          </DescriptionItem>
          <DescriptionItem label="Owner">Maya Chen</DescriptionItem>
        </DescriptionList>
      </PopoverContent>
    </Popover>
  )
}
