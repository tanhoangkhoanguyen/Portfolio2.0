import { useEffect, useRef, useState } from "react"
import { ImageWithFallback, InitialsBadge } from "../components/ui/ImageWithFallback"
import { useTheme } from "../context/theme"
import { ROLES } from "../lib/roles"
import { CONTACT, PROFILE } from "../data/profile"
import { PROJECTS } from "../data/projects"
import { SKILL_GROUPS } from "../data/skills"
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion"
import { openLink } from "../lib/platform"
import { sortTags } from "../lib/tags"
import { useOS } from "../os/context"

/** The Skills app is a small zsh-like terminal: it auto-runs `skills`, then takes real commands. */
const AUTO_COMMAND = "skills"

const APP_ALIASES = {
  about: "about",
  skills: "skills",
  terminal: "skills",
  projects: "projects",
  experience: "experience",
  contact: "contact",
  mail: "contact",
}

const HELP = [
  ["skills [group]", "my tech stack - try `skills cloud`"],
  ["whoami", "who's behind this terminal"],
  ["about", "a short bio"],
  ["projects", "things I've built"],
  ["experience", "where I've worked"],
  ["contact", "ways to reach me"],
  ["open <app>", "about · projects · experience · contact · resume"],
  ["theme", "toggle light / dark appearance"],
  ["ls · date · echo · clear · exit", ""],
]

const COMMANDS = ["about", "clear", "contact", "date", "echo", "exit", "experience", "help", "ls", "open", "projects", "skills", "theme", "whoami"]

function Prompt() {
  return (
    <span className="select-none">
      <span className="text-emerald-400">cole@portfolio</span> <span className="text-sky-400">~</span>{" "}
      <span className="text-slate-500">%</span>{" "}
    </span>
  )
}

function TermLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-sky-400 underline decoration-sky-400/30 underline-offset-2 hover:decoration-sky-400">
      {children}
    </a>
  )
}

function SkillIcon({ item }) {
  return (
    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-[6px] bg-white shadow-sm">
      <ImageWithFallback
        src={item.icon}
        className="h-4 w-4 object-contain"
        width={16}
        height={16}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        fallback={<InitialsBadge text={item.name[0]} className="text-[11px] text-slate-700" />}
      />
    </span>
  )
}

function SkillsOutput({ groups }) {
  const total = groups.reduce((n, g) => n + g.items.length, 0)
  return (
    <div className="space-y-4 py-1.5">
      {groups.map((group, i) => (
        <section key={group.title} className="term-in" style={{ animationDelay: `${i * 110}ms` }}>
          <div>
            <span className="text-fuchsia-400">==&gt;</span> <span className="font-bold text-white">{group.title}</span>{" "}
            <span className="text-slate-500">({group.items.length})</span>
          </div>
          <ul className="mt-2 flex flex-wrap gap-2">
            {group.items.map((item) => (
              <li
                key={item.name}
                className="inline-flex items-center gap-2 rounded-md border border-white/[0.08] bg-white/[0.03] py-1 pl-1 pr-2.5 text-[12.5px] text-slate-200 transition-[translate,background-color,border-color] duration-200 hover:-translate-y-px hover:border-indigo-400/45 hover:bg-indigo-400/10"
              >
                <SkillIcon item={item} />
                {item.name}
              </li>
            ))}
          </ul>
        </section>
      ))}
      <div className="term-in text-slate-500" style={{ animationDelay: `${groups.length * 110}ms` }}>
        {total} tools across {groups.length} groups. Type <span className="text-slate-300">help</span> for more commands.
      </div>
    </div>
  )
}

/** Runs one command line. Returns `{ output }`, or `{ clear: true }`. */
function execute(line, ctx) {
  const [name = "", ...args] = line.trim().split(/\s+/)
  const arg = args.join(" ")

  switch (name.toLowerCase()) {
    case "":
      return { output: null }
    case "help":
      return {
        output: (
          <div className="grid grid-cols-[minmax(0,15rem)_1fr] gap-x-4">
            {HELP.map(([cmd, desc]) => (
              <div key={cmd} className="contents">
                <span className="text-amber-300">{cmd}</span>
                <span className="text-slate-400">{desc}</span>
              </div>
            ))}
          </div>
        ),
      }
    case "skills": {
      const q = arg.toLowerCase()
      const groups = q ? SKILL_GROUPS.filter((g) => g.title.toLowerCase().includes(q)) : SKILL_GROUPS
      if (!groups.length) return { output: <div className="text-rose-400">skills: no group matching “{arg}”. Try: {SKILL_GROUPS.map((g) => g.title.split(" ")[0].toLowerCase()).join(", ")}</div> }
      return { output: <SkillsOutput groups={groups} /> }
    }
    case "whoami":
      return {
        output: (
          <div>
            <span className="font-bold text-white">{PROFILE.fullName}</span> <span className="text-slate-400">- {PROFILE.jobTitles.join(" · ")}</span>
          </div>
        ),
      }
    case "about":
      return { output: <div className="max-w-[72ch] whitespace-pre-line text-slate-300">{PROFILE.bio}</div> }
    case "projects":
      return {
        output: (
          <div>
            {PROJECTS.map((p) => (
              <div key={p.title}>
                <TermLink href={p.link}>{p.title}</TermLink> <span className="text-slate-500">- {sortTags(p.tags).slice(0, 4).join(", ")}</span>
              </div>
            ))}
          </div>
        ),
      }
    case "experience":
      return {
        output: (
          <div>
            {ROLES.map((r) => (
              <div key={`${r.company}-${r.title}`}>
                <span className="tabular-nums text-amber-300">
                  {r.start} → {r.end.padEnd(7)}
                </span>{" "}
                {r.title} <span className="text-slate-500">@</span> <span className="text-white">{r.company}</span>
              </div>
            ))}
          </div>
        ),
      }
    case "contact":
      return {
        output: (
          <div className="grid grid-cols-[6rem_1fr]">
            <span className="text-slate-500">email</span>
            <TermLink href={`mailto:${CONTACT.email}`}>{CONTACT.email}</TermLink>
            <span className="text-slate-500">linkedin</span>
            <TermLink href={CONTACT.linkedin}>{CONTACT.linkedin.replace(/^https:\/\/(www\.)?/, "")}</TermLink>
            <span className="text-slate-500">github</span>
            <TermLink href={CONTACT.github}>{CONTACT.github.replace(/^https:\/\//, "")}</TermLink>
            <span className="text-slate-500">phone</span>
            <TermLink href={`tel:${CONTACT.phoneTel}`}>{CONTACT.phoneDisplay}</TermLink>
          </div>
        ),
      }
    case "ls":
      return {
        output: (
          <div className="flex flex-wrap gap-x-6">
            <span>About.app</span>
            <span>Experience.app</span>
            <span>Mail.app</span>
            <span className="font-bold text-sky-400">Projects/</span>
            <span>Terminal.app</span>
            <span className="text-rose-300">resume.pdf</span>
          </div>
        ),
      }
    case "open": {
      const target = arg.toLowerCase().replace(/\.(app|pdf)$|\/$/g, "")
      if (target === "resume") {
        openLink(PROFILE.resumeUrl)
        return { output: <div className="text-slate-500">Opening resume.pdf…</div> }
      }
      if (!APP_ALIASES[target]) return { output: <div className="text-rose-400">open: {arg ? `no such app: ${arg}` : "usage: open <app>"}</div> }
      ctx.openApp(APP_ALIASES[target])
      return { output: null }
    }
    case "theme":
      ctx.toggleTheme()
      return { output: <div className="text-slate-500">Switched to {ctx.theme === "dark" ? "light" : "dark"} appearance.</div> }
    case "date":
      return { output: <div>{new Date().toString()}</div> }
    case "echo":
      return { output: <div>{arg}</div> }
    case "clear":
      return { clear: true }
    case "exit":
      ctx.closeApp("skills")
      return { output: null }
    case "sudo":
      return { output: <div className="text-rose-400">cole is not in the sudoers file. This incident will be reported.</div> }
    default:
      return { output: <div className="text-rose-400">zsh: command not found: {name}</div> }
  }
}

function lastLogin() {
  const d = new Date(Date.now() - 37 * 60_000)
  const day = d.toLocaleDateString("en-US", { weekday: "short" })
  const month = d.toLocaleDateString("en-US", { month: "short" })
  const time = d.toLocaleTimeString("en-US", { hour12: false })
  return `${day} ${month} ${String(d.getDate()).padStart(2, " ")} ${time}`
}

export function Skills() {
  const { openApp, closeApp } = useOS()
  const { theme, toggleTheme } = useTheme()
  const reduced = usePrefersReducedMotion()
  const nextId = useRef(1)
  const bodyRef = useRef(null)
  const inputRef = useRef(null)
  const [login] = useState(lastLogin)
  const [entries, setEntries] = useState(() => (reduced ? [{ id: 0, input: AUTO_COMMAND, ...execute(AUTO_COMMAND) }] : []))
  const [input, setInput] = useState("")
  const [autoTyping, setAutoTyping] = useState(!reduced)
  const [historyIndex, setHistoryIndex] = useState(null)

  // Type the first command like a person would, then run it
  useEffect(() => {
    if (reduced) return undefined
    let i = 0
    let timer = 0
    const typeNext = () => {
      i += 1
      setInput(AUTO_COMMAND.slice(0, i))
      if (i < AUTO_COMMAND.length) timer = setTimeout(typeNext, 80 + Math.random() * 70)
      else
        timer = setTimeout(() => {
          setEntries([{ id: 0, input: AUTO_COMMAND, ...execute(AUTO_COMMAND) }])
          setInput("")
          setAutoTyping(false)
        }, 280)
    }
    timer = setTimeout(typeNext, 700)
    return () => clearTimeout(timer)
  }, [reduced])

  useEffect(() => {
    const body = bodyRef.current
    body.scrollTop = body.scrollHeight
  }, [entries])

  useEffect(() => {
    if (!autoTyping) inputRef.current?.focus({ preventScroll: true })
  }, [autoTyping])

  const submit = () => {
    const result = execute(input, { openApp, closeApp, toggleTheme, theme })
    setHistoryIndex(null)
    setInput("")
    if (result.clear) setEntries([])
    else setEntries((list) => [...list, { id: nextId.current++, input, output: result.output }])
  }

  const history = entries.map((e) => e.input).filter(Boolean)

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      submit()
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault()
      if (!history.length) return
      const up = e.key === "ArrowUp"
      const index = historyIndex === null ? (up ? history.length - 1 : null) : historyIndex + (up ? -1 : 1)
      if (index === null || index >= history.length) {
        setHistoryIndex(null)
        setInput("")
      } else {
        const clamped = Math.max(0, index)
        setHistoryIndex(clamped)
        setInput(history[clamped])
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      const matches = COMMANDS.filter((c) => c.startsWith(input.trim()))
      if (input.trim() && matches.length === 1) setInput(`${matches[0]} `)
    } else if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault()
      setEntries([])
    } else if (e.ctrlKey && e.key.toLowerCase() === "c") {
      e.preventDefault()
      setEntries((list) => [...list, { id: nextId.current++, input: `${input}^C`, output: null }])
      setInput("")
    }
  }

  return (
    <div
      ref={bodyRef}
      onMouseUp={() => !window.getSelection()?.toString() && inputRef.current?.focus({ preventScroll: true })}
      className="os-scroll h-full cursor-text overflow-y-auto px-4 py-3 font-mono text-[12.5px] leading-[1.65] text-slate-200 sm:text-[13px]"
    >
      <div className="text-slate-500">Last login: {login} on ttys001</div>
      <div className="mb-2 text-slate-500">
        Welcome to ColeOS. Type <span className="text-slate-300">help</span> to see what this terminal can do.
      </div>

      {entries.map((entry) => (
        <div key={entry.id} className="mb-1.5">
          <div>
            <Prompt />
            {entry.input}
          </div>
          {entry.output}
        </div>
      ))}

      <label className="flex items-center">
        <Prompt />
        <input
          ref={inputRef}
          value={input}
          readOnly={autoTyping}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          aria-label="Terminal command"
          className="min-w-0 flex-1 bg-transparent text-base text-slate-100 caret-indigo-300 outline-none sm:text-[13px]"
        />
      </label>
    </div>
  )
}
