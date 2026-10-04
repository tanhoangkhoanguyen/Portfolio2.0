import { useState } from "react"

/** Renders `fallback` when `src` is missing or fails to load. */
export function ImageWithFallback({ src, fallback, alt = "", ...imgProps }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) return fallback

  return (
    <img
      src={src}
      alt={alt}
      onLoad={(e) => {
        if (e.currentTarget.naturalWidth === 0) setFailed(true)
      }}
      onError={() => setFailed(true)}
      {...imgProps}
    />
  )
}

/** Small square letter badge, used as an image fallback. */
export function InitialsBadge({ text, className = "" }) {
  return (
    <span className={`grid shrink-0 place-items-center font-bold leading-none ${className}`} aria-hidden>
      {text}
    </span>
  )
}
