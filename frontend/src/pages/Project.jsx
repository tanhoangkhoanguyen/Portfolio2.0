import { useCallback, useEffect, useState } from "react"
import { GlassCard } from "../components/ui/GlassCard"
import { Icon } from "../components/ui/Icon"
import { SectionHeading } from "../components/ui/SectionHeading"
import { PROJECT_IMAGE, PROJECTS } from "../data/projects"

const n = PROJECTS.length

const navBtnClass =
  "relative z-10 m-0 shrink-0 cursor-pointer border-0 bg-transparent p-0 text-slate-400 transition-colors hover:text-sky-600 disabled:pointer-events-none disabled:opacity-25 dark:text-slate-500 dark:hover:text-sky-300"

const pad2 = (num) => String(num).padStart(2, "0")

function ProjectCard({ project, index }) {
  return (
    <article className="project-card grid h-full min-h-0 w-full grid-cols-1 grid-rows-[11rem_minmax(0,1fr)] md:grid-cols-2 md:grid-rows-1">
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block h-full min-h-0 overflow-hidden bg-slate-200/80 dark:bg-slate-950"
      >
        <img
          src={project.image ?? PROJECT_IMAGE}
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
      {/* Keyed on index so the fade-in animation replays on every change */}
      <div
        key={index}
        className="project-card-anim relative flex h-full min-h-0 flex-col gap-3 bg-gradient-to-br from-white/95 via-sky-50/40 to-cyan-50/30 p-5 text-left dark:from-slate-950/95 dark:via-slate-950/85 dark:to-black/70 sm:gap-3.5 sm:p-6 md:p-7"
      >
        <p className="absolute right-4 top-4 z-10 font-mono text-xs tabular-nums tracking-wide text-slate-400 dark:text-slate-500 sm:right-5 sm:top-5">
          {pad2(index + 1)} / {pad2(n)}
        </p>
        <h3 className="shrink-0 pr-14 font-semibold tracking-tight text-slate-900 dark:text-white">{project.title}</h3>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">{project.description}</p>
        </div>
        <ul className="flex shrink-0 flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-sky-200/70 bg-sky-50/80 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-sky-800 dark:border-sky-500/25 dark:bg-sky-500/10 dark:text-sky-200/90"
            >
              {tag}
            </li>
          ))}
        </ul>
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group/cta inline-flex w-fit shrink-0 items-center gap-1 text-base font-semibold text-sky-700 transition-colors hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-100"
        >
          View details
          <span className="inline-block transition-transform duration-200 group-hover/cta:translate-x-0.5" aria-hidden>
            →
          </span>
        </a>
      </div>
    </article>
  )
}

export function Project() {
  const [index, setIndex] = useState(0)
  const step = useCallback((delta) => setIndex((i) => (i + delta + n) % n), [])

  useEffect(() => {
    function handleKey(e) {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return
      if (e.key === "ArrowLeft") step(-1)
      if (e.key === "ArrowRight") step(1)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [step])

  return (
    <div className="w-full">
      <SectionHeading>Projects</SectionHeading>

      <div className="mx-auto mt-10 flex w-full items-center justify-center gap-3 sm:gap-5 md:gap-[12.5rem]">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={n <= 1}
          aria-label="Previous project"
          className={`${navBtnClass} -mr-1.5 sm:-mr-2 md:-mr-[8.75rem]`}
        >
          <Icon name="chevronLeft" className="h-7 w-7" />
        </button>

        <GlassCard className="flex h-[30rem] min-h-0 w-full min-w-0 flex-1 overflow-hidden shadow-[0_20px_50px_-24px_rgba(14,116,144,0.35)] dark:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.65)] md:h-[23rem]">
          <ProjectCard project={PROJECTS[index]} index={index} />
        </GlassCard>

        <button
          type="button"
          onClick={() => step(1)}
          disabled={n <= 1}
          aria-label="Next project"
          className={`${navBtnClass} -ml-1.5 sm:-ml-2 md:-ml-[8.75rem]`}
        >
          <Icon name="chevronRight" className="h-7 w-7" />
        </button>
      </div>

      {n > 1 && (
        <div className="mt-6 flex justify-center gap-2.5" role="group" aria-label="Choose project">
          {PROJECTS.map((proj, i) => (
            <button
              key={proj.title}
              type="button"
              aria-label={`Show project: ${proj.title}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-6 bg-sky-600 dark:bg-sky-400"
                  : "w-1.5 bg-slate-300 hover:bg-sky-400/60 dark:bg-slate-800 dark:hover:bg-sky-500/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
