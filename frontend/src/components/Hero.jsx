import { useEffect, useState } from "react"
import { PROFILE } from "../data/profile"
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion"
import { scrollToSection } from "../lib/scrollToSection"
import { Icon } from "./ui/Icon"

const TYPE_MS = 100
const DELETE_MS = 50
const PAUSE_FULL_MS = 1500
const PAUSE_EMPTY_MS = 500

function TypewriterJobTitles({ titles }) {
  const reducedMotion = usePrefersReducedMotion()
  const [display, setDisplay] = useState("")

  useEffect(() => {
    if (reducedMotion) return undefined

    let timeoutId = 0

    // Types `word` up to `count` chars, then deletes it, then moves to the next word.
    const step = (wordIndex, count, deleting) => {
      const word = titles[wordIndex]
      setDisplay(word.slice(0, count))

      if (!deleting && count < word.length) {
        timeoutId = window.setTimeout(() => step(wordIndex, count + 1, false), TYPE_MS)
      } else if (!deleting) {
        timeoutId = window.setTimeout(() => step(wordIndex, count - 1, true), PAUSE_FULL_MS)
      } else if (count > 0) {
        timeoutId = window.setTimeout(() => step(wordIndex, count - 1, true), DELETE_MS)
      } else {
        timeoutId = window.setTimeout(() => step((wordIndex + 1) % titles.length, 1, false), PAUSE_EMPTY_MS)
      }
    }

    step(0, 1, false)
    return () => window.clearTimeout(timeoutId)
  }, [titles, reducedMotion])

  return (
    <p
      className="font-hero-code m-0 flex items-center justify-center text-2xl text-[#2F81F7] sm:text-3xl dark:text-[#58a6ff]"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="inline-block text-center">{reducedMotion ? titles.join(" · ") : display}</span>
      {!reducedMotion && (
        <span className="hero-typewriter-caret ml-0.5 inline-block w-[0.55ch] shrink-0 self-center font-normal leading-none" aria-hidden>
          |
        </span>
      )}
    </p>
  )
}

export function Hero() {
  return (
    <div className="mb-20 flex w-full max-w-4xl flex-col items-center gap-6 text-center">
      <p className="font-display text-sm font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
        _Hello, I&apos;m_
      </p>

      <h1 className="hero-name-gradient font-display w-full px-3 text-balance text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
        {PROFILE.fullName}
      </h1>

      <div className="flex min-h-[5.75rem] w-full max-w-xl items-start justify-center px-2 pt-0.5 sm:min-h-[5.25rem]">
        <TypewriterJobTitles titles={PROFILE.jobTitles} />
      </div>

      <button
        type="button"
        onClick={() => scrollToSection("about")}
        className="hero-chevron mt-6 flex flex-col items-center gap-1.5 text-slate-400 transition hover:text-[#2F81F7] dark:text-slate-500 sm:mt-7"
        aria-label="Scroll to About"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.25em]">Scroll</span>
        <Icon name="arrowDown" className="h-6 w-6" />
      </button>
    </div>
  )
}
