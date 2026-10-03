import { ResourceCard, ResourceGrid, StatusLine } from 'libui-kit'
import { Calendar, CreditCard, HardDrive, Mail, MessageSquare, Webhook } from 'lucide-react'

const INTEGRATIONS = [
  { name: 'Email', icon: <Mail />, connected: true },
  { name: 'Calendar', icon: <Calendar />, connected: true },
  { name: 'Webhooks', icon: <Webhook />, connected: true },
  { name: 'Payments', icon: <CreditCard />, connected: false },
  { name: 'Storage', icon: <HardDrive />, connected: true },
  { name: 'Chat', icon: <MessageSquare />, connected: false },
]

export default function ResourceCardMinWidth() {
  return (
    <ResourceGrid aria-label="Integrations" minItemWidth={160}>
      {INTEGRATIONS.map((integration) => (
        <ResourceCard
          key={integration.name}
          name={integration.name}
          icon={integration.icon}
          footer={
            <StatusLine tone={integration.connected ? 'success' : 'neutral'}>
              {integration.connected ? 'Connected' : 'Not connected'}
            </StatusLine>
          }
        />
      ))}
    </ResourceGrid>
  )
}
