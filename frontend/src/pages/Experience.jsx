import { useCallback, useState } from "react"
import { QuickLook } from "../components/os/QuickLook"
import { Icon } from "../components/ui/Icon"
import { ImageWithFallback, InitialsBadge } from "../components/ui/ImageWithFallback"
import { ROLES, isCurrent, parseMonth } from "../lib/roles"

const COLORS = ["#6366f1", "#0ea5e9", "#f59e0b", "#10b981", "#ec4899", "#8b5cf6"]
const ROW_H = 20

const monthsBetween = (a, b) => (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth())

/** LinkedIn-style inclusive duration, e.g. "1 yr 2 mos". */
function duration(role) {
  const months = monthsBetween(parseMonth(role.start), parseMonth(role.end)) + 1
  const years = Math.floor(months / 12)
  const rest = months % 12
  return [years && `${years} yr${years > 1 ? "s" : ""}`, rest && `${rest} mo${rest > 1 ? "s" : ""}`].filter(Boolean).join(" ")
}

const formatMonth = (value) =>
  isCurrent({ end: value }) ? "Present" : parseMonth(value).toLocaleDateString("en-US", { month: "short", year: "numeric" })

const period = (role) => role.label ?? `${formatMonth(role.start)} – ${formatMonth(role.end)}`

const ACRONYM = /\(([^)]+)\)\s*$/

/** "Society of Competitive Programmers (SCP)" → "SCP"; otherwise the name itself. */
const shortName = (company) => company.match(ACRONYM)?.[1] ?? company

function initials(company) {
  const acronym = company.match(ACRONYM)?.[1]
  if (acronym) return acronym.slice(0, 3).toUpperCase()
  const words = company.trim().split(/\s+/)
  return (words.length >= 2 ? words[0][0] + words[1][0] : company.slice(0, 2)).toUpperCase()
}

/** Makes the numbers in a bullet (99.7%, 66ms, 1,000…) pop, in the role's own color (`--role`). */
function highlightMetrics(text) {
  return text.split(/((?<![\w])\d+(?:[.,]\d+)*(?:%|ms|s\b|×|\+)?)/g).map((part, i) =>
    i % 2 ? (
      <strong key={i} className="role-ink font-semibold">
        {part}
      </strong>
    ) : (
      part
    )
  )
}

function Logo({ role, size }) {
  const cls = `${size} shrink-0 rounded-[10px] object-cover ring-1 ring-black/10 dark:ring-white/10`
  return (
    <ImageWithFallback
      src={role.logo}
      className={cls}
      loading="lazy"
      decoding="async"
      fallback={<InitialsBadge text={initials(role.company)} className={`${cls} bg-indigo-100 text-xs text-indigo-800 dark:bg-white/10 dark:text-indigo-200`} />}
    />
  )
}

/** Award cards under a role's bullets; each opens its certificate in a preview. */
function Achievements({ items, delay, onOpen }) {
  return (
    <section className="mt-7">
      <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Achievements</h3>
      <ul className="grid gap-3 @2xl:grid-cols-2">
        {items.map((item, i) => (
          <li key={item.title} className="detail-item" style={{ animationDelay: `${delay + i * 70}ms` }}>
            <button
              type="button"
              onClick={() => onOpen(item)}
              className="group flex w-full items-center gap-4 rounded-xl border border-black/[0.05] bg-white/60 p-3 text-left outline-none transition-colors hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-indigo-400 dark:border-white/[0.06] dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
            >
              <span className="block aspect-[1198/841] w-28 shrink-0 overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-black/10 dark:ring-white/10">
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 text-[11.5px] text-slate-500 dark:text-slate-400">
                  <Icon name="award" className="role-ink h-3.5 w-3.5" />
                  {item.date}
                </span>
                <span className="mt-0.5 block text-[14px] font-semibold leading-snug">{item.title}</span>
                <span className="role-ink block text-[13px] font-semibold">{item.result}</span>
                <span className="mt-1.5 inline-flex items-center gap-0.5 text-[12px] text-slate-500 transition-colors group-hover:text-slate-800 dark:text-slate-400 dark:group-hover:text-slate-100">
                  View certificate
                  <Icon name="chevronRight" className="btn-arrow h-3 w-3" />
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Gantt strip: every role as a bar across the years, with a "now" marker. */
function Timeline({ active, onSelect }) {
  const ranges = ROLES.map((r) => [parseMonth(r.start), parseMonth(r.end)])
  const first = new Date(Math.min(...ranges.map(([s]) => s)))
  const last = new Date(Math.max(...ranges.map(([, e]) => e)))
  const domainStart = new Date(first.getFullYear(), 0, 1)
  const domainEnd = new Date(last.getFullYear(), last.getMonth() + 3, 1)
  const span = domainEnd - domainStart
  const pct = (d) => ((d - domainStart) / span) * 100
  const years = Array.from({ length: domainEnd.getFullYear() - domainStart.getFullYear() + 1 }, (_, i) => domainStart.getFullYear() + i)
  const now = new Date()

  return (
    <div className="shrink-0 border-b border-black/[0.06] px-5 pb-3 pt-3 dark:border-white/[0.06]">
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-[13px] font-semibold">Timeline</h2>
        <span className="text-[11.5px] text-slate-500">{ROLES.length} roles</span>
      </div>
      <div className="relative" style={{ height: ROLES.length * ROW_H + 16 }}>
        {years.map((year) => {
          const left = pct(new Date(year, 0, 1))
          return (
            <div key={year} className="absolute inset-y-0" style={{ left: `${left}%` }}>
              <div className="absolute bottom-4 top-0 w-px bg-black/[0.07] dark:bg-white/[0.08]" />
              <span className="absolute bottom-0 -translate-x-1/2 text-[10.5px] tabular-nums text-slate-400">{year}</span>
            </div>
          )
        })}
        <div className="absolute bottom-4 top-0 w-px border-l border-dashed border-emerald-500/70" style={{ left: `${pct(now)}%` }}>
          <span className="absolute -top-0.5 left-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Now</span>
        </div>
        {ROLES.map((role, i) => {
          const [s, e] = ranges[i]
          const end = isCurrent(role) ? now : new Date(e.getFullYear(), e.getMonth() + 1, 1)
          return (
            <button
              key={`${role.company}-${role.title}`}
              type="button"
              onClick={() => onSelect(i)}
              aria-label={`${role.company}, ${period(role)}`}
              className={`absolute flex h-[14px] items-center overflow-hidden rounded-full px-2 text-[10px] font-semibold leading-none text-white transition-[opacity,box-shadow] ${
                active === i ? "opacity-100 shadow-[0_0_0_2px_rgba(255,255,255,0.7),0_4px_14px_-4px_rgba(0,0,0,0.4)]" : "opacity-55 hover:opacity-85"
              }`}
              style={{ left: `${pct(s)}%`, width: `${Math.max(pct(end) - pct(s), 2)}%`, top: i * ROW_H, background: COLORS[i % COLORS.length] }}
            >
              <span className="truncate">{shortName(role.company)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function Experience() {
  const [active, setActive] = useState(0)
  const [preview, setPreview] = useState(null)
  const closePreview = useCallback(() => setPreview(null), [])
  const role = ROLES[active]
  const achievements = role.achievements ?? []
  const color = COLORS[active % COLORS.length]

  return (
    <div className="@container flex h-full flex-col">
      <Timeline active={active} onSelect={setActive} />

      <div className="flex min-h-0 flex-1 flex-col @3xl:flex-row">
        <nav
          aria-label="Roles"
          className="os-scroll flex shrink-0 gap-1 overflow-x-auto border-b border-black/[0.06] p-2 @3xl:w-[270px] @3xl:flex-col @3xl:overflow-y-auto @3xl:border-b-0 @3xl:border-r dark:border-white/[0.06]"
        >
          {ROLES.map((r, i) => (
            <button
              key={`${r.company}-${r.title}`}
              type="button"
              onClick={() => setActive(i)}
              aria-current={active === i}
              className={`flex min-w-[210px] items-center gap-2.5 rounded-lg px-2.5 py-2 text-left @3xl:min-w-0 ${
                active === i ? "bg-indigo-500 text-white" : "hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
              }`}
            >
              <Logo role={r} size="h-9 w-9" />
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-semibold">{shortName(r.company)}</span>
                <span className={`block truncate text-[11.5px] ${active === i ? "text-white/75" : "text-slate-500"}`}>
                  {r.title} · {r.start.slice(3)}
                </span>
              </span>
              {isCurrent(r) && (
                <span className={`ml-auto h-1.5 w-1.5 shrink-0 rounded-full ${active === i ? "bg-white" : "bg-emerald-500"}`} aria-label="Current role" />
              )}
            </button>
          ))}
        </nav>

        <article key={active} className="detail-in os-scroll min-h-0 flex-1 overflow-y-auto px-6 py-6" style={{ "--role": color }}>
          <header className="flex items-start gap-4">
            <Logo role={role} size="h-14 w-14" />
            <div className="min-w-0">
              <h2 className="text-[22px] font-semibold leading-tight tracking-tight">{role.title}</h2>
              <p className="role-ink mt-0.5 text-[15px] font-medium">
                {role.company}
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="calendar" className="h-3.5 w-3.5" />
                  {period(role)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="clock" className="h-3.5 w-3.5" />
                  {duration(role)}
                </span>
                {role.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="mapPin" className="h-3.5 w-3.5" />
                    {role.location}
                  </span>
                )}
                {isCurrent(role) && (
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Current</span>
                )}
              </div>
            </div>
          </header>

          {role.bullets.length > 0 && (
            <ul className="mt-6 space-y-2.5">
              {role.bullets.map((bullet, i) => (
                <li
                  key={bullet}
                  className="detail-item flex gap-3 rounded-xl border border-black/[0.05] bg-white/60 p-3.5 text-[13.5px] leading-relaxed text-slate-600 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-slate-300"
                  style={{ animationDelay: `${80 + i * 70}ms` }}
                >
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} aria-hidden />
                  <span>{highlightMetrics(bullet)}</span>
                </li>
              ))}
            </ul>
          )}

          {achievements.length > 0 && <Achievements items={achievements} delay={80 + role.bullets.length * 70} onOpen={setPreview} />}

          {role.bullets.length === 0 && achievements.length === 0 && (
            <p className="mt-6 rounded-xl border border-dashed border-black/10 p-4 text-[13px] text-slate-500 dark:border-white/10">
              Highlights for this role are on the way.
            </p>
          )}
        </article>
      </div>

      {preview && (
        <QuickLook
          src={preview.image}
          title={`${preview.title} · ${preview.result}`}
          alt={`${preview.title} certificate, ${preview.result}`}
          onClose={closePreview}
        />
      )}
    </div>
  )
}
