import { useMemo } from "react"
import { useTheme } from "../context/useTheme"

function rand(a, b) {
  return a + Math.random() * (b - a)
}

// Dark bg only
export function GalaxyBackground() {
  const { theme } = useTheme()

  const stars = useMemo(
    () =>
      Array.from({ length: 200 }, (_, i) => ({
        id: i,                                 // Unique ID for each star
        left: `${rand(0, 100)}%`,              // Horizontal position
        top: `${rand(0, 100)}%`,               // Vertical position
        size: rand(1.25, 2.75),                // Size of the star
        driftIdx: Math.floor(rand(0, 12)),
        duration: `${rand(16, 50)}s`,          // Time to complete 1 cycle
        delay: `${rand(-60, 0)}s`,             // Delay before starting the animation
        opacity: rand(0.82, 1),                // Transparency level of the star
      })),
    []
  )

  if (theme !== "dark") return null

  return (
    <div
      /*
      fixed               → stays fixed on screen
      inset-0             → top: 0, right: 0, bottom: 0, left: 0 (full screen)
      z-0                 → very back layer
      overflow-hidden     → hides anything outside screen
      bg-black            → black background
      pointer-events-none → clicks pass through
      aria-hidden         → screen readers ignore it (pure decoration)
      */
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black"
      aria-hidden
    >
      {stars.map((s) => (
        <span
          key={s.id}
          className="galaxy-star-arm absolute rounded-full bg-white shadow-[0_0_2px_rgba(255,255,255,0.5)]"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animationName: `galaxy-star-drift-${s.driftIdx}`,
            animationDuration: s.duration,
            animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  )
}
