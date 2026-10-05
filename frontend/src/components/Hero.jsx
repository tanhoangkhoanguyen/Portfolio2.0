import { useEffect, useRef, useState } from "react"
import { CONTACT, PROFILE } from "../data/profile"
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion"
import { getPointer, subscribePointer } from "../lib/pointer"
import { APPS } from "../os/apps"
import { useOS } from "../os/context"
import { AppIcon } from "./os/AppIcon"
import { useMagnetic } from "../hooks/useMagnetic"
import { Button } from "./ui/Button"
import { Icon } from "./ui/Icon"

const [FIRST_NAME, ...REST] = PROFILE.fullName.split(" ")

/** Where each floating icon sits in the constellation box (%), its parallax depth, tilt and bob period. */
const CONSTELLATION = {
  about: { left: 6, top: 8, size: 96, depth: 0.55, tilt: -8, bob: 7.5 },
  projects: { left: 50, top: 0, size: 120, depth: 1, tilt: 6, bob: 9 },
  skills: { left: 28, top: 38, size: 108, depth: 0.8, tilt: -4, bob: 8.2 },
  experience: { left: 68, top: 46, size: 92, depth: 0.45, tilt: 9, bob: 6.8 },
  contact: { left: 10, top: 70, size: 100, depth: 0.9, tilt: 5, bob: 7.8 },
}
const EDGES = [
  ["about", "skills"],
  ["skills", "projects"],
  ["projects", "experience"],
  ["skills", "contact"],
  ["skills", "experience"],
]
const SHIFT = { x: 28, y: 20 }

const TYPE_MS = 85
const DELETE_MS = 40
const HOLD_MS = 1600

function Typewriter({ words }) {
  const reduced = usePrefersReducedMotion()
  const [text, setText] = useState("")

  useEffect(() => {
    if (reduced) return undefined
    let timer = 0
    const step = (word, count, deleting) => {
      const current = words[word]
      setText(current.slice(0, count))
      if (!deleting && count < current.length) timer = setTimeout(() => step(word, count + 1, false), TYPE_MS)
      else if (!deleting) timer = setTimeout(() => step(word, count - 1, true), HOLD_MS)
      else if (count > 0) timer = setTimeout(() => step(word, count - 1, true), DELETE_MS)
      else timer = setTimeout(() => step((word + 1) % words.length, 1, false), 350)
    }
    step(0, 1, false)
    return () => clearTimeout(timer)
  }, [words, reduced])

  return (
    <p className="whitespace-nowrap font-mono text-[min(1.125rem,calc((100vw-48px)/23))] sm:text-[min(1.25rem,calc((100vw-80px)/29))] text-slate-500 dark:text-slate-400" aria-label={words.join(", ")}>
      <span className="hidden text-indigo-500 sm:inline dark:text-indigo-400" aria-hidden>
        ~/cole ❯{" "}
      </span>
      <span className="text-slate-900 dark:text-white" aria-hidden>
        {reduced ? words[0] : text}
      </span>
      <span className="caret" aria-hidden />
    </p>
  )
}

function Constellation({ onOpen, running }) {
  const boxRef = useRef(null)
  const lineRefs = useRef([])

  // Parallax: icons move by depth via CSS vars; the connecting lines follow in JS
  useEffect(() => {
    const box = boxRef.current
    let size = { w: box.clientWidth, h: box.clientHeight }

    const center = (id, p) => {
      const s = CONSTELLATION[id]
      return [
        (s.left / 100) * size.w + s.size / 2 - p.x * s.depth * SHIFT.x,
        (s.top / 100) * size.h + s.size / 2 - p.y * s.depth * SHIFT.y,
      ]
    }
    const place = (p) => {
      box.style.setProperty("--px", p.x.toFixed(4))
      box.style.setProperty("--py", p.y.toFixed(4))
      EDGES.forEach(([a, b], i) => {
        const line = lineRefs.current[i]
        if (!line) return
        const [x1, y1] = center(a, p)
        const [x2, y2] = center(b, p)
        line.setAttribute("x1", x1)
        line.setAttribute("y1", y1)
        line.setAttribute("x2", x2)
        line.setAttribute("y2", y2)
      })
    }

    const observer = new ResizeObserver(() => {
      size = { w: box.clientWidth, h: box.clientHeight }
      place(getPointer())
    })
    observer.observe(box)
    const unsubscribe = subscribePointer(place)
    return () => {
      observer.disconnect()
      unsubscribe()
    }
  }, [])

  return (
    <div
      ref={boxRef}
      className="absolute right-[5vw] top-1/2 hidden h-[min(560px,60vh)] w-[min(520px,36vw)] -translate-y-[46%] xl:block"
    >
      <svg className="constellation-lines absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        {EDGES.map(([a, b], i) => (
          <line key={`${a}-${b}`} ref={(el) => {
              lineRefs.current[i] = el
            }} />
        ))}
      </svg>

      {APPS.map((app, i) => {
        const spec = CONSTELLATION[app.id]
        return (
          <div
            key={app.id}
            className="floating-app absolute"
            style={{ left: `${spec.left}%`, top: `${spec.top}%`, "--depth": spec.depth }}
          >
            <div className="floating-bob" style={{ animationDuration: `${spec.bob}s`, animationDelay: `${-i * 1.7}s` }}>
              <button
                type="button"
                onClick={(e) => onOpen(app.id, e.currentTarget.firstElementChild)}
                aria-label={`Open ${app.label}`}
                className="floating-pop group flex flex-col items-center gap-3 outline-none"
                style={{ "--i": i }}
              >
                <span
                  className="block rounded-[22.5%] transition-[scale,translate] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-1.5 group-hover:scale-110 group-focus-visible:scale-110 group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-indigo-400 group-active:scale-95"
                  style={{ width: spec.size, height: spec.size, rotate: `${spec.tilt}deg` }}
                  data-app-icon={app.id}
                >
                  <AppIcon id={app.id} className="floating-icon h-full w-full" />
                </span>
                <span className="floating-label text-[13px] font-semibold">{app.label}</span>
                <RunningDot on={running.has(app.id)} />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** Small dot under an app whose window is open, like the macOS dock indicator. */
function RunningDot({ on }) {
  return <span className={`-mt-1.5 h-1 w-1 rounded-full bg-slate-900/70 transition-opacity dark:bg-white/85 ${on ? "" : "opacity-0"}`} aria-hidden />
}

/** Below xl the floating constellation is hidden, so the apps sit in a row under the buttons. */
function AppRow({ onOpen, running }) {
  return (
    <ul className="rise mt-10 grid max-w-sm grid-cols-5 gap-1 sm:flex sm:max-w-none sm:gap-4 xl:hidden" style={{ "--i": 5 }}>
      {APPS.map((app) => (
        <li key={app.id}>
          <button
            type="button"
            onClick={(e) => onOpen(app.id, e.currentTarget.firstElementChild)}
            aria-label={`Open ${app.label}`}
            className="group flex w-full flex-col items-center gap-1.5 outline-none sm:w-16"
          >
            <span
              data-app-icon={app.id}
              className="block h-12 w-12 rounded-[22.5%] transition-[scale] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-indigo-400 group-active:scale-95 sm:h-14 sm:w-14"
            >
              <AppIcon id={app.id} className="h-full w-full" />
            </span>
            <span className="floating-label text-[11.5px] font-semibold">{app.label}</span>
            <RunningDot on={running.has(app.id)} />
          </button>
        </li>
      ))}
    </ul>
  )
}

const SOCIAL = [
  { href: CONTACT.linkedin, label: "LinkedIn", icon: "linkedin", brand: "#0a66c2", size: "h-[18px] w-[18px]" },
  { href: CONTACT.github, label: "GitHub", icon: "github", brand: "linear-gradient(135deg, #8957e5, #24292f)", size: "h-5 w-5" },
]

export function Hero({ ready }) {
  const { openApp, windows } = useOS()
  const magnetic = useMagnetic(0.3)
  const running = new Set(windows.filter((w) => w.status !== "closing").map((w) => w.id))

  return (
    <main
      data-ready={ready}
      className="desktop-hero relative z-[1] flex h-full items-center px-6 pb-6 pt-[30px] sm:px-10 md:pl-[7vw] md:pr-[5vw]"
    >
      <div className="max-w-xl">
        {/* .rise owns the wrapper's animation, so the title's slow color drift lives on the h1 */}
        <div className="rise" style={{ "--i": 1 }}>
          <h1 className="hero-title">
            {FIRST_NAME}
            <br />
            {REST.join(" ")}
          </h1>
        </div>

        <div className="rise mt-3" style={{ "--i": 2 }}>
          <Typewriter words={PROFILE.jobTitles} />
        </div>

        <p className="rise mt-4 max-w-md text-[17px] leading-relaxed text-slate-600 dark:text-slate-300/85" style={{ "--i": 3 }}>
          {PROFILE.tagline}
        </p>

        <div className="rise mt-8 flex flex-wrap items-center gap-3" style={{ "--i": 4 }}>
          <Button size="lg" variant="secondary" href={PROFILE.resumeDownloadUrl} download>
            <Icon name="download" className="btn-download h-[18px] w-[18px]" />
            Download résumé
          </Button>
          <Button size="lg" variant="secondary" onClick={(e) => openApp("about", e.currentTarget)}>
            About me
            <Icon name="chevronRight" className="btn-arrow h-4 w-4" />
          </Button>
          {SOCIAL.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="btn btn-orb h-12 w-12"
              style={{ "--brand": s.brand }}
              {...magnetic}
            >
              <Icon name={s.icon} className={`relative z-[1] ${s.size}`} />
            </a>
          ))}
        </div>

        <AppRow onOpen={openApp} running={running} />
      </div>

      <Constellation onOpen={openApp} running={running} />
    </main>
  )
}
