import { buttonVariants, type ButtonProps } from 'ferry-ui'

// The options of the helper have the same types as the props of Button.
type RepositoryLinkProps = Pick<ButtonProps, 'variant' | 'size'>

function RepositoryLink({ variant, size }: RepositoryLinkProps) {
  return (
    <a
      className={buttonVariants({ variant, size })}
      href="https://github.com/Carter2307/libui"
      target="_blank"
      rel="noreferrer"
    >
      Open the repository
    </a>
  )
}

export default function VariantHelper() {
  return (
    <>
      <RepositoryLink />
      <RepositoryLink variant="outline" size="md" />
    </>
  )
}
