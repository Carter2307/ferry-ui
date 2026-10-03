import { CopyField, Field, SecretField } from 'libui-kit'

export default function CopyHero() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5">
      <Field label="Project ID">
        <CopyField value="prj_7Hq2kLx9Vd3mN4" what="project ID" />
      </Field>
      <Field label="Secret key" hint="Keep this key on your server.">
        <SecretField value="sk_demo_4f9a2c7e1b8d3f6a" what="secret key" />
      </Field>
    </div>
  )
}
