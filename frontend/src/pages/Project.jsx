import { useState, useEffect } from "react"

const PROJECT_CARD_IMAGE =
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=480&fit=crop&q=80"

const projects = [
  {
    title: "DocuMedAI",
    description: "A medical AI chatbot capable of generating structured, knowledge-driven responses on diseases, covering definitions, etiology, and treatment strategies.",
    stack: "Python · LangChain · Qdrant · Redis · Docker",
    link: "https://github.com/tanhoangkhoanguyen/DocuMedAI",
  },
  {
    title: "Hand2Image",
    description: "A computer vision system that recognizes hand gestures and translates them into corresponding visual outputs in real time.",
    stack: "Python · Object Detection",
    link: "https://github.com/tanhoangkhoanguyen/Hand2Image",
  },
  {
    title: "Online-Platform-Video-Crawler",
    description: "An automated data collection system that crawls and organizes large-scale video content and metadata from online platforms.",
    stack: "Python · Selenium",
    link: "https://github.com/tanhoangkhoanguyen/Online-Platform-Video-Crawler",
  },
  {
    title: "FinDeep-backend",
    description: "An intelligent financial assistant capable of extracting and answering questions from financial documents.",
    stack: "Python · LlamaIndex",
    link: "https://github.com/tanhoangkhoanguyen/FinDeep-backend",
  },
  {
    title: "MapBench",
    description: "A ML project capable of reading a visual map and give guidance to the user.",
    stack: "Python · Pytorch",
    link: "https://github.com/tanhoangkhoanguyen/MapBench",
  },
].map((p) => ({ ...p, image: PROJECT_CARD_IMAGE }))

function Chevron({ direction, className }) {
  const d = direction === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"
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
      <path d={d} />
    </svg>
  )
}

function stackToTags(stack) {
  return stack
    .split("·")
    .map((s) => s.trim())
    .filter(Boolean)
}

const navBtnClass =
  "m-0 shrink-0 cursor-pointer border-0 bg-transparent p-0 text-slate-400 transition-colors hover:text-sky-600 disabled:pointer-events-none disabled:opacity-25 dark:text-slate-500 dark:hover:text-sky-300"

export function Project() {
  const [index, setIndex] = useState(0)
  const [animationKey, setAnimationKey] = useState(0)
  const n = projects.length
  const p = projects[index]

  function navigate(nextIndex) {
    setIndex(nextIndex)
    setAnimationKey((k) => k + 1)
  }

  useEffect(() => {
    function handleKey(e) {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return
      if (e.key === "ArrowLeft") navigate((index - 1 + n) % n)
      if (e.key === "ArrowRight") navigate((index + 1) % n)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [index, n])

  return (
    <div className="w-full">
      <h2 className="text-left text-slate-900 dark:text-white">Projects</h2>

      <div className="mx-auto mt-10 flex w-full items-center justify-center gap-3 sm:gap-5 md:gap-[12.5rem]">
        <button
          type="button"
          onClick={() => navigate((index - 1 + n) % n)}
          disabled={n <= 1}
          aria-label="Previous project"
          className={`${navBtnClass} relative z-10 -mr-1.5 sm:-mr-2 md:-mr-[8.75rem]`}
        >
          <Chevron direction="left" className="h-7 w-7" />
        </button>

        <div className="flex h-[30rem] min-h-0 w-full min-w-0 flex-1 overflow-hidden rounded-2xl border border-sky-200/50 bg-white/55 shadow-[0_20px_50px_-24px_rgba(14,116,144,0.35)] backdrop-blur-md dark:border-slate-700/45 dark:bg-slate-950/70 dark:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.65)] md:h-[23rem]">
          <article
            className="project-card grid h-full min-h-0 w-full grid-cols-1 grid-rows-[11rem_minmax(0,1fr)] md:grid-cols-2 md:grid-rows-1"
          >
            <a
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block h-full min-h-0 overflow-hidden bg-slate-200/80 dark:bg-slate-950"
            >
              <img
                src={p.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                width={800}
                height={480}
                loading="lazy"
              />
              <span
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-sky-900/20 via-transparent to-transparent opacity-80 dark:from-black/50"
                aria-hidden
              />
            </a>
            <div key={animationKey} className="project-card-anim relative flex h-full min-h-0 flex-col gap-3 bg-gradient-to-br from-white/95 via-sky-50/40 to-cyan-50/30 p-5 text-left dark:from-slate-950/95 dark:via-slate-950/85 dark:to-black/70 sm:gap-3.5 sm:p-6 md:p-7">
              <p className="absolute right-4 top-4 z-10 font-mono text-xs tabular-nums tracking-wide text-slate-400 dark:text-slate-500 sm:right-5 sm:top-5">
                {String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
              </p>
              <h3 className="flex-shrink-0 pr-14 font-semibold tracking-tight text-slate-900 dark:text-white">{p.title}</h3>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">{p.description}</p>
              </div>
              <ul className="flex flex-shrink-0 flex-wrap gap-1.5">
                {stackToTags(p.stack).map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-sky-200/70 bg-sky-50/80 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-sky-800 dark:border-sky-500/25 dark:bg-sky-500/10 dark:text-sky-200/90"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group/cta inline-flex w-fit flex-shrink-0 items-center gap-1 text-base font-semibold text-sky-700 transition-colors hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-100"
              >
                View details
                <span
                  className="inline-block transition-transform duration-200 group-hover/cta:translate-x-0.5"
                  aria-hidden
                >
                  →
                </span>
              </a>
            </div>
          </article>
        </div>

        <button
          type="button"
          onClick={() => navigate((index + 1) % n)}
          disabled={n <= 1}
          aria-label="Next project"
          className={`${navBtnClass} relative z-10 -ml-1.5 sm:-ml-2 md:-ml-[8.75rem]`}
        >
          <Chevron direction="right" className="h-7 w-7" />
        </button>
      </div>

      {n > 1 ? (
        <div className="mt-6 flex justify-center gap-2.5" role="group" aria-label="Choose project">
          {projects.map((proj, i) => (
            <button
              key={proj.title}
              type="button"
              aria-label={`Show project: ${proj.title}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => navigate(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-6 bg-sky-600 dark:bg-sky-400"
                  : "w-1.5 bg-slate-300 hover:bg-sky-400/60 dark:bg-slate-800 dark:hover:bg-sky-500/50"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
