import { useState } from "react"
import { Button } from "../components/ui/Button"
import { Icon } from "../components/ui/Icon"
import { SectionHeading } from "../components/ui/SectionHeading"
import { CONTACT } from "../data/profile"
import { apiUrl } from "../lib/api"

const FIELD_CLASS =
  "mt-1.5 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 outline-none ring-sky-500/30 focus:border-sky-500 focus:ring-2 dark:border-slate-700 dark:bg-black/70 dark:text-slate-100"

const ICON_LINK_CLASS =
  "inline-flex h-12 w-12 items-center justify-center rounded-xl border border-sky-200/80 bg-white/80 text-slate-700 shadow-sm transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-sky-500/50 dark:hover:bg-slate-800 dark:hover:text-sky-200"

const CONTACT_LINKS = [
  { icon: "linkedin", href: CONTACT.linkedin, label: "Open LinkedIn profile", external: true },
  { icon: "github", href: CONTACT.github, label: "Open GitHub profile", external: true },
  { icon: "mail", href: `mailto:${CONTACT.email}`, label: `Email ${CONTACT.email}` },
  { icon: "phone", href: `tel:${CONTACT.phoneTel}`, label: `Call ${CONTACT.phoneDisplay}` },
]

/** Extra line shown after a successful submit, keyed by the API's email outcome. */
const EMAIL_NOTES = {
  sent: "A notification was sent to my inbox — I'll reply using the address you provided.",
  smtp_not_configured: "Message saved — I'll follow up with you soon.",
  send_failed: "Message saved — I'll get back to you as soon as possible.",
}

const EMPTY_FORM = { name: "", email: "", message: "" }

function Field({ label, as: Tag = "input", className = "", ...props }) {
  return (
    <label className="block min-w-0">
      <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <Tag required className={`${FIELD_CLASS} ${className}`} {...props} />
    </label>
  )
}

export function Contact() {
  const [form, setForm] = useState(EMPTY_FORM)
  // { state: "idle" | "sending" | "sent", error?: string, note?: string }
  const [status, setStatus] = useState({ state: "idle" })

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus({ state: "sending" })
    try {
      const res = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus({ state: "idle", error: data.error || "Something went wrong." })
        return
      }
      setStatus({ state: "sent", note: EMAIL_NOTES[data.emailSent ? "sent" : data.emailError] })
      setForm(EMPTY_FORM)
    } catch {
      setStatus({ state: "idle", error: "Network error — is the API running on port 8001?" })
    }
  }

  return (
    <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
      <div className="min-w-0 max-w-xl lg:max-w-none">
        <SectionHeading>Contact</SectionHeading>
        <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-400">
          Reach out for collaborations, opportunities, or a quick hello. Use the form or tap an icon to open LinkedIn,
          GitHub, email, or phone.
        </p>

        <ul className="mt-8 flex flex-wrap gap-3">
          {CONTACT_LINKS.map(({ icon, href, label, external }) => (
            <li key={icon}>
              <a
                href={href}
                className={ICON_LINK_CLASS}
                aria-label={label}
                {...(external && { target: "_blank", rel: "noopener noreferrer" })}
              >
                <Icon name={icon} className="h-6 w-6" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="grid w-full min-w-0 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Name" name="name" value={form.name} onChange={update} autoComplete="name" />
          <Field label="Email" name="email" type="email" value={form.email} onChange={update} autoComplete="email" />
        </div>
        <Field label="Message" as="textarea" name="message" rows={5} value={form.message} onChange={update} className="resize-y" />

        {status.error && (
          <p className="text-base text-red-600 dark:text-red-400" role="alert">
            {status.error}
          </p>
        )}
        {status.state === "sent" && (
          <div className="space-y-1.5 text-base" role="status">
            <p className="text-emerald-700 dark:text-emerald-400">Thanks — your message was received.</p>
            {status.note && <p className="text-slate-600 dark:text-slate-400">{status.note}</p>}
          </div>
        )}

        <Button type="submit" size="md" disabled={status.state === "sending"} className="w-fit">
          {status.state === "sending" ? "Sending…" : "Send message"}
        </Button>
      </form>
    </div>
  )
}
