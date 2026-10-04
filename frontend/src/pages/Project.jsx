import { GlassCard } from "../components/ui/GlassCard"
import { Icon } from "../components/ui/Icon"
import { SectionHeading } from "../components/ui/SectionHeading"
import { PROJECTS } from "../data/projects"

function ProjectCard({ project }) {
  return (
    <GlassCard
      as="article"
      className="project-card flex h-full flex-col gap-4 p-6 text-left shadow-[0_16px_40px_-24px_rgba(14,116,144,0.3)] dark:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.55)]"
    >
      <h3 className="font-semibold tracking-tight text-slate-900 dark:text-white">{project.title}</h3>
      <p className="flex-1 text-base leading-relaxed text-slate-600 dark:text-slate-300">{project.description}</p>
      <ul className="flex flex-wrap gap-1.5">
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
        className="group/cta inline-flex w-fit items-center gap-1 text-base font-semibold text-sky-700 transition-colors hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-100"
      >
        <Icon name="github" className="h-4 w-4" />
        View on GitHub
        <span className="inline-block transition-transform duration-200 group-hover/cta:translate-x-0.5" aria-hidden>
          →
        </span>
      </a>
    </GlassCard>
  )
}

export function Project() {
  return (
    <div className="w-full">
      <SectionHeading>Projects</SectionHeading>
      <div className="mx-auto mt-10 grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </div>
  )
}
