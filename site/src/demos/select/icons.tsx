import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'ferry-ui'
import { Banknote, CreditCard, Landmark, Wallet } from 'lucide-react'

export default function SelectIcons() {
  return (
    <Select defaultValue="card">
      <SelectTrigger className="w-56" aria-label="Payment method">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="card">
          <CreditCard />
          Credit card
        </SelectItem>
        <SelectItem value="transfer">
          <Landmark />
          Bank transfer
        </SelectItem>
        <SelectItem value="wallet">
          <Wallet />
          Digital wallet
        </SelectItem>
        <SelectItem value="cash">
          <Banknote />
          Cash
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
