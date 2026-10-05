import { useEffect, useState } from "react"
import { LogoMark } from "./LogoMark"

const BOOT_MS = 1500
const FADE_MS = 450

/** A short boot sequence, shown once per browser session. */
export function BootScreen({ onDone }) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const fade = setTimeout(() => setLeaving(true), BOOT_MS)
    const done = setTimeout(onDone, BOOT_MS + FADE_MS)
    return () => {
      clearTimeout(fade)
      clearTimeout(done)
    }
  }, [onDone])

  return (
    <div
      className={`fixed inset-0 z-[3000] grid place-items-center bg-black transition-opacity ease-out ${leaving ? "opacity-0" : ""}`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
      aria-hidden
    >
      <div className="flex flex-col items-center gap-12">
        <LogoMark className="boot-logo h-[72px] w-[72px] text-white" />
        <div className="h-[5px] w-52 overflow-hidden rounded-full bg-white/20">
          <div className="boot-progress h-full rounded-full bg-white" />
        </div>
      </div>
    </div>
  )
}
