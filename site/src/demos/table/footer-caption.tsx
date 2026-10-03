import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from 'libui'

const LINES = [
  { product: 'Standard plan', quantity: 12, total: '$1,440.00' },
  { product: 'Extra seats', quantity: 3, total: '$90.00' },
  { product: 'Priority support', quantity: 1, total: '$250.00' },
]

export default function TableFooterCaption() {
  return (
    <Table>
      <TableCaption>Order ORD-10482. Amounts in USD.</TableCaption>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Product</TableHead>
          <TableHead className="text-right">Qty</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {LINES.map((line) => (
          <TableRow key={line.product}>
            <TableCell>{line.product}</TableCell>
            <TableCell className="text-right tabular">{line.quantity}</TableCell>
            <TableCell className="text-right tabular">{line.total}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-right tabular">$1,780.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
