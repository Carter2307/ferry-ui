import { Divider } from './backdrop'
import { HeroActions } from './hero'
import { Reveal } from './reveal'

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title">
      <Divider delay="-11s" reverse />
      <Reveal className="container-page flex flex-col items-center py-24 text-center lg:py-32">
        <h2 id="cta-title" className="heading-section">
          <span className="text-foreground-lighter">Product screens,</span> already designed
        </h2>
        <p className="mt-4 max-w-[30rem] text-foreground-lighter">
          Read the quick start, copy a page from the examples and put your data in it.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <HeroActions />
        </div>
      </Reveal>
    </section>
  )
}
