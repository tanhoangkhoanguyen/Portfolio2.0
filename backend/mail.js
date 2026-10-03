const dns = require("dns")
const nodemailer = require("nodemailer")
const { Resend } = require("resend")

dns.setDefaultResultOrder("ipv4first")

const env = process.env

// Each factory runs once at startup and returns a reusable `send(mail)` function.
function createResendSender() {
  const resend = new Resend(env.RESEND_API_KEY)
  const from = env.RESEND_FROM || "Portfolio Contact <onboarding@resend.dev>"
  return async (mail) => {
    const { error } = await resend.emails.send({ from, ...mail })
    if (error) throw new Error(error.message)
  }
}

function createSmtpSender() {
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: env.SMTP_SECURE === "true",
    family: 4,
    connectionTimeout: 30_000,
    greetingTimeout: 30_000,
    socketTimeout: 30_000,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  })
  return (mail) => transporter.sendMail({ from: env.SMTP_FROM, ...mail })
}

/**
 * Ordered by priority; the first enabled provider is used. Add a provider by adding an entry.
 * - Resend: production (Render free tier blocks SMTP ports 587/465).
 * - SMTP: local dev (e.g. Gmail via Nodemailer).
 */
const PROVIDERS = [
  { enabled: Boolean(env.RESEND_API_KEY), create: createResendSender },
  { enabled: Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS), create: createSmtpSender },
]

const TO = env.CONTACT_TO_EMAIL
const send = TO ? PROVIDERS.find((p) => p.enabled)?.create() : undefined

function isEmailConfigured() {
  return Boolean(send)
}

async function sendContactNotification({ name, email, message }) {
  if (!send) return { sent: false, reason: "smtp_not_configured" }

  await send({
    to: TO,
    replyTo: email,
    subject: `[Portfolio] Message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`,
  })
  return { sent: true }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

module.exports = { sendContactNotification, isEmailConfigured }
