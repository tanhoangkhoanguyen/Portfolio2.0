import { GITHUB_PATH, LINKEDIN_IN_PATH } from "../ui/Icon"

/** Big Sur–style squircle icons: a gradient tile plus a glyph drawn on a 100×100 grid. */
const ICONS = {
  about: {
    bg: "linear-gradient(160deg, #c4b5fd 0%, #818cf8 45%, #4338ca 100%)",
    glyph: (
      <>
        <circle cx="50" cy="50" r="30" fill="#fff" fillOpacity=".16" />
        <circle cx="50" cy="41" r="12" fill="#fff" />
        <path d="M28.6 71C32 61 40 56 50 56s18 5 21.4 15A30 30 0 0 1 28.6 71z" fill="#fff" />
      </>
    ),
  },
  skills: {
    bg: "linear-gradient(180deg, #52525b 0%, #27272a 100%)",
    glyph: (
      <>
        <rect x="14" y="18" width="72" height="64" rx="9" fill="#0b0d12" stroke="#fff" strokeOpacity=".16" strokeWidth="1.5" />
        <path d="M27 42l11 8-11 8" fill="none" stroke="#34d399" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M43 60h17" stroke="#e5e7eb" strokeWidth="5" strokeLinecap="round" />
      </>
    ),
  },
  projects: {
    bg: "linear-gradient(160deg, #7dd3fc 0%, #38bdf8 40%, #0369a1 100%)",
    glyph: (
      <>
        <path d="M17 30a6 6 0 0 1 6-6h16.5a6 6 0 0 1 4.6 2.2L48 31h29a6 6 0 0 1 6 6v3H17z" fill="#e0f2fe" fillOpacity=".85" />
        <path d="M17 38h66v34a6 6 0 0 1-6 6H23a6 6 0 0 1-6-6z" fill="#fff" />
        <path d="M43 50l-7 7 7 7M57 50l7 7-7 7" fill="none" stroke="#0ea5e9" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  experience: {
    bg: "linear-gradient(160deg, #fcd34d 0%, #f59e0b 45%, #c2410c 100%)",
    glyph: (
      <>
        <path d="M39 33v-6a5 5 0 0 1 5-5h12a5 5 0 0 1 5 5v6" fill="none" stroke="#fff" strokeWidth="5.5" />
        <rect x="16" y="32" width="68" height="46" rx="8" fill="#fff" />
        <path d="M16 52h68" stroke="#f59e0b" strokeOpacity=".45" strokeWidth="3" />
        <rect x="44" y="47" width="12" height="10" rx="2.5" fill="#d97706" />
      </>
    ),
  },
  contact: {
    bg: "linear-gradient(180deg, #7cc0ff 0%, #2f7cf6 55%, #1d4ed8 100%)",
    glyph: (
      <>
        <rect x="15" y="27" width="70" height="48" rx="7" fill="#fff" />
        <path d="M17 30l33 25 33-25" fill="none" stroke="#3b82f6" strokeOpacity=".55" strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M17 73l24-20M83 73L59 53" stroke="#3b82f6" strokeOpacity=".22" strokeWidth="2.5" />
      </>
    ),
  },
  resume: {
    bg: "linear-gradient(160deg, #fda4af 0%, #f43f5e 50%, #be123c 100%)",
    glyph: (
      <>
        <path d="M30 15h26l17 17v47a6 6 0 0 1-6 6H30a6 6 0 0 1-6-6V21a6 6 0 0 1 6-6z" fill="#fff" />
        <path d="M56 15v12a5 5 0 0 0 5 5h12z" fill="#fecdd3" />
        <rect x="32" y="42" width="30" height="4" rx="2" fill="#cbd5e1" />
        <rect x="32" y="51" width="34" height="4" rx="2" fill="#cbd5e1" />
        <rect x="32" y="60" width="24" height="4" rx="2" fill="#cbd5e1" />
        <rect x="32" y="70" width="20" height="7" rx="2.5" fill="#f43f5e" />
      </>
    ),
  },
  github: {
    bg: "linear-gradient(180deg, #3b4048 0%, #161b22 100%)",
    glyph: (
      <svg x="21" y="21" width="58" height="58" viewBox="2 2 20 20">
        <path fill="#fff" fillRule="evenodd" d={GITHUB_PATH} />
      </svg>
    ),
  },
  linkedin: {
    bg: "linear-gradient(180deg, #1a7fd6 0%, #0a66c2 50%, #004182 100%)",
    glyph: (
      <svg x="25" y="24" width="50" height="50" viewBox="2.5 2.5 19 19">
        <path fill="#fff" d={LINKEDIN_IN_PATH} />
      </svg>
    ),
  },
}

export function AppIcon({ id, className = "" }) {
  const icon = ICONS[id]
  return (
    <span className={`app-icon ${className}`} style={{ background: icon.bg }} aria-hidden>
      <svg viewBox="0 0 100 100" className="app-icon-glyph">
        {icon.glyph}
      </svg>
    </span>
  )
}
