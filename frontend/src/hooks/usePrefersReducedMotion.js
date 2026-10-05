import { useEffect, useState } from "react"

const QUERY = "(prefers-reduced-motion: reduce)"

/** Non-reactive read, for imperative animation code. */
export const prefersReducedMotion = () => window.matchMedia(QUERY).matches

export function usePrefersReducedMotion() {
  // Read the real value on first render so animations don't start and then immediately stop
  const [reduced, setReduced] = useState(prefersReducedMotion)

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const onChange = () => setReduced(mq.matches)                    // update if the OS setting changes
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  return reduced
}
