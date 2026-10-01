import * as React from 'react'
import { BellRing, CreditCard, Globe, Lock, SlidersHorizontal, TriangleAlert, Users, Webhook } from 'lucide-react'

import {
  ActionRow,
  Button,
  Checkbox,
  ConfirmDialog,
  Field,
  FormCard,
  FormRow,
  InnerMenu,
  Input,
  KeyValueEditor,
  PageContainer,
  PageHeader,
  RadioCardGroup,
  SaveBar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  getErrorMessage,
  toast,
  useKeyValueRows,
  validateIdentifierKey,
  type KeyValuePair,
  type NavGroup,
  type RadioCardOption,
} from '../index'

import { ExampleApp } from './example-app'

/* ---------------------------------------------------------------------------------------------- */
/* Example data                                                                                    */
/* ---------------------------------------------------------------------------------------------- */

type SettingsSection = 'general' | 'notifications' | 'billing' | 'webhooks' | 'danger'
type Visibility = 'private' | 'workspace' | 'public'

/** Everything the settings form edits, except the webhook headers (kept by `useKeyValueRows`). */
interface SettingsValues {
  name: string
  slug: string
  description: string
  defaultRole: string
  visibility: Visibility
  weeklyDigest: boolean
  mentions: boolean
  invoiceReminders: boolean
  company: string
  billingEmail: string
  taxId: string
  country: string
  address: string
  webhookUrl: string
}

const SAVED_VALUES: SettingsValues = {
  name: 'Acme',
  slug: 'acme',
  description: 'Product, growth and finance teams of Acme Inc.',
  defaultRole: 'editor',
  visibility: 'workspace',
  weeklyDigest: true,
  mentions: true,
  invoiceReminders: false,
  company: 'Acme Inc.',
  billingEmail: 'billing@acme.example',
  taxId: '',
  country: 'us',
  address: '500 Market Street\nSan Francisco, CA 94105',
  webhookUrl: 'https://hooks.acme.example/workspace-events',
}

const SAVED_HEADERS: KeyValuePair[] = [
  { key: 'X-Acme-Source', value: 'workspace-events' },
  { key: 'Authorization', value: 'Bearer whk_demo_3f6a91c2', secret: true },
]

/** Module-level (stable) options, so `useKeyValueRows` does not revalidate on every render. */
const HEADER_OPTIONS = { validateKey: validateIdentifierKey }

/** Title and description of every section: the page header follows the current one. */
export const SECTIONS: Record<SettingsSection, { title: string; description: string }> = {
  general: { title: 'General', description: 'The identity of the workspace and the defaults of new projects.' },
  notifications: { title: 'Notifications', description: 'Emails the workspace sends to its members.' },
  billing: { title: 'Billing contact', description: 'Who receives the invoices, and what is printed on them.' },
  webhooks: { title: 'Webhooks', description: 'Notify your own systems when something changes in the workspace.' },
  danger: { title: 'Danger zone', description: 'Irreversible actions. Each one asks for a confirmation.' },
}

/** Sections switched in place: items without `href` are buttons, and `value` marks the current one. */
const MENU_GROUPS: NavGroup[] = [
  {
    id: 'workspace',
    items: [
      { id: 'general', label: 'General', icon: <SlidersHorizontal /> },
      { id: 'notifications', label: 'Notifications', icon: <BellRing /> },
      { id: 'billing', label: 'Billing contact', icon: <CreditCard /> },
    ],
  },
  { id: 'developers', label: 'Developers', items: [{ id: 'webhooks', label: 'Webhooks', icon: <Webhook /> }] },
  { id: 'advanced', label: 'Advanced', items: [{ id: 'danger', label: 'Danger zone', icon: <TriangleAlert /> }] },
]

const VISIBILITY_OPTIONS: RadioCardOption<Visibility>[] = [
  { value: 'private', label: 'Private', description: 'Only invited members.', icon: <Lock /> },
  { value: 'workspace', label: 'Workspace', description: 'Every member of Acme.', icon: <Users /> },
  { value: 'public', label: 'Public', description: 'Anyone with the link.', icon: <Globe /> },
]

const ROLES = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'editor', label: 'Editor' },
  { value: 'admin', label: 'Admin' },
]

const COUNTRIES = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'jp', label: 'Japan' },
]

/** Stands in for a network request. */
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

type SettingsErrors = Partial<Record<keyof SettingsValues, string>>

function validate(values: SettingsValues): SettingsErrors {
  const errors: SettingsErrors = {}
  if (values.name.trim() === '') errors.name = 'Enter a workspace name.'
  if (values.slug === '') errors.slug = 'Enter a URL slug.'
  else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(values.slug)) errors.slug = 'Use lowercase letters, digits and single hyphens.'
  if (!/^\S+@\S+\.\S+$/.test(values.billingEmail)) errors.billingEmail = 'Enter a valid email address.'
  if (values.webhookUrl !== '' && !values.webhookUrl.startsWith('https://')) errors.webhookUrl = 'Use an https:// URL.'
  return errors
}

/* ---------------------------------------------------------------------------------------------- */
/* Sections                                                                                        */
/* ---------------------------------------------------------------------------------------------- */

interface SectionProps {
  values: SettingsValues
  errors: SettingsErrors
  /** Updates one value of the form. */
  set: <K extends keyof SettingsValues>(key: K, value: SettingsValues[K]) => void
}

/**
 * Label-left rows in cards: `FormCard` + `FormRow` around Input, Textarea, Select and RadioCardGroup.
 * A row with `htmlFor` gives its single control `id`, `aria-describedby` and `aria-invalid`; a
 * composite control (`Select`) takes them through the render function.
 */
function GeneralSection({ values, errors, set }: SectionProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* `asDiv`: the page owns the single <form>, so the cards must not nest forms. */}
      <FormCard asDiv title="Workspace profile" description="How the workspace appears to its members.">
        <FormRow label="Name" htmlFor="ws-name" error={errors.name}>
          <Input value={values.name} onChange={(event) => set('name', event.target.value)} />
        </FormRow>
        <FormRow
          label="URL slug"
          description="Part of every link to the workspace: acme.example/w/your-slug."
          htmlFor="ws-slug"
          error={errors.slug}
        >
          <Input
            mono
            value={values.slug}
            onChange={(event) => set('slug', event.target.value)}
            autoCapitalize="off"
            spellCheck={false}
          />
        </FormRow>
        <FormRow label="Description" description="Shown on the workspace overview." htmlFor="ws-description">
          <Textarea rows={3} value={values.description} onChange={(event) => set('description', event.target.value)} />
        </FormRow>
      </FormCard>

      <FormCard asDiv title="Defaults" description="Applied to new members and new projects.">
        <FormRow
          label="Default role"
          description="Given to members invited without an explicit role."
          htmlFor="ws-role"
          controlClassName="max-w-xs"
        >
          {(control) => (
            <Select value={values.defaultRole} onValueChange={(role) => set('defaultRole', role)}>
              <SelectTrigger {...control} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormRow>
        {/* Wide control: a `vertical` row. A radio group has no single focus target, so no `htmlFor`. */}
        <FormRow label="Project visibility" description="Who can see a project right after it is created." layout="vertical">
          <RadioCardGroup
            aria-label="Project visibility"
            size="sm"
            appearance="soft"
            columns={3}
            options={VISIBILITY_OPTIONS}
            value={values.visibility}
            onValueChange={(visibility) => set('visibility', visibility)}
          />
        </FormRow>
      </FormCard>
    </div>
  )
}

/**
 * On/off settings saved with the rest of the form: one `FormRow` per `Checkbox` (a `Switch` is for a
 * setting applied on change).
 */
function NotificationsSection({ values, set }: SectionProps) {
  const rows = [
    { key: 'weeklyDigest', id: 'notify-digest', label: 'Weekly digest', description: 'A summary of project activity, every Monday morning.' },
    { key: 'mentions', id: 'notify-mentions', label: 'Mentions', description: 'When a member is mentioned in a comment.' },
    { key: 'invoiceReminders', id: 'notify-invoices', label: 'Invoice reminders', description: 'Three days before an invoice is due, to the billing contact.' },
  ] as const
  return (
    <FormCard asDiv title="Email notifications" description="Members can still mute them from their own profile.">
      {rows.map((row) => (
        <FormRow key={row.key} label={row.label} description={row.description} htmlFor={row.id} controlClassName="md:items-end">
          <Checkbox checked={values[row.key]} onCheckedChange={(checked) => set(row.key, checked === true)} />
        </FormRow>
      ))}
    </FormCard>
  )
}

/** Stacked fields in a dense grid: `Field` wires label, hint, error and ids for each control. */
function BillingSection({ values, errors, set }: SectionProps) {
  return (
    <FormCard asDiv title="Invoice details" description="Printed on every invoice of the workspace.">
      {/* Non-row content of a FormCard brings its own padding. */}
      <div className="grid gap-5 px-5 py-5 sm:grid-cols-2 md:px-6">
        <Field label="Company name">
          <Input value={values.company} onChange={(event) => set('company', event.target.value)} autoComplete="organization" />
        </Field>
        <Field label="Billing email" hint="Invoices and receipts are sent here." error={errors.billingEmail}>
          <Input
            type="email"
            value={values.billingEmail}
            onChange={(event) => set('billingEmail', event.target.value)}
            autoComplete="email"
          />
        </Field>
        <Field label="Tax ID" optional hint="VAT, GST or EIN number.">
          <Input mono value={values.taxId} onChange={(event) => set('taxId', event.target.value)} />
        </Field>
        {/* Composite control: the render function hands the ids to the focusable trigger. */}
        <Field label="Country">
          {(control) => (
            <Select value={values.country} onValueChange={(country) => set('country', country)}>
              <SelectTrigger {...control} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Field>
        <Field label="Address" className="sm:col-span-2">
          <Textarea rows={3} value={values.address} onChange={(event) => set('address', event.target.value)} />
        </Field>
      </div>
    </FormCard>
  )
}

/* ---------------------------------------------------------------------------------------------- */
/* Page                                                                                            */
/* ---------------------------------------------------------------------------------------------- */

/** Props of the Settings example. */
export interface SettingsExampleProps {
  /** Section shown first. The `InnerMenu` then switches sections in place. */
  defaultSection?: SettingsSection
  /** Called with the target `href` when a link of the app is followed (a real app navigates). */
  onNavigate?: (href: string) => void
  /** Called with the saved values and webhook headers once a save succeeds. */
  onSave?: (values: SettingsValues, headers: KeyValuePair[]) => void
  /** Called once the deletion of the workspace is confirmed. */
  onDeleteWorkspace?: () => void
}

/**
 * A settings area: an `InnerMenu` switching sections in place, one form made of `FormCard`s with a
 * sticky `SaveBar`, and a danger zone whose actions go through a `ConfirmDialog`.
 */
export function SettingsExample({ defaultSection = 'general', onNavigate, onSave, onDeleteWorkspace }: SettingsExampleProps) {
  const [section, setSection] = React.useState<SettingsSection>(defaultSection)
  // `saved` is the server state, `values` the edits: the form is dirty while they differ.
  const [saved, setSaved] = React.useState(SAVED_VALUES)
  const [values, setValues] = React.useState(SAVED_VALUES)
  const [savedHeaders, setSavedHeaders] = React.useState(SAVED_HEADERS)
  const headers = useKeyValueRows(savedHeaders, HEADER_OPTIONS)
  const [saving, setSaving] = React.useState(false)
  const [saveError, setSaveError] = React.useState<string | null>(null)

  const errors = validate(values)
  const invalid = Object.keys(errors).length > 0 || !headers.valid
  const dirty =
    headers.dirty || (Object.keys(saved) as (keyof SettingsValues)[]).some((key) => values[key] !== saved[key])

  const set: SectionProps['set'] = (key, value) => setValues((current) => ({ ...current, [key]: value }))

  const reset = () => {
    setValues(saved)
    headers.reset(savedHeaders)
    setSaveError(null)
  }

  const save = async () => {
    if (!dirty || invalid || saving) return
    setSaving(true)
    setSaveError(null)
    try {
      await wait(400)
      setSaved(values)
      // The saved data changed: move the editor's baseline with it.
      setSavedHeaders(headers.pairs)
      headers.reset(headers.pairs)
      onSave?.(values, headers.pairs)
      // Transient feedback after an action: a toast (the Toaster is mounted once, in the app frame).
      toast.success('Workspace settings saved')
    } catch (error) {
      setSaveError(getErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  const { title, description } = SECTIONS[section]
  const sectionProps: SectionProps = { values, errors, set }

  return (
    <ExampleApp section="settings" onNavigate={onNavigate}>
      {/* InnerMenu first, then the content. From `md` the content scrolls on its own next to the menu. */}
      <div className="flex flex-1 flex-col md:min-h-0 md:flex-row">
        <InnerMenu
          title="Settings"
          groups={MENU_GROUPS}
          value={section}
          onValueChange={(id) => setSection(id as SettingsSection)}
        />
        <div className="flex min-w-0 flex-1 flex-col md:overflow-y-auto">
          {section === 'danger' ? (
            // Outside the <form>: these actions run on their own, after a confirmation.
            <PageContainer size="narrow">
              <PageHeader title={title} description={description} />
              <FormCard asDiv tone="destructive">
                <ActionRow
                  title="Transfer ownership"
                  description="Hand the workspace over to another admin. You keep the Admin role."
                  action={
                    <ConfirmDialog
                      tone="warning"
                      trigger={<Button variant="warning">Transfer…</Button>}
                      title="Transfer “Acme” to Liam Ortiz?"
                      description="Liam becomes the owner and the billing contact. Only the new owner can transfer it back."
                      confirmLabel="Transfer ownership"
                      cancelLabel="Keep ownership"
                      onConfirm={() => {
                        toast.success('Ownership transferred to Liam Ortiz')
                      }}
                    />
                  }
                />
                <ActionRow
                  title="Delete workspace"
                  description="Permanently deletes the workspace with its projects, members, invoices and API keys."
                  action={
                    <ConfirmDialog
                      trigger={<Button variant="destructive">Delete workspace</Button>}
                      title="Delete workspace “Acme”?"
                      description={
                        <>
                          <p>All projects, members, invoices and API keys of this workspace are permanently deleted.</p>
                          <p>
                            <strong className="font-medium text-foreground">This cannot be undone.</strong>
                          </p>
                        </>
                      }
                      // Typed confirmation: friction reserved for irreversible, high-impact actions.
                      confirmText={saved.slug}
                      confirmLabel="Delete workspace"
                      // A promise: the dialog shows a spinner, then closes itself (or shows the error).
                      onConfirm={async () => {
                        await wait(300)
                        onDeleteWorkspace?.()
                        toast.success('Workspace deleted')
                      }}
                    />
                  }
                />
              </FormCard>
            </PageContainer>
          ) : (
            <form
              noValidate
              aria-label={`${title} settings`}
              className="flex flex-1 flex-col"
              onSubmit={(event) => {
                event.preventDefault()
                void save()
              }}
            >
              <PageContainer size="narrow" className="flex-1 pb-10">
                <PageHeader title={title} description={description} />
                {section === 'general' && <GeneralSection {...sectionProps} />}
                {section === 'notifications' && <NotificationsSection {...sectionProps} />}
                {section === 'billing' && <BillingSection {...sectionProps} />}
                {section === 'webhooks' && (
                  <FormCard asDiv title="Workspace events" description="A POST request is sent for every change in the workspace.">
                    <FormRow
                      label="Endpoint URL"
                      description="Leave it empty to turn the webhook off."
                      htmlFor="webhook-url"
                      error={errors.webhookUrl}
                    >
                      <Input
                        type="url"
                        mono
                        value={values.webhookUrl}
                        onChange={(event) => set('webhookUrl', event.target.value)}
                        placeholder="https://example.com/hooks/acme"
                      />
                    </FormRow>
                    <FormRow
                      label="Request headers"
                      description="Sent with every request. Secret values stay masked until revealed."
                      layout="vertical"
                    >
                      <KeyValueEditor
                        value={headers.rows}
                        onValueChange={headers.setRows}
                        errors={headers.errors}
                        validateKey={validateIdentifierKey}
                        disabled={saving}
                        keyLabel="Header"
                        keyPlaceholder="X-Header-Name"
                        addLabel="Add header"
                        itemNoun={{ one: 'header', other: 'headers' }}
                        listLabel="Request headers"
                        emptyMessage="No headers yet."
                      />
                    </FormRow>
                  </FormCard>
                )}
              </PageContainer>
              {/* Save is the form's submit button (no `onSave`), so Enter in a field saves too. */}
              <SaveBar
                sticky
                dirty={dirty}
                invalid={invalid}
                saving={saving}
                error={saveError}
                hint="All changes saved"
                onReset={reset}
              />
            </form>
          )}
        </div>
      </div>
    </ExampleApp>
  )
}
