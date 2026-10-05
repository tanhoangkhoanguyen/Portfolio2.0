const SUPPORTS_LINEAR =
  typeof CSS !== "undefined" && typeof CSS.supports === "function" && CSS.supports("animation-timing-function", "linear(0, 1)")

/**
 * Samples a damped spring into a CSS `linear()` easing, so Web Animations get real spring motion
 * (slight overshoot, then settle). Older browsers fall back to a strong ease-out.
 */
export function spring({ stiffness = 200, damping = 24, mass = 1 } = {}) {
  const w0 = Math.sqrt(stiffness / mass)
  const zeta = damping / (2 * Math.sqrt(stiffness * mass))
  const position = (t) => {
    if (zeta < 1) {
      const wd = w0 * Math.sqrt(1 - zeta * zeta)
      return 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t))
    }
    return 1 - Math.exp(-w0 * t) * (1 + w0 * t)
  }

  let settle = 0
  for (let t = 0; t < 3; t += 1 / 120) if (Math.abs(position(t) - 1) > 0.002) settle = t
  const duration = Math.round(Math.max(settle, 0.15) * 1000)

  if (!SUPPORTS_LINEAR) return { duration: Math.min(duration, 500), easing: "cubic-bezier(0.22, 1, 0.36, 1)" }

  const STEPS = 40
  const points = Array.from({ length: STEPS + 1 }, (_, i) => +position((i / STEPS) * (duration / 1000)).toFixed(4))
  points[STEPS] = 1
  return { duration, easing: `linear(${points.join(", ")})` }
}

/** Window open / restore. */
export const SPRING_WINDOW = spring({ stiffness: 260, damping: 25 })
/** Zoom, panels, popovers. */
export const SPRING_SOFT = spring({ stiffness: 190, damping: 24 })
