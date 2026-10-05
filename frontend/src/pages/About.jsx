import { Fragment } from "react"
import { Button } from "../components/ui/Button"
import { ImageWithFallback, InitialsBadge } from "../components/ui/ImageWithFallback"
import { ROLES } from "../lib/roles"
import { PROFILE } from "../data/profile"
import { useOS } from "../os/context"

const CURRENT_ROLE = ROLES.find((role) => /present/i.test(role.end))

/** "About This Mac"-style spec sheet. */
const SPECS = [
  ...PROFILE.facts,
  CURRENT_ROLE?.location && { label: "Based in", value: CURRENT_ROLE.location },
].filter(Boolean)

const INITIALS = PROFILE.fullName
  .split(" ")
  .map((word) => word[0])
  .join("")

export function About() {
  const { openApp } = useOS()
  const photoClass = "relative h-36 w-36 rounded-full object-cover shadow-xl ring-1 ring-black/10 dark:ring-white/15"

  return (
    <div className="os-scroll h-full overflow-y-auto">
      <div className="mx-auto flex min-h-full max-w-2xl flex-col items-center px-8 pb-5 pt-10 text-center">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-indigo-500/45 via-violet-500/30 to-sky-400/35 blur-2xl" aria-hidden />
          <ImageWithFallback
            src={PROFILE.photo}
            alt={PROFILE.fullName}
            width={144}
            height={144}
            className={photoClass}
            fallback={<InitialsBadge text={INITIALS} className={`${photoClass} bg-gradient-to-br from-indigo-500 to-violet-600 text-3xl text-white`} />}
          />
        </div>

        <h1 className="mt-6 text-[32px] font-semibold tracking-tight">{PROFILE.fullName}</h1>
        <p className="mt-1 text-[14px] text-slate-500 dark:text-slate-400">{PROFILE.jobTitles.slice(0, 3).join(" · ")}</p>

        <dl className="mt-6 grid w-full max-w-md grid-cols-[minmax(0,7rem)_1fr] gap-x-3.5 gap-y-2 text-[14.5px]">
          {SPECS.map(({ label, value }) => (
            <Fragment key={label}>
              <dt className="text-right font-semibold text-slate-800 dark:text-slate-200">{label}</dt>
              <dd className="text-left text-slate-600 dark:text-slate-400">{value}</dd>
            </Fragment>
          ))}
        </dl>

        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          <Button href={PROFILE.resumeUrl} target="_blank" rel="noopener noreferrer">
            View résumé
          </Button>
          <Button variant="secondary" onClick={(e) => openApp("contact", e.currentTarget)}>
            Get in touch
          </Button>
        </div>

        <p className="mt-7 whitespace-pre-line border-t border-black/[0.07] pt-6 text-[15px] leading-relaxed text-slate-600 dark:border-white/[0.08] dark:text-slate-300/90">
          {PROFILE.bio}
        </p>

        <p className="mt-auto pt-6 text-[11.5px] text-slate-400 dark:text-slate-500">
          ™ and © {new Date().getFullYear()} {PROFILE.fullName}. All rights reserved.
        </p>
      </div>
    </div>
  )
}
