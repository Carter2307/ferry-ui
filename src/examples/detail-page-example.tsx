import * as React from 'react'
import { Ban, Plus, RefreshCw } from 'lucide-react'

import {
  Badge,
  Button,
  Callout,
  CodeBlock,
  ConfirmDialog,
  CopyField,
  DescriptionItem,
  DescriptionList,
  FormCard,
  FormRow,
  MetricCard,
  MetricTrend,
  PageBackLink,
  PageContainer,
  PageHeader,
  PageSection,
  SecretField,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  UsageBar,
  toast,
  type StatusTone,
} from '../index'

import { ExampleApp } from './example-app'

/* ---------------------------------------------------------------------------------------------- */
/* Example data                                                                                    */
/* ---------------------------------------------------------------------------------------------- */

type ApiKeyStatus = 'active' | 'expiring' | 'revoked'
type DetailTab = 'overview' | 'usage' | 'activity'

/** Domain status → status vocabulary of the library, declared once. */
export const KEY_STATUS: Record<ApiKeyStatus, { tone: StatusTone; label: string }> = {
  active: { tone: 'success', label: 'Active' },
  expiring: { tone: 'warning', label: 'Expires soon' },
  revoked: { tone: 'destructive', label: 'Revoked' },
}

/** The record shown by the page. Demo values only: these are not real credentials. */
export const API_KEY = {
  name: 'Production server',
  id: 'key_8f3a2c91d4',
  secret: 'sk_demo_4f9a1c7e2b6d8035a1c7e2b6d8035f9a',
  baseUrl: 'https://api.acme.example/v1',
  createdBy: 'Maya Chen',
  created: 'Jan 14, 2026',
  lastUsed: '2 minutes ago',
  scopes: ['projects:read', 'projects:write', 'invoices:read'],
}

const CURL_EXAMPLE = `curl ${API_KEY.baseUrl}/projects \\
  -H "Authorization: Bearer $ACME_API_KEY" \\
  -H "Accept: application/json"`

const NODE_EXAMPLE = `const response = await fetch('${API_KEY.baseUrl}/projects', {
  headers: { Authorization: \`Bearer \${process.env.ACME_API_KEY}\` },
})
const projects = await response.json()`

const EVENTS = [
  { id: 'e1', event: 'Key used from a new IP address', actor: '203.0.113.24', when: 'Today, 09:12' },
  { id: 'e2', event: 'Scope invoices:read added', actor: 'Maya Chen', when: 'Sep 18, 2026' },
  { id: 'e3', event: 'Key renamed to “Production server”', actor: 'Liam Ortiz', when: 'Mar 2, 2026' },
  { id: 'e4', event: 'Key created', actor: 'Maya Chen', when: 'Jan 14, 2026' },
]

/* ---------------------------------------------------------------------------------------------- */
/* Page                                                                                            */
/* ---------------------------------------------------------------------------------------------- */

/** Props of the Detail Page example. */
export interface DetailPageExampleProps {
  /** State of the record: drives the status badge, the callout and which actions are available. */
  status?: ApiKeyStatus
  /** Tab shown first. */
  defaultTab?: DetailTab
  /** Called with the target `href` when a link of the app is followed (a real app navigates). */
  onNavigate?: (href: string) => void
  /** Called once the rotation of the key is confirmed. */
  onRotate?: () => void
  /** Called once the revocation of the key is confirmed. */
  onRevoke?: () => void
}

/**
 * The page of one record (here: an API key): back link and title, a callout for what needs
 * attention, read-only facts, copyable credentials, a usage snippet and tabs for the secondary views.
 */
export function DetailPageExample({ status = 'expiring', defaultTab = 'overview', onNavigate, onRotate, onRevoke }: DetailPageExampleProps) {
  // Local outcome of the page's own actions, layered over the `status` prop.
  const [outcome, setOutcome] = React.useState<ApiKeyStatus | null>(null)
  // Controlled dialogs, rendered once at the end of the page: "Rotate" has two triggers (the header
  // button and the callout action), and the header buttons disappear once the key is revoked.
  const [rotateOpen, setRotateOpen] = React.useState(false)
  const [revokeOpen, setRevokeOpen] = React.useState(false)
  const current = outcome ?? status
  const revoked = current === 'revoked'
  const badge = KEY_STATUS[current]

  return (
    <ExampleApp
      section="api-keys"
      crumbs={[
        { label: 'API keys', href: '/api-keys' },
        { label: API_KEY.name, href: `/api-keys/${API_KEY.id}` },
      ]}
      onNavigate={onNavigate}
    >
      <PageContainer size="narrow">
        <PageHeader
          size="lg"
          eyebrow={<PageBackLink href="/api-keys">API keys</PageBackLink>}
          title={API_KEY.name}
          badges={<StatusBadge size="sm" tone={badge.tone} label={badge.label} />}
          description="Server-side key used by the nightly billing sync."
          actions={
            revoked ? (
              <Button variant="primary" icon={<Plus />} onClick={() => onNavigate?.('/api-keys/new')}>
                Create new key
              </Button>
            ) : (
              <>
                <Button icon={<RefreshCw />} onClick={() => setRotateOpen(true)}>
                  Rotate key
                </Button>
                <Button variant="destructive" icon={<Ban />} onClick={() => setRevokeOpen(true)}>
                  Revoke key
                </Button>
              </>
            )
          }
        />

        {/* Persistent, contextual message tied to the page: a Callout (not a toast). */}
        {current === 'expiring' && (
          <Callout
            tone="warning"
            title="This key expires in 12 days"
            className="mb-6"
            actionsPlacement="end"
            actions={
              <Button size="tiny" onClick={() => setRotateOpen(true)}>
                Rotate now
              </Button>
            }
          >
            Requests signed with it start failing on Oct 13, 2026. Rotate it and update your integration before then.
          </Callout>
        )}
        {revoked && (
          <Callout tone="destructive" title="This key was revoked" className="mb-6">
            Requests using it are rejected with <code className="font-mono text-[12.5px]">401 Unauthorized</code>. Create a new
            key to restore access.
          </Callout>
        )}

        {/* Secondary views of the same record: Tabs (not navigation between pages). */}
        <Tabs defaultValue={defaultTab}>
          <TabsList aria-label="API key sections">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="activity">
              Activity <Badge>{EVENTS.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="pt-2">
            <PageSection>
              {/* Read-only facts about ONE record. Six items fill the two rows of the 3-column grid. */}
              <DescriptionList columns={3} aria-label="Key details">
                <DescriptionItem label="Key ID" mono>
                  {API_KEY.id}
                </DescriptionItem>
                <DescriptionItem label="Created">{API_KEY.created}</DescriptionItem>
                <DescriptionItem label="Created by">{API_KEY.createdBy}</DescriptionItem>
                <DescriptionItem label="Last used">{revoked ? undefined : API_KEY.lastUsed}</DescriptionItem>
                <DescriptionItem label="Expires" valueClassName={current === 'expiring' ? 'text-warning' : undefined}>
                  {current === 'active' ? 'Jan 14, 2027' : 'Oct 13, 2026'}
                </DescriptionItem>
                <DescriptionItem label="Scopes" wrap valueClassName="flex flex-wrap gap-1.5">
                  {API_KEY.scopes.map((scope) => (
                    <Badge key={scope} font="mono" shape="square" case="normal">
                      {scope}
                    </Badge>
                  ))}
                </DescriptionItem>
              </DescriptionList>
            </PageSection>

            <PageSection title="Credentials" description="Send the secret in the Authorization header of every request.">
              {/* A read-only card: `asDiv`, no footer. */}
              <FormCard asDiv>
                <FormRow label="Base URL" description="Every endpoint lives under this address." htmlFor="key-base-url">
                  <CopyField value={API_KEY.baseUrl} what="base URL" />
                </FormRow>
                <FormRow label="Key ID" description="Safe to share: it identifies the key in logs." htmlFor="key-id">
                  <CopyField value={API_KEY.id} what="key ID" />
                </FormRow>
                {!revoked && (
                  <FormRow
                    label="Secret"
                    description="Masked until revealed. Copying never reveals it."
                    htmlFor="key-secret"
                  >
                    <SecretField value={API_KEY.secret} what="secret" />
                  </FormRow>
                )}
              </FormCard>
            </PageSection>

            <PageSection title="Quick start" description="List the projects of the workspace with this key.">
              {/* A compact view switch inside a section: the `pills` list. */}
              <Tabs defaultValue="curl" className="gap-3">
                <TabsList variant="pills" aria-label="Language">
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="node">Node.js</TabsTrigger>
                </TabsList>
                <TabsContent value="curl">
                  <CodeBlock code={CURL_EXAMPLE} what="cURL command" />
                </TabsContent>
                <TabsContent value="node">
                  <CodeBlock code={NODE_EXAMPLE} what="Node.js snippet" />
                </TabsContent>
              </Tabs>
            </PageSection>
          </TabsContent>

          <TabsContent value="usage" className="pt-2">
            <div className="grid gap-4 sm:grid-cols-3">
              <MetricCard
                label="Requests"
                value={revoked ? '0' : '184,302'}
                trend={revoked ? undefined : <MetricTrend direction="up">+8.1%</MetricTrend>}
                hint="Last 30 days"
              />
              <MetricCard
                label="Error rate"
                value={revoked ? '0%' : '0.18%'}
                trend={
                  revoked ? undefined : (
                    <MetricTrend direction="down" sentiment="positive">
                      -0.05 pts
                    </MetricTrend>
                  )
                }
                hint="Last 30 days"
              />
              <MetricCard label="Rate limit" value={revoked ? '0' : '412'} unit="of 600 req/min" hint="Peak in the last hour">
                <UsageBar value={revoked ? 0 : 69} label="Rate limit used at peak" />
              </MetricCard>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="pt-2">
            <Table aria-label="Key activity">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Event</TableHead>
                  <TableHead>By</TableHead>
                  <TableHead className="text-right">When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {EVENTS.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.event}</TableCell>
                    <TableCell className="text-foreground-light">{entry.actor}</TableCell>
                    <TableCell className="text-right text-foreground-lighter tabular">{entry.when}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </PageContainer>

      <ConfirmDialog
        open={rotateOpen}
        onOpenChange={setRotateOpen}
        tone="warning"
        title={`Rotate “${API_KEY.name}”?`}
        description="A new secret is generated. The current one keeps working for 24 hours, then stops."
        confirmLabel="Rotate key"
        cancelLabel="Keep current key"
        onConfirm={() => {
          setOutcome('active')
          onRotate?.()
          toast.success('API key rotated', { description: 'The previous secret stops working in 24 hours.' })
        }}
      />
      <ConfirmDialog
        open={revokeOpen}
        onOpenChange={setRevokeOpen}
        title={`Revoke “${API_KEY.name}”?`}
        description="Requests signed with this key are rejected immediately. This cannot be undone."
        confirmLabel="Revoke key"
        onConfirm={() => {
          setOutcome('revoked')
          onRevoke?.()
          toast.success('API key revoked')
        }}
      />
    </ExampleApp>
  )
}
