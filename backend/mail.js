const dns = require("dns")
const nodemailer = require("nodemailer")
const { Resend } = require("resend")

dns.setDefaultResultOrder("ipv4first")

function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY)
}

function isSmtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

function isEmailConfigured() {
  return isResendConfigured() || isSmtpConfigured()
}

/**
 * Sends the contact form to CONTACT_TO_EMAIL.
 * - Production (Render free): use RESEND_API_KEY (HTTPS; SMTP ports 587/465 are blocked).
 * - Local dev: SMTP via Nodemailer/Gmail works when RESEND_API_KEY is unset.
 */
async function sendContactNotification({ name, email, message }) {
  if (isResendConfigured()) {
    return sendViaResend({ name, email, message })
  }

  if (!isSmtpConfigured()) {
    return { sent: false, reason: "smtp_not_configured" }
  }

  return sendViaSmtp({ name, email, message })
}

function buildEmailBody({ name, email, message }) {
  return {
    subject: `[Portfolio] Message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`,
  }
}

async function sendViaResend({ name, email, message }) {
  const to = process.env.CONTACT_TO_EMAIL
  if (!to) throw new Error("CONTACT_TO_EMAIL is not set")

  const from = process.env.RESEND_FROM || "Portfolio Contact <onboarding@resend.dev>"
  const resend = new Resend(process.env.RESEND_API_KEY)
  const body = buildEmailBody({ name, email, message })

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: email,
    ...body,
  })

  if (error) throw new Error(error.message)
  return { sent: true }
}

async function sendViaSmtp({ name, email, message }) {
  const to = process.env.CONTACT_TO_EMAIL
  if (!to) throw new Error("CONTACT_TO_EMAIL is not set")

  const from = process.env.SMTP_FROM
  const body = buildEmailBody({ name, email, message })

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    family: 4,
    connectionTimeout: 30_000,
    greetingTimeout: 30_000,
    socketTimeout: 30_000,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.sendMail({ from, to, replyTo: email, ...body })
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
