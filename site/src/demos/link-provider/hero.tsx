import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  LinkProvider,
  toast,
  type LinkComponent,
} from 'libui'

// In a real app, the adapter renders the link of the router: <Link to={href} {...props} />.
// This adapter stays on the page and shows the target of the link.
const DemoLink: LinkComponent = ({ href, onClick, ...props }) => (
  <a
    href={href}
    {...props}
    onClick={(event) => {
      onClick?.(event)
      event.preventDefault()
      toast('The link component got a click', { description: `Target: ${href}` })
    }}
  />
)

export default function LinkProviderHero() {
  return (
    // A real app mounts the provider one time, near its root.
    <LinkProvider component={DemoLink}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#customers">Customers</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#acme">Acme</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>INV-2041</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </LinkProvider>
  )
}
