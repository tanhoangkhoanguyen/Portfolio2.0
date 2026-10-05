import { About } from "../pages/About"
import { Contact } from "../pages/Contact"
import { Experience } from "../pages/Experience"
import { Project } from "../pages/Project"
import { Skills } from "../pages/Skills"

/**
 * Every "app" on the desktop. `label` is what the desktop and menu bar show; `title` is the
 * window title; `size` is the preferred window size (clamped to the viewport).
 */
export const APPS = [
  {
    id: "about",
    label: "About",
    title: "About Me",
    Page: About,
    size: { w: 720, h: 766 },
    keywords: "bio profile cole school usf",
  },
  {
    id: "skills",
    label: "Skills",
    title: "cole - zsh - skills",
    Page: Skills,
    size: { w: 1020, h: 720 },
    dark: true,
    keywords: "terminal stack tech languages tools frameworks",
  },
  {
    id: "projects",
    label: "Projects",
    title: "Projects",
    Page: Project,
    size: { w: 1180, h: 800 },
    keywords: "work github code portfolio repos",
  },
  {
    id: "experience",
    label: "Experience",
    title: "Experience",
    Page: Experience,
    size: { w: 1100, h: 800 },
    keywords: "jobs work internship roles timeline career",
  },
  {
    id: "contact",
    label: "Contact",
    title: "New Message",
    Page: Contact,
    size: { w: 840, h: 720 },
    keywords: "mail email message hire reach",
  },
]

export const APP_BY_ID = Object.fromEntries(APPS.map((app) => [app.id, app]))
