import { useEffect, useState } from "react"
import { CONTENT_MAX } from "../constants/layout"
import { NAV_ITEMS } from "../constants/nav"
import { useTheme } from "../context/useTheme"
import { scrollToSection } from "../lib/scrollToSection"

const sectionIds = NAV_ITEMS.map((item) => item.id)

const linkBase =
  "font-display rounded-lg px-3 py-2 text-sm font-semibold tracking-wide transition hover:bg-sky-500/15 hover:text-sky-800 sm:px-3.5 dark:hover:text-sky-300"

function ThemeGlyph({ variant, className }) {
  if (variant === "sun") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    )
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [activeSection, setActiveSection] = useState("hero")

  useEffect(() => {
    const elements = sectionIds.map((id) => document.getElementById(id)).filter(Boolean)
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting)
        if (intersecting.length === 0) return
        const best = intersecting.reduce((a, b) =>
          b.intersectionRatio > a.intersectionRatio ? b : a
        )
        setActiveSection(best.target.id)
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <header className="fixed top-0 z-50 w-full border-b border-sky-200/60 bg-white/80 backdrop-blur-md dark:border-slate-900/90 dark:bg-black/90">
      <nav
        className={`relative mx-auto flex w-full ${CONTENT_MAX} items-center justify-center px-5 py-3.5 sm:px-7`}
      >
        <ul className="flex max-w-[calc(100%-5rem)] flex-wrap justify-center gap-1 sm:max-w-none sm:gap-2">
          {NAV_ITEMS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection(id)
                }}
                className={`${linkBase} ${
                  activeSection === id
                    ? "bg-sky-500/20 text-sky-900 dark:bg-sky-500/15 dark:text-sky-200"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={toggleTheme}
          className="absolute right-4 top-1/2 h-9 w-[3.75rem] shrink-0 -translate-y-1/2 rounded-full border border-sky-300/80 bg-sky-100/90 shadow-inner transition-colors hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-900/95 dark:hover:bg-slate-900 sm:right-6"
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        >
          <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 text-slate-400 dark:text-slate-500">
            <ThemeGlyph variant="sun" className="h-3.5 w-3.5 opacity-60" />
            <ThemeGlyph variant="moon" className="h-3.5 w-3.5 opacity-60" />
          </span>
          <span
            className={`absolute top-1 left-1 flex size-7 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-slate-200/80 transition-transform duration-300 ease-out dark:bg-slate-700 dark:ring-slate-600/80 ${
              theme === "dark" ? "translate-x-6" : "translate-x-0"
            }`}
          >
            {theme === "light" ? (
              <ThemeGlyph variant="sun" className="h-4 w-4 text-amber-500" />
            ) : (
              <ThemeGlyph variant="moon" className="h-4 w-4 text-sky-100" />
            )}
          </span>
        </button>
      </nav>
    </header>
  )
}
