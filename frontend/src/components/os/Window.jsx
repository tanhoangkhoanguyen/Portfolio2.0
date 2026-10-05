import { useLayoutEffect, useRef, useState } from "react"
import { prefersReducedMotion } from "../../hooks/usePrefersReducedMotion"
import { SPRING_SOFT, SPRING_WINDOW } from "../../lib/spring"
import { useOS } from "../../os/context"
import { dragRect, maximizedRect } from "../../os/layout"
import { AppIcon } from "./AppIcon"
import { TrafficLights } from "./TrafficLights"

const rectOf = (el) => {
  const r = el.getBoundingClientRect()
  return { x: r.left, y: r.top, w: r.width, h: r.height }
}

/** The app's visible icon on the desktop (floating constellation or the app row, whichever is shown). */
const iconRect = (id) => {
  for (const el of document.querySelectorAll(`[data-app-icon="${id}"]`)) {
    const r = rectOf(el)
    if (r.w > 0) return r
  }
  return null
}

/** Transform that squeezes the window's own box (`to`) onto `from` - transform-origin is top-left. */
const morph = (from, to) =>
  `translate(${from.x - to.x}px, ${from.y - to.y}px) scale(${from.w / to.w}, ${from.h / to.h})`

/** Fallback origin when there is no icon to zoom from: a slightly smaller box, a bit lower. */
const shrunk = (r) => ({ x: r.x + r.w * 0.06, y: r.y + r.h * 0.06 + 14, w: r.w * 0.88, h: r.h * 0.88 })

export function Window({ win, app, focused, z }) {
  const { isCompact, bounds, settleWindow, removeWindow, closeApp, minimizeApp, toggleMaximize, focusApp, moveWindow } = useOS()
  const ref = useRef(null)
  const wasMaximized = useRef(win.maximized)
  const [dragging, setDragging] = useState(false)

  const full = isCompact || win.maximized
  const rect = full ? maximizedRect(bounds) : win.rect
  const hidden = win.status === "minimized"
  const { Page } = app

  // Lifecycle animations: zoom out of the app icon on open/restore, back into it on close/minimize
  const { id, status, origin } = win
  useLayoutEffect(() => {
    const el = ref.current
    el.getAnimations().forEach((a) => a.cancel())
    if (status === "open" || status === "minimized") return

    const reduced = prefersReducedMotion()
    const box = rectOf(el)
    const timing = (t) => (reduced ? { duration: 1 } : t)

    if (status === "opening" || status === "restoring") {
      const from = (status === "opening" ? origin : iconRect(id)) ?? shrunk(box)
      const zoom = el.animate([{ transform: morph(from, box) }, { transform: "none" }], timing(SPRING_WINDOW))
      el.animate([{ opacity: 0 }, { opacity: 1 }], timing({ duration: 200, easing: "ease-out" }))
      zoom.finished.then(() => settleWindow(id, status, "open")).catch(() => {})
      return
    }

    const to = iconRect(id) ?? shrunk(box)
    const closing = status === "closing"
    const anim = el.animate(
      [
        { transform: "none", opacity: 1 },
        { opacity: closing ? 0.85 : 1, offset: 0.6 },
        { transform: morph(to, box), opacity: 0 },
      ],
      timing(
        closing
          ? { duration: 280, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" }
          : { duration: 430, easing: "cubic-bezier(0.55, 0, 0.8, 0.3)", fill: "forwards" }
      )
    )
    anim.finished
      .then(() => (closing ? removeWindow(id) : settleWindow(id, "minimizing", "minimized")))
      .catch(() => {})
  }, [status, id, origin, settleWindow, removeWindow])

  // Zoom (green light / double-click title): FLIP between the floating and maximized frames
  useLayoutEffect(() => {
    if (wasMaximized.current === win.maximized) return
    wasMaximized.current = win.maximized
    if (isCompact || prefersReducedMotion()) return
    const first = win.maximized ? win.rect : maximizedRect(bounds)
    const last = win.maximized ? maximizedRect(bounds) : win.rect
    ref.current.animate([{ transform: morph(first, last) }, { transform: "none" }], SPRING_SOFT)
  }, [win.maximized, win.rect, bounds, isCompact])

  const startDrag = (e) => {
    if (full || e.button !== 0 || e.target.closest("button, a, input")) return
    const el = ref.current
    const bar = e.currentTarget
    const start = win.rect
    const sx = e.clientX
    const sy = e.clientY
    let next = start

    bar.setPointerCapture(e.pointerId)
    setDragging(true)

    const move = (ev) => {
      next = dragRect({ ...start, x: start.x + ev.clientX - sx, y: start.y + ev.clientY - sy }, bounds)
      el.style.left = `${next.x}px`
      el.style.top = `${next.y}px`
    }
    const end = () => {
      bar.removeEventListener("pointermove", move)
      bar.removeEventListener("pointerup", end)
      bar.removeEventListener("pointercancel", end)
      setDragging(false)
      moveWindow(win.id, next)
    }
    bar.addEventListener("pointermove", move)
    bar.addEventListener("pointerup", end)
    bar.addEventListener("pointercancel", end)
  }

  return (
    <section
      ref={ref}
      role="dialog"
      aria-label={app.title}
      aria-hidden={hidden || undefined}
      inert={hidden}
      data-app={app.id}
      data-focused={focused}
      data-dragging={dragging}
      onPointerDownCapture={() => focusApp(win.id)}
      className={`os-window fixed flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 ${
        isCompact ? "rounded-2xl" : "rounded-[12px]"
      } ${app.dark ? "dark" : ""}`}
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        zIndex: z,
        visibility: hidden ? "hidden" : undefined,
        transformOrigin: "0 0",
      }}
    >
      <header
        onPointerDown={startDrag}
        onDoubleClick={(e) => !isCompact && !e.target.closest("button") && toggleMaximize(win.id)}
        className="relative flex h-[38px] shrink-0 items-center border-b border-black/[0.07] px-3.5 dark:border-white/[0.07]"
      >
        <TrafficLights
          focused={focused}
          onClose={() => closeApp(win.id)}
          onMinimize={() => minimizeApp(win.id)}
          onZoom={() => toggleMaximize(win.id)}
          zoomDisabled={isCompact}
        />
        <h2
          className={`pointer-events-none absolute inset-x-24 flex items-center justify-center gap-1.5 truncate text-[13px] font-semibold transition-opacity ${
            focused ? "" : "opacity-45"
          }`}
        >
          <AppIcon id={app.id} className="h-4 w-4 shrink-0 !shadow-none" />
          <span className="truncate">{app.title}</span>
        </h2>
      </header>

      <div className={`relative min-h-0 flex-1 ${dragging ? "" : "select-text"}`}>
        <Page />
      </div>
    </section>
  )
}
