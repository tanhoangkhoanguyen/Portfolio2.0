import { useEffect, useState } from "react"

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)") // check browser preference
    setReduced(mq.matches)                                           // true if reduced motion enabled, false otherwise
    const onChange = () => setReduced(mq.matches)                    // create a listener function
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])
  return reduced
}