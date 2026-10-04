import { GalaxyBackground } from "./components/GalaxyBackground"
import { Hero } from "./components/Hero"
import { Navbar } from "./components/Navbar"
import { Reveal } from "./components/Reveal"
import { ScrollProgressBar } from "./components/ScrollProgressBar"
import { SkyBackdrop } from "./components/SkyBackdrop"
import { CONTENT_MAX, SECTION_SCROLL_MARGIN } from "./constants/layout"
import { PROFILE } from "./data/profile"
import { About } from "./pages/About"
import { Contact } from "./pages/Contact"
import { Experience } from "./pages/Experience"
import { Project } from "./pages/Project"
import { Skills } from "./pages/Skills"

/** Single source of truth for page sections and their nav links. */
const CONTENT_SECTIONS = [
  { id: "about", label: "About", Page: About },
  { id: "skills", label: "Skills", Page: Skills },
  { id: "projects", label: "Projects", Page: Project },
  { id: "experience", label: "Experience", Page: Experience },
  { id: "contact", label: "Contact", Page: Contact },
]

const NAV_ITEMS = [{ id: "hero", label: "Home" }, ...CONTENT_SECTIONS]

export function App() {
  return (
    <div className="relative min-h-screen bg-white text-slate-800 dark:bg-black dark:text-slate-200">
      <ScrollProgressBar />
      <SkyBackdrop />
      <GalaxyBackground />
      <Navbar items={NAV_ITEMS} />
      <main className={`relative z-[1] mx-auto w-full ${CONTENT_MAX} px-5 pb-28 pt-28 sm:px-7`}>
        <section
          id="hero"
          className={`${SECTION_SCROLL_MARGIN} flex min-h-[calc(100dvh-5.5rem)] flex-col items-center justify-center py-10 sm:py-14`}
        >
          <Reveal immediate className="w-full">
            <Hero />
          </Reveal>
        </section>
        <div className="text-base leading-relaxed [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight sm:[&_h3]:text-2xl">
          {CONTENT_SECTIONS.map(({ id, Page }) => (
            <section key={id} id={id} className={`${SECTION_SCROLL_MARGIN} mt-32 sm:mt-40`}>
              <Reveal>
                <Page />
              </Reveal>
            </section>
          ))}
        </div>
      </main>
      <footer className="relative z-[1] border-t border-sky-200/70 py-7 text-center text-sm text-slate-500 dark:border-slate-900">
        © {new Date().getFullYear()} {PROFILE.fullName} — portfolio
      </footer>
    </div>
  )
}
