
import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Icon } from "../ui/Icon"

const TOOL = "grid h-7 w-7 place-items-center rounded-md text-slate-500 outline-none hover:bg-black/[0.06] focus-visible:ring-2 focus-visible:ring-indigo-400 dark:text-slate-400 dark:hover:bg-white/[0.08]"

/**
 * Quick Look-style image preview over the whole desktop. Esc or a click outside closes it; Esc is caught
 * in the capture phase so it doesn't also close the window underneath. Pass a stable `onClose`.
 */
export function QuickLook({ src, title, alt = title, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key !== "Escape") return
      e.stopPropagation()
      onClose()
    }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
  }, [onClose])

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      className="quicklook fixed inset-0 z-[1000] grid place-items-center bg-black/45 p-4 backdrop-blur-sm sm:p-10"
    >
      <figure
        onClick={(e) => e.stopPropagation()}
        className="quicklook-panel flex max-h-full max-w-[min(1100px,100%)] flex-col overflow-hidden rounded-xl bg-white/85 text-slate-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] ring-1 ring-black/10 backdrop-blur-xl dark:bg-[#26262c]/90 dark:text-white dark:ring-white/10"
      >
        <figcaption className="flex h-10 shrink-0 items-center gap-2 border-b border-black/[0.08] px-2 text-[13px] dark:border-white/[0.08]">
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close preview" className={TOOL}>
            <Icon name="x" className="h-4 w-4" />
          </button>
          <span className="min-w-0 flex-1 truncate text-center font-semibold">{title}</span>
          <a href={src} target="_blank" rel="noopener noreferrer" aria-label="Open full size" className={TOOL}>
            <Icon name="arrowUpRight" className="h-4 w-4" />
          </a>
        </figcaption>
        <img src={src} alt={alt} className="max-h-[calc(100vh-9rem)] min-h-0 w-auto bg-white object-contain" />
      </figure>
    </div>,
    document.body
  )
}
