import { useState } from "react"
import { Button } from "../components/ui/Button"
import { Icon } from "../components/ui/Icon"
import { CONTACT, PROFILE } from "../data/profile"
import { apiUrl } from "../lib/api"
import { MOD_KEY } from "../lib/platform"

const EMAIL_NOTES = {
  sent: "A notification was sent to my inbox - if you left a reply address, I'll get back to you there.",
  smtp_not_configured: "Message saved - I'll follow up with you soon.",
  send_failed: "Message saved - I'll get back to you as soon as possible.",
}

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" }

const QUICK_LINKS = [
  { icon: "linkedin", href: CONTACT.linkedin, label: "LinkedIn", external: true },
  { icon: "github", href: CONTACT.github, label: "GitHub", external: true },
  { icon: "phone", href: `tel:${CONTACT.phoneTel}`, label: `Call ${CONTACT.phoneDisplay}` },
]

const INPUT_CLASS =
  "min-w-0 flex-1 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 sm:text-[13.5px] dark:text-white dark:placeholder:text-slate-500"

function HeaderRow({ label, htmlFor, children }) {
  return (
    <div className="flex items-center gap-3 border-b border-black/[0.06] px-5 py-2.5 dark:border-white/[0.07]">
      <label htmlFor={htmlFor} className="w-[4.5rem] shrink-0 text-right text-[13px] text-slate-500 dark:text-slate-400">
        {label}
      </label>
      {children}
    </div>
  )
}

function SentScreen({ note, onReset }) {
  return (
    <div className="sent-screen absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#f7f7f9] px-8 text-center dark:bg-[#1c1c22]">
      <div className="relative h-24 w-24">
        <span className="sent-plane absolute inset-0 grid place-items-center text-indigo-500">
          <Icon name="send" className="h-12 w-12" />
        </span>
        <span className="sent-check absolute inset-0 grid place-items-center rounded-full bg-emerald-500 text-white shadow-[0_12px_40px_-8px_rgba(16,185,129,0.7)]">
          <Icon name="check" className="h-11 w-11" />
        </span>
      </div>
      <h2 className="mt-7 text-[22px] font-semibold tracking-tight">Message sent</h2>
      <p className="mt-1.5 max-w-sm text-[13.5px] leading-relaxed text-slate-500 dark:text-slate-400">{note}</p>
      <Button size="sm" variant="secondary" className="mt-6" onClick={onReset}>
        New message
      </Button>
    </div>
  )
}

export function Contact() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState({ state: "idle" })
  const [copied, setCopied] = useState(false)

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  const sending = status.state === "sending"

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus({ state: "sending" })
    const subject = form.subject.trim()
    const message = subject ? `Subject: ${subject}\n\n${form.message}` : form.message
    try {
      const res = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, message }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus({ state: "idle", error: data.error || "Something went wrong." })
        return
      }
      setStatus({ state: "sent", note: EMAIL_NOTES[data.emailSent ? "sent" : data.emailError] ?? EMAIL_NOTES.sent })
      setForm(EMPTY_FORM)
    } catch {
      setStatus({ state: "idle", error: "Couldn't reach the server - try again, or email me directly." })
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(CONTACT.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      window.location.href = `mailto:${CONTACT.email}`
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={(e) => (e.metaKey || e.ctrlKey) && e.key === "Enter" && e.currentTarget.requestSubmit()}
      className="relative flex h-full flex-col"
    >
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-black/[0.06] px-3 dark:border-white/[0.07]">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex h-8 items-center gap-1.5 rounded-md bg-indigo-600 px-3 text-[13px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-colors hover:bg-indigo-500 disabled:opacity-60"
        >
          <Icon name="send" className={`h-3.5 w-3.5 ${sending ? "animate-pulse" : ""}`} />
          {sending ? "Sending…" : "Send"}
        </button>
        <span className="ml-1 hidden text-[11.5px] text-slate-400 sm:inline">{MOD_KEY} ↵ to send</span>

        <div className="ml-auto flex items-center gap-0.5">
          {QUICK_LINKS.map(({ icon, href, label, external }) => (
            <a
              key={icon}
              href={href}
              aria-label={label}
              title={label}
              {...(external && { target: "_blank", rel: "noopener noreferrer" })}
              className="grid h-8 w-8 place-items-center rounded-md text-slate-500 transition-colors hover:bg-black/[0.05] hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <Icon name={icon} className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>

      {status.error && (
        <p role="alert" className="border-b border-rose-500/20 bg-rose-500/10 px-5 py-2 text-[13px] text-rose-600 dark:text-rose-400">
          {status.error}
        </p>
      )}

      <div className="flex items-center gap-3 border-b border-black/[0.06] px-5 py-2 dark:border-white/[0.07]">
        <span className="w-[4.5rem] shrink-0 text-right text-[13px] text-slate-500 dark:text-slate-400">To:</span>
        <span className="inline-flex min-w-0 items-center gap-1 rounded-md bg-indigo-500/12 px-2 py-0.5 text-[13px] font-medium text-indigo-700 dark:bg-indigo-400/15 dark:text-indigo-200">
          <span className="truncate">{PROFILE.fullName}</span>
        </span>
        <button
          type="button"
          onClick={copyEmail}
          className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-[12px] text-slate-500 transition-colors hover:bg-black/[0.05] hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <Icon name={copied ? "check" : "copy"} className={`h-3.5 w-3.5 ${copied ? "text-emerald-500" : ""}`} />
          <span className="hidden sm:inline">{copied ? "Copied" : CONTACT.email}</span>
        </button>
      </div>
      <HeaderRow label="From:" htmlFor="mail-name">
        <input id="mail-name" name="name" required value={form.name} onChange={update} autoComplete="name" placeholder="Your name" className={INPUT_CLASS} />
      </HeaderRow>
      <HeaderRow label="Reply-To:" htmlFor="mail-email">
        <input id="mail-email" name="email" type="email" value={form.email} onChange={update} autoComplete="email" placeholder="Optional - so I can reply" className={INPUT_CLASS} />
      </HeaderRow>
      <HeaderRow label="Subject:" htmlFor="mail-subject">
        <input id="mail-subject" name="subject" value={form.subject} onChange={update} placeholder="Let's work together" className={`${INPUT_CLASS} font-medium`} />
      </HeaderRow>

      <textarea
        name="message"
        required
        value={form.message}
        onChange={update}
        aria-label="Message"
        placeholder="Write your message…"
        className="os-scroll min-h-0 flex-1 resize-none bg-transparent px-6 py-4 text-base leading-relaxed text-slate-900 outline-none placeholder:text-slate-400 sm:text-[14px] dark:text-slate-100 dark:placeholder:text-slate-500"
      />

      {status.state === "sent" && <SentScreen note={status.note} onReset={() => setStatus({ state: "idle" })} />}
    </form>
  )
}
