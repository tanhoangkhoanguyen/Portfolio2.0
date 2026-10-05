require("dotenv").config()
const cors = require("cors")
const express = require("express")

const { sendContactNotification, isEmailConfigured } = require("./mail")

const app = express()
const PORT = Number(process.env.PORT) || 8001

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim())
  : ["http://localhost:5173", "http://127.0.0.1:5173"]

app.use(cors({ origin: corsOrigins }))
app.use(express.json())

if (!isEmailConfigured()) {
  console.warn(
    "Email not configured - set CONTACT_TO_EMAIL plus RESEND_API_KEY (Render) or SMTP_* (local) to send contact notifications."
  )
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, email: isEmailConfigured() })
})

// Non-strings (numbers, objects) become "" so they fail validation instead of crashing `.trim()`
const clean = (value) => (typeof value === "string" ? value.trim() : "")

app.post("/api/contact", async (req, res) => {
  const body = req.body || {}
  const contact = { name: clean(body.name), email: clean(body.email), message: clean(body.message) }

  // Email is optional: without it the message still arrives, there's just no reply-to address
  if (!contact.name || !contact.message) {
    return res.status(400).json({ ok: false, error: "Name and message are required." })
  }

  // The message is accepted either way; email problems are reported, not treated as request failures
  try {
    const { sent, reason = null } = await sendContactNotification(contact)
    return res.status(201).json({ ok: true, emailSent: sent, emailError: reason })
  } catch (err) {
    console.error("[contact] email failed:", err.message)
    return res.status(201).json({ ok: true, emailSent: false, emailError: "send_failed" })
  }
})

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
