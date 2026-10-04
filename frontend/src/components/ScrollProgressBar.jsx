import { useEffect, useRef } from "react"

/** Writes straight to the DOM (no React state), at most once per frame, so scrolling never re-renders. */
export function ScrollProgressBar() {
  const ref = useRef(null)

  useEffect(() => {
    let frame = 0
    function update() {
      frame = 0
      const el = document.documentElement
      const total = el.scrollHeight - el.clientHeight
      ref.current.style.transform = `scaleX(${total > 0 ? el.scrollTop / total : 0})`
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return <div ref={ref} className="scroll-progress-bar" aria-hidden />
}
