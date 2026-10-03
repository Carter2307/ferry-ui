import {
  Button,
  Card,
  CardAction,
  CardHeader,
  CardTitle,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type StatusTone,
} from '@roger.b/libui'

const ORDERS: { id: string; customer: string; total: string; tone: StatusTone; status: string }[] = [
  { id: '#1042', customer: 'Northwind Traders', total: '$1,240.00', tone: 'success', status: 'Paid' },
  { id: '#1043', customer: 'Acme', total: '$860.50', tone: 'info', status: 'Pending' },
  { id: '#1044', customer: 'Globex', total: '$3,105.00', tone: 'neutral', status: 'Refunded' },
]

export default function CardWithTable() {
  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader>
        <CardTitle>Recent orders</CardTitle>
        <CardAction>
          <Button size="tiny">View all</Button>
        </CardAction>
      </CardHeader>
      {/* No CardContent: the table touches the edges. Its own frame is off. */}
      <Table aria-label="Recent orders" containerClassName="rounded-none border-0 shadow-none">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ORDERS.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-[13px]">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>
                <StatusBadge tone={order.tone} label={order.status} />
              </TableCell>
              <TableCell className="text-right tabular">{order.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
