import { GlassCard } from "../components/ui/GlassCard"
import { Icon } from "../components/ui/Icon"
import { ImageWithFallback, InitialsBadge } from "../components/ui/ImageWithFallback"
import { SectionHeading } from "../components/ui/SectionHeading"
import { ROLES } from "../data/experience"

const AVG_MONTH_MS = 1000 * 60 * 60 * 24 * 30.4375

/** "MM/YYYY" → Date at the start of that month; "Present" → now. */
function parseMonth(value) {
  if (/present/i.test(value)) return new Date()
  const [month, year] = value.split("/").map(Number)
  return new Date(year, month - 1, 1)
}

function midpointMs({ start, end }) {
  return (parseMonth(start).getTime() + parseMonth(end).getTime()) / 2
}

/** Gap below each role scales with the time between it and the next one. */
const SPACING_BELOW = ROLES.map((role, i) => {
  const next = ROLES[i + 1]
  if (!next) return "0"
  const months = Math.abs(midpointMs(role) - midpointMs(next)) / AVG_MONTH_MS
  return `${Math.min(5.5, Math.max(1, 0.85 + months * 0.28))}rem`
})

const formatPeriod = (role) => role.label ?? `${role.start} — ${role.end}`

function companyInitials(company) {
  const words = company.trim().split(/\s+/)
  return (words.length >= 2 ? words[0][0] + words[1][0] : company.slice(0, 2)).toUpperCase()
}

export function Experience() {
  return (
    <div className="w-full">
      <SectionHeading className="text-center">Experience</SectionHeading>
      <div className="relative left-1/2 mt-12 w-screen max-w-[100vw] -translate-x-1/2 px-5 sm:px-7">
        <div className="relative mx-auto max-w-7xl">
          {/* Timeline line: left rail on mobile, centered on desktop */}
          <div
            className="pointer-events-none absolute bottom-0 left-3 top-0 z-0 w-px -translate-x-1/2 bg-gradient-to-b from-sky-400/60 via-indigo-400/45 to-purple-500/55 md:left-1/2"
            aria-hidden
          />

          <ol className="relative">
            {ROLES.map((role, i) => {
              const isLeft = i % 2 === 0
              return (
                // Mobile: [dot | card]. Desktop: [card | dot | ] or [ | dot | card], alternating.
                <li
                  key={`${role.company}-${role.title}`}
                  className="grid grid-cols-[24px_1fr] gap-x-4 sm:gap-x-5 md:grid-cols-[1fr_24px_1fr] md:gap-x-0 md:py-1"
                  style={{ marginBottom: SPACING_BELOW[i] }}
                >
                  <span
                    className="z-10 col-start-1 row-start-1 h-3 w-3 self-center justify-self-center rounded-full border-2 border-sky-500 bg-white shadow-[0_0_14px_rgba(56,189,248,0.65)] md:col-start-2 md:h-4 md:w-4 dark:border-sky-300 dark:bg-black dark:shadow-[0_0_16px_rgba(125,211,252,0.5)]"
                    aria-hidden
                  />
                  <div
                    className={`col-start-2 row-start-1 flex min-w-0 items-center ${
                      isLeft ? "md:col-start-1" : "md:col-start-3 md:flex-row-reverse"
                    }`}
                  >
                    <ExperienceCard role={role} />
                    {/* Desktop connector from card to the center line */}
                    <div
                      className={`hidden h-px min-w-[1.5rem] max-w-[4rem] flex-1 from-sky-500/75 to-sky-300/25 md:block dark:from-sky-400/80 dark:to-sky-200/15 ${
                        isLeft ? "bg-gradient-to-r" : "bg-gradient-to-l"
                      }`}
                      aria-hidden
                    />
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}

function ExperienceCard({ role }) {
  return (
    <GlassCard
      as="article"
      className="experience-card w-full min-w-0 flex-1 p-5 text-left shadow-[0_16px_44px_-28px_rgba(14,116,144,0.35)] dark:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.6)] sm:p-6"
    >
      <div className="flex gap-3 sm:gap-3.5">
        <ImageWithFallback
          src={role.logo}
          className="h-11 w-11 shrink-0 rounded-lg object-cover ring-1 ring-sky-200/80 dark:ring-slate-600/80"
          width={44}
          height={44}
          loading="lazy"
          decoding="async"
          fallback={
            <InitialsBadge
              text={companyInitials(role.company)}
              className="h-11 w-11 rounded-lg bg-sky-100 text-xs tracking-tight text-sky-800 ring-1 ring-sky-200/80 dark:bg-slate-800 dark:text-sky-200 dark:ring-slate-600/80"
            />
          }
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold tracking-tight text-slate-900 dark:text-white">{role.title}</h3>
            <p className="mt-0.5 font-medium text-sky-700 dark:text-sky-300/90">{role.company}</p>
          </div>
          <div className="flex shrink-0 flex-col items-start sm:items-end sm:pt-0.5">
            <p className="font-mono text-xs leading-snug tracking-wide text-slate-500 tabular-nums sm:text-right dark:text-slate-400">
              {formatPeriod(role)}
            </p>
            {role.location && (
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-600 sm:justify-end dark:text-slate-400">
                <Icon name="mapPin" className="mt-px h-3.5 w-3.5 shrink-0 text-sky-600 dark:text-sky-400" />
                <span>{role.location}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {role.bullets.length > 0 && (
        <ul className="mt-4 space-y-3 border-t border-sky-100/80 pt-4 text-slate-600 dark:border-slate-800/60 dark:text-slate-300">
          {role.bullets.map((b) => (
            <li key={b} className="flex gap-3 leading-relaxed">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sky-500 dark:bg-sky-400" aria-hidden />
              <span className="min-w-0">{b}</span>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  )
}
