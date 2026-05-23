import { useEffect, useState } from "react"
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion"
import { scrollToSection } from "../lib/scrollToSection"

const JOB_TITLES = ["Software Engineer", "AI Engineer", "Data Engineer", "Research Assistant"]

const TYPE_MS = 100
const DELETE_MS = 50
const PAUSE_FULL_MS = 1500
const PAUSE_EMPTY_MS = 500

function TypewriterJobTitles({ titles }) {
  const reducedMotion = usePrefersReducedMotion()
  const [display, setDisplay] = useState("")

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(titles.join(" · "))
      return undefined
    }

    let cancelled = false
    let timeoutId = 0
    const schedule = (fn, ms) => { timeoutId = window.setTimeout(fn, ms) }

    const run = (wordIndex, visibleCount, mode) => {
      if (cancelled) return
      const word = titles[wordIndex]

      if (mode === "typing") {
        if (visibleCount < word.length) {
          setDisplay(word.slice(0, visibleCount + 1))
          schedule(() => run(wordIndex, visibleCount + 1, "typing"), TYPE_MS)
        } else {
          schedule(() => run(wordIndex, visibleCount, "paused"), PAUSE_FULL_MS)
        }
      } else if (mode === "paused") {
        schedule(() => run(wordIndex, visibleCount, "deleting"), 0)
      } else if (mode === "deleting") {
        if (visibleCount > 0) {
          setDisplay(word.slice(0, visibleCount - 1))
          schedule(() => run(wordIndex, visibleCount - 1, "deleting"), DELETE_MS)
        } else {
          const next = (wordIndex + 1) % titles.length
          schedule(() => run(next, 0, "typing"), PAUSE_EMPTY_MS)
        }
      }
    }

    run(0, 0, "typing")
    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [titles, reducedMotion])

  return (
    <div className="flex w-full justify-center">
      <p
        className="hero-typewriter font-hero-code m-0 flex items-center justify-center text-2xl text-[#2F81F7] sm:text-3xl dark:text-[#58a6ff]"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="inline-block text-center">{display}</span>
        {!reducedMotion && (
          <span
            className="hero-typewriter-caret ml-0.5 inline-block w-[0.55ch] shrink-0 self-center font-normal leading-none text-[#2F81F7] dark:text-[#58a6ff]"
            aria-hidden
          >
            |
          </span>
        )}
      </p>
    </div>
  )
}

const FULL_NAME = "Khoa Nguyen"

export function Hero() {
  return (
    <div className="mb-20 w-full max-w-4xl flex flex-col items-center gap-6 text-center">
      <p className="font-display text-sm font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
        _Hello, I&apos;m_
      </p>

      <h1 className="hero-name-gradient font-display w-full px-3 text-balance text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
        {FULL_NAME}
      </h1>

      <div className="w-full max-w-xl px-2">
        <div className="flex items-start justify-center pt-0.5 min-h-[5.75rem] sm:min-h-[5.25rem]">
          <TypewriterJobTitles titles={JOB_TITLES} />
        </div>
      </div>

      <button
        type="button"
        onClick={() => scrollToSection("about")}
        className="hero-chevron mt-6 flex flex-col items-center gap-1.5 text-slate-400 transition hover:text-[#2F81F7] dark:text-slate-500 sm:mt-7"
        aria-label="Scroll to About"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.25em]">Scroll</span>
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>
    </div>
  )
}
