import {
  Button,
  DescriptionItem,
  DescriptionList,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from 'ferry-ui'

export default function SheetWidth() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>View order</Button>
      </SheetTrigger>
      {/* `sm:max-w-lg` makes the panel wider than the default width. */}
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Order #10482</SheetTitle>
          <SheetDescription>Acme placed this order on March 3, 2026.</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <DescriptionList variant="rows" divided={false} aria-label="Order details">
            <DescriptionItem label="Customer">Acme</DescriptionItem>
            <DescriptionItem label="Payment">Card that ends in 4242</DescriptionItem>
            <DescriptionItem label="Delivery">Express, 2 days</DescriptionItem>
            <DescriptionItem label="Total">$1,284.00</DescriptionItem>
          </DescriptionList>
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}
