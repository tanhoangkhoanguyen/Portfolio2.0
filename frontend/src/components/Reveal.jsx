import { useEffect, useRef, useState } from "react"

export function Reveal({ children, className = "", immediate = false }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(immediate)

  useEffect(() => {
    if (immediate) return
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.unobserve(entry.target)
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [immediate])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </div>
  )
}
