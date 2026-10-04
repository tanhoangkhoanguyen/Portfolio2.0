import { Button } from "../components/ui/Button"
import { ImageWithFallback } from "../components/ui/ImageWithFallback"
import { SectionHeading } from "../components/ui/SectionHeading"
import { PROFILE } from "../data/profile"
import { scrollToSection } from "../lib/scrollToSection"

const PHOTO_FALLBACK =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=600&fit=crop&q=80"

const PHOTO_CLASS =
  "aspect-square w-56 rounded-lg object-cover sm:w-60 md:aspect-auto md:h-full md:min-h-[12rem] md:w-full"

export function About() {
  const photoProps = { alt: PROFILE.fullName, width: 280, height: 280, className: PHOTO_CLASS }

  return (
    <div className="w-full">
      <SectionHeading>About me</SectionHeading>
      <div className="mx-auto mt-10 flex w-full max-w-3xl flex-col gap-8 md:flex-row md:items-stretch md:gap-10">
        <div className="shrink-0 md:flex md:w-60 md:self-stretch">
          <ImageWithFallback
            src={PROFILE.photo}
            {...photoProps}
            fallback={<img src={PHOTO_FALLBACK} {...photoProps} />}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-start">
          <p className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Hi, I&apos;m <span className="hero-name-gradient">{PROFILE.firstName}</span>
          </p>
          <p className="mt-2 w-full text-slate-700 dark:text-slate-300">{PROFILE.bio}</p>

          <hr className="my-3 w-full border-0 border-t border-sky-200/90 dark:border-slate-800" />

          <dl className="grid w-full gap-1.5">
            {PROFILE.facts.map(({ label, value }) => (
              <div key={label} className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                <dt className="shrink-0 font-semibold text-sky-800 dark:text-sky-300">{label}</dt>
                <dd className="text-slate-700 dark:text-slate-300">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-3 flex flex-wrap gap-2">
            <Button href={PROFILE.resumeUrl} download="Cole-Nguyen-Resume.pdf">
              Download resume
            </Button>
            <Button variant="secondary" onClick={() => scrollToSection("contact")}>
              Contact me
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
