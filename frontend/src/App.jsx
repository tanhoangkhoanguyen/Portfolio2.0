import { useEffect, useState } from "react"
import { GalaxyBackground } from "./components/GalaxyBackground"
import { Hero } from "./components/Hero"
import { Navbar } from "./components/Navbar"
import { Reveal } from "./components/Reveal"
import { SkyBackdrop } from "./components/SkyBackdrop"
import { CONTENT_MAX, SECTION_SCROLL_MARGIN } from "./constants/layout"
import { About } from "./pages/About"
import { Contact } from "./pages/Contact"
import { Experience } from "./pages/Experience"
import { Project } from "./pages/Project"
import { Skills } from "./pages/Skills"

const CONTENT_SECTIONS = [
  { id: "about", className: "mt-32 sm:mt-40", Page: About },
  { id: "skills", className: "mt-32 sm:mt-40", Page: Skills },
  { id: "projects", className: "mt-32 sm:mt-40", Page: Project },
  { id: "experience", className: "mt-32 sm:mt-40", Page: Experience },
  { id: "contact", className: "mt-32 w-full sm:mt-40", Page: Contact },
]

export function App() {
  const [scrollPct, setScrollPct] = useState(0)

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement
      const scrolled = el.scrollTop || document.body.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setScrollPct(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="relative min-h-screen bg-white text-slate-800 dark:bg-black dark:text-slate-200">
      <div className="scroll-progress-bar" style={{ width: `${scrollPct}%` }} aria-hidden />
      <SkyBackdrop />
      <GalaxyBackground />
      <Navbar />
      <main className={`relative z-[1] mx-auto w-full ${CONTENT_MAX} px-5 pb-28 pt-28 sm:px-7`}>
        <section
          id="hero"
          className={`${SECTION_SCROLL_MARGIN} mt-0 flex min-h-[calc(100dvh-5.5rem)] flex-col items-center justify-center py-10 sm:py-14`}
        >
          <Reveal immediate className="w-full">
            <Hero />
          </Reveal>
        </section>
        <div className="text-base leading-relaxed [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:tracking-tight sm:[&_h2]:text-4xl md:[&_h2]:text-5xl [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight sm:[&_h3]:text-2xl">
          {CONTENT_SECTIONS.map(({ id, className, Page }) => (
            <section key={id} id={id} className={`${SECTION_SCROLL_MARGIN} ${className}`}>
              <Reveal>
                <Page />
              </Reveal>
            </section>
          ))}
        </div>
      </main>
      <footer className="relative z-[1] border-t border-sky-200/70 py-7 text-center text-sm text-slate-500 dark:border-slate-900 dark:text-slate-500">
        © {new Date().getFullYear()} Tan Hoang Khoa Nguyen — portfolio
      </footer>
    </div>
  )
}
