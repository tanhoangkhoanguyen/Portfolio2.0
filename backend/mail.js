const nodemailer = require("nodemailer")

function isSmtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

/**
 * Sends the contact form to CONTACT_TO_EMAIL (default: your inbox).
 * Requires Gmail App Password (or other SMTP) in env — see backend/.env.example.
 */
async function sendContactNotification({ name, email, message }) {
  if (!isSmtpConfigured()) {
    return { sent: false, reason: "smtp_not_configured" }
  }

  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.SMTP_FROM

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from,
    to,
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

module.exports = { sendContactNotification, isSmtpConfigured }