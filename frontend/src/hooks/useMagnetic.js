import { useMemo } from "react"
import { prefersReducedMotion } from "./usePrefersReducedMotion"

/**
 * Pointer handlers for "magnetic" buttons: the element leans toward the cursor and exposes the
 * cursor position as --mx / --my so CSS can draw highlights that follow it.
 */
export function useMagnetic(strength = 0.22) {
  return useMemo(
    () => ({
      onPointerMove(e) {
        if (e.pointerType !== "mouse") return
        const el = e.currentTarget
        const r = el.getBoundingClientRect()
        const x = e.clientX - r.left
        const y = e.clientY - r.top
        el.style.setProperty("--mx", `${x}px`)
        el.style.setProperty("--my", `${y}px`)
        if (prefersReducedMotion()) return
        el.style.translate = `${(x - r.width / 2) * strength}px ${(y - r.height / 2) * strength * 1.4}px`
      },
      onPointerLeave(e) {
        e.currentTarget.style.translate = ""
      },
    }),
    [strength]
  )
}
