const roles = [
  {
    company: "Trustate",
    title: "AI Engineer",
    period: "incoming intern",
    location: "Tampa, FL",
    logo: "/trustate.jpg",
    bullets: [],
  },
  {
    company: "ERA Lab",
    title: "Research Assistant",
    period: "03/2026 — Present",
    location: "Tampa, FL",
    logo: "/ERA.png",
    bullets: [
      "Developed a RL model using a Self-Distilled Policy Optimization approach, leveraging the model as its own teacher to learn from environment feedback",
      "Evaluated model performance using a public benchmark dataset for vision-language navigation, validating generalization across start–destination scenarios"
    ],
  },
  {
    company: "CSAIL Lab",
    title: "Research Assistant",
    period: "03/2026 — Present",
    location: "Tampa, FL",
    logo: "/CSAIL.png",
    bullets: ["Developed a MediaPipe-based model to analyze subtitle human body movements and classify patient emotional states in clinical settings"],
  },
  {
    company: "Data Science Club",
    title: "Member",
    period: "03/2026 — Present",
    location: "Tampa, FL",
    logo: "/datascience.jpg",
    bullets: ["Led a hands-on workshop on building an agentic banking chatbot using CrewAI and DuckDB in Python, engaging 23 participants"],
  },
  {
    company: "SCP club",
    title: "Tech Lead",
    period: "12/2025 — Present",
    location: "Tampa, FL",
    logo: "/scp.jpg",
    bullets: ["Strategized technical roadmap for club activities",
              "Led advanced algorithm workshops for 40+ participants, breaking down complex problems for interview-level coding challenges",
              "Built a DETR-based hand sign classifier model, enhancing real-time accuracy and FPS by integrating a MediaPipe hand detection pipeline to reduce redundant computation"],
  },
  {
    company: "Finbud AI",
    title: "AI Engineer",
    period: "09/2025 — 11/2025",
    location: "Smithfield, VA",
    logo: "/FINBUD.png",
    bullets: [
      "Built a RAG pipeline leveraging paraphrasing and generalization techniques with hybrid retrieval, enhanced by a reranker to improve chatbot response accuracy, coverage, and reduce hallucination.",
      "Designed a long-term conversational memory architecture that performs topic-level summaries, generates vector embeddings, and stores them in Qdrant, enabling durable context retention across sessions.",
    ],
  },
  {
    company: "FPT Software",
    title: "AI Engineer",
    period: "05/2025 — 08/2025",
    location: "Vietnam",
    logo: "/FPT.png",
    bullets: [
      "Co-optimized FPT’s internal employee-support chatbot with LangChain, LangGraph and enhanced context-specific input segmentation, improving multi-agent routing accuracy and tripling query speed.",
      "Implemented a Redis caching using reranker-based relevance scoring, employed TTL key expiration, Hashes for efficient context indexing, and automatic cache eviction.",
    ],
  },
  {
    company: "Rare Lab",
    title: "Research Assistant",
    period: "01/2025 — 05/2025",
    location: "Tampa, FL",
    logo: "/RARE.png",
    bullets: [
      "Conducted rigorous hypothesis testing and proposed 4 system enhancements, optimizing fog screen system performance by 60% through case studies validation, directly improving experimental reliability.",
      "Synthesized insights from 50+ scientific papers to validate the minimal health impacts of glycerin and propylene glycol in fog exposure, contributing a comprehensive safety analysis section to the research publication."
    ],
  },
]

const AVG_MONTH_MS = 1000 * 60 * 60 * 24 * 30.4375

/** Parse period strings into start/end month boundaries for timeline spacing. */
function parsePeriodRange(period) {
  const p = period.trim()
  if (/incoming/i.test(p)) {
    return { start: new Date(2026, 5, 1), end: new Date(2026, 7, 31) }
  }
  const m = p.match(/^(\d{2})\/(\d{4})\s*[—\-–]\s*(.+)$/i)
  if (!m) {
    const d = new Date(2020, 0, 1)
    return { start: d, end: d }
  }
  const month = Number.parseInt(m[1], 10)
  const year = Number.parseInt(m[2], 10)
  const start = new Date(year, month - 1, 1)
  const rest = m[3].trim()
  let end
  if (/present/i.test(rest)) {
    end = new Date()
  } else {
    const m2 = rest.match(/^(\d{2})\/(\d{4})$/)
    end = m2
      ? new Date(Number.parseInt(m2[2], 10), Number.parseInt(m2[1], 10) - 1, 1)
      : start
  }
  return { start, end }
}

function midpointMs(period) {
  const { start, end } = parsePeriodRange(period)
  return (start.getTime() + end.getTime()) / 2
}

/** `margin-bottom` under each row: tighter when adjacent roles are closer in time. */
function spacingBelowRem(list) {
  return list.map((role, i) => {
    if (i >= list.length - 1) return "0"
    const months = Math.abs(midpointMs(role.period) - midpointMs(list[i + 1].period)) / AVG_MONTH_MS
    const rem = Math.min(5.5, Math.max(1, 0.85 + months * 0.28))
    return `${rem}rem`
  })
}

const spacingBelow = spacingBelowRem(roles)

export function Experience() {
  return (
    <div className="w-full">
      <h2 className="text-center text-slate-900 dark:text-white">Experience</h2>
      <div className="relative left-1/2 mt-12 w-screen max-w-[100vw] -translate-x-1/2 px-5 sm:px-7">
        <div className="relative mx-auto max-w-7xl">
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 top-0 z-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-sky-400/60 via-indigo-400/45 to-purple-500/55 md:block"
          aria-hidden
        />

        <ol className="relative">
          {roles.map((role, i) => {
            const isLeft = i % 2 === 0
            const marginBottom = spacingBelow[i]
            return (
              <li
                key={`${role.company}-${role.period}-${role.title}-${i}`}
                className="relative"
                style={{ marginBottom }}
              >
                <div className="flex gap-4 sm:gap-5 md:hidden">
                  <div className="flex min-h-0 w-6 shrink-0 flex-col items-center self-stretch">
                    {i > 0 ? (
                      <div
                        className="experience-rail w-px flex-1 min-h-[0.5rem] bg-gradient-to-b from-sky-400/55 via-sky-300/25 to-sky-200/10 dark:from-sky-500/35 dark:via-slate-600/20 dark:to-slate-800/10"
                        aria-hidden
                      />
                    ) : (
                      <div className="min-h-[0.5rem] shrink-0" aria-hidden />
                    )}
                    <span
                      className="experience-dot z-10 h-3 w-3 shrink-0 rounded-full border-2 border-sky-500 bg-white shadow-[0_0_14px_rgba(56,189,248,0.45)] dark:border-sky-300 dark:bg-black dark:shadow-[0_0_14px_rgba(125,211,252,0.35)]"
                      aria-hidden
                    />
                    {i < roles.length - 1 ? (
                      <div
                        className="experience-rail w-px flex-1 min-h-[0.5rem] bg-gradient-to-b from-sky-400/55 via-sky-300/25 to-sky-200/10 dark:from-sky-500/35 dark:via-slate-600/20 dark:to-slate-800/10"
                        aria-hidden
                      />
                    ) : (
                      <div className="min-h-[0.5rem] shrink-0" aria-hidden />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <ExperienceCard role={role} />
                  </div>
                </div>

                <div className="hidden md:grid md:grid-cols-[1fr_24px_1fr] md:items-stretch md:gap-0 md:py-1">
                  <div className="flex min-h-0 min-w-0 items-center justify-end">
                    {isLeft ? (
                      <div className="flex w-full max-w-full items-stretch">
                        <ExperienceCard role={role} />
                        <div
                          className="experience-connector ml-0 h-px min-w-[1.5rem] max-w-[4rem] flex-1 self-center bg-gradient-to-r from-sky-500/75 to-sky-300/25 dark:from-sky-400/80 dark:to-sky-200/15"
                          aria-hidden
                        />
                      </div>
                    ) : null}
                  </div>
                  <div className="flex h-full min-h-0 w-full flex-col items-center justify-center">
                    <span
                      className="z-10 h-4 w-4 shrink-0 rounded-full border-2 border-sky-500 bg-white shadow-[0_0_14px_rgba(56,189,248,0.65)] dark:border-sky-300 dark:bg-black dark:shadow-[0_0_16px_rgba(125,211,252,0.5)]"
                      aria-hidden
                    />
                  </div>
                  <div className="flex min-h-0 min-w-0 items-center justify-start">
                    {!isLeft ? (
                      <div className="flex w-full max-w-full items-stretch">
                        <div
                          className="experience-connector mr-0 h-px min-w-[1.5rem] max-w-[4rem] flex-1 self-center bg-gradient-to-l from-sky-500/75 to-sky-300/25 dark:from-sky-400/80 dark:to-sky-200/15"
                          aria-hidden
                        />
                        <ExperienceCard role={role} />
                      </div>
                    ) : null}
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
        </div>
      </div>
    </div>
  )
}

function companyInitials(company) {
  const words = company.trim().split(/\s+/).filter(Boolean)
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase()
  return company.slice(0, 2).toUpperCase()
}

function MapPinIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function CompanyAvatar({ company, logo }) {
  if (logo) {
    return (
      <img
        src={logo}
        alt=""
        className="h-11 w-11 shrink-0 rounded-lg object-cover ring-1 ring-sky-200/80 dark:ring-slate-600/80"
        width={44}
        height={44}
        loading="lazy"
        decoding="async"
      />
    )
  }
  return (
    <div
      className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-xs font-bold tracking-tight text-sky-800 ring-1 ring-sky-200/80 dark:bg-slate-800 dark:text-sky-200 dark:ring-slate-600/80"
      aria-hidden
    >
      {companyInitials(company)}
    </div>
  )
}

function ExperienceCard({ role }) {
  const hasBullets = role.bullets.length > 0
  const location = role.location?.trim()

  return (
    <article className="experience-card w-full min-w-0 flex-1 rounded-2xl border border-sky-200/50 bg-white/55 p-5 text-left shadow-[0_16px_44px_-28px_rgba(14,116,144,0.35)] backdrop-blur-md dark:border-slate-700/45 dark:bg-slate-950/70 dark:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.6)] sm:p-6 md:max-w-full">
      <div className="flex gap-3 sm:gap-3.5">
        <CompanyAvatar company={role.company} logo={role.logo} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold tracking-tight text-slate-900 dark:text-white">{role.title}</h3>
              <p className="mt-0.5 font-medium text-sky-700 dark:text-sky-300/90">{role.company}</p>
            </div>
            <div className="flex shrink-0 flex-col items-start sm:items-end sm:pt-0.5">
              <p className="font-mono text-xs leading-snug tracking-wide text-slate-500 tabular-nums sm:text-right dark:text-slate-400">
                {role.period}
              </p>
              {location ? (
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-600 sm:justify-end dark:text-slate-400">
                  <MapPinIcon className="mt-px h-3.5 w-3.5 shrink-0 text-sky-600 dark:text-sky-400" />
                  <span>{location}</span>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {hasBullets ? (
        <ul className="mt-4 space-y-3 border-t border-sky-100/80 pt-4 text-slate-600 dark:border-slate-800/60 dark:text-slate-300">
          {role.bullets.map((b) => (
            <li key={b} className="flex gap-3 leading-relaxed">
              <span
                className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sky-500 dark:bg-sky-400"
                aria-hidden
              />
              <span className="min-w-0">{b}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}
