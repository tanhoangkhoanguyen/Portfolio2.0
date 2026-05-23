import { useState } from "react"
import { apiUrl } from "../lib/api"

const CONTACT = {
  linkedin: "https://www.linkedin.com/in/tanhoangkhoanguyen/",
  github: "https://github.com/tanhoangkhoanguyen",
  email: "hoangkhoa.nguyentan@gmail.com",
  phoneTel: "+18134241968",
  phoneDisplay: "(813) 424-1968",
}

const FIELD_CLASS =
  "mt-1.5 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 outline-none ring-sky-500/30 focus:border-sky-500 focus:ring-2 dark:border-slate-700 dark:bg-black/70 dark:text-slate-100"

const ICON_LINK_CLASS =
  "inline-flex h-12 w-12 items-center justify-center rounded-xl border border-sky-200/80 bg-white/80 text-slate-700 shadow-sm transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-sky-500/50 dark:hover:bg-slate-800 dark:hover:text-sky-200"

function LinkedInIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function GitHubIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.833.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

function MailIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function PhoneIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  )
}

const CONTACT_ICON_LINKS = [
  {
    key: "linkedin",
    href: CONTACT.linkedin,
    label: "Open LinkedIn profile",
    external: true,
    Icon: LinkedInIcon,
  },
  {
    key: "github",
    href: CONTACT.github,
    label: "Open GitHub profile",
    external: true,
    Icon: GitHubIcon,
  },
  {
    key: "email",
    href: `mailto:${CONTACT.email}`,
    label: `Email ${CONTACT.email}`,
    external: false,
    Icon: MailIcon,
  },
  {
    key: "phone",
    href: `tel:${CONTACT.phoneTel}`,
    label: `Call ${CONTACT.phoneDisplay}`,
    external: false,
    Icon: PhoneIcon,
  },
]

function FormStatus({ status, error, emailSent, emailError }) {
  return (
    <>
      {error ? (
        <p className="text-base text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      {status === "sent" ? (
        <div className="space-y-1.5 text-base" role="status">
          <p className="text-emerald-700 dark:text-emerald-400">Thanks — your message was received.</p>
          {emailSent === true ? (
            <p className="text-slate-600 dark:text-slate-400">
              A notification was sent to my inbox — I&apos;ll reply using the address you provided.
            </p>
          ) : null}
          {emailSent === false && emailError === "smtp_not_configured" ? (
            <p className="text-slate-600 dark:text-slate-400">
              Message saved — I&apos;ll follow up with you soon.
            </p>
          ) : null}
          {emailSent === false && emailError === "send_failed" ? (
            <p className="text-slate-600 dark:text-slate-400">
              Message saved — I&apos;ll get back to you as soon as possible.
            </p>
          ) : null}
        </div>
      ) : null}
    </>
  )
}

export function Contact() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("idle")
  const [error, setError] = useState("")
  const [emailSent, setEmailSent] = useState(null)
  const [emailError, setEmailError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setEmailSent(null)
    setEmailError(null)
    setStatus("sending")
    try {
      const res = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || "Something went wrong.")
        setStatus("idle")
        return
      }
      setStatus("sent")
      if (typeof data.emailSent === "boolean") setEmailSent(data.emailSent)
      if (data.emailError) setEmailError(data.emailError)
      setName("")
      setEmail("")
      setMessage("")
    } catch {
      setError("Network error — is the API running on port 8001?")
      setStatus("idle")
    }
  }

  return (
    <div className="w-full">
      <div className="grid w-full gap-10 lg:grid-cols-2 lg:gap-14 lg:items-start">
        <div className="min-w-0 max-w-xl lg:max-w-none">
          <h2 className="text-slate-900 dark:text-white">Contact</h2>
          <p className="mt-2 text-slate-600 leading-relaxed dark:text-slate-400">
            Reach out for collaborations, opportunities, or a quick hello. Use the form or tap an icon to open
            LinkedIn, GitHub, email, or phone.
          </p>

          <ul className="mt-8 flex flex-wrap gap-3">
            {CONTACT_ICON_LINKS.map(({ key, href, label, external, Icon }) => (
              <li key={key}>
                <a
                  href={href}
                  className={ICON_LINK_CLASS}
                  aria-label={label}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <Icon className="h-6 w-6" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="grid w-full min-w-0 gap-4 lg:max-w-none">
          <div className="grid grid-cols-2 gap-4">
            <label className="block min-w-0">
              <span className="font-medium text-slate-700 dark:text-slate-300">Name</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={FIELD_CLASS}
                autoComplete="name"
              />
            </label>
            <label className="block min-w-0">
              <span className="font-medium text-slate-700 dark:text-slate-300">Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={FIELD_CLASS}
                autoComplete="email"
              />
            </label>
          </div>
          <label className="block min-w-0">
            <span className="font-medium text-slate-700 dark:text-slate-300">Message</span>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`${FIELD_CLASS} resize-y`}
            />
          </label>
          <FormStatus
            status={status}
            error={error}
            emailSent={emailSent}
            emailError={emailError}
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex w-fit items-center justify-center rounded-lg bg-sky-600 px-6 py-2.5 text-base font-semibold text-white shadow-md shadow-sky-600/20 transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
          >
            {status === "sending" ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>
    </div>
  )
}
