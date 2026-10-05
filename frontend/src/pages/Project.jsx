import { useState } from "react"
import { Icon } from "../components/ui/Icon"
import { CONTACT } from "../data/profile"
import { PROJECTS } from "../data/projects"
import { openLink } from "../lib/platform"
import { TAG_COUNTS, compareTags, sortTags } from "../lib/tags"

const TAG_COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"]
const tagColor = (tag) => TAG_COLORS[[...tag].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % TAG_COLORS.length]

const MONOGRAMS = [
  "from-indigo-500 to-violet-600",
  "from-sky-400 to-blue-600",
  "from-emerald-400 to-teal-600",
  "from-amber-400 to-orange-600",
  "from-pink-400 to-rose-600",
]

/** Every tag with its project count, in skill-group order. */
const ALL_TAGS = Object.keys(TAG_COUNTS)
  .sort(compareTags)
  .map((tag) => [tag, TAG_COUNTS[tag]])

const repoPath = (link) => link.replace(/^https?:\/\//, "")

function Monogram({ index, title, small }) {
  return (
    <span
      className={`grid shrink-0 place-items-center bg-gradient-to-br font-bold text-white shadow-md ${MONOGRAMS[index % MONOGRAMS.length]} ${
        small ? "h-6 w-6 rounded-[6px] text-[11px]" : "h-11 w-11 rounded-[11px] text-lg"
      }`}
      aria-hidden
    >
      {title[0]}
    </span>
  )
}

function SidebarItem({ active, onClick, count, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-[13px] ${
        active ? "bg-black/[0.08] font-medium dark:bg-white/[0.12]" : "hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
      }`}
    >
      {children}
      {count != null && <span className="ml-auto text-[11.5px] tabular-nums text-slate-400">{count}</span>}
    </button>
  )
}

function ProjectCard({ project, index, selected, onSelect }) {
  return (
    <article
      onClick={onSelect}
      onDoubleClick={() => openLink(project.link)}
      data-selected={selected}
      className="group flex cursor-default flex-col rounded-xl border border-black/[0.06] bg-white/75 p-4 shadow-sm transition-[translate,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:shadow-lg data-[selected=true]:ring-2 data-[selected=true]:ring-indigo-500/70 dark:border-white/[0.07] dark:bg-white/[0.04] dark:hover:shadow-black/40"
    >
      <div className="flex items-start gap-3">
        <Monogram index={index} title={project.title} />
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">{project.title}</h3>
          <p className="truncate font-mono text-[11.5px] text-slate-500">{repoPath(project.link)}</p>
        </div>
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Open ${project.title} on GitHub`}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-medium text-slate-500 transition-colors hover:bg-black/[0.05] hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <Icon name="github" className="h-3.5 w-3.5" />
          <Icon name="arrowUpRight" className="h-3 w-3" />
        </a>
      </div>
      <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300/90">{project.description}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {sortTags(project.tags).map((tag) => (
          <li key={tag} className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.04] px-2 py-0.5 text-[11.5px] font-medium text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: tagColor(tag) }} aria-hidden />
            {tag}
          </li>
        ))}
      </ul>
    </article>
  )
}

function ListView({ projects, selected, onSelect }) {
  return (
    <div className="overflow-hidden rounded-lg border border-black/[0.06] text-[13px] dark:border-white/[0.07]">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_2.5rem] gap-3 border-b border-black/[0.06] bg-black/[0.02] px-3 py-1.5 text-[11.5px] font-semibold text-slate-500 dark:border-white/[0.07] dark:bg-white/[0.03]">
        <span>Name</span>
        <span>Stack</span>
        <span />
      </div>
      {projects.map((p) => (
        <div
          key={p.title}
          onClick={() => onSelect(p.title)}
          onDoubleClick={() => openLink(p.link)}
          className={`grid cursor-default grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_2.5rem] items-center gap-3 px-3 py-2 odd:bg-black/[0.015] dark:odd:bg-white/[0.02] ${
            selected === p.title ? "!bg-indigo-500 text-white" : ""
          }`}
        >
          <span className="flex min-w-0 items-center gap-2 font-medium">
            <Monogram index={PROJECTS.indexOf(p)} title={p.title} small />
            <span className="truncate">{p.title}</span>
          </span>
          <span className={`truncate ${selected === p.title ? "text-white/80" : "text-slate-500"}`}>{sortTags(p.tags).join(", ")}</span>
          <a href={p.link} target="_blank" rel="noopener noreferrer" aria-label={`Open ${p.title} on GitHub`} className="justify-self-end opacity-70 hover:opacity-100">
            <Icon name="github" className="h-4 w-4" />
          </a>
        </div>
      ))}
    </div>
  )
}

export function Project() {
  const [tag, setTag] = useState(null)
  const [query, setQuery] = useState("")
  const [view, setView] = useState("grid")
  const [selected, setSelected] = useState(null)

  const q = query.trim().toLowerCase()
  const visible = PROJECTS.filter(
    (p) => (!tag || p.tags.includes(tag)) && (!q || [p.title, p.description, ...p.tags].join(" ").toLowerCase().includes(q))
  )

  const segment = (value, icon, label) => (
    <button
      type="button"
      aria-label={label}
      aria-pressed={view === value}
      onClick={() => setView(value)}
      className={`grid h-6 w-8 place-items-center rounded-[5px] ${view === value ? "bg-white shadow-sm dark:bg-white/20" : "text-slate-500"}`}
    >
      <Icon name={icon} className="h-3.5 w-3.5" />
    </button>
  )

  return (
    <div className="@container flex h-full">
      <aside className="os-scroll hidden w-[200px] shrink-0 flex-col gap-5 overflow-y-auto border-r border-black/[0.06] bg-slate-500/[0.05] p-3 @2xl:flex dark:border-white/[0.06] dark:bg-black/20">
        <section>
          <h3 className="mb-1 px-2 text-[11px] font-semibold text-slate-400">Favorites</h3>
          <SidebarItem active={!tag} onClick={() => setTag(null)} count={PROJECTS.length}>
            <Icon name="folder" className="h-4 w-4 text-sky-500" />
            All Projects
          </SidebarItem>
          <SidebarItem onClick={() => openLink(CONTACT.github)}>
            <Icon name="github" className="h-4 w-4 text-slate-500" />
            GitHub
            <Icon name="arrowUpRight" className="ml-auto h-3 w-3 text-slate-400" />
          </SidebarItem>
        </section>
        <section>
          <h3 className="mb-1 px-2 text-[11px] font-semibold text-slate-400">Tags</h3>
          {ALL_TAGS.map(([name, count]) => (
            <SidebarItem key={name} active={tag === name} onClick={() => setTag(tag === name ? null : name)} count={count}>
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: tagColor(name) }} aria-hidden />
              <span className="truncate">{name}</span>
            </SidebarItem>
          ))}
        </section>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-12 shrink-0 items-center gap-2 border-b border-black/[0.06] px-3 dark:border-white/[0.06]">
          <button
            type="button"
            aria-label="Back to all projects"
            disabled={!tag}
            onClick={() => setTag(null)}
            className="grid h-7 w-7 place-items-center rounded-md text-slate-600 enabled:hover:bg-black/[0.05] disabled:opacity-30 dark:text-slate-300 dark:enabled:hover:bg-white/10"
          >
            <Icon name="chevronLeft" className="h-4 w-4" />
          </button>
          <h2 className="min-w-0 truncate text-[15px] font-semibold">{tag ?? "All Projects"}</h2>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex rounded-md bg-black/[0.06] p-0.5 dark:bg-white/[0.08]">
              {segment("grid", "grid", "Grid view")}
              {segment("list", "list", "List view")}
            </div>
            <label className="relative hidden @md:block">
              <Icon name="search" className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                aria-label="Search projects"
                className="h-7 w-44 rounded-md bg-black/[0.05] pl-7 pr-2 text-[13px] outline-none ring-indigo-500/50 placeholder:text-slate-400 focus:ring-2 dark:bg-white/[0.08]"
              />
            </label>
          </div>
        </div>

        {/* Tag strip replaces the sidebar in narrow windows */}
        <div className="flex shrink-0 gap-1.5 overflow-x-auto border-b border-black/[0.06] px-3 py-2 @2xl:hidden dark:border-white/[0.06]">
          {[null, ...ALL_TAGS.map(([name]) => name)].map((name) => (
            <button
              key={name ?? "all"}
              type="button"
              onClick={() => setTag(name)}
              className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] font-medium ${
                tag === name ? "bg-indigo-500 text-white" : "bg-black/[0.05] text-slate-600 dark:bg-white/[0.07] dark:text-slate-300"
              }`}
            >
              {name ?? "All"}
            </button>
          ))}
        </div>

        <div className="os-scroll min-h-0 flex-1 overflow-y-auto p-4 @2xl:p-5" onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
          {visible.length === 0 ? (
            <p className="mt-16 text-center text-[13px] text-slate-500">No items match.</p>
          ) : view === "grid" ? (
            <div className="grid gap-4 @3xl:grid-cols-2">
              {visible.map((p) => (
                <ProjectCard key={p.title} project={p} index={PROJECTS.indexOf(p)} selected={selected === p.title} onSelect={() => setSelected(p.title)} />
              ))}
            </div>
          ) : (
            <ListView projects={visible} selected={selected} onSelect={setSelected} />
          )}
        </div>

        <footer className="flex h-7 shrink-0 items-center justify-between gap-3 border-t border-black/[0.06] px-3 text-[11.5px] text-slate-500 dark:border-white/[0.06]">
          <span className="truncate">
            Users › cole › Projects{tag && ` › ${tag}`}
          </span>
          <span className="shrink-0 tabular-nums">
            {visible.length} {visible.length === 1 ? "item" : "items"}
          </span>
        </footer>
      </div>
    </div>
  )
}
