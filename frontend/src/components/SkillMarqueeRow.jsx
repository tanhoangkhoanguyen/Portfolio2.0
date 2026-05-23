import { useState, useMemo } from "react"

/** Short lists are tiled until the segment is at least this long (smooth loop). */
const MIN_SEGMENT_ITEMS = 24
/** Scroll speed for all rows (previous formula always clamped to this value). */
const MARQUEE_DURATION_SEC = 72

function buildMarqueeTrack(items) {
  if (!items.length) return []
  let segment = [...items]
  while (segment.length < MIN_SEGMENT_ITEMS) {
    segment = [...segment, ...items]
  }
  return [...segment, ...segment]
}

/** One-letter badge from skill name (e.g. LangChain → L, Hugging Face → H). */
function skillInitials(name) {
  const normalized = name.replace(/([a-z])([A-Z])/g, "$1 $2")
  const firstWord = normalized.split(/[\s/-]+/).find(Boolean)
  if (!firstWord) return "?"
  const ch = firstWord.match(/[A-Za-z0-9]/)?.[0]
  return ch ? ch.toUpperCase() : "?"
}

function badgeLabel(name, abbr) {
  const raw = (abbr ?? skillInitials(name)).toString().trim()
  return raw ? raw.slice(0, 2).toUpperCase() : "?"
}

function SkillIcon({ src, name, abbr }) {
  const [failed, setFailed] = useState(false)
  const label = badgeLabel(name, abbr)

  if (!src || failed) {
    return (
      <span
        className="grid h-6 w-6 shrink-0 place-items-center rounded bg-slate-200 text-xs font-bold leading-none text-slate-600 sm:h-7 sm:w-7 sm:text-sm dark:bg-slate-800 dark:text-slate-300"
        aria-hidden
      >
        {label}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt=""
      className="h-6 w-6 shrink-0 object-contain sm:h-7 sm:w-7"
      width={24}
      height={24}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onLoad={(e) => {
        if (e.currentTarget.naturalWidth === 0) setFailed(true)
      }}
      onError={() => setFailed(true)}
    />
  )
}

function FullBleed({ children }) {
  return (
    <div
      className="skill-row-masked relative w-screen max-w-[100vw] overflow-x-clip"
      style={{ marginLeft: "calc(50% - 50vw)" }}
    >
      {children}
    </div>
  )
}

export function SkillMarqueeRow({ direction, items }) {
  const track = useMemo(() => buildMarqueeTrack(items), [items])
  const name = direction === "left" ? "marquee-left" : "marquee-right"

  if (!track.length) return null

  return (
    <FullBleed>
      <div className="skill-row overflow-hidden py-2.5">
        <div
          data-skill-marquee
          className="flex w-max gap-7 pr-7 will-change-transform sm:gap-9 sm:pr-9"
          style={{
            animation: `${name} ${MARQUEE_DURATION_SEC}s linear infinite`,
          }}
        >
          {track.map((item, i) => (
            <div key={`${item.name}-${i}`} className="flex shrink-0 items-center gap-2 px-1">
              <SkillIcon src={item.icon} name={item.name} abbr={item.abbr} />
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100 sm:text-[0.9375rem]">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </FullBleed>
  )
}