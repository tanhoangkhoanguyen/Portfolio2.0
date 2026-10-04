import { useMemo } from "react"
import { ImageWithFallback, InitialsBadge } from "./ui/ImageWithFallback"

/** Short lists are tiled until the segment is at least this long (smooth loop). */
const MIN_SEGMENT_ITEMS = 24
const MARQUEE_DURATION_SEC = 72

/** Repeats `items` to fill one segment, then doubles it so a -50% translate loops seamlessly. */
function buildMarqueeTrack(items) {
  if (!items.length) return []
  const repeats = Math.ceil(MIN_SEGMENT_ITEMS / items.length)
  const segment = Array.from({ length: repeats }, () => items).flat()
  return [...segment, ...segment]
}

function SkillIcon({ src, name }) {
  return (
    <ImageWithFallback
      src={src}
      className="h-6 w-6 shrink-0 object-contain sm:h-7 sm:w-7"
      width={24}
      height={24}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      fallback={
        <InitialsBadge
          text={name.charAt(0).toUpperCase()}
          className="h-6 w-6 rounded bg-slate-200 text-xs text-slate-600 sm:h-7 sm:w-7 sm:text-sm dark:bg-slate-800 dark:text-slate-300"
        />
      }
    />
  )
}

export function SkillMarqueeRow({ direction, items }) {
  const track = useMemo(() => buildMarqueeTrack(items), [items])

  if (!track.length) return null

  return (
    // Full-bleed: break out of the centered content column to span the viewport
    <div className="skill-row-masked relative w-screen max-w-[100vw] overflow-x-clip" style={{ marginLeft: "calc(50% - 50vw)" }}>
      <div className="skill-row overflow-hidden py-2.5">
        <div
          data-skill-marquee
          className="flex w-max gap-7 pr-7 will-change-transform sm:gap-9 sm:pr-9"
          style={{ animation: `marquee-${direction} ${MARQUEE_DURATION_SEC}s linear infinite` }}
        >
          {track.map((item, i) => (
            <div key={`${item.name}-${i}`} className="flex shrink-0 items-center gap-2 px-1">
              <SkillIcon src={item.icon} name={item.name} />
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100 sm:text-[0.9375rem]">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
