import { Field, SecretField } from 'libui-kit'

export default function CopySecret() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5">
      <Field label="Secret key">
        <SecretField value="sk_demo_4f9a2c7e1b8d3f6a" what="secret key" />
      </Field>
      <Field label="Recovery code" hint="The mask shows the last four characters.">
        <SecretField value="4F7K-9QXM-2B8R-TL6P" what="recovery code" mask="••••-••••-••••-TL6P" />
      </Field>
    </div>
  )
}
