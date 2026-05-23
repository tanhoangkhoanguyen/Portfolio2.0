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
      // disable animation, show all titles immediately
      // Developer · Researcher · Designer
      setDisplay(titles.join(" · "))
      return undefined
    }

    let cancelled = false
    let timeoutId = 0
    const schedule = (fn, ms) => {
      // delay next animation step
      timeoutId = window.setTimeout(fn, ms)
    }

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
  }, [titles, reducedMotion])                                        // re-run when titles or reducedMotion changes

  return (
    /* 
    flex            → use flexbox
    w-full          → full width
    justify-center  → center content horizontally
    */
    <div className="flex w-full justify-center">
      <p
        /*
        text-2xl sm:text-3xl             → font size (default / when screen ≥ 640px)
        text-[#2F81F7]                   → blue color (light mode)
        dark:text-[#58a6ff]              → blue color (dark mode)
        font-hero-code                   → custom font
        hero-typewriter                  → custom animation style
        m-0                              → remove margin
        flex items-center justify-center → center content inside
        */
        className="hero-typewriter font-hero-code m-0 flex items-center justify-center text-2xl text-[#2F81F7] sm:text-3xl dark:text-[#58a6ff]"
        role="status"
        aria-live="polite"
        aria-atomic="true"               // if true, updates the entire content; if false updates only modified sections
      >
        <span className="inline-block text-center">{display}</span>
        {!reducedMotion && (
          // blinking typing cursor
          // If reducedMotion === false → show cursor
          // If true                    → don’t render cursor
          <span
            /*
            ml-0.5                      → small left margin
            inline-block                → allows width/height control
            w-[0.55ch]                  → fixed width. Prevents layout shifting while blinking
            shrink-0                    → don’t shrink in flex layout
            self-center                 → vertically center inside flex container
            leading-none                → tight line height (no extra vertical spacing)
            */
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
    /*
    items-center  → center children horizontally
    flex-col      → vertical layout
    text-center   → center text
    max-w-4xl     → limit width
    */
    <div className="mb-20 w-full max-w-4xl flex flex-col items-center gap-6 text-center">
      {/* text-sm   → small text
          uppercase → all caps
          tracking-[0.4em] → spaced-out letters (nice UI effect)
          text-slate-500   → gray text (light/dark mode supported) 
      */}
      <p className="font-display text-sm font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
        _Hello, I&apos;m_
      </p>

      <h1 className="hero-name-gradient font-display w-full px-3 text-balance text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
        {FULL_NAME}
      </h1>

      {/*
      w-full   → take full available width
      max-w-xl → but dont exceed “extra-large” width (~36rem)
      */}
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